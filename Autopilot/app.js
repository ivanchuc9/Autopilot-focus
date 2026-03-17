// ===================================
// AUTOPILOT 3.0 - PLATINUM EDITION
// Real Geodesics, Glassmorphism, & Neuro-Flow
// ===================================

const AIRPORTS = [
    { code: 'MAD', name: 'Madrid', lat: 40.4839, lng: -3.5680 },
    { code: 'JFK', name: 'New York', lat: 40.6413, lng: -73.7781 },
    { code: 'LHR', name: 'London', lat: 51.4700, lng: -0.4543 },
    { code: 'NRT', name: 'Tokyo', lat: 35.7720, lng: 140.3929 },
    { code: 'SYD', name: 'Sydney', lat: -33.9399, lng: 151.1753 },
    { code: 'DXB', name: 'Dubai', lat: 25.2532, lng: 55.3657 },
    { code: 'BCN', name: 'Barcelona', lat: 41.2974, lng: 2.0833 },
    { code: 'CDG', name: 'Paris', lat: 49.0097, lng: 2.5479 },
    { code: 'FRA', name: 'Frankfurt', lat: 50.0379, lng: 8.5622 },
    { code: 'AMS', name: 'Amsterdam', lat: 52.3105, lng: 4.7683 }
];

// ===================================
// AUDIO ENGINE - Web Audio API
// ===================================
class AudioEngine {
    constructor() {
        this.ctx = null;
    }

    _getCtx() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        return this.ctx;
    }

    // Calming ambient chime — A4 → E5 → A5, slow attack, long tail
    playBoardingDing() {
        try {
            const ctx = this._getCtx();
            const tones = [
                { freq: 440.00, start: 0, dur: 2.2, vol: 0.18 },  // A4
                { freq: 659.25, start: 0.7, dur: 2.4, vol: 0.13 },  // E5
                { freq: 880.00, start: 1.4, dur: 3.0, vol: 0.09 }   // A5 (soft overtone)
            ];
            tones.forEach(({ freq, start, dur, vol }) => {
                // Primary oscillator
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0, ctx.currentTime + start);
                gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + start + 0.4);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(ctx.currentTime + start);
                osc.stop(ctx.currentTime + start + dur + 0.1);

                // Slightly detuned shimmer for warmth
                const osc2 = ctx.createOscillator();
                const gain2 = ctx.createGain();
                osc2.type = 'sine';
                osc2.frequency.value = freq * 1.0015;
                gain2.gain.setValueAtTime(0, ctx.currentTime + start);
                gain2.gain.linearRampToValueAtTime(vol * 0.35, ctx.currentTime + start + 0.55);
                gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur + 0.5);
                osc2.connect(gain2);
                gain2.connect(ctx.destination);
                osc2.start(ctx.currentTime + start);
                osc2.stop(ctx.currentTime + start + dur + 0.6);
            });
        } catch (e) {
            console.log('Audio not available', e);
        }
    }

    // Landing melody — a celebratory arpeggio (C4-E4-G4-C5)
    playLandingMelody() {
        try {
            const ctx = this._getCtx();
            const notes = [
                { freq: 261.63, start: 0, dur: 0.5 },  // C4
                { freq: 329.63, start: 0.25, dur: 0.5 },  // E4
                { freq: 392.00, start: 0.5, dur: 0.5 },  // G4
                { freq: 523.25, start: 0.75, dur: 1.2 },  // C5
                { freq: 659.25, start: 1.0, dur: 1.5 }   // E5 (high note)
            ];
            notes.forEach(({ freq, start, dur }) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0, ctx.currentTime + start);
                gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + start + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(ctx.currentTime + start);
                osc.stop(ctx.currentTime + start + dur + 0.1);
            });
        } catch (e) {
            console.log('Audio not available', e);
        }
    }
}

class AutopilotApp {
    constructor() {
        this.audio = new AudioEngine();

        this.state = {
            currentStep: 0,
            isFirstLoad: true,
            selectedMethod: 'pomodoro',
            selectedDurationMinutes: 60,
            selectedFlight: null,
            flights: [],

            // Tracking
            flightAnimation: null,

            // Timers
            timerValue: 0,
            timerRunning: false,
            timerMax: 0,
            pomodoroMode: 'work'
        };

        // DOM Map
        this.overlay = document.getElementById('welcomeOverlay');
        this.screens = {
            1: document.getElementById('screen-method'),
            2: document.getElementById('screen-duration'),
            3: document.getElementById('screen-selection'),
            4: document.getElementById('screen-tracking'),
            5: document.getElementById('screen-landed')
        };

        this.steps = document.querySelectorAll('.step-dot');
        this.map = null;
        this.layers = {
            plane: L.layerGroup(),
            pathPast: L.layerGroup(),
            pathFuture: L.layerGroup()
        };
        this.intervals = {};

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initMap();

        // Show Welcome Screen ONLY on first load
        if (this.state.isFirstLoad && this.overlay) {
            this.overlay.classList.remove('hidden');
            const h = document.getElementById('appHeader');
            if (h) h.style.opacity = '0';
        }
    }

    // --- NAVIGATION ---

    enterApp() {
        this.state.isFirstLoad = false;
        if (this.overlay) {
            this.overlay.classList.add('hidden');
        }
        setTimeout(() => {
            this.goToStep(1);
            const h = document.getElementById('appHeader');
            if (h) h.style.opacity = '1';
        }, 500);
    }

    goToStep(step) {
        // Forzar ocultar overlay en cualquier navegación
        if (this.overlay) {
            this.overlay.style.display = 'none';
            this.overlay.classList.add('hidden');
        }

        if (this.state.currentStep > 0 && this.screens[this.state.currentStep]) {
            const prev = this.screens[this.state.currentStep];
            prev.classList.add('exit');
            prev.classList.remove('active');
        }

        this.state.currentStep = step;

        setTimeout(() => {
            Object.values(this.screens).forEach(s => { if (s) s.classList.remove('exit'); });
            const next = this.screens[step];
            if (next) next.classList.add('active');
            this.updateHeaderVisuals(step);
        }, 300);
    }

    updateHeaderVisuals(step) {
        const header = document.getElementById('appHeader');
        if (!header) return;

        if (step === 4 || step === 5) { // Tracking & Landing
            const isZen = this.state.selectedMethod === 'hyperfocus';
            if (isZen && step === 4) {
                document.body.classList.add('zen-mode');
                header.style.opacity = '0';
            } else {
                document.body.classList.remove('zen-mode');
                if (step === 5) {
                    header.style.opacity = '0';
                } else {
                    header.style.opacity = '1';
                    this.steps.forEach(d => d.style.opacity = '0');
                }
            }
        } else {
            document.body.classList.remove('zen-mode');
            header.style.opacity = '1';
            this.updateStepsIndicator(step);
        }
    }

    updateStepsIndicator(step) {
        this.steps.forEach(dot => {
            const dotStep = parseInt(dot.dataset.step);
            dot.style.opacity = '1';
            dot.classList.toggle('active', dotStep <= step);
        });
    }

    setupEventListeners() {
        const btnStart = document.getElementById('btnStartApp');
        if (btnStart) btnStart.addEventListener('click', () => this.enterApp());

        document.querySelectorAll('.method-card').forEach(card => {
            card.addEventListener('click', (e) => this.selectMethod(e.currentTarget.dataset.method));
        });

        document.getElementById('btnBackToMethod').addEventListener('click', () => this.goToStep(1));

        // BUG FIX 1: When clicking a chip, sync the display AND mark chip active properly
        document.querySelectorAll('.chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
                e.target.classList.add('active');
                this.updateDurationInputs(parseInt(e.target.dataset.time));
            });
        });

        document.getElementById('btnToStep2').addEventListener('click', () => {
            const h = parseInt(document.getElementById('inputHours').value) || 0;
            const m = parseInt(document.getElementById('inputMinutes').value) || 0;
            this.state.selectedDurationMinutes = (h * 60) + m;
            if (this.state.selectedDurationMinutes < 10) return alert("Mínimo 10 min.");
            // BUG FIX 1: Sync chip selection to what is actually typed
            this.syncChipToCurrentDuration();
            this.loadFlights();
            this.goToStep(3);
        });

        // BUG FIX 1: Also desyncs chips when user manually types a value
        ['inputHours', 'inputMinutes'].forEach(id => {
            document.getElementById(id).addEventListener('input', () => {
                this.syncChipToCurrentDuration();
            });
        });

        document.getElementById('btnBackToDuration').addEventListener('click', () => this.goToStep(2));
        document.getElementById('btnRefreshFlights').addEventListener('click', () => this.loadFlights());

        document.getElementById('btnExitTracking').addEventListener('click', () => {
            if (confirm("¿Terminar sesión?")) {
                this.stopTracking();
                this.goToStep(1);
            }
        });

        document.getElementById('btnPomodoroToggle').addEventListener('click', () => this.toggleTimer());
        document.getElementById('btnPomodoroReset').addEventListener('click', () => this.resetTimer());
        document.querySelectorAll('.mode-pill').forEach(p => p.addEventListener('click', (e) => this.setTimerMode(e.target.dataset.mode)));

        // Landing screen button
        document.getElementById('btnNewSession').addEventListener('click', () => {
            this.goToStep(1);
        });
    }

    // BUG FIX 1: helper to sync chips to current h/m inputs
    syncChipToCurrentDuration() {
        const h = parseInt(document.getElementById('inputHours').value) || 0;
        const m = parseInt(document.getElementById('inputMinutes').value) || 0;
        const total = (h * 60) + m;
        let matched = false;
        document.querySelectorAll('.chip').forEach(c => {
            if (parseInt(c.dataset.time) === total) {
                c.classList.add('active');
                matched = true;
            } else {
                c.classList.remove('active');
            }
        });
        // If no chip matches, deselect all
        if (!matched) {
            document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        }
    }

    // --- LOGIC ---

    selectMethod(method) {
        this.state.selectedMethod = method;
        let mins = 60;
        let title = "Configura tu sesión";

        if (method === 'hyperfocus') { mins = 90; title = "Sesión de Hiperfoco"; }
        else if (method === 'ultradian') { mins = 90; title = "Ciclo Ultradiano"; }
        else if (method === 'pomodoro') { mins = 25; title = "Sesión Pomodoro"; }
        else if (method === '5217') { mins = 52; title = "Sesión 52/17"; }
        else if (method === 'timeblocking') { mins = 60; title = "Time Blocking"; }

        document.getElementById('durationTitle').textContent = title;
        this.updateDurationInputs(mins);
        // Sync chips to the new method's default duration
        this.syncChipToCurrentDuration();
        this.goToStep(2);
    }

    updateDurationInputs(total) {
        document.getElementById('inputHours').value = Math.floor(total / 60);
        document.getElementById('inputMinutes').value = total % 60;
    }

    // --- FLIGHT API & PROCESSING ---

    async loadFlights() {
        const grid = document.getElementById('flightsGrid');
        grid.innerHTML = `<div class="loader-container"><div class="spinner"></div><p>Escaneando tráfico aéreo global...</p></div>`;
        document.getElementById('selectionSubtitle').textContent = `Duración: ${this.formatTime(this.state.selectedDurationMinutes)}`;

        try {
            // 1. Fetch live data from OpenSky Network
            const response = await fetch('https://opensky-network.org/api/states/all');
            const data = await response.json();

            if (!data.states || data.states.length === 0) {
                throw new Error("No sky data");
            }

            this.processAndRenderFlights(data.states);

        } catch (error) {
            console.error("API Error:", error);
            grid.innerHTML = `<div class="loader-container"><p>Error de conexión con torre de control.</p><button class="btn-glass-primary" style="margin-top:1rem" onclick="window.app.loadFlights()">Reintentar</button></div>`;
        }
    }

    processAndRenderFlights(rawStates) {
        const targetMins = this.state.selectedDurationMinutes;
        const targetSeconds = targetMins * 60;

        // Expanded Airport Database for matching
        const GLOBAL_HUBS = [
            { code: 'LHR', name: 'London Heathrow', lat: 51.4700, lng: -0.4543 },
            { code: 'JFK', name: 'New York JFK', lat: 40.6413, lng: -73.7781 },
            { code: 'DXB', name: 'Dubai Intl', lat: 25.2532, lng: 55.3657 },
            { code: 'HND', name: 'Tokyo Haneda', lat: 35.5494, lng: 139.7798 },
            { code: 'CDG', name: 'Paris Charles de Gaulle', lat: 49.0097, lng: 2.5479 },
            { code: 'AMS', name: 'Amsterdam Schiphol', lat: 52.3105, lng: 4.7683 },
            { code: 'FRA', name: 'Frankfurt', lat: 50.0379, lng: 8.5622 },
            { code: 'SIN', name: 'Singapore Changi', lat: 1.3644, lng: 103.9915 },
            { code: 'IST', name: 'Istanbul', lat: 41.2768, lng: 28.7217 },
            { code: 'SYD', name: 'Sydney Kingsford', lat: -33.9399, lng: 151.1753 },
            { code: 'LAX', name: 'Los Angeles Intl', lat: 33.9416, lng: -118.4085 },
            { code: 'ORD', name: 'Chicago O\'Hare', lat: 41.9742, lng: -87.9073 },
            { code: 'DFW', name: 'Dallas/Fort Worth', lat: 32.8998, lng: -97.0403 },
            { code: 'DEN', name: 'Denver Intl', lat: 39.8561, lng: -104.6737 },
            { code: 'MAD', name: 'Madrid Barajas', lat: 40.4839, lng: -3.5680 },
            { code: 'BCN', name: 'Barcelona El Prat', lat: 41.2974, lng: 2.0833 },
            { code: 'YYZ', name: 'Toronto Pearson', lat: 43.6777, lng: -79.6248 },
            { code: 'GRU', name: 'São Paulo Guarulhos', lat: -23.4356, lng: -46.4731 },
            { code: 'MEX', name: 'Mexico City Benito', lat: 19.4361, lng: -99.0719 },
            { code: 'HKG', name: 'Hong Kong Intl', lat: 22.3080, lng: 113.9185 },
            { code: 'ICN', name: 'Seoul Incheon', lat: 37.4602, lng: 126.4407 },
            { code: 'DEL', name: 'Delhi Indira Gandhi', lat: 28.5562, lng: 77.1000 },
            { code: 'BKK', name: 'Bangkok Suvarnabhumi', lat: 13.6900, lng: 100.7501 },
            { code: 'SFO', name: 'San Francisco', lat: 37.6213, lng: -122.3790 },
            { code: 'MIA', name: 'Miami Intl', lat: 25.7959, lng: -80.2870 }
        ];

        // Filter and Process
        const flights = rawStates
            .filter(state =>
                !state[8] && // !on_ground
                state[5] && // has longitude
                state[6] && // has latitude
                state[9] > 100 // velocity > 100m/s (cruising)
            )
            .map(state => {
                const [icao24, callsign, origin_country, time_position, last_contact, longitude, latitude, baro_altitude, on_ground, velocity, true_track] = state;

                const cleanCallsign = (callsign || icao24).trim();
                const distanceMeters = velocity * targetSeconds;
                const projected = this.calculateDestination(latitude, longitude, true_track, distanceMeters);

                // BUG FIX 2: Find nearest hub for DESTINATION (projected forward)
                let nearestDestHub = null;
                let minDestDist = Infinity;
                for (const hub of GLOBAL_HUBS) {
                    const dist = this.calculateDistance(projected.lat, projected.lng, hub.lat, hub.lng);
                    if (dist < minDestDist) {
                        minDestDist = dist;
                        nearestDestHub = hub;
                    }
                }

                // BUG FIX 2: Find nearest hub for ORIGIN (current position, backwards)
                // Project backwards using opposite heading to find approximate departure airport
                const oppositeHeading = (true_track + 180) % 360;
                // Use a reasonable "already-flown" distance estimate
                const elapsedDistMeters = velocity * targetSeconds * 0.5; // assume ~50% into flight as rough heuristic
                const projectedOrigin = this.calculateDestination(latitude, longitude, oppositeHeading, elapsedDistMeters);

                let nearestOriginHub = null;
                let minOriginDist = Infinity;
                for (const hub of GLOBAL_HUBS) {
                    const dist = this.calculateDistance(projectedOrigin.lat, projectedOrigin.lng, hub.lat, hub.lng);
                    if (dist < minOriginDist) {
                        minOriginDist = dist;
                        nearestOriginHub = hub;
                    }
                }

                // 800km tolerance for trajectory matching
                if (minDestDist < 800 && nearestDestHub && nearestOriginHub) {
                    // Ensure origin and destination are different
                    const finalOrigin = (nearestOriginHub.code !== nearestDestHub.code)
                        ? nearestOriginHub
                        : { code: origin_country ? origin_country.substring(0, 3).toUpperCase() : 'OVR', name: origin_country || 'En Vuelo', lat: latitude, lng: longitude };

                    return {
                        icao24,
                        callsign: cleanCallsign || "N/A",
                        origin: { ...finalOrigin, lat: latitude, lng: longitude }, // use actual position for map path start
                        originHub: finalOrigin, // airport code/name for display
                        destination: nearestDestHub,
                        lat: latitude,
                        lon: longitude,
                        velocity,
                        heading: true_track,
                        estDuration: targetMins,
                        matchScore: minDestDist
                    };
                }
                return null;
            })
            .filter(f => f !== null)
            .sort((a, b) => a.matchScore - b.matchScore)
            .slice(0, 15);

        if (flights.length === 0) {
            const grid = document.getElementById('flightsGrid');
            grid.innerHTML = `
                <div class="loader-container">
                    <p style="text-align: center; color: var(--text-secondary); margin-top: 2rem;">
                         No hay vuelos que coincidan con tu trayectoria exacta ahora mismo.
                    </p>
                    <button class="btn-glass-primary" style="margin-top:1rem" onclick="window.app.loadFlights()">Escanear otro sector</button>
                </div>
            `;
            return;
        }

        this.state.flights = flights;
        this.renderFlightCards(flights);
    }

    // Helper: Calculate destination point given start, bearing, and distance
    calculateDestination(lat1, lon1, bearing, distMeters) {
        const R = 6371e3; // Earth radius
        const φ1 = lat1 * Math.PI / 180;
        const λ1 = lon1 * Math.PI / 180;
        const θ = bearing * Math.PI / 180;
        const δ = distMeters / R;

        const φ2 = Math.asin(Math.sin(φ1) * Math.cos(δ) + Math.cos(φ1) * Math.sin(δ) * Math.cos(θ));
        const λ2 = λ1 + Math.atan2(Math.sin(θ) * Math.sin(δ) * Math.cos(φ1), Math.cos(δ) - Math.sin(φ1) * Math.sin(φ2));

        return {
            lat: φ2 * 180 / Math.PI,
            lng: λ2 * 180 / Math.PI
        };
    }

    renderFlightCards(flights) {
        const grid = document.getElementById('flightsGrid');
        grid.innerHTML = '';

        flights.forEach(f => {
            const el = document.createElement('div');
            el.className = 'flight-card-native';

            // BUG FIX 2: Show real originHub code and name
            const originCode = f.originHub ? f.originHub.code : '???';
            const originName = f.originHub ? f.originHub.name : 'En Vuelo';

            el.innerHTML = `
                <div class="card-top">
                    <div class="card-callsign">${f.callsign}</div>
                    <div class="card-time">${this.formatTime(f.estDuration)}</div>
                </div>
                <div class="card-route">
                    <span class="route-city">${originCode}</span>
                    <div class="route-line"><span class="material-symbols-rounded plane-icon-small">flight</span></div>
                    <span class="route-city">${f.destination.code}</span>
                </div>
                <div class="card-meta">
                    <span>${originName} → ${f.destination.name}</span>
                </div>
            `;
            el.addEventListener('click', () => this.startTracking(f));
            grid.appendChild(el);
        });
    }

    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    formatTime(m) {
        const h = Math.floor(m / 60);
        const rem = m % 60;
        return h > 0 ? `${h}h ${rem}m` : `${rem}m`;
    }

    // --- TRACKING ---

    initMap() {
        this.map = L.map('map', { zoomControl: false, attributionControl: false }).setView([0, 0], 3);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
            subdomains: 'abcd'
        }).addTo(this.map);

        this.layers.pathPast.addTo(this.map);
        this.layers.pathFuture.addTo(this.map);
        this.layers.plane.addTo(this.map);
    }

    startTracking(flight) {
        this.state.selectedFlight = flight;
        this.goToStep(4);

        const originCode = flight.originHub ? flight.originHub.code : '???';
        document.getElementById('trackCallsign').textContent = flight.callsign;
        document.getElementById('trackOrigin').textContent = `${originCode} → ${flight.destination.code}`;

        // BUG FIX 3: Timer is configured but NOT started automatically
        this.configureMethodUI();
        this.calculateGeodesicPath(flight);
        this.startAnim();

        // FEAT 1: Play boarding ding sound when flight is selected
        this.audio.playBoardingDing();
    }

    configureMethodUI() {
        const method = this.state.selectedMethod;
        const selector = document.querySelector('.mode-selector');
        const main = document.querySelector('.bottom-center');

        if (method === 'hyperfocus') {
            main.classList.add('minimal-timer');
            selector.style.display = 'none';
        } else {
            main.classList.remove('minimal-timer');
            selector.style.display = 'flex';
        }

        // BUG FIX 3: Do NOT auto-start timer; just set the initial value
        if (method === 'hyperfocus') {
            this.state.timerValue = this.state.selectedDurationMinutes * 60;
        } else if (method === 'flowtime') {
            this.state.timerValue = 0;
        } else {
            // Pomodoro, 5217, ultradian, timeblocking — set mode without auto-starting
            this.setTimerModeValue(method, 'work');
        }

        // BUG FIX 3: Ensure timer is NOT running
        this.state.timerRunning = false;
        clearInterval(this.intervals.timer);
        const btn = document.getElementById('iconPomudoToggle');
        if (btn) btn.textContent = 'play_arrow';

        this.updateTimerDisplay();
    }

    // BUG FIX 4: Extracted timer value logic so timeblocking uses its own duration
    setTimerModeValue(method, mode) {
        this.state.pomodoroMode = mode;

        if (method === 'timeblocking') {
            // Time blocking: uses the full user-defined duration for work, proportional breaks
            const totalMins = this.state.selectedDurationMinutes;
            if (mode === 'work') {
                this.state.timerValue = totalMins * 60;
            } else if (mode === 'short') {
                this.state.timerValue = Math.max(5, Math.round(totalMins * 0.1)) * 60;
            } else if (mode === 'long') {
                this.state.timerValue = Math.max(10, Math.round(totalMins * 0.2)) * 60;
            }
        } else if (method === 'ultradian') {
            if (mode === 'work') this.state.timerValue = 90 * 60;
            else if (mode === 'short') this.state.timerValue = 20 * 60;
            else if (mode === 'long') this.state.timerValue = 20 * 60;
        } else if (method === '5217') {
            if (mode === 'work') this.state.timerValue = 52 * 60;
            else if (mode === 'short') this.state.timerValue = 17 * 60;
            else if (mode === 'long') this.state.timerValue = 17 * 60;
        } else {
            // Pomodoro default
            if (mode === 'work') this.state.timerValue = 25 * 60;
            else if (mode === 'short') this.state.timerValue = 5 * 60;
            else if (mode === 'long') this.state.timerValue = 15 * 60;
        }
    }

    calculateGeodesicPath(flight) {
        const start = flight.origin;
        const end = flight.destination;
        const pathPoints = this.getGreatCirclePoints(start, end, 100);

        this.state.flightAnimation = {
            path: pathPoints,
            totalDuration: flight.estDuration * 60 * 1000,
            startTime: Date.now(),
        };

        const bounds = L.latLngBounds([start, end]);
        this.map.fitBounds(bounds, { padding: [50, 50], animate: true });
    }

    getGreatCirclePoints(start, end, numPoints) {
        const points = [];
        for (let i = 0; i <= numPoints; i++) {
            const f = i / numPoints;
            const lat = start.lat + (end.lat - start.lat) * f;
            const lng = start.lng + (end.lng - start.lng) * f;
            points.push({ lat, lng });
        }
        return points;
    }

    startAnim() {
        if (this.intervals.anim) clearInterval(this.intervals.anim);
        this.intervals.anim = setInterval(() => this.updateFrame(), 33);
    }

    updateFrame() {
        if (!this.state.flightAnimation) return;
        const anim = this.state.flightAnimation;
        const now = Date.now();
        const progress = Math.min((now - anim.startTime) / anim.totalDuration, 1);

        const totalPoints = anim.path.length;
        const currentIdxFloat = progress * (totalPoints - 1);
        const idx = Math.floor(currentIdxFloat);
        const nextIdx = Math.min(idx + 1, totalPoints - 1);
        const subT = currentIdxFloat - idx;

        const p1 = anim.path[idx];
        const p2 = anim.path[nextIdx];

        const lat = p1.lat + (p2.lat - p1.lat) * subT;
        const lng = p1.lng + (p2.lng - p1.lng) * subT;

        const dy = p2.lat - p1.lat;
        const dx = (p2.lng - p1.lng) * Math.cos(lat * Math.PI / 180);
        const angle = Math.atan2(dx, dy) * 180 / Math.PI;

        this.updateMarker(lat, lng, angle);
        this.updatePathLines(anim.path, currentIdxFloat);
        this.map.panTo([lat, lng], { animate: false });

        const leftMs = anim.totalDuration * (1 - progress);
        document.getElementById('trackRemaining').textContent = `${Math.ceil(leftMs / 60000)}m`;

        // Check flight animation done — trigger landing
        if (progress >= 1) {
            clearInterval(this.intervals.anim);
            this.showLandingScreen();
        }
    }

    updateMarker(lat, lng, angle) {
        this.layers.plane.clearLayers();
        const h = `<div class="plane-marker-icon" style="transform: rotate(${angle}deg); font-size: 28px; color: var(--accent-color); text-shadow: 0 0 15px var(--accent-glow); display: flex; align-items:center; justify-content:center; width: 100%; height: 100%;"><span class="material-symbols-rounded">flight</span></div>`;
        const icon = L.divIcon({
            html: h,
            className: 'plane-cont',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });
        L.marker([lat, lng], { icon: icon }).addTo(this.layers.plane);
    }

    updatePathLines(path, currentIdxFloat) {
        const idx = Math.floor(currentIdxFloat);
        const pastPoints = path.slice(0, idx + 1);
        const futurePoints = path.slice(idx);

        this.layers.pathPast.clearLayers();
        this.layers.pathFuture.clearLayers();

        if (pastPoints.length > 1) {
            L.polyline(pastPoints, {
                color: 'var(--text-tertiary)',
                weight: 2,
                opacity: 0.4,
                className: 'path-past'
            }).addTo(this.layers.pathPast);
        }

        if (futurePoints.length > 1) {
            L.polyline(futurePoints, {
                color: 'var(--accent-color)',
                weight: 2,
                className: 'path-future'
            }).addTo(this.layers.pathFuture);
        }
    }

    toggleTimer() {
        const btn = document.getElementById('iconPomudoToggle');
        if (this.state.timerRunning) {
            this.state.timerRunning = false;
            clearInterval(this.intervals.timer);
            btn.textContent = 'play_arrow';
        } else {
            this.state.timerRunning = true;
            btn.textContent = 'pause';
            this.intervals.timer = setInterval(() => this.tickTimer(), 1000);
        }
    }

    tickTimer() {
        if (this.state.selectedMethod === 'flowtime') {
            this.state.timerValue++;
        } else {
            this.state.timerValue--;
            if (this.state.timerValue <= 0) this.timerComplete();
        }
        this.updateTimerDisplay();
    }

    timerComplete() {
        this.state.timerRunning = false;
        clearInterval(this.intervals.timer);
        document.getElementById('iconPomudoToggle').textContent = 'play_arrow';

        // Notify with browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification("Autopilot", { body: "¡Sesión Completada!" });
        }
    }

    // Called when FLIGHT animation ends (full duration has elapsed)
    showLandingScreen() {
        this.stopTracking();

        // FEAT 2: Play landing melody
        this.audio.playLandingMelody();

        const f = this.state.selectedFlight;
        if (f) {
            const dest = f.destination;
            document.getElementById('landedDestName').textContent = dest.name;
            document.getElementById('landedDestCode').textContent = dest.code;
            document.getElementById('landedCallsign').textContent = f.callsign;
        }

        this.goToStep(5);
    }

    setTimerMode(mode) {
        this.state.pomodoroMode = mode;
        // BUG FIX 4: Use method-aware helper
        this.setTimerModeValue(this.state.selectedMethod, mode);
        this.updateTimerDisplay();

        document.querySelectorAll('.mode-pill').forEach(p => {
            p.classList.toggle('active', p.dataset.mode === mode);
        });
    }

    resetTimer() {
        this.state.timerRunning = false;
        clearInterval(this.intervals.timer);
        document.getElementById('iconPomudoToggle').textContent = 'play_arrow';

        if (this.state.selectedMethod === 'hyperfocus') {
            this.state.timerValue = this.state.selectedDurationMinutes * 60;
        } else if (this.state.selectedMethod === 'flowtime') {
            this.state.timerValue = 0;
        } else {
            this.setTimerModeValue(this.state.selectedMethod, this.state.pomodoroMode);
        }

        this.updateTimerDisplay();
    }

    updateTimerDisplay() {
        const m = Math.floor(Math.abs(this.state.timerValue) / 60);
        const s = Math.abs(this.state.timerValue) % 60;
        document.getElementById('mainTimer').textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    stopTracking() {
        clearInterval(this.intervals.anim);
        clearInterval(this.intervals.timer);
        this.state.timerRunning = false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new AutopilotApp();
});

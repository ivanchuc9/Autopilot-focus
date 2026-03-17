# ✈️ Autopilot - Productivity in Flight
(is my first repo, so expect bugs)

**Transform your deep work sessions into mental journeys**

Autopilot is a desktop productivity application that uses real-time flights as a metaphor to maintain sustained concentration. Inspired by Material Design 3 and optimized for hyperfocus.

![Autopilot](https://img.shields.io/badge/Version-1.0.0-blue) ![License](https://img.shields.io/badge/License-MIT-green)

## 🎯 Key Features

### ⏳ Duration-First Selection (New)
- **Time-First Flow**: You define how long you want to work, the system finds the perfect flight.
- **Quick Filters**: 30m, 1h, 1.5h, 2h, etc.
- **Custom Duration**: Manual adjustment of exact hours and minutes.
- **Matching Algorithm**: Searches for real flights whose estimated duration matches your session, avoiding premature landings.

### 🎬 Pre-calculated & Synchronized Animation
- **Fluid Movement**: The plane advances smoothly by calculating the complete trajectory from the start.
- **Smart Synchronization**: Periodic verification with the API every 5 minutes to correct subtle deviations without abrupt jumps.
- **Route Projection**: Visualization of the complete estimated trajectory.

### 🌑 "Tunnel Effect" Aesthetics
- **Twilight Palette**: Desaturated tones, deep grays, and muted blues.
- **Low Stimulation**: Interface designed to "disappear" peripherally.
- **Dark Map**: Custom high-contrast but low-brightness map layer.

### ⏱️ Integrated Pomodoro Timer
- Modes: Work (25m), Short Break (5m), Long Break (15m)
- Start/pause/reset controls
- Sound notifications on completion

## 🚀 Installation and Usage

### Option 1: Direct Use (Recommended)

1. **Open the `index.html` file directly in your browser**:
```bash
   # From Windows Explorer
   Double-click LANZAR_Autopilot.bat
```

2. **Ready!** The application will load immediately.

## 📖 User Guide

### 1️⃣ **Define Your Session**

- On startup, **select the duration** of your work session (e.g., 1 hour).
- Optionally enter a custom time.
- The system will search for active flights that match that time.

### 2️⃣ **Select Your "Vehicle"**

- You'll see a prioritized list of real flights.
- Match quality is indicated ("Perfect match").
- Click on a flight to begin.

### 3️⃣ **Focus Mode (Tracking)**

- The map shows flight progress synchronized with your time.
- Activate **Pomodoro** if you want to divide the session into blocks.
- **Tunnel Effect**: The dark interface minimizes visual fatigue and distractions.

**Concentration Tips:**
- The animation is your visual clock: when the plane lands, your session ends.
- If the real flight deviates or changes speed, the system will smoothly adjust the animation.

### 3️⃣ **Statistics View**

- Review your accumulated progress
- Unlock achievements:
  - 🛫 **First Flight**: Track your first flight
  - 🌍 **World Traveler**: Track 10 flights
  - ⭐ **Zen Concentration**: Complete 5 Pomodoro sessions
  - 💎 **Flow Master**: Maintain a 7-day streak

## 🎨 Customization

### Colors
Edit `styles.css` in the `:root` section to change the palette:
```css
:root {
    --primary-600: #56809cff;    /* Primary color */
    --secondary-500: #42b8dbff;  /* Secondary color */
    --accent-500: #216769ff;     /* Accent color */
}
```

### Flight Region
Modify the search area in `app.js` line ~105:
```javascript
// Change bounding box coordinates
const response = await fetch(
    'https://opensky-network.org/api/states/all?lamin=35&lomin=-10&lamax=60&lomax=30'
    // lamin: minimum latitude
    // lomin: minimum longitude
    // lamax: maximum latitude
    // lomax: maximum longitude
);
```

### Pomodoro Times
Adjust in `app.js` line ~532:
```javascript
const modes = {
    'work': 25 * 60,    // 25 minutes
    'short': 5 * 60,    // 5 minutes
    'long': 15 * 60     // 15 minutes
};
```

## 🛠️ Technologies Used

- **HTML5**: Semantic structure
- **CSS3**: Modern design with CSS variables, Grid, Flexbox
- **JavaScript (Vanilla)**: Application logic without frameworks
- **Leaflet.js**: Interactive maps
- **OpenSky Network API**: Real-time flight data
- **Web Audio API**: Sound notifications
- **LocalStorage**: Statistics persistence

## 🌐 Flight API - OpenSky Network

**Features:**
- ✅ Free
- ✅ No API key required
- ✅ Real-time data
- ✅ Global coverage
- ⚠️ Limit: 10 seconds between requests

**Documentation**: https://opensky-network.org/apidoc/

## 📊 Project Structure
```
Autopilot-productive/
├── index.html          # Application structure
├── styles.css          # Complete design system
├── app.js             # Application logic
└── README.md          # This documentation
```

## 🎯 Future Roadmap

### Planned Improvements:
- [ ] **Electron packaging**: Native desktop app
- [ ] **Multiple regions**: Geographic area selector
- [ ] **Commercial routes**: Origin/destination airport information
- [ ] **Offline mode**: Cache of recent flights
- [ ] **Additional themes**: Light/Dark/Automatic
- [ ] **Spotify integration**: Background music for concentration
- [ ] **Statistics export**: CSV/JSON
- [ ] **Desktop widget**: Always visible

### Advanced Gamification:
- [ ] **Level system**: XP for completed sessions
- [ ] **Airline collection**: Track different companies
- [ ] **Coverage map**: Visualize all tracked routes
- [ ] **Weekly challenges**: Personalized goals

## 💡 Productivity Tips

### "Mental Flight" Technique
1. **Pre-flight**: Plan your session (5 min)
2. **Takeoff**: Start with simple tasks (10 min)
3. **Cruise**: Deep concentration on main task (25-50 min)
4. **Landing**: Review and close (5 min)

### Combination with Pomodoro
- **1 Pomodoro = Takeoff**
- **2-3 Pomodoros = Cruise**
- **4 Pomodoros = Complete Landing**

### Pilot Metaphor
> "You can't pause a flight mid-air. Similarly, maintain your concentration without interruptions during work sessions."

## 🔒 Privacy

- ✅ **No tracking**: We don't collect personal data
- ✅ **Local-first**: Statistics saved in your browser
- ✅ **No account required**: Works completely offline (except flight data)
- ✅ **Open source**: Fully auditable code

## 🐛 Troubleshooting

### Flights won't load
- **Cause**: OpenSky API rate limit
- **Solution**: Wait 10 seconds and try refreshing

### Map doesn't display
- **Cause**: Leaflet CDN connection
- **Solution**: Check your internet connection

### Notifications don't work
- **Cause**: Browser permissions
- **Solution**: Accept permissions when the app requests them

## 📄 License

MIT License - Free for personal and commercial use

## 👨‍💻 Credits

**Developed with:**
- Material Design 3 guidelines
- Inspiration: Original Autopilot
- Data: OpenSky Network
- Maps: Leaflet.js + CartoDB Dark

---

**Safe flight and excellent concentration! ✈️🎯**

Questions or suggestions? Open an issue in the repository.

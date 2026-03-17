# ✈️ Autopilot - Productividad en Vuelo

**Transforma tus sesiones de trabajo profundo en viajes mentales**

Autopilot es una aplicación de escritorio de productividad que utiliza vuelos reales en tiempo real como metáfora para mantener la concentración sostenida. Inspirada en Material Design 3 y optimizada para el hiperfoco.

![Autopilot](https://img.shields.io/badge/Version-1.0.0-blue) ![License](https://img.shields.io/badge/License-MIT-green)

## 🎯 Características Principales

### ⏳ Selección por Duración (Nuevo)
- **Flujo "Tiempo Primero"**: Tú defines cuánto quieres trabajar, el sistema encuentra el vuelo perfecto.
- **Filtros Rápidos**: 30m, 1h, 1.5h, 2h, etc.
- **Duración Personalizada**: Ajuste manual de horas y minutos exactos.
- **Algoritmo de Coincidencia**: Busca vuelos reales cuya duración estimada coincida con tu sesión evitando aterrizajes prematuros.

### 🎬 Animación Pre-calculada & Sincronizada
- **Movimiento Fluido**: El avión avanza suavemente calculando la trayectoria completa desde el inicio.
- **Sincronización Inteligente**: Verificación puntual con la API cada 5 minutos para corregir desviaciones sutiles sin saltos bruscos.
- **Proyección de Ruta**: Visualización de la trayectoria completa estimada.

### 🌑 Estética "Efecto Túnel"
- **Paleta Crepuscular**: Tonos desaturados, grises profundos y azules apagados.
- **Baja Estimulación**: Interfaz diseñada para "desaparecer" periféricamente.
- **Mapa Oscuro**: Capa de mapa personalizada de alto contraste pero bajo brillo.

### ⏱️ Temporizador Pomodoro Integrado
- Modos: Trabajo (25m), Descanso Corto (5m), Descanso Largo (15m)
- Controles de inicio/pausa/reinicio
- Notificaciones con sonido al completar

## 🚀 Instalación y Uso

### Opción 1: Uso Directo (Recomendado)

1. **Abre el archivo `index.html` directamente en tu navegador**:
   ```bash
   # Desde el explorador de Windows
   Doble clic en LANZAR_Autopilot.bat
   ```

2. **¡Listo!** La aplicación cargará inmediatamente.

## 📖 Guía de Uso

### 1️⃣ **Define tu Sesión**

- Al iniciar, **selecciona la duración** de tu sesión de trabajo (ej. 1 hora).
- Opcionalmente ingresa un tiempo personalizado.
- El sistema buscará vuelos activos que encajen con ese tiempo.

### 2️⃣ **Selecciona tu "Vehículo"**

- Verás una lista priorizada de vuelos reales.
- Se indica la calidad de la compaginación ("Coincidencia perfecta").
- Haz clic en un vuelo para iniciar.

### 3️⃣ **Modo Enfoque (Tracking)**

- El mapa muestra el progreso del vuelo sincronizado con tu tiempo.
- Activa el **Pomodoro** si deseas dividir la sesión en bloques.
- **Efecto Túnel**: La interfaz oscura minimiza el cansancio visual y las distracciones.

**Tips de Concentración:**
- La animación es tu reloj visual: cuando el avión aterrice, tu sesión termina.
- Si el vuelo real se desvía o cambia velocidad, el sistema ajustará suavemente la animación.

### 3️⃣ **Vista de Estadísticas**

- Revisa tu progreso acumulado
- Desbloquea logros:
  - 🛫 **Primer Vuelo**: Rastrea tu primer vuelo
  - 🌍 **Viajero Mundial**: Rastrea 10 vuelos
  - ⭐ **Concentración Zen**: Completa 5 sesiones Pomodoro
  - 💎 **Maestro del Flow**: Mantén una racha de 7 días

## 🎨 Personalización

### Colores
Edita `styles.css` en la sección `:root` para cambiar la paleta:

```css
:root {
    --primary-600: #56809cff;    /* Color primario */
    --secondary-500: #42b8dbff;  /* Color secundario */
    --accent-500: #216769ff;     /* Color de acento */
}
```

### Región de Vuelos
Modifica el área de búsqueda en `app.js` línea ~105:

```javascript
// Cambiar coordenadas del bounding box
const response = await fetch(
    'https://opensky-network.org/api/states/all?lamin=35&lomin=-10&lamax=60&lomax=30'
    // lamin: latitud mínima
    // lomin: longitud mínima
    // lamax: latitud máxima
    // lomax: longitud máxima
);
```

### Tiempos Pomodoro
Ajusta en `app.js` línea ~532:

```javascript
const modes = {
    'work': 25 * 60,    // 25 minutos
    'short': 5 * 60,    // 5 minutos
    'long': 15 * 60     // 15 minutos
};
```

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Diseño moderno con variables CSS, Grid, Flexbox
- **JavaScript (Vanilla)**: Lógica de aplicación sin frameworks
- **Leaflet.js**: Mapas interactivos
- **OpenSky Network API**: Datos de vuelos en tiempo real
- **Web Audio API**: Notificaciones sonoras
- **LocalStorage**: Persistencia de estadísticas

## 🌐 API de Vuelos - OpenSky Network

**Características:**
- ✅ Gratuita
- ✅ Sin necesidad de API key
- ✅ Datos en tiempo real
- ✅ Cobertura global
- ⚠️ Límite: 10 segundos entre requests

**Documentación**: https://opensky-network.org/apidoc/

## 📊 Estructura del Proyecto

```
Autopilot-productive/
├── index.html          # Estructura de la aplicación
├── styles.css          # Sistema de diseño completo
├── app.js             # Lógica de aplicación
└── README.md          # Esta documentación
```

## 🎯 Roadmap Futuro

### Mejoras Planificadas:
- [ ] **Electron packaging**: App nativa de escritorio
- [ ] **Múltiples regiones**: Selector de área geográfica
- [ ] **Rutas comerciales**: Información de aeropuertos origen/destino
- [ ] **Modo offline**: Cache de vuelos recientes
- [ ] **Temas adicionales**: Claro/Oscuro/Automático
- [ ] **Integración con Spotify**: Música de fondo para concentración
- [ ] **Export de estadísticas**: CSV/JSON
- [ ] **Widget de escritorio**: Siempre visible

### Gamificación Avanzada:
- [ ] **Sistema de niveles**: XP por sesiones completadas
- [ ] **Colección de aerolíneas**: Rastrea diferentes compañías
- [ ] **Mapa de cobertura**: Visualiza todas las rutas seguidas
- [ ] **Desafíos semanales**: Metas personalizadas

## 💡 Consejos de Productividad

### Técnica del "Vuelo Mental"
1. **Pre-vuelo**: Planifica tu sesión (5 min)
2. **Despegue**: Comienza con tareas simples (10 min)
3. **Crucero**: Concentración profunda en la tarea principal (25-50 min)
4. **Aterrizaje**: Revisión y cierre (5 min)

### Combinación con Pomodoro
- **1 Pomodoro = Despegue**
- **2-3 Pomodoros = Crucero**
- **4 Pomodoros = Aterrizaje completo**

### Metáfora del Piloto
> "No puedes pausar un vuelo en el aire. Del mismo modo, mantén tu concentración sin interrupciones durante las sesiones de trabajo."

## 🔒 Privacidad

- ✅ **Sin tracking**: No recopilamos datos personales
- ✅ **Local-first**: Estadísticas guardadas en tu navegador
- ✅ **Sin cuenta requerida**: Funciona completamente offline (excepto datos de vuelos)
- ✅ **Open source**: Código completamente auditable

## 🐛 Solución de Problemas

### Los vuelos no cargan
- **Causa**: Límite de rate de OpenSky API
- **Solución**: Espera 10 segundos e intenta refrescar

### El mapa no se muestra
- **Causa**: Conexión a CDN de Leaflet
- **Solución**: Verifica tu conexión a internet

### Las notificaciones no funcionan
- **Causa**: Permisos de navegador
- **Solución**: Acepta los permisos cuando la app los solicite

## 📄 Licencia

MIT License - Libre para uso personal y comercial

---

**¡Buen vuelo y excelente concentración! ✈️🎯**

¿Preguntas o sugerencias? Abre un issue en el repositorio.

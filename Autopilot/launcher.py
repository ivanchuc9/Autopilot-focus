"""
Autopilot - Focus Productivity App
Lanzador principal cross-platform (Windows / Linux / macOS)
Inicia un servidor HTTP local y abre la app en modo --app de Edge/Chrome/Chromium
"""
import os
import sys
import time
import socket
import threading
import subprocess
import webbrowser
import http.server
import socketserver
import platform

# ── Configuración ────────────────────────────────
APP_NAME = "Autopilot"

# ── Ruta a los archivos de la app ────────────────
if getattr(sys, 'frozen', False):
    # Ejecutando como ejecutable compilado (PyInstaller)
    BASE_DIR = sys._MEIPASS
else:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))


def find_free_port():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('', 0))
        return s.getsockname()[1]


def start_server(port, directory):
    os.chdir(directory)
    handler = http.server.SimpleHTTPRequestHandler
    handler.log_message = lambda *a: None  # silenciar logs
    with socketserver.TCPServer(("127.0.0.1", port), handler) as httpd:
        httpd.serve_forever()


def find_browser():
    """
    Busca un navegador Chromium-based para lanzar en modo --app.
    Compatible con Windows, Linux y macOS.
    Devuelve la ruta del ejecutable o None si no se encuentra.
    """
    system = platform.system()

    if system == "Windows":
        candidates = [
            # Microsoft Edge
            r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
            r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
            os.path.expandvars(r"%LOCALAPPDATA%\Microsoft\Edge\Application\msedge.exe"),
            # Google Chrome
            r"C:\Program Files\Google\Chrome\Application\chrome.exe",
            r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
            os.path.expandvars(r"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"),
            # Brave
            r"C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe",
        ]

    elif system == "Linux":
        candidates = [
            # Google Chrome
            "/usr/bin/google-chrome",
            "/usr/bin/google-chrome-stable",
            "/usr/bin/google-chrome-unstable",
            # Chromium
            "/usr/bin/chromium",
            "/usr/bin/chromium-browser",
            "/snap/bin/chromium",
            "/usr/bin/chromium-browser-stable",
            # Microsoft Edge
            "/usr/bin/microsoft-edge",
            "/usr/bin/microsoft-edge-stable",
            # Brave
            "/usr/bin/brave-browser",
            "/usr/bin/brave-browser-stable",
            # Flatpak Chromium (común en Fedora/openSUSE)
            "/var/lib/flatpak/exports/bin/org.chromium.Chromium",
        ]

    elif system == "Darwin":  # macOS
        candidates = [
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            "/Applications/Chromium.app/Contents/MacOS/Chromium",
            "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
            "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
        ]

    else:
        return None

    for path in candidates:
        if os.path.isfile(path):
            return path
    return None


def launch_app(url):
    browser = find_browser()
    if browser:
        # Modo app: sin barra de navegación, como app nativa
        try:
            subprocess.Popen([
                browser,
                f"--app={url}",
                "--window-size=1280,820",
                "--disable-extensions",
                "--no-first-run",
                "--no-default-browser-check",
            ])
            return
        except Exception as e:
            print(f"Error lanzando {browser}: {e}")

    # Fallback: navegador por defecto del sistema
    webbrowser.open(url)


def main():
    port = find_free_port()
    app_dir = os.path.join(BASE_DIR, "app")

    # Iniciar servidor en hilo daemon
    t = threading.Thread(target=start_server, args=(port, app_dir), daemon=True)
    t.start()

    # Esperar a que el servidor esté listo
    url = f"http://127.0.0.1:{port}/index.html"
    for _ in range(30):
        try:
            with socket.create_connection(("127.0.0.1", port), timeout=0.3):
                break
        except OSError:
            time.sleep(0.15)

    # Lanzar navegador en modo app
    launch_app(url)

    # Mantener el proceso vivo mientras el servidor corre
    try:
        while True:
            time.sleep(3600)
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()


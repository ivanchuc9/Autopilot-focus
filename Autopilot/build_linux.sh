#!/usr/bin/env bash
# ================================================================
# Autopilot - Script de compilación para Linux
# Genera un ejecutable nativo usando PyInstaller
# ================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🔧  Autopilot Build — Linux"
echo "================================"

# 1. Verificar Python 3
if ! command -v python3 &>/dev/null; then
    echo "❌  Python 3 no encontrado."
    exit 1
fi
echo "✓  Python $(python3 --version)"

# 2. Instalar PyInstaller si no está
if ! python3 -c "import PyInstaller" 2>/dev/null; then
    echo "📦  Instalando PyInstaller..."
    pip3 install pyinstaller --quiet
fi
echo "✓  PyInstaller disponible"

# 3. Asegurarse de que la carpeta app/ existe con los archivos web
mkdir -p app
cp -f index.html app/
cp -f app.js     app/  2>/dev/null || true   # app.js podría estar ya en app/
cp -f styles.css app/
echo "✓  Archivos web copiados a app/"

# 4. Convertir icono PNG a ICO (requiere Pillow)
if python3 -c "from PIL import Image" 2>/dev/null && [ -f "autopilot.ico" ]; then
    echo "✓  Icono autopilot.ico disponible"
elif python3 -c "from PIL import Image" 2>/dev/null && [ -f "autopilot_icon.png" ]; then
    python3 -c "
from PIL import Image
img = Image.open('autopilot_icon.png').convert('RGBA')
imgs = [img.resize((s,s)) for s in [16,32,48,64,128,256]]
imgs[0].save('autopilot.ico', format='ICO', append_images=imgs[1:])
print('  ICO generado')
"
fi

# 5. Compilar con PyInstaller
echo ""
echo "🚀  Compilando ejecutable..."
python3 -m PyInstaller \
    --onefile \
    --windowed \
    --name "Autopilot" \
    --add-data "app:app" \
    $([ -f autopilot.ico ] && echo "--icon=autopilot.ico") \
    --noconfirm \
    launcher.py

echo ""
echo "✅  ¡Completado!"
echo "   Ejecutable: $(pwd)/dist/Autopilot"
echo ""
echo "Para ejecutar:"
echo "   ./dist/Autopilot"

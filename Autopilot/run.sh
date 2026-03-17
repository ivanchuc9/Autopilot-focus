#!/usr/bin/env bash
# ================================================================
# Autopilot - Script de lanzamiento para Linux
# Lanza la app directamente con Python (sin compilar)
# ================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🛫  Autopilot — Iniciando..."

# Verificar Python 3
if ! command -v python3 &>/dev/null; then
    echo "❌  Python 3 no encontrado. Instálalo con:"
    echo "    sudo apt install python3    (Debian/Ubuntu)"
    echo "    sudo dnf install python3    (Fedora)"
    echo "    sudo pacman -S python       (Arch)"
    exit 1
fi

# Lanzar la app
cd "$SCRIPT_DIR"
python3 launcher.py

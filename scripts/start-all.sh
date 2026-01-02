#!/bin/bash

# Previous Admin - Startskript für Raspberry Pi
cd "$(dirname "$0")"

echo "========================================"
echo "  Previous Admin wird gestartet..."
echo "========================================"
echo ""

# Alle laufenden Backend- und Frontend-Prozesse beenden
echo "Beende alle laufenden Prozesse..."
pkill -f "backend/index" 2>/dev/null
pkill -f "vite preview" 2>/dev/null
pkill -f "tsx backend" 2>/dev/null
sleep 2
echo "✓ Prozesse beendet"
echo ""

# Backend im Hintergrund starten
echo "Starte Backend..."
npm run backend > backend.log 2>&1 &
BACKEND_PID=$!
echo "✓ Backend gestartet (PID: $BACKEND_PID)"
echo "  Logs: backend.log"
echo ""

echo "Warte 3 Sekunden..."
sleep 3

# IP-Adresse anzeigen
echo ""
echo "========================================"
echo "  Netzwerk-Informationen"
echo "========================================"
# macOS compatible: Use ifconfig instead of hostname -I
IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
echo "IP-Adresse: $IP"
echo ""
echo "Zugriff über Browser:"
echo "  http://$IP:2342"
echo "  http://localhost:2342"
echo ""
echo "========================================"
echo ""

# Frontend starten (im Vordergrund)
echo "Frontend wird gestartet..."
echo ""
npm run preview -- --host 0.0.0.0 --port 2342

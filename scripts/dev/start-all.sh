#!/bin/bash

# Previous Admin - Startup script for Raspberry Pi
cd "$(dirname "$0")"

echo "========================================"
echo "  Starting Previous Admin..."
echo "========================================"
echo ""

# Stop all running backend and frontend processes
echo "Stopping all running processes..."
pkill -f "backend/index" 2>/dev/null
pkill -f "vite preview" 2>/dev/null
pkill -f "tsx backend" 2>/dev/null
sleep 2
echo "✓ Processes stopped"
echo ""

# Start backend in background
echo "Starting backend..."
if [ "$CI" = "true" ]; then
  npm run backend &
else
  npm run backend > backend.log 2>&1 &
fi
BACKEND_PID=$!
echo "✓ Backend started (PID: $BACKEND_PID)"
if [ "$CI" != "true" ]; then
  echo "  Logs: backend.log"
fi
echo ""

echo "Waiting 3 seconds..."
sleep 3

# Display IP address
echo ""
echo "========================================"
echo "  Network Information"
echo "========================================"
# macOS compatible: Use ifconfig instead of hostname -I
IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
echo "IP Address: $IP"
echo ""
echo "Access via browser:"
echo "  http://$IP:2342"
echo "  http://localhost:2342"
echo ""
echo "========================================"
echo ""

# Start frontend in background
echo "Starting frontend..."
echo ""
npm run preview -- --host 0.0.0.0 --port 2342 &
FRONTEND_PID=$!
echo "✓ Frontend started (PID: $FRONTEND_PID)"
echo ""

echo "Waiting 3 seconds for frontend..."
sleep 3

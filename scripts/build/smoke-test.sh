#!/usr/bin/env bash
set -euo pipefail

# Simple smoke test for the bundled backend
# Starts the bundle, waits for the health endpoint, then stops it

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

BUNDLE="backend/dist/bundle.js"
if [ ! -f "$BUNDLE" ]; then
  echo "Bundle not found: $BUNDLE" >&2
  exit 2
fi

PORT=${PORT:-3001}

echo "Starting backend bundle..."
node "$BUNDLE" &
PID=$!

trap 'kill $PID 2>/dev/null || true; exit 1' INT TERM

echo "Waiting for health endpoint http://127.0.0.1:${PORT}/api/health ..."
for i in {1..20}; do
  if curl -sSf "http://127.0.0.1:${PORT}/api/health" >/dev/null 2>&1; then
    echo "Health check OK"
    kill $PID 2>/dev/null || true
    wait $PID 2>/dev/null || true
    exit 0
  fi
  sleep 0.5
done

echo "Health check failed after timeout" >&2
kill $PID 2>/dev/null || true
wait $PID 2>/dev/null || true
exit 3

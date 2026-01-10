#!/usr/bin/env bash
set -euo pipefail

# Build helper for backend bundling (moved to scripts/)
# Runs npm install and then esbuild bundling target

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "Installing dependencies..."
npm install --no-audit --no-fund >/dev/null 2>&1

echo "Building backend bundle..."
npm run build:backend:bundle

echo "Backend bundle created at backend/dist/bundle.js"

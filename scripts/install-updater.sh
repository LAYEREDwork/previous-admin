#!/usr/bin/env bash
# Install script for Previous Admin Updater
# - Builds backend TypeScript
# - Copies project to /opt/previous-admin
# - Installs production dependencies
# - Installs wrapper to /usr/local/bin and prints sudoers snippet

set -euo pipefail

if [ "$EUID" -ne 0 ]; then
  echo "This installer must be run as root to install files into /opt and /usr/local/bin."
  echo "Run with: sudo ./scripts/install-updater.sh"
  exit 1
fi

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
INSTALL_DIR="/opt/previous-admin"
WRAPPER_SRC="$PROJECT_DIR/scripts/padmin-updater"
WRAPPER_DST="/usr/local/bin/padmin-updater"
SUDOERS_DST="/etc/sudoers.d/padmin-updater"

echo "Building backend TypeScript..."
# build backend TypeScript
cd "$PROJECT_DIR"
# compile backend TS into backend/dist
npx tsc -p backend/tsconfig.json

echo "Creating install directory $INSTALL_DIR"
rm -rf "$INSTALL_DIR"
mkdir -p "$INSTALL_DIR"

echo "Syncing project files to $INSTALL_DIR (excludes node_modules, .git, .previous-admin)"
rsync -a --delete --exclude node_modules --exclude .git --exclude .previous-admin --exclude dist "$PROJECT_DIR/" "$INSTALL_DIR/"

echo "Installing production dependencies in $INSTALL_DIR"
cd "$INSTALL_DIR"
npm install --omit=dev

echo "Installing wrapper to $WRAPPER_DST"
cp "$WRAPPER_SRC" "$WRAPPER_DST"
chown root:root "$WRAPPER_DST"
chmod 750 "$WRAPPER_DST"

echo "Writing sudoers snippet to $SUDOERS_DST (edit to replace backend-user)"
cat > "$SUDOERS_DST" <<'EOF'
# /etc/sudoers.d/padmin-updater
# Replace 'backend-user' with the user running the backend service
backend-user ALL=(root) NOPASSWD: /usr/local/bin/padmin-updater
EOF
chmod 0440 "$SUDOERS_DST"

echo "Installation complete.
- Ensure you replace 'backend-user' in $SUDOERS_DST with the actual backend user.
- The updater entry point is $INSTALL_DIR/backend/updater/dist/index.js (compiled).
- Start the updater via: sudo /usr/local/bin/padmin-updater start"

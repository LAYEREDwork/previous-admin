#!/usr/bin/env bash
set -euo pipefail

# install-release.sh
# Usage: install-release.sh <path-to-release-tarball>
# Extracts release into /opt/previous-admin.new, performs atomic swap with /opt/previous-admin

TARBALL="$1"
if [ -z "$TARBALL" ]; then
  echo "Usage: $0 /path/to/release.tar.gz" >&2
  exit 2
fi

INSTALL_DIR="/opt/previous-admin"
TMP_DIR="${INSTALL_DIR}.new"
BACKUP_DIR="${INSTALL_DIR}.bak.$(date +%s)"

if [ ! -f "$TARBALL" ]; then
  echo "Tarball not found: $TARBALL" >&2
  exit 3
fi

mkdir -p "$TMP_DIR"
tar -xzf "$TARBALL" -C "$TMP_DIR"

# Basic validation: ensure bundle exists
if [ ! -f "$TMP_DIR/backend/dist/bundle.js" ]; then
  echo "Bundle not found in release (backend/dist/bundle.js)" >&2
  rm -rf "$TMP_DIR"
  exit 4
fi

# Stop services (best-effort)
if command -v systemctl >/dev/null 2>&1; then
  systemctl --user stop previous-admin-frontend.service || true
  systemctl --user stop previous-admin-backend.service || true
fi

# Move current to backup, move new into place
if [ -d "$INSTALL_DIR" ]; then
  mv "$INSTALL_DIR" "$BACKUP_DIR"
fi
mv "$TMP_DIR" "$INSTALL_DIR"

# Restore permissions (assume target user exists in INSTALL_DIR/.install-user)
# If INSTALL_DIR/.owner exists, use it; else keep current owner
if [ -f "$INSTALL_DIR/.install-user" ]; then
  TARGET_USER=$(cat "$INSTALL_DIR/.install-user")
  chown -R "$TARGET_USER:$TARGET_USER" "$INSTALL_DIR" || true
fi

# Start services
if command -v systemctl >/dev/null 2>&1; then
  systemctl --user daemon-reload || true
  systemctl --user enable previous-admin-backend.service || true
  systemctl --user enable previous-admin-frontend.service || true
  systemctl --user start previous-admin-backend.service || true
  systemctl --user start previous-admin-frontend.service || true
fi

echo "Install complete. Backup of previous install at: $BACKUP_DIR"

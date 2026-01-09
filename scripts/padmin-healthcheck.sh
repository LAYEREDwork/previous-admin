#!/usr/bin/env bash
# Quick health-check for padmin updater installation
# Checks presence and basic permissions of /etc/sudoers.d/padmin-updater
# Checks presence and ownership/mode of /usr/local/bin/padmin-updater
# Attempts a non-interactive sudo call to verify passwordless execution (sudo -n)

set -euo pipefail

SUDOERS_FILE="/etc/sudoers.d/padmin-updater"
WRAPPER_BIN="/usr/local/bin/padmin-updater"

print_ok() { printf "\033[0;32m✓ %s\033[0m\n" "$1"; }
print_warn() { printf "\033[0;33m⚠ %s\033[0m\n" "$1"; }
print_err() { printf "\033[0;31m✗ %s\033[0m\n" "$1"; }

echo "Padmin Updater Healthcheck"
echo "=========================="

if [ -f "$SUDOERS_FILE" ]; then
  print_ok "Found sudoers snippet: $SUDOERS_FILE"
  ls -l "$SUDOERS_FILE"
else
  print_err "Missing sudoers snippet: $SUDOERS_FILE"
fi

if [ -f "$WRAPPER_BIN" ]; then
  print_ok "Found updater wrapper: $WRAPPER_BIN"
  ls -l "$WRAPPER_BIN"
  OWNER=$(stat -c '%U' "$WRAPPER_BIN" 2>/dev/null || stat -f '%Su' "$WRAPPER_BIN" 2>/dev/null || echo "?")
  if [ "$OWNER" = "root" ]; then
    print_ok "Wrapper is owned by root"
  else
    print_warn "Wrapper owner is: $OWNER (expected: root)"
  fi
else
  print_err "Updater wrapper not found at: $WRAPPER_BIN"
fi

echo ""
echo "Checking non-interactive sudo execution (sudo -n $WRAPPER_BIN status)"
if sudo -n "$WRAPPER_BIN" status >/dev/null 2>&1; then
  print_ok "sudo -n executed wrapper successfully (no password prompt)"
else
  SUDO_EXIT=$?
  if [ $SUDO_EXIT -eq 1 ]; then
    print_warn "sudo -n returned non-zero: likely requires a password or not permitted for this user"
  else
    print_warn "sudo -n returned exit code $SUDO_EXIT (wrapper may have run and exited with non-zero)"
  fi
  echo "You can verify the sudoers entry with:"
  echo "  sudo cat $SUDOERS_FILE"
  echo "And test as the backend user (replace backend-user):"
  echo "  sudo -u backend-user -i sudo -n $WRAPPER_BIN status"
fi

echo ""
echo "Healthcheck finished"

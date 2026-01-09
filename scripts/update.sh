#!/bin/bash

# Previous Admin - Update Script
# Downloads and installs the latest version from GitHub
# Usage: sudo ./scripts/update.sh

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration (can be overridden via environment variables)
TARGET_USER="${PA_TARGET_USER:-next}"
REPO="LAYEREDwork/previous-admin"
DATA_DIR="/home/$TARGET_USER/.previous-admin"
STATUS_FILE="$DATA_DIR/update-status.json"

# Check if we're in development environment
# Development mode only if NODE_ENV is explicitly set to development
if [[ "$NODE_ENV" == "development" ]]; then
    DEV_MODE=true
    echo -e "${YELLOW}Development environment detected - running in simulation mode${NC}"
    echo -e "${YELLOW}No real files will be modified, no services will be stopped/started${NC}"
    # In development, use current directory as project dir
    PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
else
    DEV_MODE=false
    PROJECT_DIR="/home/$TARGET_USER/previous-admin"
fi

BACKUP_DIR="$DATA_DIR/backup/previous-admin-backup-$(date +%Y-%m-%d-%H-%M-%S)"

# Ensure data directory exists
mkdir -p "$DATA_DIR"

# Function to update status file for frontend polling
update_status() {
    local status="$1"
    local step="$2"
    local progress="$3"
    local message="$4"
    local version="${5:-}"
    local error="${6:-null}"

    # Escape message for JSON
    message=$(echo "$message" | sed 's/"/\\"/g')

    if [[ "$error" != "null" ]]; then
        error="\"$error\""
    fi

    cat > "$STATUS_FILE" << EOF
{
  "status": "$status",
  "step": "$step",
  "progress": $progress,
  "message": "$message",
  "version": "$version",
  "error": $error,
  "timestamp": $(date +%s)
}
EOF

    # Also log to console
    echo -e "${GREEN}[$progress%] $message${NC}"
}

# Function to handle errors
handle_error() {
    local message="$1"
    update_status "error" "failed" 0 "$message" "" "$message"
    echo -e "${RED}Error: $message${NC}"
    exit 1
}

# Trap errors
trap 'handle_error "Update failed unexpectedly"' ERR

# Initialize status
update_status "running" "initializing" 0 "Starting update..." "" "null"

# Ensure XDG_RUNTIME_DIR is set for user systemd
if [ -z "$XDG_RUNTIME_DIR" ]; then
    export XDG_RUNTIME_DIR="/run/user/$(id -u)"
fi

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    update_status "running" "dependencies" 5 "Installing jq..."
    sudo apt update && sudo apt install -y jq
fi

# Fetch latest release info
update_status "running" "checking" 10 "Fetching latest release from GitHub..."

# Use explicit headers to avoid GitHub API issues
RELEASE_DATA=$(curl -s -H "Accept: application/vnd.github.v3+json" -H "User-Agent: Previous-Admin-Updater" "https://api.github.com/repos/$REPO/releases/latest")

VERSION=$(echo "$RELEASE_DATA" | jq -r '.tag_name' | sed 's/^v//')
# Try to read an uploaded asset first; if none present, fallback to tarball/zipball
ASSET_URL=$(echo "$RELEASE_DATA" | jq -r '.assets[0].browser_download_url // empty')
if [ -z "$ASSET_URL" ] || [ "$ASSET_URL" = "null" ]; then
    # fallback to tarball_url or zipball_url
    ASSET_URL=$(echo "$RELEASE_DATA" | jq -r '.tarball_url // .zipball_url // empty')
fi

if [ -z "$VERSION" ] || [ "$VERSION" = "null" ] || [ -z "$ASSET_URL" ] || [ "$ASSET_URL" = "null" ]; then
    handle_error "Could not fetch release data from GitHub"
fi

update_status "running" "downloading" 15 "Downloading version $VERSION..." "$VERSION"

# Download and extract
TEMP_DIR="/tmp/previous-admin-update"
rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR"

if [[ "$ASSET_URL" == *"/tarball/"* ]] || [[ "$ASSET_URL" == *.tar.gz ]]; then
    curl -L -s -o "$TEMP_DIR/update.tar.gz" "$ASSET_URL"
    update_status "running" "extracting" 25 "Extracting files..." "$VERSION"
    tar -xzf "$TEMP_DIR/update.tar.gz" -C "$TEMP_DIR"
    SOURCE_DIR=$(find "$TEMP_DIR" -mindepth 1 -maxdepth 1 -type d | head -1)
elif [[ "$ASSET_URL" == *"/zipball/"* ]] || [[ "$ASSET_URL" == *.zip ]]; then
    curl -L -s -o "$TEMP_DIR/update.zip" "$ASSET_URL"
    update_status "running" "extracting" 25 "Extracting files..." "$VERSION"
    unzip -q "$TEMP_DIR/update.zip" -d "$TEMP_DIR"
    SOURCE_DIR=$(find "$TEMP_DIR" -mindepth 1 -maxdepth 1 -type d | head -1)
else
    # Last resort: try downloading tarball by tag
    curl -L -s -o "$TEMP_DIR/update.tar.gz" "https://api.github.com/repos/$REPO/tarball/$VERSION"
    update_status "running" "extracting" 25 "Extracting files..." "$VERSION"
    tar -xzf "$TEMP_DIR/update.tar.gz" -C "$TEMP_DIR"
    SOURCE_DIR=$(find "$TEMP_DIR" -mindepth 1 -maxdepth 1 -type d | head -1)
fi

# Create backup
if [[ "$DEV_MODE" == "true" ]]; then
    update_status "running" "backup" 30 "DEV: Simulating backup creation..." "$VERSION"
    sleep 1
else
    update_status "running" "backup" 30 "Creating backup..." "$VERSION"
    mkdir -p "$BACKUP_DIR"
    cp -r "$PROJECT_DIR" "$BACKUP_DIR/"
fi

# Stop services
if [[ "$DEV_MODE" == "true" ]]; then
    update_status "running" "stopping" 40 "DEV: Simulating service stop..." "$VERSION"
    sleep 1
else
    update_status "running" "stopping" 40 "Stopping services..." "$VERSION"
    systemctl --user stop previous-admin-backend previous-admin-frontend || true
fi

# Copy new files
if [[ "$DEV_MODE" == "true" ]]; then
    update_status "running" "installing" 50 "DEV: Simulating file installation..." "$VERSION"
    sleep 1
else
    update_status "running" "installing" 50 "Installing new files..." "$VERSION"
    rsync -a --exclude='.git' --exclude='node_modules' --exclude='*.log' --exclude='update.zip' --exclude='update.tar.gz' --exclude="$DATA_DIR" "$SOURCE_DIR/" "$PROJECT_DIR/"
fi

# Update version files
if [[ "$DEV_MODE" == "true" ]]; then
    update_status "running" "versioning" 55 "DEV: Simulating version update..." "$VERSION"
    sleep 1
else
    update_status "running" "versioning" 55 "Updating version files..." "$VERSION"
    jq --arg v "$VERSION" '.version = $v' "$PROJECT_DIR/package.json" > /tmp/package.json.tmp
    mv /tmp/package.json.tmp "$PROJECT_DIR/package.json"
    echo "{\"version\": \"$VERSION\"}" > "$DATA_DIR/version.json"
fi

# Install dependencies
if [[ "$DEV_MODE" == "true" ]]; then
    update_status "running" "dependencies" 60 "DEV: Simulating npm install..." "$VERSION"
    sleep 2
else
    update_status "running" "dependencies" 60 "Installing dependencies (this may take a while)..." "$VERSION"
    cd "$PROJECT_DIR"
    npm install --prefer-offline >/dev/null 2>&1 || npm install >/dev/null 2>&1
fi

# Build application
if [[ "$DEV_MODE" == "true" ]]; then
    update_status "running" "building" 75 "DEV: Simulating build..." "$VERSION"
    sleep 2
else
    update_status "running" "building" 75 "Building application..." "$VERSION"
    cd "$PROJECT_DIR"
    npm run build >/dev/null 2>&1
fi

# Start services
if [[ "$DEV_MODE" == "true" ]]; then
    update_status "running" "starting" 90 "DEV: Simulating service start..." "$VERSION"
    sleep 1
else
    update_status "running" "starting" 90 "Starting services..." "$VERSION"
    systemctl --user start previous-admin-backend previous-admin-frontend
fi

# Cleanup
update_status "running" "cleanup" 95 "Cleaning up..." "$VERSION"
rm -rf "$TEMP_DIR"

# Keep only last 3 backups
if [[ "$DEV_MODE" != "true" ]]; then
    ls -dt "$DATA_DIR/backup/"* 2>/dev/null | tail -n +4 | xargs rm -rf 2>/dev/null || true
fi

# Complete
if [[ "$DEV_MODE" == "true" ]]; then
    update_status "completed" "done" 100 "DEV: Update simulation completed!" "$VERSION"
else
    update_status "completed" "done" 100 "Update completed successfully!" "$VERSION"
fi

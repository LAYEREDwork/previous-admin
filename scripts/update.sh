#!/bin/bash

# Previous Admin - Update Script
# Downloads and installs the latest version from GitHub
# Usage: sudo ./scripts/update.sh

set -e

# Redirect all output to both console and log file
exec > >(tee -a ../backend.log) 2>&1

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in development environment
# Development mode if NODE_ENV is set to development or if we're running from a git repository
if [[ "$NODE_ENV" == "development" ]] || [[ -d ".git" ]]; then
    DEV_MODE=true
    echo -e "${YELLOW}Development environment detected - running in simulation mode${NC}"
    echo -e "${YELLOW}No real files will be modified, no services will be stopped/started${NC}"
else
    DEV_MODE=false
fi

# Configuration (can be overridden via environment variables)
TARGET_USER="${PA_TARGET_USER:-next}"
REPO="LAYEREDwork/previous-admin"
if [[ "$DEV_MODE" == "true" ]]; then
    # In development, use current directory as project dir
    PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
else
    PROJECT_DIR="/home/$TARGET_USER/previous-admin"
fi
DATA_DIR="/home/$TARGET_USER/.previous-admin"
BACKUP_DIR="$DATA_DIR/backup/previous-admin-backup-$(date +%Y-%m-%d-%H-%M-%S)"

# Ensure XDG_RUNTIME_DIR is set for user systemd
if [ -z "$XDG_RUNTIME_DIR" ]; then
    export XDG_RUNTIME_DIR="/run/user/$(id -u)"
fi

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo -e "${YELLOW}jq not found, installing...${NC}"
    sudo apt update && sudo apt install -y jq
fi

# Fetch latest release info
echo -e "${GREEN}Fetching latest release from GitHub...${NC}"
# Use explicit headers to avoid GitHub API issues
RELEASE_DATA=$(curl -s -H "Accept: application/vnd.github.v3+json" -H "User-Agent: Previous-Admin-Updater" "https://api.github.com/repos/$REPO/releases/latest")

VERSION=$(echo "$RELEASE_DATA" | jq -r '.tag_name' | sed 's/^v//')
# Try to read an uploaded asset first; if none present, fallback to tarball/zipball
ASSET_URL=$(echo "$RELEASE_DATA" | jq -r '.assets[0].browser_download_url // empty')
if [ -z "$ASSET_URL" ] || [ "$ASSET_URL" = "null" ]; then
    # fallback to tarball_url or zipball_url
    ASSET_URL=$(echo "$RELEASE_DATA" | jq -r '.tarball_url // .zipball_url // empty')
    ASSET_FALLBACK=true
else
    ASSET_FALLBACK=false
fi

if [ -z "$VERSION" ] || [ "$VERSION" = "null" ] || [ -z "$ASSET_URL" ] || [ "$ASSET_URL" = "null" ]; then
    echo -e "${RED}Error: Could not fetch release data from GitHub${NC}"
    exit 1
fi

echo -e "${GREEN}Updating to version: $VERSION${NC}"
echo -e "${GREEN}Asset URL: $ASSET_URL${NC}"
if [ "$ASSET_FALLBACK" = true ]; then
    echo -e "${YELLOW}No uploaded assets found — using tarball/zipball fallback${NC}"
fi

# Download and extract
echo -e "${GREEN}Downloading and extracting update...${NC}"
TEMP_DIR="/tmp/previous-admin-update"
rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR"

if [[ "$ASSET_URL" == *"/tarball/"* ]] || [[ "$ASSET_URL" == *.tar.gz ]]; then
    curl -L -o "$TEMP_DIR/update.tar.gz" "$ASSET_URL"
    tar -xzf "$TEMP_DIR/update.tar.gz" -C "$TEMP_DIR"
    SOURCE_DIR=$(find "$TEMP_DIR" -mindepth 1 -maxdepth 1 -type d | head -1)
elif [[ "$ASSET_URL" == *"/zipball/"* ]] || [[ "$ASSET_URL" == *.zip ]]; then
    curl -L -o "$TEMP_DIR/update.zip" "$ASSET_URL"
    unzip -q "$TEMP_DIR/update.zip" -d "$TEMP_DIR"
    SOURCE_DIR=$(find "$TEMP_DIR" -mindepth 1 -maxdepth 1 -type d | head -1)
else
    # Last resort: try downloading tarball by tag
    echo -e "${YELLOW}Unknown asset URL format — attempting tarball download for tag $VERSION${NC}"
    curl -L -o "$TEMP_DIR/update.tar.gz" "https://api.github.com/repos/$REPO/tarball/$VERSION"
    tar -xzf "$TEMP_DIR/update.tar.gz" -C "$TEMP_DIR"
    SOURCE_DIR=$(find "$TEMP_DIR" -mindepth 1 -maxdepth 1 -type d | head -1)
fi

# Create backup
if [[ "$DEV_MODE" == "true" ]]; then
    echo -e "${YELLOW}DEV MODE: Simulating backup creation...${NC}"
    echo -e "${YELLOW}Would create backup in: $BACKUP_DIR${NC}"
else
    echo -e "${GREEN}Creating backup...${NC}"
    mkdir -p "$BACKUP_DIR"
    cp -r "$PROJECT_DIR" "$BACKUP_DIR/"
fi

# Stop services (user-space services, no sudo required)
if [[ "$DEV_MODE" == "true" ]]; then
    echo -e "${YELLOW}DEV MODE: Simulating service stop...${NC}"
    echo -e "${YELLOW}Would stop services: previous-admin-backend previous-admin-frontend${NC}"
else
    echo -e "${GREEN}Stopping services...${NC}"
    systemctl --user stop previous-admin-backend previous-admin-frontend || true
fi

# Copy new files (exclude data and temp files)
if [[ "$DEV_MODE" == "true" ]]; then
    echo -e "${YELLOW}DEV MODE: Simulating file installation...${NC}"
    echo -e "${YELLOW}Would copy files from $SOURCE_DIR to $PROJECT_DIR${NC}"
    echo -e "${YELLOW}Would exclude: .git, node_modules, *.log, update.zip, update.tar.gz, $DATA_DIR${NC}"
else
    echo -e "${GREEN}Installing update...${NC}"
    rsync -av --exclude='.git' --exclude='node_modules' --exclude='*.log' --exclude='update.zip' --exclude='update.tar.gz' --exclude="$DATA_DIR" "$SOURCE_DIR/" "$PROJECT_DIR/"
fi

# Update versions
if [[ "$DEV_MODE" == "true" ]]; then
    echo -e "${YELLOW}DEV MODE: Simulating version update...${NC}"
    echo -e "${YELLOW}Would update package.json version to: $VERSION${NC}"
    echo -e "${YELLOW}Would update $DATA_DIR/version.json${NC}"
else
    echo -e "${GREEN}Updating version files...${NC}"
    jq --arg v "$VERSION" '.version = $v' "$PROJECT_DIR/package.json" > /tmp/package.json.tmp
    mv /tmp/package.json.tmp "$PROJECT_DIR/package.json"
    echo "{\"version\": \"$VERSION\"}" > "$DATA_DIR/version.json"
fi

# Install dependencies
if [[ "$DEV_MODE" == "true" ]]; then
    echo -e "${YELLOW}DEV MODE: Simulating dependency installation...${NC}"
    echo -e "${YELLOW}Would run: npm install${NC}"
else
    echo -e "${GREEN}Installing dependencies...${NC}"
    cd "$PROJECT_DIR"
    npm install
fi

# Start services (user-space services, no sudo required)
if [[ "$DEV_MODE" == "true" ]]; then
    echo -e "${YELLOW}DEV MODE: Simulating service start...${NC}"
    echo -e "${YELLOW}Would start services: previous-admin-backend previous-admin-frontend${NC}"
else
    echo -e "${GREEN}Starting services...${NC}"
    systemctl --user start previous-admin-backend previous-admin-frontend
fi

# Cleanup
echo -e "${GREEN}Cleaning up...${NC}"
rm -rf "$TEMP_DIR"

# Keep only last 3 backups
if [[ "$DEV_MODE" == "true" ]]; then
    echo -e "${YELLOW}DEV MODE: Simulating backup cleanup...${NC}"
    echo -e "${YELLOW}Would keep only last 3 backups in $DATA_DIR/backup/${NC}"
else
    echo -e "${GREEN}Cleaning old backups...${NC}"
    ls -dt "$DATA_DIR/backup/"* | tail -n +4 | xargs rm -rf 2>/dev/null || true
fi

if [[ "$DEV_MODE" == "true" ]]; then
    echo -e "${GREEN}Development update simulation completed successfully!${NC}"
    echo -e "${YELLOW}Note: No real files were modified. This was just a test run.${NC}"
else
    echo -e "${GREEN}Update completed successfully to version $VERSION${NC}"
fi
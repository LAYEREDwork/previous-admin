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

REPO="LAYEREDwork/previous-admin"
# Determine script and project directories robustly (works when invoked via sudo)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Project directory is parent of scripts directory
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Determine project owner and its home directory so DATA_DIR points to the install user's home
PROJECT_OWNER=""
if PROJECT_OWNER=$(stat -c '%U' "$PROJECT_DIR" 2>/dev/null); then
    :
elif PROJECT_OWNER=$(stat -f '%Su' "$PROJECT_DIR" 2>/dev/null); then
    :
fi

# Resolve home for the project owner; fall back to ~owner expansion if getent is unavailable
PROJECT_HOME=""
if [ -n "$PROJECT_OWNER" ]; then
    PROJECT_HOME=$(getent passwd "$PROJECT_OWNER" | cut -d: -f6 2>/dev/null || true)
fi
if [ -z "$PROJECT_HOME" ] && [ -n "$PROJECT_OWNER" ]; then
    PROJECT_HOME=$(eval echo "~$PROJECT_OWNER")
fi

# Final DATA_DIR: prefer owner's home, otherwise fallback to current $HOME
if [ -n "$PROJECT_HOME" ]; then
    DATA_DIR="$PROJECT_HOME/.previous-admin"
else
    DATA_DIR="$HOME/.previous-admin"
fi

BACKUP_DIR="$DATA_DIR/backup/previous-admin-backup-$(date +%Y-%m-%d-%H-%M-%S)"

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
echo -e "${GREEN}Creating backup...${NC}"
mkdir -p "$BACKUP_DIR"
cp -r "$PROJECT_DIR" "$BACKUP_DIR/"

# Stop services
echo -e "${GREEN}Stopping services...${NC}"
sudo systemctl stop previous-admin-backend previous-admin-frontend || true

# Copy new files (exclude data and temp files)
echo -e "${GREEN}Installing update...${NC}"
rsync -av --exclude='.git' --exclude='node_modules' --exclude='*.log' --exclude='update.zip' --exclude='update.tar.gz' --exclude="$DATA_DIR" "$SOURCE_DIR/" "$PROJECT_DIR/"

# Update versions
echo -e "${GREEN}Updating version files...${NC}"
jq --arg v "$VERSION" '.version = $v' "$PROJECT_DIR/package.json" > /tmp/package.json.tmp
mv /tmp/package.json.tmp "$PROJECT_DIR/package.json"
echo "{\"version\": \"$VERSION\"}" > "$DATA_DIR/version.json"

# Install dependencies
echo -e "${GREEN}Installing dependencies...${NC}"
cd "$PROJECT_DIR"
npm install

# Start services
echo -e "${GREEN}Starting services...${NC}"
sudo systemctl start previous-admin-backend previous-admin-frontend

# Cleanup
echo -e "${GREEN}Cleaning up...${NC}"
rm -rf "$TEMP_DIR"

# Keep only last 3 backups
echo -e "${GREEN}Cleaning old backups...${NC}"
ls -dt "$DATA_DIR/backup/"* | tail -n +4 | xargs rm -rf 2>/dev/null || true

echo -e "${GREEN}Update completed successfully to version $VERSION${NC}"
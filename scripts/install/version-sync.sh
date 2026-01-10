#!/bin/bash

# Previous Admin - Version Sync Script
# Syncs version from GitHub to package.json and version.json
# Usage: ./scripts/install_version_sync.sh

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

REPO="LAYEREDwork/previous-admin"
PROJECT_DIR="$HOME/previous-admin"
DATA_DIR="$HOME/.previous-admin"

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo -e "${YELLOW}jq not found, installing...${NC}"
    sudo apt update && sudo apt install -y jq
fi

# Fetch latest version from GitHub
echo -e "${GREEN}Fetching latest version from GitHub...${NC}"
VERSION=$(curl -s "https://api.github.com/repos/$REPO/releases/latest" | jq -r '.tag_name' | sed 's/^v//')

if [ -z "$VERSION" ] || [ "$VERSION" = "null" ]; then
    echo -e "${RED}Error: Could not fetch version from GitHub${NC}"
    exit 1
fi

echo -e "${GREEN}Latest version: $VERSION${NC}"

# Update package.json
if [ -f "$PROJECT_DIR/package.json" ]; then
    echo -e "${GREEN}Updating package.json...${NC}"
    jq --arg v "$VERSION" '.version = $v' "$PROJECT_DIR/package.json" > /tmp/package.json.tmp
    mv /tmp/package.json.tmp "$PROJECT_DIR/package.json"
else
    echo -e "${YELLOW}Warning: package.json not found in $PROJECT_DIR${NC}"
fi

# Create/update version.json
echo -e "${GREEN}Updating version.json...${NC}"
mkdir -p "$DATA_DIR"
echo "{\"version\": \"$VERSION\"}" > "$DATA_DIR/version.json"

echo -e "${GREEN}Version sync completed: $VERSION${NC}"
#!/bin/bash

# Generate config schema from reference CFG file
# Parses backend/config-schema/reference.cfg and generates shared/previous-config/schema.json
# Run this after updating the reference config file

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONFIG_FILE="$PROJECT_ROOT/backend/config-schema/reference.cfg"
SCHEMA_FILE="$PROJECT_ROOT/shared/previous-config/schema.json"
SYMBOL_MAPPING="$PROJECT_ROOT/backend/config-schema/section-symbols.json"

# Validate inputs
if [ ! -f "$CONFIG_FILE" ]; then
  echo "❌ Config file not found: $CONFIG_FILE"
  exit 1
fi

echo "📝 Generating schema from $CONFIG_FILE..."

# Generate schema using TypeScript
cd "$PROJECT_ROOT"
CONFIG_FILE="$CONFIG_FILE" SCHEMA_FILE="$SCHEMA_FILE" SYMBOL_MAPPING="$SYMBOL_MAPPING" \
  npx tsx scripts/generate-config-schema.ts

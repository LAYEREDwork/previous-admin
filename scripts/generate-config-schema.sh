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
npx tsx << 'EOF'
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { parseCfgFile } from './backend/config-schema/config-parser';
import { extractSchema } from './backend/config-schema/schema-extractor';
import { validateSymbols, reportValidationResults } from './backend/config-schema/validate-symbols';

const configFile = process.env.CONFIG_FILE || './backend/config-schema/reference.cfg';
const schemaFile = process.env.SCHEMA_FILE || './shared/previous-config/schema.json';
const symbolMappingFile = process.env.SYMBOL_MAPPING || './backend/config-schema/section-symbols.json';

try {
  // Read config file
  const cfgContent = readFileSync(configFile, 'utf-8');
  
  // Parse raw config
  const rawConfig = parseCfgFile(cfgContent);
  
  // Load symbol mapping if available
  let symbolMapping: Record<string, string> = {};
  if (existsSync(symbolMappingFile)) {
    const mappingContent = readFileSync(symbolMappingFile, 'utf-8');
    symbolMapping = JSON.parse(mappingContent);
    
    // Validate symbols before generating schema
    const validationResult = validateSymbols(symbolMapping);
    reportValidationResults(validationResult);
  }
  
  // Extract schema with type interpretation
  const schema = extractSchema(rawConfig, symbolMapping);
  
  // Write schema to file
  writeFileSync(schemaFile, JSON.stringify(schema, null, 2));
  
  console.log(`✅ Schema generated: ${schemaFile}`);
  console.log(`   - Sections: ${Object.keys(schema.sections).length}`);
  console.log(`   - Total parameters: ${Object.values(schema.sections).reduce((sum, s) => sum + s.parameters.length, 0)}`);
  
} catch (error) {
  console.error('❌ Schema generation failed:');
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
EOF

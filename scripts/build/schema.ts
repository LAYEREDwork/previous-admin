/**
 * Generate config schema from reference CFG file
 *
 * Parses backend/config-schema/reference.cfg and generates shared/previous-config/schema.json
 * Run this after updating the reference config file
 */

import { existsSync, readFileSync, writeFileSync } from 'fs';

import { parseCfgFile } from '../../backend/config-schema/config-parser';
import { extractSchema } from '../../backend/config-schema/schema-extractor';
import { reportValidationResults, validateSymbols } from '../../backend/config-schema/validate-symbols';
import type { SectionSchema } from '@shared/previous-config/schema-types';

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
    console.log(`   - Total parameters: ${(Object.values(schema.sections) as SectionSchema[]).reduce((sum, section) => sum + section.parameters.length, 0)}`);

} catch (error) {
    console.error('❌ Schema generation failed:');
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
}

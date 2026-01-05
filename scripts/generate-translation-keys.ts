/**
 * Generate missing translation keys for the config editor
 *
 * This script reads the schema.json and ensures all required translation keys
 * exist in all language files (de, en, es, fr, it).
 *
 * Usage: npx ts-node scripts/generate-translation-keys.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Types
interface ParameterSchema {
  name: string;
  translationKey?: string;
  [key: string]: unknown;
}

interface SectionSchema {
  name: string;
  translationKey?: string;
  parameters: ParameterSchema[];
  [key: string]: unknown;
}

interface ConfigSchema {
  sections: Record<string, SectionSchema>;
}

interface SectionSchema {
  name: string;
  displayName?: string;
  translationKey?: string;
  parameters: Array<{
    name: string;
    translationKey?: string;
    [key: string]: unknown;
  }>;
}

interface TranslationStrings {
  configEditor?: {
    sections?: Record<string, string>;
    parameters?: Record<string, string>;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

// Language codes
const LANGUAGES = ['de', 'en', 'es', 'fr', 'it'] as const;
type Language = (typeof LANGUAGES)[number];

// File paths
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCHEMA_PATH = path.join(__dirname, '../shared/previous-config/schema.json');
const LOCALES_DIR = path.join(__dirname, '../frontend/lib/i18n/locales');

/**
 * Load schema.json
 */
function loadSchema(): ConfigSchema {
  const content = fs.readFileSync(SCHEMA_PATH, 'utf-8');
  return JSON.parse(content);
}

/**
 * Load translation file for a specific language
 */
function loadTranslations(language: Language): TranslationStrings {
  const filePath = path.join(LOCALES_DIR, `${language}.ts`);
  const content = fs.readFileSync(filePath, 'utf-8');

  // Extract the export const from the TypeScript file
  const match = content.match(/export const \w+(?:: \w+)? = ({[\s\S]*});/);
  if (!match) {
    throw new Error(`Could not parse translations from ${filePath}`);
  }

  // Evaluate the object (safe since it's from our own code)
  const appName = 'Previous Admin';
  const translations = eval(`(function() { const appName = '${appName}'; return ${match[1]}; })()`);
  return translations;
}

/**
 * Save translation file for a specific language
 */
function saveTranslations(language: Language, translations: TranslationStrings): void {
  // Convert to pretty-printed JSON for the nested objects
  const getIndent = (level: number): string => '  '.repeat(level);

  // We need to recreate the TypeScript file with proper formatting
  // This is complex, so we use a simpler approach: replace just the translation object

  // Generate proper import statement
  const importLine = "import { appName } from '../../constants';";
  const importType = "import { Translations } from '.';";
  const exportStatement = `export const ${language}: Translations = `;

  // Create the new translation object content
  const stringifyObject = (obj: Record<string, unknown>, indent: number = 1): string => {
    const lines: string[] = [];
    const keys = Object.keys(obj);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = obj[key];
      const isLast = i === keys.length - 1;
      const comma = isLast ? '' : ',';

      if (typeof value === 'string') {
        const escapedValue = value
          .replace(/\\/g, '\\\\')
          .replace(/'/g, "\\'")
          .replace(/\n/g, '\\n');
        lines.push(`${getIndent(indent)}'${key}': '${escapedValue}'${comma}`);
      } else if (typeof value === 'object' && value !== null) {
        lines.push(`${getIndent(indent)}'${key}': {`);
        lines.push(stringifyObject(value as Record<string, unknown>, indent + 1));
        lines.push(`${getIndent(indent)}}${comma}`);
      }
    }

    return lines.join('\n');
  };

  const content =
    `${importLine}\n\n${importType}\n\n${exportStatement}{\n` +
    stringifyObject(translations as Record<string, unknown>, 1) +
    '\n};\n';

  fs.writeFileSync(path.join(LOCALES_DIR, `${language}.ts`), content, 'utf-8');
}

/**
 * Get all translation keys that should exist from the schema
 */
function getRequiredTranslationKeys(schema: ConfigSchema): {
  sections: Record<string, string>;
  parameters: Record<string, string>;
} {
  const sections: Record<string, string> = {};
  const parameters: Record<string, string> = {};

  for (const sectionData of Object.values(schema.sections)) {
    if (sectionData.translationKey) {
      sections[sectionData.translationKey] = sectionData.displayName || sectionData.name;
    }

    for (const param of sectionData.parameters) {
      if (param.translationKey) {
        parameters[param.translationKey] = param.name;
      }
    }
  }

  return { sections, parameters };
}

/**
 * Merge translation keys into existing translation object
 */
function mergeTranslationKeys(
  existing: TranslationStrings,
  requiredKeys: { sections: Record<string, string>; parameters: Record<string, string> }
): TranslationStrings {
  const updated = JSON.parse(JSON.stringify(existing)); // Deep copy

  // Ensure configEditor structure exists
  if (!updated.configEditor) {
    updated.configEditor = {};
  }
  if (!updated.configEditor.sections) {
    updated.configEditor.sections = {};
  }
  if (!updated.configEditor.parameters) {
    updated.configEditor.parameters = {};
  }

  // Merge section keys
  for (const [key, defaultValue] of Object.entries(requiredKeys.sections)) {
    if (!(key in updated.configEditor.sections!)) {
      updated.configEditor.sections![key] = defaultValue;
    }
  }

  // Merge parameter keys
  for (const [key, defaultValue] of Object.entries(requiredKeys.parameters)) {
    if (!(key in updated.configEditor.parameters!)) {
      updated.configEditor.parameters![key] = defaultValue;
    }
  }

  return updated;
}

/**
 * Main function
 */
function main(): void {
  console.log('🔄 Generating translation keys...\n');

  // Load schema
  const schema = loadSchema();
  console.log('✅ Schema loaded');

  // Get required translation keys from schema
  const requiredKeys = getRequiredTranslationKeys(schema);
  console.log(`✅ Found ${Object.keys(requiredKeys.sections).length} sections and ${Object.keys(requiredKeys.parameters).length} parameters\n`);

  // Process each language
  for (const language of LANGUAGES) {
    try {
      // Load existing translations
      const existing = loadTranslations(language);
      console.log(`Processing ${language}...`);

      // Merge missing keys
      const updated = mergeTranslationKeys(existing, requiredKeys);

      // Read original file to preserve formatting
      const filePath = path.join(LOCALES_DIR, `${language}.ts`);
      const originalContent = fs.readFileSync(filePath, 'utf-8');

      // Save updated translations
      saveTranslations(language, updated, originalContent);
      console.log(`  ✅ Updated ${language}.ts`);
    } catch (error) {
      console.error(`  ❌ Error processing ${language}:`, (error as Error).message);
    }
  }

  console.log('\n✅ Translation keys generation completed!');
}

// Run the script
main();

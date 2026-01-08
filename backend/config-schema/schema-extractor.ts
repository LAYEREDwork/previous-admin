/**
 * Schema extraction from raw CFG data
 * 
 * Takes raw CFG data (from parser) and interprets types from comments.
 * Converts untyped RawConfigData into strongly typed ParameterSchema.
 * 
 * This is the second step in the two-step parsing process:
 * 1. ConfigParser: Type-agnostic extraction (raw values + comments)
 * 2. SchemaExtractor: Type interpretation (assigns types based on comments)
 * 
 * @module backend/config-schema/schema-extractor
 */

import type { 
  ParameterType, 
  ParameterSchema, 
  SectionSchema, 
  ConfigSchema 
} from '@shared/previous-config/schema-types';

import type { RawConfigData, RawConfigParameter } from './config-parser';

/**
 * Convert CamelCase to display name with spaces
 * 
 * @param camelCaseName Input (e.g., "ConfigDialog")
 * @returns Display name (e.g., "Config Dialog")
 * 
 * @example
 * toDisplayName("ConfigDialog") // "Config Dialog"
 * toDisplayName("SystemSettings") // "System Settings"
 */
export function toDisplayName(camelCaseName: string): string {
  return camelCaseName.replace(/([A-Z])/g, ' $1').trim();
}

/**
 * Intelligently map section names to SF Symbols
 * 
 * Analyzes section names using semantic keyword matching to determine appropriate symbols.
 * Includes synonyms, related terms, and phonetic similarities.
 * Uses .fill variants when available for better visual consistency.
 * Falls back to gearshape.fill as default.
 * 
 * @param sectionName The configuration section name
 * @returns Appropriate SF Symbol name
 * 
 * @example
 * getSymbolForSection("Sound") // "speaker.fill"
 * getSymbolForSection("AudioOutput") // "speaker.fill"
 * getSymbolForSection("Keyboard") // "keyboard.fill"
 * getSymbolForSection("Network") // "network"
 */
function getSymbolForSection(sectionName: string): string {
  const lowerName = sectionName.toLowerCase();
  
  // Semantic keyword groups with synonyms and related terms
  // Order matters: more specific groups should come before generic ones
  const symbolMappings: Array<{ keywords: string[]; symbol: string }> = [
    // Mouse/Input Device - synonyms and related: mouse, pointer, cursor, trackpad, touchpad
    {
      keywords: ['mouse', 'computermouse', 'pointer', 'cursor', 'trackpad', 'touchpad', 'trackball'],
      symbol: 'computermouse.fill'
    },
    // Audio/Sound - synonyms and related: audio, sound, speaker, voice, music, tone, volume, mic, microphone
    {
      keywords: ['sound', 'audio', 'speaker', 'voice', 'music', 'tone', 'sox', 'volume', 'mic', 'microphone', 'output', 'hifi', 'acoustic'],
      symbol: 'hifispeaker.fill'
    },
    // Printer - synonyms and related: printer, print, output, printout, document, paper, laser, inkjet
    {
      keywords: ['printer', 'print', 'output', 'printout', 'document', 'paper', 'laser', 'inkjet', 'plotter'],
      symbol: 'printer.fill'
    },
    // Keyboard/Input - synonyms and related: keyboard, input, keys, shortcuts, control, modifier, keypad, keymap
    {
      keywords: ['keyboard', 'input', 'keys', 'shortcuts', 'control', 'modifier', 'keypad', 'keymap', 'hotkey', 'accelerator'],
      symbol: 'keyboard.fill'
    },
    // Display/Screen - synonyms and related: display, screen, monitor, graphics, resolution, video, render, lcd, led, panel, viewport, framebuffer, 3d, card, dimension
    {
      keywords: ['display', 'screen', 'monitor', 'graphics', 'resolution', 'video', 'render', 'lcd', 'led', 'panel', 'viewport', 'framebuffer', 'vram', '3d', 'card', 'dimension'],
      symbol: 'display.fill'
    },
    // Optical Drive - synonyms and related: optical, cd, dvd, disc, cd-rom, dvd-rom, magneto, blu-ray, blueray
    {
      keywords: ['optical', 'cd', 'dvd', 'disc', 'cd-rom', 'dvd-rom', 'magneto', 'blu-ray', 'blueray', 'rom-drive'],
      symbol: 'opticaldisc.fill'
    },
    // Network - synonyms and related: network, ethernet, wifi, internet, connection, tcp, ip, lan, wan, modem, router, bridge
    {
      keywords: ['network', 'ethernet', 'wifi', 'internet', 'connection', 'tcp', 'ip', 'lan', 'wan', 'modem', 'router', 'bridge', 'hub', 'adapter', 'nic'],
      symbol: 'network'
    },
    // Storage/Drive - synonyms and related: scsi, drive, disk, storage, hd, ssd, volume, hard, ide, ata, sata, nvme
    {
      keywords: ['scsi', 'drive', 'disk', 'storage', 'hd', 'ssd', 'volume', 'hard', 'ide', 'ata', 'sata', 'nvme', 'raid', 'partition'],
      symbol: 'externaldrive.fill'
    },
    // Boot - synonyms and related: boot, startup, launch, initialization, loader, bootloader, firmware, bios
    {
      keywords: ['boot', 'startup', 'launch', 'initialization', 'loader', 'bootloader', 'firmware', 'bios', 'uefi'],
      symbol: 'bolt.fill'
    },
    // System/General - synonyms and related: system, config, general, settings, preferences, options, setup
    {
      keywords: ['system', 'config', 'general', 'settings', 'preferences', 'options', 'setup', 'configuration', 'parameters', 'properties'],
      symbol: 'gearshape.fill'
    }
  ];
  
  // Try to find matching symbol by checking each keyword group
  for (const mapping of symbolMappings) {
    for (const keyword of mapping.keywords) {
      if (lowerName.includes(keyword)) {
        return mapping.symbol;
      }
    }
  }
  
  // Default fallback
  return 'gearshape.fill';
}

/**
 * Parse type from comment
 * 
 * Looks for "# Type: X" pattern in comments
 * 
 * @param comments Array of comment lines
 * @returns Determined parameter type
 */
function parseTypeFromComments(comments: string[]): ParameterType {
  for (const comment of comments) {
    const typeMatch = comment.match(/Type:\s*(\w+)/i);
    if (typeMatch) {
      const typeStr = typeMatch[1].toLowerCase();
      
      if (typeStr === 'bool' || typeStr === 'boolean') return 'boolean';
      if (typeStr === 'int' || typeStr === 'integer') return 'number';
      if (typeStr === 'float' || typeStr === 'double') return 'number';
      if (typeStr === 'key') return 'number';
      if (typeStr === 'string') return 'string';
    }
  }
  
  return 'string'; // Default type
}

/**
 * Parse possible values from comments
 * 
 * Looks for "# Possible Values: A, B, C" or "# Possible Values: X-Y" or "# Possible Values: X/Y"
 * 
 * @param comments Array of comment lines
 * @returns Tuple of [values, labels, type] or [undefined, undefined, type]
 */
function parsePossibleValuesFromComments(
  comments: string[]
): [string[] | undefined, string[] | undefined, ParameterType | undefined] {
  for (const comment of comments) {
    const valuesMatch = comment.match(/Possible Values:\s*(.+?)(?:\n|$)/i);
    if (valuesMatch) {
      const valuesStr = valuesMatch[1].trim();
      
      // Check if it's a range (X-Y)
      const rangeMatch = valuesStr.match(/^(\d+)\s*-\s*(\d+)$/);
      if (rangeMatch) {
        // Range detected, types will be assigned during schema extraction
        return [undefined, undefined, 'range'];
      }
      
      // Parse values - support comma-separated (A, B) or slash-separated (A/B) format
      let values: string[] = [];
      
      if (valuesStr.includes(',')) {
        values = valuesStr.split(',').map(v => v.trim()).filter(v => v);
      } else if (valuesStr.includes('/')) {
        // Handle slash-separated values like "TRUE/FALSE"
        values = valuesStr.split('/').map(v => v.trim()).filter(v => v);
      }
      
      if (values.length > 0) {
        // Extract labels if format is "VALUE=Label"
        const labels: string[] = [];
        const cleanValues: string[] = [];
        
        for (const val of values) {
          if (val.includes('=')) {
            const [cleanVal, label] = val.split('=').map(s => s.trim());
            cleanValues.push(cleanVal);
            labels.push(label);
          } else {
            cleanValues.push(val);
            labels.push(val);
          }
        }
        
        return [cleanValues, labels, 'enum'];
      }
    }
  }
  
  return [undefined, undefined, undefined];
}

/**
 * Parse default value from comments
 * 
 * Looks for "# Default: value" pattern
 * 
 * @param comments Array of comment lines
 * @returns Default value as string or null if not found
 */
function parseDefaultFromComments(comments: string[]): string | null {
  for (const comment of comments) {
    const defaultMatch = comment.match(/Default:\s*(.+?)(?:\n|$)/i);
    if (defaultMatch) {
      return defaultMatch[1].trim();
    }
  }
  return null;
}

/**
 * Parse description from comments
 * 
 * Looks for "# Meaning: ..." pattern
 * 
 * @param comments Array of comment lines
 * @returns Description string or empty string
 */
function parseDescriptionFromComments(comments: string[]): string {
  for (const comment of comments) {
    const meaningMatch = comment.match(/Meaning:\s*(.+?)(?:\n|$)/i);
    if (meaningMatch) {
      return meaningMatch[1].trim();
    }
  }
  return '';
}

/**
 * Convert raw parameter to typed parameter schema
 * 
 * @param rawParam Raw parameter from parser
 * @returns Typed parameter schema
 */
function extractParameterSchema(rawParam: RawConfigParameter): ParameterSchema {
  const baseType = parseTypeFromComments(rawParam.comments);
  const [possibleValues, labels, enumOrRangeType] = parsePossibleValuesFromComments(
    rawParam.comments
  );
  
  // Determine final type
  // Special case: if baseType is boolean and possibleValues are TRUE/FALSE, keep it as boolean
  let finalType: ParameterType;
  let finalPossibleValues: string[] | undefined = possibleValues;
  let finalLabels: string[] | undefined = labels;
  
  if (baseType === 'boolean' && possibleValues && possibleValues.length === 2) {
    // Check if values are TRUE/FALSE (case-insensitive)
    const normalizedValues = possibleValues.map(v => v.toUpperCase());
    if ((normalizedValues.includes('TRUE') && normalizedValues.includes('FALSE'))) {
      finalType = 'boolean';
      // Don't include possibleValues and labels for boolean types
      finalPossibleValues = undefined;
      finalLabels = undefined;
    } else {
      // Not a true boolean enum, treat as regular enum
      finalType = enumOrRangeType || baseType;
    }
  } else {
    // For other types, enum/range take precedence
    finalType = enumOrRangeType || baseType;
  }
  
  // Parse default value
  const defaultStr = parseDefaultFromComments(rawParam.comments) || rawParam.value;
  const defaultValue = convertStringToType(defaultStr, finalType);
  
  // Extract min/max for range types
  let min: number | undefined;
  let max: number | undefined;
  
  if (finalType === 'range') {
    for (const comment of rawParam.comments) {
      const rangeMatch = comment.match(/Possible Values:\s*(\d+)\s*-\s*(\d+)/i);
      if (rangeMatch) {
        min = parseInt(rangeMatch[1]);
        max = parseInt(rangeMatch[2]);
      }
    }
  }
  
  return {
    name: rawParam.name,
    type: finalType,
    default: defaultValue,
    description: parseDescriptionFromComments(rawParam.comments),
    translationKey: `configEditor.parameters.${rawParam.name}`,
    possibleValues: finalPossibleValues,
    labels: finalLabels,
    min,
    max
  };
}

/**
 * Convert string value to appropriate type
 * 
 * @param value String value
 * @param type Target type
 * @returns Converted value
 */
function convertStringToType(value: string, type: ParameterType): string | number | boolean {
  if (type === 'boolean') {
    return value.toUpperCase() === 'TRUE';
  }
  if (type === 'number' || type === 'range') {
    return parseInt(value) || 0;
  }
  return value;
}

/**
 * Extract schema from raw config data
 * 
 * Interprets types from comments and creates typed schema.
 * Maps section names to display names and assigns SF symbols.
 * 
 * @param rawConfig Parsed raw config data (from ConfigParser)
 * @param symbolMapping Optional section name to SF symbol mapping
 * @returns Strongly typed config schema
 */
export function extractSchema(
  rawConfig: RawConfigData,
  symbolMapping: Record<string, string> = {}
): ConfigSchema {
  const sectionsArray: SectionSchema[] = [];
  
  for (const rawSection of rawConfig.sections) {
    const sectionName = rawSection.name;
    const parameters = rawSection.parameters.map(extractParameterSchema);
    
    // Use provided mapping first, then fall back to intelligent detection
    const sfSymbol = symbolMapping[sectionName] || getSymbolForSection(sectionName);
    
    sectionsArray.push({
      name: sectionName,
      displayName: toDisplayName(sectionName),
      translationKey: `configEditor.sections.${sectionName}`,
      sfSymbol,
      parameters
    });
  }
  
  // Convert array to Record with section names as keys
  const sectionsRecord: Record<string, SectionSchema> = {};
  for (const section of sectionsArray) {
    sectionsRecord[section.name] = section;
  }
  
  return { sections: sectionsRecord };
}

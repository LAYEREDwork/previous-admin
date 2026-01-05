/**
 * CFG file parser for Previous emulator configuration
 * 
 * Parses INI/CFG format files into structured data.
 * This parser is type-agnostic - it extracts raw values and comments
 * without interpreting types. Type interpretation is handled by SchemaExtractor.
 * 
 * @module backend/config-schema/config-parser
 */

/**
 * Raw configuration parameter with unparsed comments
 * Comments remain as strings - no type interpretation
 */
export interface RawConfigParameter {
  /** Parameter name (e.g., "bShowConfigDialogAtStartup") */
  name: string;
  
  /** Parameter value as raw string */
  value: string;
  
  /** Raw comment lines above the parameter (unparsed) */
  comments: string[];
}

/**
 * Raw configuration section
 */
export interface RawConfigSection {
  /** Section name (e.g., "ConfigDialog") */
  name: string;
  
  /** Parameters in this section */
  parameters: RawConfigParameter[];
}

/**
 * Complete raw configuration data structure
 */
export interface RawConfigData {
  /** Header comments (metadata like version and creation date) */
  headerComments: string[];
  
  /** All sections from the config file */
  sections: RawConfigSection[];
}

/**
 * Parse CFG file content into raw structured data
 * 
 * Reads INI/CFG format and extracts:
 * - Section names in [brackets]
 * - Parameter key=value pairs
 * - Comments above parameters (lines starting with # or //)
 * 
 * No type interpretation or validation is performed.
 * Comments remain as raw strings for later processing.
 * 
 * @param cfgContent Raw file content as string
 * @returns Structured raw config data with unparsed comments
 * 
 * @example
 * const cfgContent = `
 * [ConfigDialog]
 * # Type: Bool
 * # Meaning: Show dialog
 * bShowDialog = TRUE
 * `;
 * 
 * const raw = parseCfgFile(cfgContent);
 * // Returns:
 * // {
 * //   sections: [{
 * //     name: "ConfigDialog",
 * //     parameters: [{
 * //       name: "bShowDialog",
 * //       value: "TRUE",
 * //       comments: ["# Type: Bool", "# Meaning: Show dialog"]
 * //     }]
 * //   }]
 * // }
 */
export function parseCfgFile(cfgContent: string): RawConfigData {
  const lines = cfgContent.split('\n');
  const sections: RawConfigSection[] = [];
  const headerComments: string[] = [];
  
  let currentSection: RawConfigSection | null = null;
  let currentComments: string[] = [];
  let headerProcessed = false;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip empty lines
    if (!trimmedLine) {
      // Only keep comments, discard empty comment sections
      if (currentComments.length > 0 && !trimmedLine.startsWith('#') && !trimmedLine.startsWith('//')) {
        currentComments = [];
      }
      continue;
    }
    
    // Detect section header [SectionName]
    if (trimmedLine.startsWith('[') && trimmedLine.endsWith(']')) {
      headerProcessed = true; // No more header comments after first section
      const sectionName = trimmedLine.slice(1, -1);
      currentSection = {
        name: sectionName,
        parameters: []
      };
      sections.push(currentSection);
      currentComments = [];
      continue;
    }
    
    // Detect comment lines (# or //)
    if (trimmedLine.startsWith('#') || trimmedLine.startsWith('//')) {
      if (!headerProcessed) {
        headerComments.push(trimmedLine);
      } else {
        currentComments.push(trimmedLine);
      }
      continue;
    }
    
    // Detect parameter (key = value)
    if (trimmedLine.includes('=') && currentSection) {
      headerProcessed = true; // No more header comments after first parameter
      const eqIndex = trimmedLine.indexOf('=');
      const paramName = trimmedLine.slice(0, eqIndex).trim();
      const paramValue = trimmedLine.slice(eqIndex + 1).trim();
      
      // Skip invalid parameters
      if (paramName && paramValue !== undefined) {
        currentSection.parameters.push({
          name: paramName,
          value: paramValue,
          comments: [...currentComments] // Copy comments for this parameter
        });
        currentComments = [];
      }
    }
  }
  
  return { headerComments, sections };
}

/**
 * Validate that parsed config has expected structure
 * 
 * @param data Parsed config data to validate
 * @returns true if structure is valid, false otherwise
 */
export function validateRawConfigStructure(data: RawConfigData): boolean {
  if (!data || !Array.isArray(data.sections)) {
    return false;
  }
  
  for (const section of data.sections) {
    if (!section.name || !Array.isArray(section.parameters)) {
      return false;
    }
    
    for (const param of section.parameters) {
      if (!param.name || param.value === undefined) {
        return false;
      }
    }
  }
  
  return true;
}

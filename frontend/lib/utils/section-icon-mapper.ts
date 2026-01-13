/**
 * Section Icon Mapper
 * 
 * Maps SF Symbol names (from schema) to React component references.
 * Uses auto-generated icon map to handle all available SF Symbols.
 * 
 * @module frontend/lib/utils/section-icon-mapper
 */

import type { ComponentType } from 'react';

import * as SFSymbols from 'sf-symbols-lib';

import { sfIconMap } from 'sf-symbols-lib';

interface IconMapperProps {
  size?: number | string;
  className?: string;
  color?: string;
}

/**
 * Maps SF Symbol names to React icon components
 * 
 * Converts SF Symbol names (e.g., 'ServerRack', 'Cpu', 'Network')
 * to available React icon components using the auto-generated icon map.
 * Falls back to SFCpu if the symbol is not found.
 * 
 * @param sfSymbol - The SF Symbol name to look up
 * @returns The React component for the icon, or SFCpu as fallback
 */
export function getSectionIcon(
  sfSymbol: string | undefined
): ComponentType<IconMapperProps> | null {
  if (!sfSymbol) {
    return SFSymbols.SFCpu;
  }

  // Look up the component name in the auto-generated icon map
  const componentName = sfIconMap[sfSymbol as keyof typeof sfIconMap];
  if (componentName && componentName in SFSymbols) {
    return SFSymbols[componentName as keyof typeof SFSymbols] as ComponentType<IconMapperProps>;
  }

  // Default fallback
  return SFSymbols.SFCpu;
}

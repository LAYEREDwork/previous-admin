import React, { createContext, useState, useContext, useEffect } from 'react';

import { AVAILABLE_FONTS, type FontFamily } from './PAFontContext.constants';

interface FontContextType {
  font: FontFamily;
  setFont: (font: FontFamily) => void;
}

const FontContext = createContext<FontContextType | undefined>(undefined);

/**
 * Font Provider component
 * Manages global font selection and persistence
 */
export function FontProvider({ children }: { children: React.ReactNode }) {
  const [font, setFontState] = useState<FontFamily>('Roboto Flex');

  // Initialize font from localStorage on mount
  useEffect(() => {
    // Safety check for AVAILABLE_FONTS
    if (!AVAILABLE_FONTS) {
      console.error('PAFontContext: AVAILABLE_FONTS is not properly defined');
      applyFont('Roboto Flex');
      return;
    }

    const savedFont = localStorage.getItem('pa-font') as FontFamily | null;
    if (savedFont && AVAILABLE_FONTS.includes(savedFont)) {
      setFontState(savedFont);
      applyFont(savedFont);
    } else {
      applyFont('Roboto Flex');
    }
  }, []);

  /**
   * Apply font to document and update localStorage
   */
  const setFont = (newFont: FontFamily) => {
    setFontState(newFont);
    localStorage.setItem('pa-font', newFont);
    applyFont(newFont);
  };

  /**
   * Apply font-family CSS to document
   */
  const applyFont = (fontFamily: FontFamily) => {
    // Apply to both html and body elements to ensure it works
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    const fontFamily_ = `"${fontFamily}", -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
    
    htmlElement.style.fontFamily = fontFamily_;
    bodyElement.style.fontFamily = fontFamily_;
    
    // Also log for debugging
    console.log(`Font applied: ${fontFamily_}`);
  };

  return (
    <FontContext.Provider value={{ font, setFont }}>
      {children}
    </FontContext.Provider>
  );
}

/**
 * Hook to access font context
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useFont() {
  const context = useContext(FontContext);
  if (context === undefined) {
    throw new Error('useFont must be used within a FontProvider');
  }
  return context;
}

export type { FontFamily };
export { AVAILABLE_FONTS } from './PAFontContext.constants';

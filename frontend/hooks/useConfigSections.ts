import { useState, useEffect } from 'react';

/**
 * Hook to manage the expanded/collapsed state of configuration sections.
 * Persists state to localStorage.
 */
export function useConfigSections() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('configEditorSectionsExpanded');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing expanded sections from localStorage', e);
      }
    }
    return {
      system: true,
      display: false,
      scsi: false,
      network: false,
      sound: false,
      boot: false,
      input: false,
    };
  });

  useEffect(() => {
    localStorage.setItem('configEditorSectionsExpanded', JSON.stringify(expandedSections));
  }, [expandedSections]);

  function toggleAllSections() {
    const allExpanded = Object.values(expandedSections).every(expanded => expanded);
    const newState = !allExpanded;
    setExpandedSections({
      system: newState,
      display: newState,
      scsi: newState,
      network: newState,
      sound: newState,
      boot: newState,
      input: newState,
    });
  }

  return {
    expandedSections,
    setExpandedSections,
    toggleAllSections,
  };
}

import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to manage the expanded/collapsed state of configuration sections.
 * Persists state to localStorage.
 */
export function useConfigSections() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('configEditorSectionsExpanded');
    const defaultSections = {
      system: true,
      display: false,
      scsi: false,
      network: false,
      sound: false,
      boot: false,
      input: false,
    };
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge saved state with defaults to ensure all sections are defined
        return { ...defaultSections, ...parsed };
      } catch (e) {
        console.error('Error parsing expanded sections from localStorage', e);
      }
    }
    return defaultSections;
  });

  useEffect(() => {
    localStorage.setItem('configEditorSectionsExpanded', JSON.stringify(expandedSections));
  }, [expandedSections]);

  function toggleAllSections() {
    console.log('toggleAllSections called');
    setExpandedSections(prev => {
      console.log('prev expandedSections:', prev);
      const allExpanded = Object.values(prev).every(expanded => expanded);
      console.log('allExpanded:', allExpanded);
      const newState = !allExpanded;
      console.log('newState:', newState);
      // Create new state object with all current sections set to the new state
      const newExpandedSections: Record<string, boolean> = {};
      Object.keys(prev).forEach(key => {
        newExpandedSections[key] = newState;
      });
      console.log('newExpandedSections:', newExpandedSections);
      return newExpandedSections;
    });
  }

  return {
    expandedSections,
    setExpandedSections,
    toggleAllSections,
  };
}

import { useState, useEffect } from 'react';

/**
 * Hook for managing tab navigation state with localStorage persistence.
 */
export function useTabNavigation(defaultTab: string = 'configs') {
  const [currentTab, setCurrentTab] = useState(() => {
    const savedTab = localStorage.getItem('currentTab');
    return savedTab || defaultTab;
  });

  useEffect(() => {
    localStorage.setItem('currentTab', currentTab);
  }, [currentTab]);

  return { currentTab, setCurrentTab };
}
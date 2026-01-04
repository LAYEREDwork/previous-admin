import { useState, useRef, useEffect } from 'react';

/**
 * Hook to manage the state and focus logic for the "New Configuration" modal.
 */
export function useNewConfigModal() {
  const [showNewConfig, setShowNewConfig] = useState(false);
  const [newConfigName, setNewConfigName] = useState('');
  const [newConfigDesc, setNewConfigDesc] = useState('');
  const newConfigNameRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (showNewConfig) {
      const timer = setTimeout(() => {
        newConfigNameRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showNewConfig]);

  function handleClose() {
    setShowNewConfig(false);
    setNewConfigName('');
    setNewConfigDesc('');
  }

  return {
    showNewConfig,
    setShowNewConfig,
    newConfigName,
    setNewConfigName,
    newConfigDesc,
    setNewConfigDesc,
    newConfigNameRef,
    handleClose,
  };
}

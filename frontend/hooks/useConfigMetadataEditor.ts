import { useState, useEffect } from 'react';

/**
 * Hook to manage local metadata (name, description) editing with change tracking.
 */
export function useConfigMetadataEditor(initialName: string, initialDescription: string) {
  const [localName, setLocalName] = useState(initialName);
  const [localDescription, setLocalDescription] = useState(initialDescription);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalName(initialName);
    setLocalDescription(initialDescription);
    setHasChanges(false);
  }, [initialName, initialDescription]);

  useEffect(() => {
    const nameChanged = localName !== initialName;
    const descChanged = localDescription !== initialDescription;
    setHasChanges(nameChanged || descChanged);
  }, [localName, localDescription, initialName, initialDescription]);

  return {
    localName,
    setLocalName,
    localDescription,
    setLocalDescription,
    hasChanges,
    setHasChanges,
  };
}

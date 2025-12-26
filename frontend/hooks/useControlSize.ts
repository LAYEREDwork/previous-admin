import { PASize } from '../lib/types/sizes';
import { useState, useEffect } from 'react';

export function usePASize(defaultSize: PASize = PASize.md): PASize {
  const [size, setSize] = useState<PASize>(defaultSize);

  useEffect(() => {
    const updateSize = () => {
      // Use 'sm' for mobile devices (standard Tailwind sm breakpoint is 640px)
      // 'xs' might be too small for touch targets, so 'sm' is preferred for mobile inputs
      if (window.innerWidth < 640) {
        setSize(PASize.sm);
      } else {
        setSize(defaultSize);
      }
    };

    // Initial check
    updateSize();

    // Listen for resize events
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [defaultSize]);

  return size;
}

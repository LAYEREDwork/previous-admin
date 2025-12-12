import { useState, useEffect } from 'react';

type ControlSize = 'lg' | 'md' | 'sm' | 'xs';

export function useControlSize(defaultSize: ControlSize = 'md'): ControlSize {
  const [size, setSize] = useState<ControlSize>(defaultSize);

  useEffect(() => {
    const updateSize = () => {
      // Use 'sm' for mobile devices (standard Tailwind sm breakpoint is 640px)
      // 'xs' might be too small for touch targets, so 'sm' is preferred for mobile inputs
      if (window.innerWidth < 640) {
        setSize('sm');
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

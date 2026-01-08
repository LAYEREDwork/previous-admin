import { useState, useEffect } from 'react';

import { PASize } from '@frontend/lib/types/sizes';

/**
 * React hook that provides responsive sizing for UI components.
 * Automatically adjusts the component size based on screen width to ensure
 * optimal touch targets and readability on different devices.
 *
 * On mobile devices (screen width < 640px), the size is automatically set to 'sm'
 * to provide better touch targets, regardless of the default size. On larger screens,
 * the provided default size is used.
 *
 * @param defaultSize - The default size to use on desktop/tablet screens (≥640px)
 * @returns The appropriate PASize for the current screen width
 *
 * @example
 * ```tsx
 * const size = usePASize(PASize.lg); // Returns PASize.sm on mobile, PASize.lg on desktop
 * ```
 */
export function useResponsiveControlSize(defaultSize: PASize = PASize.md): PASize {
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

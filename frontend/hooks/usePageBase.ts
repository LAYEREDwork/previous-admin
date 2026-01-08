import { useLanguage } from '@frontend/contexts/PALanguageContext';
import { useResponsiveControlSize } from '@frontend/hooks/useResponsiveControlSize';
import { PASize } from '@frontend/lib/types/sizes';

/**
 * Base hook providing common dependencies for page components.
 * Provides translation and responsive control size.
 */
export function usePageBase(defaultControlSize: PASize = PASize.md) {
  const { translation } = useLanguage();
  const controlSize = useResponsiveControlSize(defaultControlSize);

  return { translation, controlSize };
}
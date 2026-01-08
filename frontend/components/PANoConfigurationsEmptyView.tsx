import { useLanguage } from '@frontend/contexts/PALanguageContext';

import { PASize } from '@frontend/lib/types/sizes';

import { PAEmptyView } from './controls/PAEmptyView';
import { SFDocumentBadgePlusFill } from './sf-symbols';

/**
 * A reusable empty state component displayed when no configurations are available.
 * Used consistently across Config List and Config Editor pages to maintain DRY principle.
 *
 * @param {Object} props - Component props
 * @param {() => void} [props.onCreateNew] - Callback when the "Create New" button is clicked
 * @param {PASize} [props.buttonSize] - Size of the action button (default: PASize.md)
 * @returns {JSX.Element} The empty state component
 */
export function PANoConfigurationsEmptyView({
  onCreateNew,
  buttonSize = PASize.md,
}: {
  onCreateNew?: () => void;
  buttonSize?: PASize;
}) {
  const { translation } = useLanguage();

  return (
    <PAEmptyView
      icon={SFDocumentBadgePlusFill}
      iconSize={120}
      title={translation.configList.emptyStateTitle}
      description={translation.configList.emptyStateDescription}
      actionText={translation.configList.createNew}
      onAction={onCreateNew || (() => {})}
      buttonSize={buttonSize}
    />
  );
}

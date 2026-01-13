import { Dropdown, Button } from 'rsuite';

import { SFScribbleVariable, SFCheckmarkCircle } from 'sf-symbols-lib';
import { useFont, AVAILABLE_FONTS } from '@frontend/contexts/PAFontContext';
import type { FontFamily } from '@frontend/contexts/PAFontContext';
import { PASize, PASizeConfig } from '@frontend/lib/types/sizes';

/**
 * Font Switcher Component
 * Allows users to dynamically select from available fonts
 * Shows live preview with font name in selected font
 * 
 * @param size The size of the font switcher (xs, sm, md, lg, xl)
 */
export function PAFontSwitcher({ size = PASize.sm }: { size?: typeof PASize[keyof typeof PASize] } = {}) {
  const { font, setFont } = useFont();
  const config = PASizeConfig[size as keyof typeof PASizeConfig];

  // Safety check for AVAILABLE_FONTS
  if (!AVAILABLE_FONTS) {
    return null;
  }

  return (
    <Dropdown
      placement="bottomEnd"
      renderToggle={(props, ref) => (
        <Button
          {...props}
          ref={ref}
          appearance="default"
          size={config.buttonSize}
          title="Font switcher"
        >
          <SFScribbleVariable size={config.iconSize} className="text-[var(--rs-text-primary)]" />
        </Button>
      )}
    >
      {AVAILABLE_FONTS.map((fontFamily: FontFamily) => (
        <Dropdown.Item
          key={fontFamily}
          onClick={() => setFont(fontFamily)}
          active={font === fontFamily}
        >
          <div className="flex items-center justify-between gap-3 min-w-[180px]">
            <div
              className="flex-grow"
              style={{
                fontFamily: `"${fontFamily}", sans-serif`,
              }}
            >
              {fontFamily}
            </div>
            {font === fontFamily && (
              <SFCheckmarkCircle size={config.iconSize} color="currentColor" className="flex-shrink-0" />
            )}
          </div>
        </Dropdown.Item>
      ))}
    </Dropdown>
  );
}

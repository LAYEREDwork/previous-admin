import React from 'react';
import { Whisper, Popover, WhisperInstance } from 'rsuite';
import type { Placement } from 'rsuite/esm/internals/types';
import { PATexture } from '../../lib/utils/color';
import { computePalette, PANeomorphPalette } from '../../lib/utils/palette';

interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const DropdownItem = ({ children, onClick, className }: DropdownItemProps) => {
  return (
    <div
      onClick={onClick}
      className={`px-4 py-2 hover:bg-black/20 cursor-pointer ${className}`}
    >
      {children}
    </div>
  );
};

interface PANeomorphDropdownProps {
  renderToggle: (
    props: React.HTMLAttributes<HTMLElement>,
    ref: React.Ref<HTMLElement>,
    isOpen: boolean
  ) => React.ReactElement;
  children: React.ReactNode;
  placement?: Placement;
  baseColor?: string;
}

const PANeomorphDropdown = ({
  renderToggle,
  children,
  placement = 'bottomEnd',
  baseColor,
}: PANeomorphDropdownProps) => {
  const popoverRef = React.useRef<WhisperInstance>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const palette = computePalette(baseColor || PANeomorphPalette.baseColor);

  const handleItemClick = () => {
    popoverRef.current?.close();
  };

  const menuItems = React.Children.map(children, (child) => {
    if (React.isValidElement<DropdownItemProps>(child)) {
      const originalOnClick = child.props.onClick;
      return React.cloneElement(child, {
        onClick: () => {
          if (originalOnClick) {
            originalOnClick();
          }
          handleItemClick();
        },
      });
    }
    return child;
  });

  return (
    <Whisper
      ref={popoverRef}
      placement={placement}
      trigger="click"
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      speaker={(props, ref) => {
        const { className, ...rest } = props;
        return (
          <Popover
            ref={ref}
            className={className}
            arrow={false}
            style={{
              background: 'transparent',
              boxShadow: 'none',
              minWidth: 'unset',
              marginTop: '0px',
              marginRight: '3px',
              padding: 0,
            }}
            {...rest}
          >
            <div
              style={{
                backgroundImage: PATexture.noise,
                backgroundColor: palette.buttonBackground,
                boxShadow: `
                  inset 1px 1px 1px ${palette.buttonShadowLight},
                  inset -1px -1px 1px ${palette.buttonShadowDark},
                  0 4px 8px rgba(0,0,0,0.3)
                `,
                borderTopRightRadius: 0,
                borderTopLeftRadius: 8,
                borderBottomRightRadius: 8,
                borderBottomLeftRadius: 8,
              }}
              className="overflow-hidden"
            >
              {menuItems}
            </div>
          </Popover>
        );
      }}
    >
      {(props, ref) => (
        <React.Fragment key={isOpen ? 'open' : 'closed'}>
          {renderToggle(props, ref, isOpen)}
        </React.Fragment>
      )}
    </Whisper>
  );
};

PANeomorphDropdown.Item = DropdownItem;

export { PANeomorphDropdown };

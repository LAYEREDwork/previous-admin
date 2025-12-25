import React from 'react';
import { Whisper, Popover, WhisperInstance } from 'rsuite';
import type { Placement } from 'rsuite/esm/internals/types';
import { PATexture } from '../../lib/utils/color';

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
  renderToggle: (props: React.HTMLAttributes<HTMLElement>, ref: React.Ref<HTMLElement>) => React.ReactElement;
  children: React.ReactNode;
  placement?: Placement;
}

const PANeomorphDropdown = ({
  renderToggle,
  children,
  placement = 'bottomEnd',
}: PANeomorphDropdownProps) => {
  const popoverRef = React.useRef<WhisperInstance>(null);

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
      speaker={(props, ref) => {
        const { className, ...rest } = props;
        return (
          <Popover
            ref={ref}
            className={className}
            style={{
              background: 'transparent',
              boxShadow: 'none',
              // The Popover from rsuite has a min-width, we override it here
              minWidth: 'unset',
            }}
            {...rest}
          >
            <div
              style={{ backgroundImage: PATexture.noise }}
              className="rounded-lg border border-gray-700/90 bg-gray-800/90 shadow-lg overflow-hidden backdrop-blur-sm"
            >
              {menuItems}
            </div>
          </Popover>
        );
      }}
    >
      {renderToggle}
    </Whisper>
  );
};

PANeomorphDropdown.Item = DropdownItem;

export { PANeomorphDropdown };

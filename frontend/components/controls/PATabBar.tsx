import React, { ReactNode } from 'react';

interface TabBarOption<T extends string> {
  value: T;
  label: string;
  icon: React.ComponentType<{ size?: number }> | ReactNode;
}

interface PATabBarProps<T extends string> {
  options: TabBarOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

/**
 * PATabBar - iOS-style bottom tab bar for mobile navigation
 * Displays icon above label for each tab
 */
export function PATabBar<T extends string>({
  options,
  value,
  onChange,
  className = '',
}: PATabBarProps<T>) {
  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--rs-border-primary)] transition-colors duration-200 safe-area-inset-bottom portrait-only md:hidden ${className}`}
      style={{ backgroundColor: 'var(--rs-bg-card)' }}
    >
      <div className="flex items-stretch justify-around h-20">
        {options.map((option) => {
          const isActive = value === option.value;

          // Handle different icon formats
          const renderIcon = () => {
            if (React.isValidElement(option.icon)) {
              return option.icon;
            }

            if (typeof option.icon === 'function') {
              const IconComponent = option.icon as React.ComponentType<{ size?: number }>;
              return <IconComponent size={24} />;
            }

            return option.icon;
          };

          return (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 px-1 transition-colors duration-200 ${
                isActive ? 'text-[var(--rs-primary-500)]' : 'text-[var(--rs-text-secondary)]'
              } hover:bg-[var(--rs-border-primary)]/50 active:bg-[var(--rs-border-primary)]`}
              title={option.label}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                {renderIcon()}
              </div>
              <span className="text-xs font-medium text-center truncate w-full leading-tight">
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

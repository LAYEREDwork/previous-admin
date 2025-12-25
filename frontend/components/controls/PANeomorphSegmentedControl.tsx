import React, { ReactNode, useRef, useEffect, useState } from 'react';
import { computePalette, PANeomorphPalette } from '../../lib/utils/palette';
import { adjustLightness, hslToString, parseColorToHsl, PATextures } from '../../lib/utils/color';

interface SegmentOption<T extends string> {
  value: T;
  label?: string;
  icon?: React.ComponentType<any> | ReactNode;
}

// Enum for shape, kept for basic configuration
export const PANeomorphSegmentedControlShape = {
  pill: 'pill',
  rect: 'rect',
} as const;
export type PANeomorphSegmentedControlShape = typeof PANeomorphSegmentedControlShape[keyof typeof PANeomorphSegmentedControlShape];

interface PANeomorphSegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  iconOnly?: boolean;
  fullWidth?: boolean;
  baseColor?: string;
  shape?: PANeomorphSegmentedControlShape;
  className?: string;
}

/**
 * A neomorphic segmented control with recessed background and embossed active segment.
 * Drop-in replacement for PASegmentedControl with neomorphic styling.
 * PA prefix for Previous Admin.
 */
export function PANeomorphSegmentedControl<T extends string>({
  options,
  value,
  onChange,
  size = 'sm',
  iconOnly = false,
  fullWidth = false,
  baseColor,
  shape = PANeomorphSegmentedControlShape.pill,
  className = '',
}: PANeomorphSegmentedControlProps<T>) {
  const palette = computePalette(baseColor || PANeomorphPalette.baseColor);
  const inactiveTextColor = hslToString(adjustLightness(parseColorToHsl(palette.text)!, -30)); // 50% of full brightness

  const activeIndex = options.findIndex((opt) => opt.value === value);
  const [sliderStyle, setSliderStyle] = useState<React.CSSProperties>({ opacity: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  // Update slider position when value or options change
  useEffect(() => {
    const updateSlider = () => {
      if (containerRef.current && activeIndex !== -1) {
        const segments = containerRef.current.querySelectorAll('.segment-item');
        const activeElement = segments[activeIndex] as HTMLElement;
        if (activeElement) {
          setSliderStyle({
            left: activeElement.offsetLeft,
            width: activeElement.offsetWidth,
            height: activeElement.offsetHeight,
            opacity: 1,
            transition: isReady ? 'all 0.3s cubic-bezier(0.34, 1.2, 0.64, 1)' : 'none',
          });
          if (!isReady) setIsReady(true);
        }
      }
    };

    // Small delay to ensure layout is ready
    const timer = setTimeout(updateSlider, 50);

    window.addEventListener('resize', updateSlider);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateSlider);
    };
  }, [activeIndex, options, isReady]);

  // Precise height mapping (+4px to match user request)
  const containerHeights = {
    xs: 'h-7',      // 28px
    sm: 'h-[34px]', // 34px
    md: 'h-10',     // 40px
    lg: 'h-[46px]', // 46px
  };

  const fontSizes = {
    xs: 'text-[10px]',
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const iconSizes = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
  };

  const containerBorderRadius = shape === PANeomorphSegmentedControlShape.pill ? 'rounded-full' : 'rounded-lg';
  const sliderBorderRadius = shape === PANeomorphSegmentedControlShape.pill ? 'rounded-full' : 'rounded-lg';

  return (
    <div
      ref={containerRef}
      className={`relative flex p-1 select-none ${containerHeights[size]} ${containerBorderRadius}
        } ${fullWidth ? 'w-full' : 'w-fit'} ${className}`}
      style={{
        backgroundImage: PATextures.noise,
        backgroundColor: palette.frameBackground,
        boxShadow: `inset 1px 1px 2px ${palette.frameShadowDark}, inset -1px -1px 2px ${palette.frameShadowLight}`,
      }}
    >
      {/* Sliding Active Tile (Active Segment Background) - Embossed */}
      <div
        className={`absolute top-1 bottom-1 pointer-events-none z-0 transition-all ${sliderBorderRadius}`}
        style={{
          ...sliderStyle,
          backgroundImage: PATextures.noise,
          backgroundColor: palette.buttonBackground,
          boxShadow: `-1px -1px 2px ${palette.buttonShadowLight}, 1px 1px 2px ${palette.buttonShadowDark}`,
        }}
      />

      {options.map((option) => {
        const isActive = value === option.value;

        // Handle different icon formats safely
        const renderIcon = () => {
          if (!option.icon) return null;

          if (React.isValidElement(option.icon)) {
            return option.icon;
          }

          if (typeof option.icon === 'function') {
            const IconComponent = option.icon as React.ComponentType<any>;
            return <IconComponent size={iconSizes[size]} />;
          }

          return option.icon;
        };

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`segment-item relative z-10 flex items-center justify-center gap-2 font-semibold h-full px-3 transition-colors duration-300 ${sliderBorderRadius} ${fontSizes[size]
              } ${fullWidth ? 'flex-1' : ''}`}
            style={{
              color: isActive ? 'white' : inactiveTextColor,
            }}
          >
            {option.icon && renderIcon() && (
              <span className={`flex items-center justify-center transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
                {renderIcon()}
              </span>
            )}
            {!iconOnly && option.label && (
              <span className="truncate">{option.label}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
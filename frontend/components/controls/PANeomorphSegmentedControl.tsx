import React, { ReactNode, useRef, useEffect, useState } from 'react';
import { PANeomorphPalette, computePalette } from '../../lib/utils/palette';
import { PANeomorphControlShape, containerHeightsPixel, containerHeightsCSS, iconSizesPixel, fontSizesCSS } from '../../lib/utils/styling';
import { adjustLightness, hslToString, parseColorToHsl, PATexture } from '../../lib/utils/color';
import { PASize } from '../../lib/types/sizes';

interface SegmentOption<T extends string> {
  value: T;
  label?: string;
  icon?: React.ComponentType<any> | ReactNode;
}

interface PANeomorphSegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size: PASize;
  iconOnly?: boolean;
  fullWidth?: boolean;
  baseColor?: string;
  shape?: PANeomorphControlShape;
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
  size = PASize.sm,
  iconOnly = false,
  fullWidth = false,
  baseColor,
  shape = PANeomorphControlShape.pill,
  className = '',
}: PANeomorphSegmentedControlProps<T>) {
  const palette = computePalette(baseColor || PANeomorphPalette.baseColor);
  const inactiveTextColor = hslToString(adjustLightness(parseColorToHsl(palette.textColor)!, -40)); // 40% darker
  const backgroundColor = hslToString(adjustLightness(parseColorToHsl(palette.frameBackground)!, 1));
  const hoverBackgroundColor = hslToString(adjustLightness(parseColorToHsl(palette.frameBackground)!, 16));
  const frameShadowLightColor = hslToString(adjustLightness(parseColorToHsl(palette.frameShadowLight)!, 10));

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

  const outerCornerRadius = shape === PANeomorphControlShape.pill ? containerHeightsPixel[size] / 2 : Math.min(containerHeightsPixel[size] / 4, 8); // Für rect max 8px wie rounded-lg
  const innerCornerRadius = Math.max(outerCornerRadius - 4, 0); // 4px padding (p-1)

  return (
    <>
      <style>
        {`
          .inactive-segment:hover {
            background-color: ${hoverBackgroundColor} !important;
            border-radius: 3px !important;
          }
        `}
      </style>
      <div
        ref={containerRef}
        className={`relative flex p-1 select-none ${containerHeightsCSS[size]}
        } ${fullWidth ? 'w-full' : 'w-fit'} ${className}`}
        style={{
          backgroundImage: PATexture.noise,
          backgroundColor: backgroundColor,
          boxShadow: `inset 1px 1px 2px ${palette.frameShadowDark}, inset -1px -1px 2px ${frameShadowLightColor}`,
          borderRadius: outerCornerRadius,
        }}
      >
      {/* Sliding Active Tile (Active Segment Background) - Embossed */}
      <div
        className={`absolute top-1 bottom-1 pointer-events-none z-0 transition-all`}
        style={{
          ...sliderStyle,
          backgroundImage: PATexture.noise,
          backgroundColor: palette.buttonBackground,
          boxShadow: `-1px -1px 2px ${palette.buttonShadowLight}, 1px 1px 2px ${palette.buttonShadowDark}`,
          borderRadius: innerCornerRadius,
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
            return <IconComponent size={iconSizesPixel[size]} />;
          }

          return option.icon;
        };

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`segment-item relative z-10 flex items-center justify-center gap-2 font-semibold h-full px-3 transition-colors duration-300 ${fontSizesCSS[size]
              } ${fullWidth ? 'flex-1' : ''} ${!isActive ? 'inactive-segment' : ''}`}
            style={{
              color: isActive ? 'white' : inactiveTextColor,
              borderRadius: innerCornerRadius,
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
    </>
  );
}
interface SFRestartCircleFillProps {
  /**
   * Size of the icon in pixels
   * @default 24
   */
  size?: number | string;

  /**
   * Color of the icon
   * @default 'currentColor'
   */
  color?: string;

  /**
   * CSS class name to apply to the SVG element
   */
  className?: string;

  /**
   * Stroke width of the icon
   * @default 1
   */
  strokeWidth?: number | string;

  /**
   * Additional SVG attributes
   */
  [key: string]: any;
}

/**
 * RestartCircleFill Icon Component
 *
 * A custom SVG icon from SF Symbols.
 * Follows the same API conventions as React Icons library components.
 *
 * @param {SFSymbolRestartCircleFillProps} props - Component props
 * @returns {JSX.Element} The SVG icon element
 *
 * @example
 * // Basic usage
 * <SFSymbolRestartCircleFill size={24} color="currentColor" />
 *
 * @example
 * // With custom styling
 * <SFSymbolRestartCircleFill size={32} color="#ff0000" className="custom-class" />
 */
export function SFRestartCircleFill({
  size = 24,
  color = 'currentColor',
  className = '',
  strokeWidth = 1,
  ...rest
}: SFRestartCircleFillProps): JSX.Element {
  const numSize = typeof size === 'string' ? parseInt(size, 10) : size;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 25.8008 25.459"
      width={numSize}
      height={numSize}
      fill={color}
      strokeWidth={strokeWidth}
      className={className}
      {...rest}
    >
      <g><rect height="25.459" opacity="0" width="25.8008" x="0" y="0"/><path d="M12.7148 25.459C19.7266 25.459 25.4395 19.7461 25.4395 12.7344C25.4395 5.73242 19.7266 0.0195312 12.7148 0.0195312C5.71289 0.0195312 0 5.73242 0 12.7344C0 19.7461 5.71289 25.459 12.7148 25.459Z" fill="currentColor" fill-opacity="0.2125"/><path d="M6.92383 11.4941L14.5801 6.91406C15.4785 6.38672 16.709 6.75781 16.709 7.99805L16.709 17.4512C16.709 18.6914 15.4785 19.0625 14.5801 18.5352L6.9043 13.9844C5.98633 13.418 5.9668 12.0801 6.92383 11.4941ZM8.58398 12.5977C8.47656 12.666 8.45703 12.8125 8.59375 12.8906L14.6387 16.4844C14.8047 16.582 14.9219 16.5137 14.9219 16.377L14.9219 9.07227C14.9219 8.93555 14.8047 8.86719 14.6387 8.97461Z" fill="currentColor" fill-opacity="0.85"/></g>
    </svg>
  );
}

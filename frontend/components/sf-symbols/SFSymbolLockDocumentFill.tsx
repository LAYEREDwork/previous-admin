interface SFSymbolLockDocumentFillProps {
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
 * LockDocumentFill Icon Component
 *
 * A custom SVG icon from SF Symbols.
 * Follows the same API conventions as React Icons library components.
 *
 * @param {SFSymbolLockDocumentFillProps} props - Component props
 * @returns {JSX.Element} The SVG icon element
 *
 * @example
 * // Basic usage
 * <SFSymbolLockDocumentFill size={24} color="currentColor" />
 *
 * @example
 * // With custom styling
 * <SFSymbolLockDocumentFill size={32} color="#ff0000" className="custom-class" />
 */
export function SFSymbolLockDocumentFill({
  size = 24,
  color = 'currentColor',
  className = '',
  strokeWidth = 1,
  ...rest
}: SFSymbolLockDocumentFillProps): JSX.Element {
  const numSize = typeof size === 'string' ? parseInt(size, 10) : size;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 21.3281 26.9238"
      width={numSize}
      height={numSize}
      fill={color}
      strokeWidth={strokeWidth}
      className={className}
      {...rest}
    >
      <g><rect height="26.9238" opacity="0" width="21.3281" x="0" y="0"/><path d="M3.75977 26.9238L17.207 26.9238C19.707 26.9238 20.9668 25.6348 20.9668 23.125L20.9668 11.4062L11.9141 11.4062C10.3906 11.4062 9.66797 10.6738 9.66797 9.15039L9.66797 0.00976562L3.75977 0.00976562C1.2793 0.00976562 0 1.28906 0 3.80859L0 23.125C0 25.6445 1.25977 26.9238 3.75977 26.9238ZM11.9727 9.84375L20.8105 9.84375C20.7324 9.38477 20.4004 8.94531 19.8828 8.42773L12.6465 1.09375C12.1484 0.576172 11.6797 0.234375 11.2305 0.15625L11.2305 9.10156C11.2305 9.59961 11.4746 9.84375 11.9727 9.84375Z" fill="white" fill-opacity="0.2125"/><path d="M7.77344 24.1309C7.02148 24.1309 6.64062 23.75 6.64062 22.9297L6.64062 18.6719C6.64062 17.8906 6.97266 17.5098 7.61719 17.4707L7.61719 16.1719C7.61719 14.2676 8.78906 12.9785 10.498 12.9785C12.207 12.9785 13.3789 14.2676 13.3789 16.1719L13.3789 17.4707C14.0234 17.5098 14.3555 17.8906 14.3555 18.6719L14.3555 22.9297C14.3555 23.75 13.9844 24.1309 13.2227 24.1309ZM8.65234 17.4609L12.334 17.4609L12.334 16.084C12.334 14.8145 11.6016 13.9844 10.498 13.9844C9.38477 13.9844 8.65234 14.8145 8.65234 16.084Z" fill="white" fill-opacity="0.85"/></g>
    </svg>
  );
}

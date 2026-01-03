interface SFSymbolOpticaldiscdriveFillProps {
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
 * OpticaldiscdriveFill Icon Component
 *
 * A custom SVG icon from SF Symbols.
 * Follows the same API conventions as React Icons library components.
 *
 * @param {SFSymbolOpticaldiscdriveFillProps} props - Component props
 * @returns {JSX.Element} The SVG icon element
 *
 * @example
 * // Basic usage
 * <SFSymbolOpticaldiscdriveFill size={24} color="currentColor" />
 *
 * @example
 * // With custom styling
 * <SFSymbolOpticaldiscdriveFill size={32} color="#ff0000" className="custom-class" />
 */
export function SFSymbolOpticaldiscdriveFill({
  size = 24,
  color = 'currentColor',
  className = '',
  strokeWidth = 1,
  ...rest
}: SFSymbolOpticaldiscdriveFillProps): JSX.Element {
  const numSize = typeof size === 'string' ? parseInt(size, 10) : size;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 29.1699 20.8496"
      width={numSize}
      height={numSize}
      fill={color}
      strokeWidth={strokeWidth}
      className={className}
      {...rest}
    >
      <g><rect height="20.8496" opacity="0" width="29.1699" x="0" y="0"/><path d="M4.69727 15.957C4.69727 15.5273 5.04883 15.166 5.49805 15.166L23.3105 15.166C23.75 15.166 24.1016 15.5273 24.1016 15.957C24.1016 16.3965 23.75 16.7578 23.3105 16.7578L5.49805 16.7578C5.04883 16.7578 4.69727 16.3965 4.69727 15.957ZM4.92188 20.8496L23.8867 20.8496C26.7578 20.8496 28.8086 18.8086 28.8086 15.957C28.8086 13.1152 26.7578 11.0645 23.8867 11.0645L4.92188 11.0645C2.05078 11.0645 0 13.1152 0 15.957C0 18.8086 2.05078 20.8496 4.92188 20.8496ZM4.92188 9.50195L23.8867 9.50195C25.0488 9.50195 26.1035 9.77539 27.0215 10.2539L23.8379 2.80273C23.0762 0.986328 21.5332 0.0195312 19.4727 0.0195312L9.33594 0.0195312C7.27539 0.0195312 5.72266 0.986328 4.9707 2.80273L1.77734 10.2539C2.69531 9.77539 3.75977 9.50195 4.92188 9.50195Z" fill="currentColor" fill-opacity="0.85"/></g>
    </svg>
  );
}

interface SFSymbolInfoSquareFillProps {
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
 * InfoSquareFill Icon Component
 *
 * A custom SVG icon from SF Symbols.
 * Follows the same API conventions as React Icons library components.
 *
 * @param {SFSymbolInfoSquareFillProps} props - Component props
 * @returns {JSX.Element} The SVG icon element
 *
 * @example
 * // Basic usage
 * <SFSymbolInfoSquareFill size={24} color="currentColor" />
 *
 * @example
 * // With custom styling
 * <SFSymbolInfoSquareFill size={32} color="#ff0000" className="custom-class" />
 */
export function SFSymbolInfoSquareFill({
  size = 24,
  color = 'currentColor',
  className = '',
  strokeWidth = 1,
  ...rest
}: SFSymbolInfoSquareFillProps): JSX.Element {
  const numSize = typeof size === 'string' ? parseInt(size, 10) : size;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 23.3203 22.959"
      width={numSize}
      height={numSize}
      fill={color}
      strokeWidth={strokeWidth}
      className={className}
      {...rest}
    >
      <g><rect height="22.959" opacity="0" width="23.3203" x="0" y="0"/><path d="M3.79883 22.959L19.1504 22.959C21.6797 22.959 22.959 21.6797 22.959 19.1992L22.959 3.76953C22.959 1.2793 21.6797 0 19.1504 0L3.79883 0C1.2793 0 0 1.26953 0 3.76953L0 19.1992C0 21.6992 1.2793 22.959 3.79883 22.959Z" fill="currentColor" fill-opacity="0.2125"/><path d="M9.19922 18.6523C8.73047 18.6523 8.37891 18.3105 8.37891 17.8516C8.37891 17.4121 8.73047 17.0605 9.19922 17.0605L10.9473 17.0605L10.9473 10.6836L9.375 10.6836C8.92578 10.6836 8.56445 10.3418 8.56445 9.88281C8.56445 9.44336 8.92578 9.0918 9.375 9.0918L11.8457 9.0918C12.4121 9.0918 12.7148 9.50195 12.7148 10.0879L12.7148 17.0605L14.4629 17.0605C14.9316 17.0605 15.293 17.4121 15.293 17.8516C15.293 18.3105 14.9316 18.6523 14.4629 18.6523ZM11.3965 6.82617C10.5469 6.82617 9.87305 6.14258 9.87305 5.29297C9.87305 4.44336 10.5469 3.75977 11.3965 3.75977C12.2461 3.75977 12.9102 4.44336 12.9102 5.29297C12.9102 6.14258 12.2461 6.82617 11.3965 6.82617Z" fill="currentColor" fill-opacity="0.85"/></g>
    </svg>
  );
}

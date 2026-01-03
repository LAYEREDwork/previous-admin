interface SFSymbolInfoTriangleProps {
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
 * InfoTriangle Icon Component
 *
 * A custom SVG icon from SF Symbols.
 * Follows the same API conventions as React Icons library components.
 *
 * @param {SFSymbolInfoTriangleProps} props - Component props
 * @returns {JSX.Element} The SVG icon element
 *
 * @example
 * // Basic usage
 * <SFSymbolInfoTriangle size={24} color="currentColor" />
 *
 * @example
 * // With custom styling
 * <SFSymbolInfoTriangle size={32} color="#ff0000" className="custom-class" />
 */
export function SFSymbolInfoTriangle({
  size = 24,
  color = 'currentColor',
  className = '',
  strokeWidth = 1,
  ...rest
}: SFSymbolInfoTriangleProps): JSX.Element {
  const numSize = typeof size === 'string' ? parseInt(size, 10) : size;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 26.6504 24.0723"
      width={numSize}
      height={numSize}
      fill={color}
      strokeWidth={strokeWidth}
      className={className}
      {...rest}
    >
      <g><rect height="24.0723" opacity="0" width="26.6504" x="0" y="0"/><path d="M3.26172 23.8672L23.0176 23.8672C25.0586 23.8672 26.2891 22.4414 26.2891 20.6348C26.2891 20.0488 26.123 19.4434 25.8008 18.8867L15.9277 1.62109C15.3125 0.537109 14.2285 0 13.1445 0C12.0508 0 10.9766 0.537109 10.3613 1.62109L0.488281 18.8867C0.15625 19.4531 0 20.0488 0 20.6348C0 22.4414 1.23047 23.8672 3.26172 23.8672ZM3.28125 22.1777C2.31445 22.1777 1.73828 21.4453 1.73828 20.625C1.73828 20.332 1.81641 20 1.98242 19.6875L11.8359 2.44141C12.1289 1.92383 12.6465 1.71875 13.1445 1.71875C13.6426 1.71875 14.1504 1.92383 14.4336 2.44141L24.2969 19.6973C24.4629 20.0098 24.541 20.332 24.541 20.625C24.541 21.4453 23.9551 22.1777 22.9883 22.1777Z" fill="currentColor" fill-opacity="0.425"/><path d="M11.1328 19.4727L15.7715 19.4727C16.1719 19.4727 16.4844 19.1797 16.4844 18.7793C16.4844 18.3984 16.1719 18.0957 15.7715 18.0957L14.2188 18.0957L14.2188 11.9434C14.2188 11.4355 13.9551 11.084 13.4668 11.084L11.2988 11.084C10.8984 11.084 10.5859 11.3867 10.5859 11.7676C10.5859 12.168 10.8984 12.4609 11.2988 12.4609L12.6855 12.4609L12.6855 18.0957L11.1328 18.0957C10.7324 18.0957 10.4199 18.3984 10.4199 18.7793C10.4199 19.1797 10.7324 19.4727 11.1328 19.4727ZM13.0664 9.07227C13.8184 9.07227 14.4043 8.48633 14.4043 7.74414C14.4043 7.00195 13.8184 6.40625 13.0664 6.40625C12.334 6.40625 11.7383 7.00195 11.7383 7.74414C11.7383 8.48633 12.334 9.07227 13.0664 9.07227Z" fill="currentColor" fill-opacity="0.85"/></g>
    </svg>
  );
}

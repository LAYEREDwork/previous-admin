interface SFSymbolMoonCircleFillProps {
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
 * MoonCircleFill Icon Component
 *
 * A custom SVG icon from SF Symbols.
 * Follows the same API conventions as React Icons library components.
 *
 * @param {SFSymbolMoonCircleFillProps} props - Component props
 * @returns {JSX.Element} The SVG icon element
 *
 * @example
 * // Basic usage
 * <SFSymbolMoonCircleFill size={24} color="currentColor" />
 *
 * @example
 * // With custom styling
 * <SFSymbolMoonCircleFill size={32} color="#ff0000" className="custom-class" />
 */
export function SFSymbolMoonCircleFill({
  size = 24,
  color = 'currentColor',
  className = '',
  strokeWidth = 1,
  ...rest
}: SFSymbolMoonCircleFillProps): JSX.Element {
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
      <g><rect height="25.459" opacity="0" width="25.8008" x="0" y="0"/><path d="M12.7148 25.459C19.7266 25.459 25.4395 19.7461 25.4395 12.7344C25.4395 5.73242 19.7266 0.0195312 12.7148 0.0195312C5.71289 0.0195312 0 5.73242 0 12.7344C0 19.7461 5.71289 25.459 12.7148 25.459Z" fill="white" fill-opacity="0.2125"/><path d="M12.8223 20.2734C8.78906 20.2734 5.51758 16.9922 5.51758 12.9785C5.51758 9.77539 7.57812 7.26562 9.93164 6.25977C10.3711 6.09375 10.6641 6.34766 10.4883 6.80664C10.2148 7.5 10.0293 8.35938 10.0293 9.20898C10.0293 13.457 12.4316 15.8691 16.6797 15.8691C17.5586 15.8691 18.457 15.6641 18.9453 15.4785C19.3457 15.3516 19.6191 15.6445 19.4141 16.0547C18.3105 18.457 15.8398 20.2734 12.8223 20.2734Z" fill="white" fill-opacity="0.85"/></g>
    </svg>
  );
}

interface SFSymbolRestartCircleProps {
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
 * RestartCircle Icon Component
 *
 * A custom SVG icon from SF Symbols.
 * Follows the same API conventions as React Icons library components.
 *
 * @param {SFSymbolRestartCircleProps} props - Component props
 * @returns {JSX.Element} The SVG icon element
 *
 * @example
 * // Basic usage
 * <SFSymbolRestartCircle size={24} color="currentColor" />
 *
 * @example
 * // With custom styling
 * <SFSymbolRestartCircle size={32} color="#ff0000" className="custom-class" />
 */
export function SFSymbolRestartCircle({
  size = 24,
  color = 'currentColor',
  className = '',
  strokeWidth = 1,
  ...rest
}: SFSymbolRestartCircleProps): JSX.Element {
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
      <g><rect height="25.459" opacity="0" width="25.8008" x="0" y="0"/><path d="M12.7148 25.4395C19.7363 25.4395 25.4395 19.7461 25.4395 12.7246C25.4395 5.70312 19.7363 0 12.7148 0C5.69336 0 0 5.70312 0 12.7246C0 19.7461 5.69336 25.4395 12.7148 25.4395ZM12.7148 23.623C6.68945 23.623 1.81641 18.75 1.81641 12.7246C1.81641 6.69922 6.68945 1.82617 12.7148 1.82617C18.7402 1.82617 23.6133 6.69922 23.6133 12.7246C23.6133 18.75 18.7402 23.623 12.7148 23.623Z" fill="white" fill-opacity="0.425"/><path d="M7.04102 11.5234C6.09375 12.0898 6.11328 13.3789 7.02148 13.9258L14.502 18.3789C15.3711 18.8965 16.5625 18.5254 16.5625 17.3242L16.5625 8.0957C16.5625 6.88477 15.3711 6.52344 14.502 7.04102ZM8.63281 12.5781L14.5605 9.0332C14.7266 8.93555 14.834 9.00391 14.834 9.12109L14.834 16.2891C14.834 16.416 14.7266 16.4844 14.5605 16.3867L8.64258 12.8711C8.50586 12.793 8.52539 12.6562 8.63281 12.5781Z" fill="white" fill-opacity="0.85"/></g>
    </svg>
  );
}

interface SFSymbolDesktopcomputerProps {
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
 * Desktopcomputer Icon Component
 *
 * A custom SVG icon from SF Symbols.
 * Follows the same API conventions as React Icons library components.
 *
 * @param {SFSymbolDesktopcomputerProps} props - Component props
 * @returns {JSX.Element} The SVG icon element
 *
 * @example
 * // Basic usage
 * <SFSymbolDesktopcomputer size={24} color="currentColor" />
 *
 * @example
 * // With custom styling
 * <SFSymbolDesktopcomputer size={32} color="#ff0000" className="custom-class" />
 */
export function SFSymbolDesktopcomputer({
  size = 24,
  color = 'currentColor',
  className = '',
  strokeWidth = 1,
  ...rest
}: SFSymbolDesktopcomputerProps): JSX.Element {
  const numSize = typeof size === 'string' ? parseInt(size, 10) : size;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 29.9902 25.791"
      width={numSize}
      height={numSize}
      fill={color}
      strokeWidth={strokeWidth}
      className={className}
      {...rest}
    >
      <g><rect height="25.791" opacity="0" width="29.9902" x="0" y="0"/><path d="M2.30469 16.0742C1.91406 16.0742 1.72852 15.9082 1.72852 15.4883L1.72852 3.44727C1.72852 2.90039 2.07031 2.55859 2.61719 2.55859L27.0117 2.55859C27.5586 2.55859 27.9004 2.90039 27.9004 3.44727L27.9004 15.4883C27.9004 15.9082 27.7148 16.0742 27.3242 16.0742Z" fill="white" fill-opacity="0.2125"/><path d="M2.57812 21.4258L27.0508 21.4258C28.6523 21.4258 29.6289 20.4492 29.6289 18.8477L29.6289 3.4082C29.6289 1.80664 28.6523 0.830078 27.0508 0.830078L2.57812 0.830078C0.976562 0.830078 0 1.80664 0 3.4082L0 18.8477C0 20.4492 0.976562 21.4258 2.57812 21.4258ZM2.30469 16.0742C1.91406 16.0742 1.72852 15.9082 1.72852 15.4883L1.72852 3.44727C1.72852 2.90039 2.07031 2.55859 2.61719 2.55859L27.0117 2.55859C27.5586 2.55859 27.9004 2.90039 27.9004 3.44727L27.9004 15.4883C27.9004 15.9082 27.7148 16.0742 27.3242 16.0742ZM10.9082 24.541L18.7207 24.541L18.7207 21.2695L10.9082 21.2695ZM10.7812 25.791L18.8477 25.791C19.3262 25.791 19.7168 25.4102 19.7168 24.9316C19.7168 24.4434 19.3262 24.0527 18.8477 24.0527L10.7812 24.0527C10.3027 24.0527 9.91211 24.4434 9.91211 24.9316C9.91211 25.4102 10.3027 25.791 10.7812 25.791Z" fill="white" fill-opacity="0.85"/></g>
    </svg>
  );
}

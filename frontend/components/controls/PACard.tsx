import { ReactNode, useState, useEffect } from 'react';
import { BiChevronUp, BiChevronDown } from 'react-icons/bi';

interface PACardProps {
  children?: ReactNode;
  className?: string;
  header?: ReactNode;
  style?: React.CSSProperties;
  bgColorScheme?: 'default' | 'danger' | 'info' | 'warning' | 'surface';
  collapsible?: boolean;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onToggle?: (expanded: boolean) => void;
}

/**
 * PACard - Card component with consistent styling
 * @param children - Content to display inside the card
 * @param className - Additional CSS classes
 * @param header - Header content for the card
 * @param style - Optional inline styles (overrides default backgroundColor)
 * @param bgColorScheme - Color scheme for the card background ('default', 'danger', 'info', 'warning', or 'surface')
 * @param collapsible - Whether the card can be collapsed/expanded (default: false)
 * @param expanded - Controlled expanded state when collapsible
 * @param defaultExpanded - Initial expanded state when collapsible (default: true)
 * @param onToggle - Callback when the card is expanded or collapsed
 */
export function PACard({
  children,
  className = '',
  header,
  style,
  bgColorScheme = 'default',
  collapsible = false,
  expanded,
  defaultExpanded = true,
  onToggle
}: PACardProps) {
  const [isExpanded, setIsExpanded] = useState(expanded !== undefined ? expanded : defaultExpanded);

  // Update internal state when expanded prop changes
  useEffect(() => {
    if (expanded !== undefined) {
      setIsExpanded(expanded);
    }
  }, [expanded]);

  const handleToggle = () => {
    if (expanded === undefined) {
      // Uncontrolled mode
      const nextState = !isExpanded;
      setIsExpanded(nextState);
      onToggle?.(nextState);
    } else {
      // Controlled mode
      onToggle?.(!expanded);
    }
  };

  // Define color schemes using RSuite CSS variables for consistent light/dark mode support
  const colorSchemes = {
    default: {
      backgroundColor: 'var(--rs-bg-card)',
      borderColor: 'var(--rs-border-primary)'
    },
    surface: {
      backgroundColor: 'color-mix(in srgb, var(--rs-bg-card), white 3%)',
      borderColor: 'var(--rs-border-primary)'
    },
    danger: {
      backgroundColor: 'color-mix(in srgb, var(--rs-message-error-bg), transparent var(--pa-message-bg-transparency))',
      borderColor: 'var(--rs-message-error-border)',
      textColor: 'var(--rs-message-error-text)'
    },
    info: {
      backgroundColor: 'color-mix(in srgb, var(--rs-message-info-bg), transparent var(--pa-message-bg-transparency))',
      borderColor: 'var(--rs-message-info-border)',
      textColor: 'var(--rs-message-info-text)'
    },
    warning: {
      backgroundColor: 'color-mix(in srgb, var(--rs-message-warning-bg), transparent var(--pa-message-bg-transparency))',
      borderColor: 'var(--rs-message-warning-border)',
      textColor: 'var(--rs-message-warning-text)'
    }
  };

  const scheme = colorSchemes[bgColorScheme];

  // Build final style
  const finalStyle = {
    backgroundColor: scheme.backgroundColor,
    border: `1px solid ${scheme.borderColor}`,
    borderRadius: '6px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    ...style
  } as React.CSSProperties;

  // Build header with optional collapse toggle
  const headerContent = collapsible ? (
    <div className="flex items-center justify-between w-full cursor-pointer py-2 px-4" onClick={handleToggle}>
      <div className="flex items-center gap-2 flex-1">{header}</div>
      <div className="flex-shrink-0 ml-2 flex items-center">
        {isExpanded ? <BiChevronUp size={24} /> : <BiChevronDown size={24} />}
      </div>
    </div>
  ) : (
    header ? <div className="py-2 px-3">{header}</div> : null
  );

  // Check if header border should be shown (when body is visible)
  const showHeaderBorder = false; // Border between header and content disabled

  return (
    <div className={`pa-card ${className}`} style={finalStyle}>
      {/* Header */}
      {headerContent && (
        <div
          className="pa-card-header"
          style={{
            borderBottom: showHeaderBorder ? `1px solid ${scheme.borderColor}` : 'none',
            transition: 'border-bottom 0.2s ease-out'
          }}
        >
          {headerContent}
        </div>
      )}

      {/* Body - with animation for collapsible cards */}
      {collapsible ? (
        <div
          style={{
            display: 'grid',
            gridTemplateRows: isExpanded ? '1fr' : '0fr',
            transition: 'grid-template-rows 0.2s ease-out'
          }}
        >
          <div style={{ overflow: 'hidden' }}>
            {children && (
              <div className="pa-card-body p-4">
                {children}
              </div>
            )}
          </div>
        </div>
      ) : (
        children && (
          <div className="pa-card-body p-4">
            {children}
          </div>
        )
      )}
    </div>
  );
}

import { ReactNode, useState, useEffect } from 'react';
import { Panel } from 'rsuite';
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
 * PACard - RSuite Panel with consistent styling
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
  
  // Build final style that works for both light and dark mode using RSuite variables
  const finalStyle = {
    backgroundColor: scheme.backgroundColor,
    borderColor: scheme.borderColor,
    ...style
  } as React.CSSProperties;

  // Build header with optional collapse toggle
  const headerContent = collapsible ? (
    <div className="flex items-center justify-between w-full cursor-pointer py-2 px-4" onClick={handleToggle}>
      <div className="flex items-center gap-2 flex-1 min-h-[24px]">{header}</div>
      <div className="flex-shrink-0 ml-2 flex items-center">
        {isExpanded ? <BiChevronUp size={20} /> : <BiChevronDown size={20} />}
      </div>
    </div>
  ) : (
    header ? <div className="py-2 px-4 leading-none">{header}</div> : null
  );

  return (
    <Panel
      header={headerContent}
      className={`pa-card ${className}`}
      style={finalStyle}
      bordered
    >
      {/* Animated collapse/expand content */}
      {collapsible ? (
        <div
          className="grid transition-[grid-template-rows,opacity] duration-300 ease-in-out"
          style={{
            gridTemplateRows: isExpanded ? '1fr' : '0fr',
            opacity: isExpanded ? 1 : 0,
          }}
        >
          <div className="overflow-hidden">{children}</div>
        </div>
      ) : (
        children
      )}
    </Panel>
  );
}

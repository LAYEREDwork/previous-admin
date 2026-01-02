import { ReactNode, useState } from 'react';
import { Panel } from 'rsuite';
import { BiChevronUp, BiChevronDown } from 'react-icons/bi';

interface PACardProps {
  children?: ReactNode;
  className?: string;
  header?: ReactNode;
  style?: React.CSSProperties;
  bgColorScheme?: 'default' | 'danger' | 'info' | 'warning';
  collapsible?: boolean;
  defaultExpanded?: boolean;
  onToggle?: (expanded: boolean) => void;
}

/**
 * PACard - RSuite Panel with consistent styling
 * @param children - Content to display inside the card
 * @param className - Additional CSS classes
 * @param header - Header content for the card
 * @param style - Optional inline styles (overrides default backgroundColor)
 * @param bgColorScheme - Color scheme for the card background ('default', 'danger', or 'info')
 * @param collapsible - Whether the card can be collapsed/expanded (default: false)
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
  defaultExpanded = true,
  onToggle
}: PACardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    const nextState = !isExpanded;
    setIsExpanded(nextState);
    onToggle?.(nextState);
  };
  
  // Define color schemes using RSuite CSS variables for consistent light/dark mode support
  const colorSchemes = {
    default: {
      backgroundColor: 'var(--rs-bg-card)',
      borderColor: 'var(--rs-border-primary)'
    },
    danger: {
      backgroundColor: 'var(--rs-bg-error)',
      borderColor: 'var(--rs-border-error)'
    },
    info: {
      backgroundColor: 'var(--rs-bg-info)',
      borderColor: 'var(--rs-border-info)'
    },
    warning: {
      backgroundColor: 'var(--rs-bg-warning)',
      borderColor: 'var(--rs-border-warning)'
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
    <div className="flex items-center justify-between w-full cursor-pointer" onClick={handleToggle}>
      <div className="flex items-center gap-2 flex-1">{header}</div>
      <div className="flex-shrink-0 ml-2">
        {isExpanded ? <BiChevronUp size={20} /> : <BiChevronDown size={20} />}
      </div>
    </div>
  ) : (
    header
  );

  return (
    <Panel
      header={headerContent}
      className={className}
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

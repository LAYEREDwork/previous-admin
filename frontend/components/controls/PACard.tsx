import { ReactNode } from 'react';
import { Panel } from 'rsuite';

interface PACardProps {
  children?: ReactNode;
  className?: string;
  header?: ReactNode;
}

/**
 * PACard - RSuite Panel with consistent styling
 */
export function PACard({ children, className = '', header }: PACardProps) {
  return (
    <Panel
      header={header}
      className={className}
      bordered
    >
      {children}
    </Panel>
  );
}

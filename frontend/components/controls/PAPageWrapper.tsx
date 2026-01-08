import { ReactNode } from 'react';

/**
 * Wrapper component for page content with consistent spacing.
 */
interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

export function PageWrapper({ children, className = 'space-y-6' }: PageWrapperProps) {
  return <div className={className}>{children}</div>;
}
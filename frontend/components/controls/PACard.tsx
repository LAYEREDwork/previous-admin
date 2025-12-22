import { ReactNode } from 'react';

interface PACardProps {
  children: ReactNode;
  className?: string;
}

export function PACard({ children, className = '' }: PACardProps) {
  return (
    <div className={`bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );
}

interface PACardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function PACardHeader({ children, className = '' }: PACardHeaderProps) {
  return (
    <div className={`p-4 sm:p-6 ${className}`}>
      {children}
    </div>
  );
}

interface PACardTitleProps {
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function PACardTitle({ children, icon, className = '' }: PACardTitleProps) {
  return (
    <h3 className={`text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 ${className}`}>
      {icon}
      {children}
    </h3>
  );
}

interface PACardContentProps {
  children: ReactNode;
  className?: string;
}

export function PACardContent({ children, className = '' }: PACardContentProps) {
  return (
    <div className={`p-4 sm:p-6 ${className}`}>
      {children}
    </div>
  );
}

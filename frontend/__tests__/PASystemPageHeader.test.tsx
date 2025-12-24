import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SystemPageHeader } from '../components/pages/system/PASystemPageHeader';
import type { Translations } from '../lib/translations';

const mockTranslation: Translations = {
  system: {
    title: 'System Information',
    subtitle: 'Monitor your system status and performance',
  },
} as Translations;

describe('SystemPageHeader', () => {
  it('should render the system title', () => {
    render(<SystemPageHeader translation={mockTranslation} />);
    expect(screen.getByText('System Information')).toBeInTheDocument();
  });

  it('should render the system subtitle', () => {
    render(<SystemPageHeader translation={mockTranslation} />);
    expect(screen.getByText('Monitor your system status and performance')).toBeInTheDocument();
  });

  it('should have correct heading structure', () => {
    render(<SystemPageHeader translation={mockTranslation} />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('System Information');
  });

  it('should have correct CSS classes', () => {
    render(<SystemPageHeader translation={mockTranslation} />);
    const titleElement = screen.getByText('System Information');
    expect(titleElement).toHaveClass('text-2xl', 'font-bold', 'text-gray-900', 'dark:text-gray-100', 'mb-2');
  });
});
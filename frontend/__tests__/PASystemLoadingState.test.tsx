import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SystemLoadingState } from '../components/pages/system/PASystemLoadingState';
import type { Translations } from '../lib/translations';

const mockTranslation: Translations = {
  system: {
    loading: 'Loading system information...',
  },
} as Translations;

describe('SystemLoadingState', () => {
  it('should render loading text', () => {
    render(<SystemLoadingState translation={mockTranslation} />);
    expect(screen.getByText('Loading system information...')).toBeInTheDocument();
  });

  it('should render spinning refresh icon', () => {
    render(<SystemLoadingState translation={mockTranslation} />);
    const icon = document.querySelector('.animate-spin');
    expect(icon).toBeInTheDocument();
  });

  it('should have correct text color', () => {
    render(<SystemLoadingState translation={mockTranslation} />);
    const textContainer = screen.getByText('Loading system information...').closest('div');
    expect(textContainer).toHaveClass('text-[var(--rs-primary-500)]');
  });
});
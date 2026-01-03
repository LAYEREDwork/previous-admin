import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { SystemErrorState } from '../components/pages/system/PASystemErrorState';
import type { Translations } from '../lib/translations';

const mockTranslation: Translations = {
  system: {
    errorLoading: 'Error loading system information',
  },
} as Translations;

describe('SystemErrorState', () => {
  it('should render error message', () => {
    render(<SystemErrorState translation={mockTranslation} />);
    expect(screen.getByText('Error loading system information')).toBeInTheDocument();
  });

  it('should render error icon', () => {
    render(<SystemErrorState translation={mockTranslation} />);
    const icon = document.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should have correct text styling', () => {
    render(<SystemErrorState translation={mockTranslation} />);
    const textContainer = screen.getByText('Error loading system information').closest('div');
    expect(textContainer).toHaveClass('text-[var(--rs-text-error)]');
  });
});
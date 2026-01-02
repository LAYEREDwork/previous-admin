import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SystemEmptyState } from '../components/pages/system/PASystemEmptyState';

describe('SystemEmptyState', () => {
  it('should render empty state message', () => {
    render(<SystemEmptyState />);
    expect(screen.getByText('Unable to load system information')).toBeInTheDocument();
  });

  it('should have correct text styling', () => {
    render(<SystemEmptyState />);
    const textContainer = screen.getByText('Unable to load system information').closest('div');
    expect(textContainer).toHaveClass('text-[var(--rs-text-secondary)]');
  });
});
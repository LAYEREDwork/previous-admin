import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SystemEmptyState } from '../components/pages/system/PASystemEmptyState';

describe('SystemEmptyState', () => {
  it('should render empty state message', () => {
    render(<SystemEmptyState />);
    expect(screen.getByText('Unable to load system information')).toBeInTheDocument();
  });

  it('should have correct container styling', () => {
    render(<SystemEmptyState />);
    const container = screen.getByText('Unable to load system information').parentElement?.parentElement;
    expect(container).toHaveClass('bg-white', 'dark:bg-gray-800', 'rounded-lg', 'shadow-md', 'border', 'border-gray-200', 'dark:border-gray-700', 'p-6');
  });

  it('should have correct text styling', () => {
    render(<SystemEmptyState />);
    const textContainer = screen.getByText('Unable to load system information').closest('div');
    expect(textContainer).toHaveClass('text-gray-600', 'dark:text-gray-400');
  });
});
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PAErrorBoundary } from '../components/PAErrorBoundary';

describe('PAErrorBoundary', () => {
  // Component that throws an error
  const ErrorComponent = () => {
    throw new Error('Test error');
  };

  // Component that renders normally
  const NormalComponent = () => <div>Normal content</div>;

  it('should render children when no error occurs', () => {
    render(
      <PAErrorBoundary>
        <NormalComponent />
      </PAErrorBoundary>
    );

    expect(screen.getByText('Normal content')).toBeInTheDocument();
  });

  it('should render fallback UI when an error occurs', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <PAErrorBoundary>
        <ErrorComponent />
      </PAErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/Test error/)).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('should render custom fallback when provided', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <PAErrorBoundary fallback={<div>Custom error message</div>}>
        <ErrorComponent />
      </PAErrorBoundary>
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('should maintain error state when children change', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { rerender } = render(
      <PAErrorBoundary>
        <ErrorComponent />
      </PAErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    // Rerender with normal component - error boundary should still show error
    rerender(
      <PAErrorBoundary>
        <NormalComponent />
      </PAErrorBoundary>
    );

    // Should still show error UI, not normal content
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.queryByText('Normal content')).not.toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
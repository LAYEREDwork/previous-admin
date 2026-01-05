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

  it('should render RSuite Loader component', () => {
    render(<SystemLoadingState translation={mockTranslation} />);
    // RSuite Loader renders as a div with class rs-loader-box
    const loader = document.querySelector('.rs-loader-box');
    expect(loader).toBeInTheDocument();
  });

  it('should have correct layout with flex center', () => {
    const { container } = render(<SystemLoadingState translation={mockTranslation} />);
    const flexContainer = container.querySelector('.flex.items-center.justify-center');
    expect(flexContainer).toBeInTheDocument();
  });
});
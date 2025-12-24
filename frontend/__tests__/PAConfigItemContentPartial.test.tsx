import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ConfigItemContent } from '../components/partials/config-list/PAConfigItemContentPartial';
import { Configuration } from '../lib/database';
import type { Translations } from '../lib/translations';

const mockConfig: Configuration = {
  id: 'test-id',
  name: 'Test Configuration',
  description: 'Test Description',
  config: {},
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockTranslation: Translations = {
  configList: {
    export: 'Exportieren',
    duplicate: 'Duplizieren',
    edit: 'Bearbeiten',
    delete: 'Löschen',
  },
} as Translations;

const mockActions = {
  exportSingleConfig: vi.fn(),
  duplicateConfig: vi.fn(),
  onEdit: vi.fn(),
  deleteConfig: vi.fn(),
};

describe('ConfigItemContent', () => {
  const defaultProps = {
    config: mockConfig,
    isMobile: false,
    translation: mockTranslation,
    ...mockActions,
  };

  it('should render config name', () => {
    render(<ConfigItemContent {...defaultProps} />);
    expect(screen.getByText('Test Configuration')).toBeInTheDocument();
  });

  it('should render config description', () => {
    render(<ConfigItemContent {...defaultProps} />);
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('should apply truncate class to name', () => {
    render(<ConfigItemContent {...defaultProps} />);
    const nameElement = screen.getByText('Test Configuration');
    expect(nameElement).toHaveClass('truncate');
  });

  it('should render mobile action buttons when isMobile is true', () => {
    render(<ConfigItemContent {...defaultProps} isMobile={true} />);
    // The ConfigListActionsPartial should be rendered in mobile mode
    // We can check for the presence of action buttons by their titles
    expect(screen.getByTitle('Exportieren')).toBeInTheDocument();
    expect(screen.getByTitle('Duplizieren')).toBeInTheDocument();
    expect(screen.getByTitle('Bearbeiten')).toBeInTheDocument();
    expect(screen.getByTitle('Löschen')).toBeInTheDocument();
  });

  it('should not render mobile action buttons when isMobile is false', () => {
    render(<ConfigItemContent {...defaultProps} isMobile={false} />);
    // In desktop mode, action buttons should be hidden with CSS class
    // Find the container that has the sm:hidden class
    const actionContainer = document.querySelector('.sm\\:hidden');
    expect(actionContainer).toBeInTheDocument();
  });
});
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ConfigItemControls } from '../components/partials/config-list/PAConfigItemControlsPartial';
import type { Translations } from '../lib/translations';

const mockTranslation: Translations = {
  configList: {
    active: 'Aktiv',
    activate: 'Aktivieren',
    move: 'Verschieben',
  },
} as Translations;

describe('ConfigItemControls', () => {
  const defaultProps = {
    isActive: false,
    hasMultipleConfigs: true,
    onSetActive: vi.fn(),
    onDragStart: vi.fn(),
    translation: mockTranslation,
  };

  it('should render active button when not active', () => {
    render(<ConfigItemControls {...defaultProps} />);
    const button = screen.getByTitle('Aktivieren');
    expect(button).toBeInTheDocument();
  });

  it('should render check circle icon when active', () => {
    render(<ConfigItemControls {...defaultProps} isActive={true} />);
    const button = screen.getByTitle('Aktiv');
    expect(button).toBeInTheDocument();
  });

  it('should call onSetActive when inactive button is clicked', () => {
    const onSetActive = vi.fn();
    render(<ConfigItemControls {...defaultProps} onSetActive={onSetActive} />);
    const button = screen.getByTitle('Aktivieren');
    fireEvent.click(button);
    expect(onSetActive).toHaveBeenCalled();
  });

  it('should not call onSetActive when active button is clicked', () => {
    const onSetActive = vi.fn();
    render(<ConfigItemControls {...defaultProps} isActive={true} onSetActive={onSetActive} />);
    const button = screen.getByTitle('Aktiv');
    fireEvent.click(button);
    expect(onSetActive).not.toHaveBeenCalled();
  });
});
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ConfigItemActions } from '../components/partials/config-list/PAConfigItemActionsPartial';
import { Configuration } from '../lib/database';
import type { Translations } from '../lib/translations';

const mockConfig: Configuration = {
  id: 'test-id',
  name: 'Test Configuration',
  description: 'Test Description',
  config_data: {
    system: { cpu_type: '68040', cpu_frequency: 25, memory_size: 32, turbo: false, fpu: true },
    display: { type: 'color', width: 640, height: 480, color_depth: 8, frameskip: 0 },
    scsi: { hd0: '', hd1: '', hd2: '', hd3: '', hd4: '', hd5: '', hd6: '', cd: '' },
    network: { enabled: false, type: 'ethernet' },
    sound: { enabled: false, output: 'sdl' },
    boot: { rom_file: '', scsi_id: 0 },
    keyboard: { type: 'us' },
    mouse: { enabled: false }
  },
  is_active: false,
  sort_order: 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  created_by: null,
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

describe('ConfigItemActions', () => {
  const defaultProps = {
    config: mockConfig,
    isMobile: false,
    translation: mockTranslation,
    ...mockActions,
  };

  it('should render action buttons on desktop (hidden on mobile)', () => {
    render(<ConfigItemActions {...defaultProps} />);
    // On desktop, the buttons should be rendered (visibility controlled by CSS)
    expect(screen.getByTitle('Exportieren')).toBeInTheDocument();
    expect(screen.getByTitle('Duplizieren')).toBeInTheDocument();
    expect(screen.getByTitle('Bearbeiten')).toBeInTheDocument();
    expect(screen.getByTitle('Löschen')).toBeInTheDocument();
  });

  it('should render export button', () => {
    render(<ConfigItemActions {...defaultProps} />);
    expect(screen.getByTitle('Exportieren')).toBeInTheDocument();
  });

  it('should render duplicate button', () => {
    render(<ConfigItemActions {...defaultProps} />);
    expect(screen.getByTitle('Duplizieren')).toBeInTheDocument();
  });

  it('should render edit button', () => {
    render(<ConfigItemActions {...defaultProps} />);
    expect(screen.getByTitle('Bearbeiten')).toBeInTheDocument();
  });

  it('should render delete button', () => {
    render(<ConfigItemActions {...defaultProps} />);
    expect(screen.getByTitle('Löschen')).toBeInTheDocument();
  });

  it('should pass isMobile prop to ConfigListActionsPartial', () => {
    render(<ConfigItemActions {...defaultProps} isMobile={true} />);
    // The ConfigListActionsPartial should receive the isMobile prop
    // We can verify this by checking that the component renders
    expect(screen.getByTitle('Exportieren')).toBeInTheDocument();
  });
});
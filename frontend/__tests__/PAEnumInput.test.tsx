/**
 * Tests for PAEnumInput component
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import type { ParameterSchema } from '@shared/previous-config/schema-types';

import { PAEnumInput } from '../components/controls/config-inputs/PAEnumInput';

describe('PAEnumInput', () => {
  const mockSchema: ParameterSchema = {
    name: 'boot_rom',
    type: 'enum',
    possibleValues: ['rev1.bin', 'rev2.bin', 'rev3.bin'],
    labels: ['Revision 1', 'Revision 2', 'Revision 3'],
    default: 'rev2.bin',
    displayName: 'Boot ROM',
    description: 'Select boot ROM revision',
    required: false,
  };
  
  it('renders SelectPicker with correct options', () => {
    render(
      <PAEnumInput
        schema={mockSchema}
        value="rev2.bin"
        onChange={() => {}}
      />
    );
    
    // SelectPicker should be present
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
  
  it('displays current value', () => {
    render(
      <PAEnumInput
        schema={mockSchema}
        value="rev2.bin"
        onChange={() => {}}
      />
    );
    
    // Should show the label for the selected value
    expect(screen.getByText('Revision 2')).toBeInTheDocument();
  });
  
  it('calls onChange when option is selected', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    
    render(
      <PAEnumInput
        schema={mockSchema}
        value="rev1.bin"
        onChange={handleChange}
      />
    );
    
    const picker = screen.getByRole('combobox');
    await user.click(picker);
    
    // Select different option
    const option = screen.getByText('Revision 3');
    await user.click(option);
    
    expect(handleChange).toHaveBeenCalledWith('rev3.bin');
  });
  
  it('uses raw values when labels are not provided', () => {
    const schemaWithoutLabels: ParameterSchema = {
      ...mockSchema,
      labels: undefined,
    };
    
    render(
      <PAEnumInput
        schema={schemaWithoutLabels}
        value="rev2.bin"
        onChange={() => {}}
      />
    );
    
    // Should display the raw value
    expect(screen.getByText('rev2.bin')).toBeInTheDocument();
  });
  
  it('is disabled when disabled prop is true', () => {
    render(
      <PAEnumInput
        schema={mockSchema}
        value="rev1.bin"
        onChange={() => {}}
        disabled={true}
      />
    );
    
    const picker = screen.getByRole('combobox');
    expect(picker).toHaveAttribute('aria-disabled', 'true');
  });
});

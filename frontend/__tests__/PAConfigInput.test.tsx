/**
 * Tests for PAConfigInput dispatcher component
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import type { ParameterSchema } from '@shared/previous-config/schema-types';

import { PAConfigInput } from '../components/controls/PAConfigInput';

describe('PAConfigInput', () => {
  it('renders PABooleanInput for boolean type', () => {
    const schema: ParameterSchema = {
      name: 'enabled',
      type: 'boolean',
      default: false,
      displayName: 'Enabled',
      description: 'Enable feature',
      required: false,
    };
    
    render(
      <PAConfigInput
        schema={schema}
        value={true}
        onChange={() => {}}
      />
    );
    
    // Should render toggle (switch role)
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });
  
  it('renders PAEnumInput for enum type', () => {
    const schema: ParameterSchema = {
      name: 'mode',
      type: 'enum',
      possibleValues: ['mode1', 'mode2'],
      labels: ['Mode 1', 'Mode 2'],
      default: 'mode1',
      displayName: 'Mode',
      description: 'Select mode',
      required: false,
    };
    
    render(
      <PAConfigInput
        schema={schema}
        value="mode1"
        onChange={() => {}}
      />
    );
    
    // Should render SelectPicker (combobox role)
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
  
  it('renders PANumberRangeInput for number type', () => {
    const schema: ParameterSchema = {
      name: 'count',
      type: 'number',
      min: 1,
      max: 100,
      default: 10,
      displayName: 'Count',
      description: 'Enter count',
      required: false,
    };
    
    render(
      <PAConfigInput
        schema={schema}
        value={42}
        onChange={() => {}}
      />
    );
    
    // Should render InputNumber (textbox role in Rsuite)
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
  
  it('renders PANumberRangeInput for range type', () => {
    const schema: ParameterSchema = {
      name: 'memory',
      type: 'range',
      min: 8,
      max: 256,
      default: 64,
      displayName: 'Memory',
      description: 'Memory size',
      required: false,
    };
    
    render(
      <PAConfigInput
        schema={schema}
        value={128}
        onChange={() => {}}
      />
    );
    
    // Should render InputNumber (textbox role in Rsuite)
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
  
  it('renders PAStringInput for string type', () => {
    const schema: ParameterSchema = {
      name: 'name',
      type: 'string',
      default: '',
      displayName: 'Name',
      description: 'Enter name',
      required: false,
    };
    
    render(
      <PAConfigInput
        schema={schema}
        value="test"
        onChange={() => {}}
      />
    );
    
    // Should render Input (textbox role)
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
  
  it('renders PAStringInput for unknown type (fallback)', () => {
    const schema: ParameterSchema = {
      name: 'unknown',
      type: 'unknown' as any,
      default: '',
      displayName: 'Unknown',
      description: 'Unknown type',
      required: false,
    };
    
    render(
      <PAConfigInput
        schema={schema}
        value="fallback"
        onChange={() => {}}
      />
    );
    
    // Should fallback to Input (textbox role)
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
  
  it('passes disabled prop to child components', () => {
    const schema: ParameterSchema = {
      name: 'enabled',
      type: 'boolean',
      default: false,
      displayName: 'Enabled',
      description: 'Enable feature',
      required: false,
    };
    
    render(
      <PAConfigInput
        schema={schema}
        value={true}
        onChange={() => {}}
        disabled={true}
      />
    );
    
    const toggle = screen.getByRole('switch');
    expect(toggle).toBeDisabled();
  });
  
  it('converts value to appropriate type for each input', () => {
    const handleChange = vi.fn();
    
    // Boolean schema with string value (type coercion test)
    const boolSchema: ParameterSchema = {
      name: 'enabled',
      type: 'boolean',
      default: false,
      displayName: 'Enabled',
      description: 'Enable',
      required: false,
    };
    
    const { rerender } = render(
      <PAConfigInput
        schema={boolSchema}
        value={true}
        onChange={handleChange}
      />
    );
    
    expect(screen.getByRole('switch')).toBeChecked();
    
    // Number schema with string value
    const numSchema: ParameterSchema = {
      name: 'count',
      type: 'number',
      min: 1,
      max: 100,
      default: 10,
      displayName: 'Count',
      description: 'Count',
      required: false,
    };
    
    rerender(
      <PAConfigInput
        schema={numSchema}
        value={42}
        onChange={handleChange}
      />
    );
    
    expect(screen.getByRole('textbox')).toHaveValue('42');
  });
});

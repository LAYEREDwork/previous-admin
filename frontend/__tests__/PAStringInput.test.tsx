/**
 * Tests for PAStringInput component
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { PAStringInput } from '../components/controls/config-inputs/PAStringInput';

describe('PAStringInput', () => {
  it('renders input with correct initial value', () => {
    render(
      <PAStringInput
        value="test value"
        onChange={() => {}}
      />
    );
    
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('test value');
  });
  
  it('calls onChange when text is entered', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    
    render(
      <PAStringInput
        value=""
        onChange={handleChange}
      />
    );
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'new text');
    
    // Should be called for each character (check it was called at least once)
    expect(handleChange).toHaveBeenCalled();
  });
  
  it('displays placeholder when provided', () => {
    render(
      <PAStringInput
        value=""
        onChange={() => {}}
        placeholder="Enter value..."
      />
    );
    
    const input = screen.getByPlaceholderText('Enter value...');
    expect(input).toBeInTheDocument();
  });
  
  it('is disabled when disabled prop is true', () => {
    render(
      <PAStringInput
        value="test"
        onChange={() => {}}
        disabled={true}
      />
    );
    
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });
  
  it('is enabled by default', () => {
    render(
      <PAStringInput
        value="test"
        onChange={() => {}}
      />
    );
    
    const input = screen.getByRole('textbox');
    expect(input).not.toBeDisabled();
  });
  
  it('handles empty string value', () => {
    render(
      <PAStringInput
        value=""
        onChange={() => {}}
      />
    );
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('');
  });
  
  it('handles multiline text input', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    
    render(
      <PAStringInput
        value=""
        onChange={handleChange}
      />
    );
    
    const input = screen.getByRole('textbox');
    const multilineText = 'Line 1\nLine 2\nLine 3';
    await user.type(input, multilineText);
    
    // Should be called multiple times for input
    expect(handleChange).toHaveBeenCalled();
  });
});

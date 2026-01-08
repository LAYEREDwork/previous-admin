/**
 * Tests for PABooleanInput component
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { PABooleanInput } from '@frontend/components/controls/config-inputs/PABooleanInput';

describe('PABooleanInput', () => {
  it('renders toggle with correct initial state', () => {
    render(
      <PABooleanInput
        value={true}
        onChange={() => {}}
      />
    );
    
    const toggle = screen.getByRole('switch');
    expect(toggle).toBeInTheDocument();
    expect(toggle).toBeChecked();
  });
  
  it('renders unchecked toggle when value is false', () => {
    render(
      <PABooleanInput
        value={false}
        onChange={() => {}}
      />
    );
    
    const toggle = screen.getByRole('switch');
    expect(toggle).not.toBeChecked();
  });
  
  it('calls onChange when toggled', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    
    render(
      <PABooleanInput
        value={false}
        onChange={handleChange}
      />
    );
    
    const toggle = screen.getByRole('switch');
    await user.click(toggle);
    
    expect(handleChange).toHaveBeenCalledWith(true);
  });
  
  it('is disabled when disabled prop is true', () => {
    render(
      <PABooleanInput
        value={false}
        onChange={() => {}}
        disabled={true}
      />
    );
    
    const toggle = screen.getByRole('switch');
    expect(toggle).toBeDisabled();
  });
  
  it('is enabled by default', () => {
    render(
      <PABooleanInput
        value={false}
        onChange={() => {}}
      />
    );
    
    const toggle = screen.getByRole('switch');
    expect(toggle).not.toBeDisabled();
  });
});

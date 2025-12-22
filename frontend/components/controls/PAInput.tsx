import { ReactNode, RefObject } from 'react';
import { Input, InputGroup } from 'rsuite';
import { PASize } from '../../lib/types/sizes';

export enum PAInputType {
  TEXT = 'text',
  PASSWORD = 'password',
  EMAIL = 'email',
  NUMBER = 'number',
  DATE = 'date',
  DATETIME_LOCAL = 'datetime-local',
  TIME = 'time',
  COLOR = 'color',
  SEARCH = 'search',
  TEL = 'tel',
  URL = 'url',
  WEEK = 'week',
  MONTH = 'month',
  DATETIME = 'datetime',
  RANGE = 'range',
  FILE = 'file',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  SUBMIT = 'submit',
  RESET = 'reset',
  BUTTON = 'button',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
}

type PAInputSize = Extract<PASize, 'sm' | 'md' | 'lg'>;

interface PAInputProps {
  size: PAInputSize;
  value: string;
  onChange: (nextValue: string) => void;
  prefixIcon?: ReactNode;
  suffixButton?: ReactNode;
  onSuffixButtonClick?: () => void;
  suffixDisabled?: boolean;
  className?: string;
  inputId?: string;
  inputRef?: RefObject<HTMLInputElement>;
  inputType?: string;
  placeholder?: string;
  autoComplete?: string;
}

/**
 * PAInput kapselt ein RSuite InputGroup mit optionalem Addon und Button,
 * um den vertieften Neumorph-Look als Drop-in Replacement bereitzustellen.
 */
export function PAInput({
  size,
  value,
  onChange,
  prefixIcon,
  suffixButton,
  onSuffixButtonClick: onSuffixButtonClick,
  suffixDisabled,
  className = '',
  inputId,
  inputRef,
  inputType = PAInputType.TEXT,
  placeholder,
  autoComplete,
}: PAInputProps) {
  const combinedClassName = `recessed-input ${className}`.trim();

  return (
    <InputGroup size={size} className={combinedClassName}>
      {prefixIcon ? (
        <InputGroup.Addon>
          {prefixIcon}
        </InputGroup.Addon>
      ) : null}
      <Input
        id={inputId}
        inputRef={inputRef}
        type={inputType}
        value={value}
        onChange={(nextValue) => onChange(nextValue)}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
      {suffixButton ? (
        <InputGroup.Button onClick={onSuffixButtonClick} disabled={suffixDisabled}>
          {suffixButton}
        </InputGroup.Button>
      ) : null}
    </InputGroup>
  );
}

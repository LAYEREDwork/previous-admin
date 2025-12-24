/**
 * Global enums for the Previous Admin application
 * Used to avoid magic strings and numbers across frontend and backend
 */

/**
 * CPU types for Previous emulator
 */
export enum CpuType {
  CPU_68020 = '68020',
  CPU_68030 = '68030',
  CPU_68040 = '68040',
}

/**
 * Display types
 */
export enum DisplayType {
  COLOR = 'color',
  GRAYSCALE = 'grayscale',
}

/**
 * Network types
 */
export enum NetworkType {
  ETHERNET = 'ethernet',
  SLIP = 'slip',
}

/**
 * Input types for forms
 */
export enum InputType {
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

/**
 * Sound output types
 */
export enum SoundOutput {
  SDL = 'sdl',
  NONE = 'none',
}

/**
 * Printer types
 */
export enum PrinterType {
  PARALLEL = 'parallel',
  SERIAL = 'serial',
}

/**
 * Keyboard types
 */
export enum KeyboardType {
  US = 'us',
  DE = 'de',
  FR = 'fr',
  GB = 'gb',
}
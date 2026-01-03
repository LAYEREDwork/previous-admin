/**
 * Enums for Previous emulator configuration
 * Used to avoid magic strings and numbers across frontend and backend
 */

/**
 * CPU types for Previous emulator
 */
export enum CpuType {
  cpu68020 = '68020',
  cpu68030 = '68030',
  cpu68040 = '68040',
}

/**
 * Display types
 */
export enum DisplayType {
  color = 'color',
  grayscale = 'grayscale',
}

/**
 * Network types
 */
export enum NetworkType {
  ethernet = 'ethernet',
  slip = 'slip',
}

/**
 * Sound output types
 */
export enum SoundOutput {
  sdl = 'sdl',
  none = 'none',
}

/**
 * Printer types
 */
export enum PrinterType {
  parallel = 'parallel',
  serial = 'serial',
}

/**
 * Keyboard types
 */
export enum KeyboardType {
  us = 'us',
  de = 'de',
  fr = 'fr',
  gb = 'gb',
}

/**
 * Input types for forms
 */
export enum InputType {
  text = 'text',
  password = 'password',
  email = 'email',
  number = 'number',
  date = 'date',
  datetimeLocal = 'datetime-local',
  time = 'time',
  color = 'color',
  search = 'search',
  tel = 'tel',
  url = 'url',
  week = 'week',
  month = 'month',
  datetime = 'datetime',
  range = 'range',
  file = 'file',
  checkbox = 'checkbox',
  radio = 'radio',
  submit = 'submit',
  reset = 'reset',
  button = 'button',
  image = 'image',
  video = 'video',
  audio = 'audio',
}

/**
 * Styling keys for consistent theming
 */
export enum StylingKey {
  itemBackground = 'itemBackground',
  dragBackground = 'dragBackground',
  activeOverlay = 'activeOverlay',
  buttonBaseColor = 'buttonBaseColor',
  frameShadowLight = 'frameShadowLight',
  frameShadowDark = 'frameShadowDark',
}

/**
 * Shadow effect types
 */
export enum ShadowType {
  frameInset = 'frameInset',
  activeGlow = 'activeGlow',
}

/**
 * Chart types for system monitoring
 */
export enum ChartType {
  cpuLoad = 'cpuLoad',
  memory = 'memory',
  networkTraffic = 'networkTraffic',
  diskIO = 'diskIO',
}

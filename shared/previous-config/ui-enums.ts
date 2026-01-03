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

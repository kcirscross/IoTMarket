/**
 * This file contains the application's variables.
 *
 * Define color, sizes, etc. here instead of duplicating them throughout the components.
 * That allows to change them more easily later on.
 */

/**
 * Colors
 */
export const Colors = {
  transparent: 'rgba(0,0,0,0)',
  inputBackground: '#FFFFFF',
  white: '#FFFFFF',
  black: '#292929',
  //Typography
  textGray800: '#292929',
  textGray400: '#4D4D4D',
  textGray200: '#A1A1A1',
  inverseTextGray800: '#E0E0E0',
  primary: '#7367F0',
  secondary: '#F2FAFF',
  info: '#00CFE8',
  success: '#28C76F',
  error: '#EA5455',
  warn: '#FF9F43',
  gray: '#A8AAAE',
  blue: '#0000FF',
  green: '#008000',
  //ComponentColors
  circleButtonBackground: '#E1E1EF',
  circleButtonColor: '#44427D',
  dropdownBackground: '#F7F7F7',
  segmentViewBackground: '#DEDEDE',
  tableHeaderBackground: '#F5F5F6',
  tableTitleBackground: '#F5F5F6',
  inputBorderColor: '#7F7F7F',
  mailFormBackground: '#e4e5f1',
  accordionHeaderBackground: '#E3E3E3',
  resetButtonBackground: '#fde2e3',
  finishedStepIndicatorBackground: '#7367cc66',
};

export const NavigationColors = {
  primary: Colors.primary,
  background: '#FFFFFF',
  card: '#EFEFEF',
};

/**
 * FontSize
 */
export const FontSize = {
  tiny: 12,
  small: 14,
  regular: 16,
  large: 24,
};

/**
 * Metrics Sizes
 */
const tiny = 10;
const small = tiny * 2; // 20
const regular = tiny * 3; // 30
const large = regular * 2; // 60
export const MetricsSizes = {
  tiny,
  small,
  regular,
  large,
};

export default {
  Colors,
  NavigationColors,
  FontSize,
  MetricsSizes,
};

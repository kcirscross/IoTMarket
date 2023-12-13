/**
 * This file contains all application's style relative to fonts
 */
import { StyleSheet } from 'react-native';
import { Colors, FontSize } from './Variables';

export const Fonts = StyleSheet.create({
  textTiny: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSize.tiny,
    color: Colors.textGray200,
  },
  textSmall: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSize.small,
    color: Colors.textGray400,
  },
  textRegular: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSize.regular,
    color: Colors.textGray800,
  },
  textLarge: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSize.large,
    color: Colors.textGray800,
  },
  textBold: {
    fontFamily: 'Roboto-Regular',
    fontWeight: 'bold',
  },
  textUppercase: {
    textTransform: 'uppercase',
  },
  textCapitalize: {
    textTransform: 'capitalize',
  },
  titleSmall: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSize.small * 1.3,
    fontWeight: 'bold',
    color: Colors.textGray800,
  },
  titleRegular: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSize.regular * 2,
    fontWeight: 'bold',
    color: Colors.textGray800,
  },
  titleLarge: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSize.large * 2,
    fontWeight: 'bold',
    color: Colors.textGray800,
  },
  textCenter: {
    textAlign: 'center',
  },
  textJustify: {
    textAlign: 'justify',
  },
  textLeft: {
    textAlign: 'left',
  },
  textRight: {
    textAlign: 'right',
  },
  textError: {
    color: Colors.error,
  },
  textSuccess: {
    color: Colors.success,
  },
  textPrimary: {
    color: Colors.primary,
  },
  textLight: {
    color: Colors.textGray200,
  },
  textWhite: {
    color: Colors.white,
  },
  textLink: {
    color: '#3366CC',
    textDecorationLine: 'underline',
  },
});

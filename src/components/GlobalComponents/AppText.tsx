import { Fonts } from '@/assets/styles';
import React, { memo } from 'react';
import { Text, TextProps } from 'react-native';

const AppText = ({ children, style, ...restProps }: TextProps) => {
  return (
    <Text style={[Fonts.textRegular, style]} {...restProps}>
      {children}
    </Text>
  );
};

export default memo(AppText);

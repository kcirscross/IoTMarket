import { Fonts, Gutters, globalStyles } from '@/assets/styles';
import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { Input, InputProps } from 'react-native-elements';

interface AppInputProps extends InputProps {}

const AppInput = ({
  label,
  defaultValue,
  inputStyle,
  inputContainerStyle,
  containerStyle,
  renderErrorMessage = false,
  labelStyle,
  ...restProps
}: AppInputProps) => {
  return (
    <Input
      label={label}
      containerStyle={[styles.textContainer, containerStyle]}
      inputContainerStyle={[styles.inputContainer, inputContainerStyle]}
      defaultValue={defaultValue}
      inputStyle={[
        Fonts.textRegular,
        {
          paddingVertical: 0,
        },
        inputStyle,
      ]}
      labelStyle={[Fonts.textRegular, Gutters.tinyBPadding, labelStyle]}
      renderErrorMessage={renderErrorMessage}
      {...restProps}
    />
  );
};

export default memo(AppInput);

const styles = StyleSheet.create({
  textContainer: {
    marginTop: 20,
    paddingHorizontal: 0,
  },
  inputContainer: {
    ...globalStyles.input,
    width: '100%',
    marginTop: 0,
    borderBottomWidth: 0,
    paddingVertical: 5,
  },
});

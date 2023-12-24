import { Gutters, Layout } from '@/assets/styles';
import React, { memo, useCallback, useMemo } from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';
import { RenderBadgeItemPropsInterface } from 'react-native-dropdown-picker';
import IconAnt from 'react-native-vector-icons/AntDesign';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import AppText from '../AppText';

export interface DropDownBadgeItemProps
  extends RenderBadgeItemPropsInterface<any> {
  badgeDotStyle: StyleProp<ViewStyle>;
  badgeStyle: StyleProp<ViewStyle>;
  badgeTextStyle: StyleProp<TextStyle>;
  getBadgeColor: (value: string) => string;
  getBadgeDotColor: (value: string) => string;
  IconComponent: () => JSX.Element;
  label: string;
  onPress: (value: any) => void;
  props: TouchableOpacityProps;
  rtl: boolean;
  showBadgeDot: boolean;
  textStyle: StyleProp<TextStyle>;
  value: any;
}

const DropDownBadgeItem = ({
  rtl,
  label,
  props,
  value,
  textStyle,
  badgeStyle,
  badgeTextStyle,
  badgeDotStyle,
  getBadgeColor,
  getBadgeDotColor,
  showBadgeDot,
  onPress,
}: DropDownBadgeItemProps) => {
  /**
   * onPress.
   */
  const __onPress = useCallback(() => onPress(value), [onPress, value]);

  /**
   * The badge style.
   * @returns {object}
   */
  const _badgeStyle = useMemo(
    () => [
      ...[badgeStyle].flat(),
      {
        backgroundColor: getBadgeColor(value),
      },
    ],
    [rtl, badgeStyle, getBadgeColor],
  );

  /**
   * The badge dot style.
   * @return {object}
   */
  const _badgeDotStyle = useMemo(
    () => [
      ...[badgeDotStyle].flat(),
      {
        backgroundColor: getBadgeDotColor(value),
      },
    ],
    [rtl, badgeDotStyle, getBadgeDotColor],
  );

  /**
   * The badge text style.
   * @returns {object}
   */
  const _badgeTextStyle = useMemo(
    () => [...[textStyle].flat(), ...[badgeTextStyle].flat()],
    [textStyle, badgeTextStyle],
  );

  return (
    <TouchableOpacity
      style={[
        Layout.rowHCenter,
        Layout.maxBorderRadius,
        Gutters.tinyHPadding,
        styles.badgeItem,
        _badgeStyle,
      ]}
      {...props}
      onPress={__onPress}
    >
      {showBadgeDot && <View style={_badgeDotStyle} />}
      <AppText style={_badgeTextStyle}>{label} </AppText>
      <IconAnt name="closecircle" color={Colors.textGray200} size={18} />
    </TouchableOpacity>
  );
};

const areEqual = (nextProps: any, prevProps: any) => {
  if (nextProps.label !== prevProps.label) {
    return false;
  }
  if (nextProps.value !== prevProps.value) {
    return false;
  }
  if (nextProps.showBadgeDot !== prevProps.showBadgeDot) {
    return false;
  }
  if (nextProps.rtl !== prevProps.rtl) {
    return false;
  }
  if (nextProps.theme !== prevProps.theme) {
    return false;
  }

  return true;
};

export default memo(DropDownBadgeItem, areEqual);

const styles = StyleSheet.create({
  badgeItem: { paddingVertical: 5 },
});

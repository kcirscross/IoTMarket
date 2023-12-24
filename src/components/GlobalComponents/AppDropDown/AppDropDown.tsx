import {
  Colors,
  Fonts,
  Gutters,
  Layout,
  MetricsSizes,
  NavigationColors,
} from '@/assets/styles';
import { PRIMARY_COLOR } from '@/components/constants';
import React, { memo } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import DropDownPicker, {
  DropDownPickerProps,
} from 'react-native-dropdown-picker';
import DropDownBadgeItem from './DropDownBadgeItem';
import DropDownListItem, { DropDownListItemProps } from './DropDownListItem';

type AppDropDownProps = DropDownPickerProps<any> & {
  renderedItem?: (itemProps: DropDownListItemProps) => React.JSX.Element;
};

const AppDropDown = ({
  multiple = false,
  mode = 'SIMPLE',
  open,
  value,
  setOpen,
  setValue,
  items,
  setItems,
  placeholder,
  onChangeValue,
  onSelectItem,
  disabled = false,
  style,
  placeholderStyle,
  dropDownContainerStyle,
  listItemContainerStyle,
  listItemLabelStyle,
  selectedItemContainerStyle,
  itemSeparatorStyle,
  onPress,
  disabledStyle,
  maxHeight,
  labelStyle,
  dropDownDirection,
  textStyle,
  renderedItem,
  tickIconStyle,
  renderBadgeItem,
  searchable = false,
  searchContainerStyle,
  searchPlaceholderTextColor,
  searchTextInputStyle,
  modalContentContainerStyle,
  modalTitleStyle,
  ...restProps
}: AppDropDownProps) => {
  const arrowTintColor = {
    tintColor: disabled ? Colors.textGray200 : Colors.textGray800,
  } as ViewStyle;
  const tickTintColor = { tintColor: Colors.textGray800 } as ViewStyle;

  return (
    <DropDownPicker
      mode={mode}
      multiple={multiple}
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      onChangeValue={onChangeValue}
      onSelectItem={onSelectItem as any}
      onPress={onPress}
      placeholder={placeholder}
      placeholderStyle={[
        styles.placeholderStyle,
        Fonts.textRegular,
        { color: Colors.textGray400 },
        placeholderStyle,
      ]}
      disabledStyle={disabledStyle}
      style={[
        Layout.regularDropShadow,
        // eslint-disable-next-line react-native/no-inline-styles
        {
          backgroundColor: Colors.white,
          borderColor: Colors.transparent,
          paddingVertical: MetricsSizes.tiny,
        },
        style,
      ]}
      listMode="SCROLLVIEW"
      itemSeparator
      scrollViewProps={{
        nestedScrollEnabled: true,
      }}
      autoScroll
      arrowIconStyle={[arrowTintColor, styles.arrowIconStyle]}
      showTickIcon
      textStyle={[
        Fonts.textRegular,
        mode === 'BADGE' && { color: Colors.black },
        textStyle,
      ]}
      labelStyle={[
        { color: disabled ? Colors.textGray200 : Colors.textGray800 },
        labelStyle,
      ]}
      dropDownContainerStyle={[
        Layout.regularDropShadow,
        Layout.smallBorderRadius,
        styles.dropDownContainerStyle,
        {
          backgroundColor: Colors.white,
          borderColor: PRIMARY_COLOR,
        },
        dropDownContainerStyle,
      ]}
      iconContainerStyle={Layout.justifyContentCenter}
      itemSeparatorStyle={[
        {
          backgroundColor: PRIMARY_COLOR,
        },
        itemSeparatorStyle,
      ]}
      selectedItemContainerStyle={[
        {
          backgroundColor: Colors.transparent,
        },
        selectedItemContainerStyle,
      ]}
      listItemContainerStyle={[
        styles.listItemContainerStyle,
        listItemContainerStyle,
      ]}
      listItemLabelStyle={[
        {
          color: Colors.textGray800,
          paddingHorizontal: MetricsSizes.tiny,
        },
        listItemLabelStyle,
      ]}
      maxHeight={maxHeight ?? searchable ? 300 : 200}
      disabled={disabled}
      dropDownDirection={dropDownDirection ?? 'AUTO'}
      renderListItem={renderedItem ?? (DropDownListItem as any)}
      renderBadgeItem={renderBadgeItem ?? (DropDownBadgeItem as any)}
      tickIconStyle={[
        tickTintColor,
        styles.tickIcon,
        { marginRight: MetricsSizes.tiny },
        tickIconStyle,
      ]}
      searchContainerStyle={[
        { borderBottomColor: Colors.textGray200 },
        searchContainerStyle,
      ]}
      props={{
        activeOpacity: 1,
      }}
      searchable={searchable}
      searchPlaceholderTextColor={
        searchPlaceholderTextColor ?? Colors.textGray200
      }
      searchTextInputStyle={[
        Fonts.textRegular,
        Gutters.tinyVPadding,
        { borderColor: Colors.textGray200 },
        searchTextInputStyle,
      ]}
      modalContentContainerStyle={[
        { backgroundColor: NavigationColors.background },
        modalContentContainerStyle,
      ]}
      modalTitleStyle={[Fonts.textRegular, modalTitleStyle]}
      {...restProps}
    />
  );
};

const styles = StyleSheet.create({
  placeholderStyle: {
    padding: 0,
    marginLeft: 5,
  },
  arrowIconStyle: {
    width: 24,
    height: 24,
    marginRight: 5,
  },
  dropDownContainerStyle: {
    borderWidth: 1,
    zIndex: 10,
    overflow: 'visible',
    marginTop: 1,
  },
  listItemContainerStyle: {
    height: 52,
  },
  tickIcon: {
    width: 24,
    height: 24,
  },
});

export default memo(AppDropDown);

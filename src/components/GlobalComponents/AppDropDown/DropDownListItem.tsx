import React, { memo, useCallback, useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import {
  ItemType,
  RenderListItemPropsInterface,
} from 'react-native-dropdown-picker';
import AppText from '../AppText';

export interface DropDownListItemProps
  extends RenderListItemPropsInterface<any> {
  item: ItemType<any>;
}

const DropDownListItem = ({
  rtl,
  item,
  label,
  value,
  parent,
  selectable,
  disabled,
  props,
  custom,
  isSelected,
  TickIconComponent,
  listItemContainerStyle,
  listItemLabelStyle,
  listChildContainerStyle,
  listParentContainerStyle,
  listChildLabelStyle,
  listParentLabelStyle,
  customItemContainerStyle,
  customItemLabelStyle,
  selectedItemContainerStyle,
  selectedItemLabelStyle,
  disabledItemContainerStyle,
  disabledItemLabelStyle,
  containerStyle,
  labelStyle,
  categorySelectable,
  onPress,
  setPosition,
}: DropDownListItemProps) => {
  /**
   * The tick icon component.
   * @returns {JSX|null}
   */
  const _TickIconComponent = useMemo(
    () => isSelected && <TickIconComponent />,
    [isSelected, TickIconComponent],
  );

  /**
   * The list category container style.
   * @returns {object}
   */
  const _listParentChildContainerStyle = useMemo(
    () =>
      parent !== null
        ? [...[listChildContainerStyle].flat()]
        : [...[listParentContainerStyle].flat()],
    [rtl, listChildContainerStyle, listParentContainerStyle, parent],
  );

  /**
   * The selected item container style.
   * @returns {object}
   */
  const _selectedItemContainerStyle = useMemo(
    () => isSelected && selectedItemContainerStyle,
    [isSelected, selectedItemContainerStyle],
  );

  /**
   * The disabled item container style.
   * @returns {object}
   */
  const _disabledItemContainerStyle = useMemo(
    () => disabled && disabledItemContainerStyle,
    [disabled, disabledItemContainerStyle],
  );

  /**
   * The custom container item style.
   * @returns {JSX}
   */
  const _customItemContainerStyle = useMemo(
    () => custom && [...[customItemContainerStyle].flat()],
    [custom, customItemContainerStyle],
  );

  /**
   * The list item container style.
   * @returns {object}
   */
  const _listItemContainerStyle = useMemo(
    () => [
      ...[listItemContainerStyle].flat(),
      ...[_listParentChildContainerStyle].flat(),
      ...[containerStyle].flat(),
      ...[_selectedItemContainerStyle].flat(),
      ...[_customItemContainerStyle].flat(),
      ...[_disabledItemContainerStyle].flat(),
    ],
    [
      listItemContainerStyle,
      _listParentChildContainerStyle,
      _selectedItemContainerStyle,
      _customItemContainerStyle,
      _disabledItemContainerStyle,
      containerStyle,
    ],
  );

  /**
   * The list category label style.
   * @returns {object}
   */
  const _listParentChildLabelStyle = useMemo(
    () =>
      parent !== null
        ? [...[listChildLabelStyle].flat()]
        : [...[listParentLabelStyle].flat()],
    [listChildLabelStyle, listParentLabelStyle, parent],
  );

  /**
   * The selected item label style.
   * @returns {object}
   */
  const _selectedItemLabelStyle = useMemo(
    () => isSelected && selectedItemLabelStyle,
    [isSelected, selectedItemLabelStyle],
  );

  /**
   * The disabled item label style.
   * @returns {object}
   */
  const _disabledItemLabelStyle = useMemo(
    () => disabled && disabledItemLabelStyle,
    [disabled, disabledItemLabelStyle],
  );

  /**
   * The custom label item style.
   * @returns {JSX}
   */
  const _customItemLabelStyle = useMemo(
    () => custom && [...[customItemLabelStyle].flat()],
    [custom, customItemLabelStyle],
  );

  /**
   * The list item label style.
   * @returns {object}
   */
  const _listItemLabelStyle = useMemo(
    () => [
      ...[listItemLabelStyle].flat(),
      ...[_listParentChildLabelStyle].flat(),
      ...[labelStyle].flat(),
      ...[_selectedItemLabelStyle].flat(),
      ...[_customItemLabelStyle].flat(),
      ...[_disabledItemLabelStyle].flat(),
    ],
    [
      listItemLabelStyle,
      _listParentChildLabelStyle,
      _selectedItemLabelStyle,
      _customItemLabelStyle,
      _disabledItemLabelStyle,
      labelStyle,
    ],
  );

  /**
   * onPress.
   */
  const __onPress = useCallback(() => {
    if (parent === null && !categorySelectable && selectable !== true) {
      return;
    }

    onPress(item);
  }, [onPress, parent, categorySelectable]);

  /**
   * onLayout.
   */
  const onLayout = useCallback(
    ({
      nativeEvent: {
        layout: { y },
      },
    }: {
      nativeEvent: {
        layout: { y: any };
      };
    }) => {
      setPosition(value, y);
    },
    [value],
  );

  return (
    <TouchableOpacity
      style={_listItemContainerStyle}
      onPress={__onPress}
      onLayout={onLayout}
      {...props}
      disabled={selectable === false || disabled}
      testID={item.testID}
    >
      <AppText style={_listItemLabelStyle}>{label}</AppText>
      {_TickIconComponent}
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
  if (nextProps.parent !== prevProps.parent) {
    return false;
  }
  if (nextProps.selectable !== prevProps.selectable) {
    return false;
  }
  if (nextProps.disabled !== prevProps.disabled) {
    return false;
  }
  if (nextProps.custom !== prevProps.custom) {
    return false;
  }
  if (nextProps.isSelected !== prevProps.isSelected) {
    return false;
  }
  if (nextProps.categorySelectable !== prevProps.categorySelectable) {
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

export default memo(DropDownListItem, areEqual);

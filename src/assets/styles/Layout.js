import { StyleSheet } from 'react-native';
import { Colors } from './Variables';

export const Layout = StyleSheet.create({
  /* Column Layouts */
  col: {
    flexDirection: 'column',
  },
  colReverse: {
    flexDirection: 'column-reverse',
  },
  colCenter: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  colVCenter: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  colHCenter: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  /* Row Layouts */
  row: {
    flexDirection: 'row',
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowVCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  rowHCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  /* Default Layouts */
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  alignItemsStart: {
    alignItems: 'flex-start',
  },
  alignItemsStretch: {
    alignItems: 'stretch',
  },
  alignItemsEnd: {
    alignItems: 'flex-end',
  },
  justifyContentCenter: {
    justifyContent: 'center',
  },
  justifyContentAround: {
    justifyContent: 'space-around',
  },
  justifyContentBetween: {
    justifyContent: 'space-between',
  },
  justifyContentEnd: {
    justifyContent: 'flex-end',
  },
  scrollSpaceAround: {
    flexGrow: 1,
    justifyContent: 'space-around',
  },
  scrollSpaceBetween: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  scroll: {
    flexGrow: 1,
  },
  selfStretch: {
    alignSelf: 'stretch',
  },
  selfEnd: {
    alignSelf: 'flex-end',
  },
  selfCenter: {
    alignSelf: 'center',
  },
  /* Sizes Layouts */
  fill: {
    flex: 1,
  },
  fullSize: {
    height: '100%',
    width: '100%',
  },
  fullWidth: {
    width: '100%',
  },
  threeQuarterWidth: {
    width: '75%',
  },
  halfWidth: {
    width: '50%',
  },
  oneThirdWidth: {
    width: '33%',
  },
  fullHeight: {
    height: '100%',
  },
  threeQuarterHeight: {
    height: '75%',
  },
  halfHeight: {
    height: '50%',
  },
  oneThirdHeight: {
    height: '33%',
  },
  /* Operation Layout */
  mirror: {
    transform: [{ scaleX: -1 }],
  },
  rotate90: {
    transform: [{ rotate: '90deg' }],
  },
  rotate90Inverse: {
    transform: [{ rotate: '-90deg' }],
  },
  // Position
  relative: {
    position: 'relative',
  },
  absolute: {
    position: 'absolute',
  },
  top0: {
    top: 0,
  },
  bottom0: {
    bottom: 0,
  },
  left0: {
    left: 0,
  },
  right0: {
    right: 0,
  },
  // Border radius
  tinyBorderTopLeftRadius: {
    borderTopLeftRadius: 2,
  },
  tinyBorderTopRightRadius: {
    borderTopRightRadius: 2,
  },
  tinyBorderTopRadius: {
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  tinyBorderBottomLeftRadius: {
    borderBottomLeftRadius: 2,
  },
  tinyBorderBottomRightRadius: {
    borderBottomRightRadius: 2,
  },
  tinyBorderBottomRadius: {
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  tinyBorderLeftRadius: {
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
  tinyBorderRightRadius: {
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  tinyBorderRadius: {
    borderRadius: 2,
  },
  smallBorderTopLeftRadius: {
    borderTopLeftRadius: 4,
  },
  smallBorderTopRightRadius: {
    borderTopRightRadius: 4,
  },
  smallBorderTopRadius: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  smallBorderBottomLeftRadius: {
    borderBottomLeftRadius: 4,
  },
  smallBorderBottomRightRadius: {
    borderBottomRightRadius: 4,
  },
  smallBorderBottomRadius: {
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  smallBorderLeftRadius: {
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  smallBorderRightRadius: {
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  smallBorderRadius: {
    borderRadius: 4,
  },
  regularBorderTopLeftRadius: {
    borderTopLeftRadius: 8,
  },
  regularBorderTopRightRadius: {
    borderTopRightRadius: 8,
  },
  regularBorderTopRadius: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  regularBorderBottomLeftRadius: {
    borderBottomLeftRadius: 8,
  },
  regularBorderBottomRightRadius: {
    borderBottomRightRadius: 8,
  },
  regularBorderBottomRadius: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  regularBorderLeftRadius: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  regularBorderRightRadius: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  regularBorderRadius: {
    borderRadius: 8,
  },
  largeBorderTopLeftRadius: {
    borderTopLeftRadius: 16,
  },
  largeBorderTopRightRadius: {
    borderTopRightRadius: 16,
  },
  largeBorderTopRadius: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  largeBorderBottomLeftRadius: {
    borderBottomLeftRadius: 16,
  },
  largeBorderBottomRightRadius: {
    borderBottomRightRadius: 16,
  },
  largeBorderBottomRadius: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  largeBorderLeftRadius: {
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  largeBorderRightRadius: {
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  largeBorderRadius: {
    borderRadius: 16,
  },
  maxBorderRadius: {
    borderRadius: 999,
  },
  // Drop shadow
  regularDropShadow: {
    elevation: 5,
    shadowColor: Colors.textGray800,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.8,
  },
});

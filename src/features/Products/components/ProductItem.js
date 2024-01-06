/* eslint-disable react-native/no-inline-styles */
import {
  FontSize,
  Fonts,
  Gutters,
  Layout,
  globalStyles,
} from '@/assets/styles';
import { AppText } from '@/components/GlobalComponents';
import React, { memo } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Card } from 'react-native-elements';

const ProductItem = ({ data, navigation }) => {
  const { price, productName, thumbnailImage, soldCount } = data;

  return (
    <View
      style={{
        width: Dimensions.get('window').width * 0.473,
        padding: 2,
      }}
    >
      <Card
        containerStyle={[
          globalStyles.cardContainer,
          { paddingHorizontal: 0, paddingTop: 0 },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.push('ProductDetail', { _id: data._id })}
        >
          <Image
            source={{ uri: thumbnailImage }}
            resizeMode="contain"
            resizeMethod="resize"
            style={styles.imageStyle}
          />

          <View style={[Gutters.tinyTPadding, Gutters.tinyHPadding]}>
            <AppText
              ellipsizeMode="tail"
              numberOfLines={2}
              style={[
                Fonts.titleSmall,
                {
                  fontSize: FontSize.regular,
                  minHeight: FontSize.regular * 2.5,
                },
              ]}
            >
              {productName}
            </AppText>

            <View
              style={[
                Layout.rowHCenter,
                Layout.justifyContentBetween,
                Gutters.smallTPadding,
              ]}
            >
              <AppText
                style={{
                  color: 'blue',
                  fontWeight: '500',
                  flex: 1,
                }}
              >
                {Intl.NumberFormat('en-US').format(price)} đ
              </AppText>

              <AppText
                style={{
                  flex: 0.5,
                  textAlign: 'right',
                  fontSize: FontSize.tiny,
                }}
              >
                Sold: {Intl.NumberFormat('en-US').format(soldCount)}
              </AppText>
            </View>
          </View>
        </TouchableOpacity>
      </Card>
    </View>
  );
};

export default memo(ProductItem);

const styles = StyleSheet.create({
  imageStyle: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
    borderColor: '#99999',
  },
});

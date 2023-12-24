/* eslint-disable react-native/no-inline-styles */
import { Fonts, Gutters, globalStyles } from '@/assets/styles';
import { AppText } from '@/components/GlobalComponents';
import React, { memo } from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { View } from 'react-native-animatable';
import { Card } from 'react-native-elements';

const CategoryItem = ({ data, navigation }) => {
  const { categoryName, image } = data[0];
  const index = data[1];

  return (
    <View
      style={{
        paddingLeft: 5,
        paddingTop: index >= Math.round(data[2] / 2) && data[2] > 4 ? 5 : 0,
      }}
    >
      <Card containerStyle={[globalStyles.cardContainer]}>
        <TouchableOpacity
          style={styles.categoryItem}
          onPress={() => navigation.navigate('FilterByCategory', data[0])}
        >
          <Image
            source={{ uri: image }}
            style={{
              width: 90,
              height: 50,
            }}
            resizeMethod="scale"
            resizeMode="contain"
          />
          <AppText
            style={[Fonts.textBold, Fonts.textSmall, Gutters.tinyTPadding]}
          >
            {categoryName}
          </AppText>
        </TouchableOpacity>
      </Card>
    </View>
  );
};

export default memo(CategoryItem);

const styles = StyleSheet.create({
  categoryItem: {
    flexDirection: 'column',
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

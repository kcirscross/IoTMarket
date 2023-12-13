/* eslint-disable react-native/no-inline-styles */
import { globalStyles } from '@/assets/styles';
import React, { memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-elements';

const CategoryItem = ({ data, navigation }) => {
  const { categoryName, image } = data[0];
  const index = data[1];

  return (
    <Card
      containerStyle={[
        globalStyles.cardContainer,
        {
          marginLeft:
            data[2] > 4
              ? index === Math.round(data[2] / 2) || index === 0
                ? 0
                : 5
              : index === 0
              ? 0
              : 5,
          marginTop: index >= Math.round(data[2] / 2) && data[2] > 4 ? 5 : 0,
        },
      ]}
    >
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
        <Text style={styles.textStyle}>{categoryName}</Text>
      </TouchableOpacity>
    </Card>
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
  textStyle: {
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 5,
  },
});

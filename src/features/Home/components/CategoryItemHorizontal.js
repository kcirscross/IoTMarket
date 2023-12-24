/* eslint-disable react-native/no-inline-styles */
import { Layout } from '@/assets/styles';
import { AppImage, AppText } from '@/components/GlobalComponents';
import React, { memo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { AlertForSignIn } from '../../../components/constants';

const CategoryItemHorizontal = ({ category, navigation }) => {
  const currentUser = useSelector(state => state.user);

  return (
    <TouchableOpacity
      onPress={() => {
        Object.keys(currentUser).length !== 0
          ? navigation.navigate('UploadDetail', { category: category })
          : AlertForSignIn({ navigation });
      }}
      style={[Layout.rowHCenter, Layout.justifyContentBetween]}
    >
      <View style={Layout.rowHCenter}>
        <AppImage
          source={{ uri: category.image }}
          style={{
            width: 80,
            height: 60,
            margin: 2,
          }}
          resizeMode="contain"
        />

        <AppText>{category.categoryName}</AppText>
      </View>

      <Icon name="chevron-forward-outline" size={24} color="black" />
    </TouchableOpacity>
  );
};

export default memo(CategoryItemHorizontal);

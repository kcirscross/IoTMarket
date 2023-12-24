/* eslint-disable react-native/no-inline-styles */
import { Gutters, Layout } from '@/assets/styles';
import { AppText } from '@/components/GlobalComponents';
import React, { memo, useEffect, useLayoutEffect, useState } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import ModalLoading from '~/components/utils/ModalLoading';
import { globalStyles } from '../../../assets/styles/globalStyles';
import { PRIMARY_COLOR } from '../../../components/constants';
import { getAPI } from '../../../components/utils/base_API';
import { CategoryItemHorizontal } from '../../Home/components';

const UploadProductScreen = ({ navigation }) => {
  const [listCategories, setListCategories] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerStyle: {
        backgroundColor: PRIMARY_COLOR,
      },
      headerTitle: '',
    });
  }, []);

  useEffect(() => {
    setModalLoading(true);

    getAPI({ url: 'category' })
      .then(res => {
        if (res.status === 200) {
          setListCategories(res.data.categories);
          setModalLoading(false);
        }
      })
      .catch(err => console.log('Get Category: ', err));
  }, []);

  return (
    <SafeAreaView style={globalStyles.container}>
      <AppText
        style={[
          Layout.selfCenter,
          Gutters.smallVPadding,
          {
            fontWeight: 'bold',
            fontSize: 20,
          },
        ]}
      >
        Choose Category
      </AppText>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[Layout.scroll, Gutters.smallBPadding]}
      >
        {listCategories.map((category, index) => (
          <CategoryItemHorizontal
            key={index}
            category={category}
            navigation={navigation}
          />
        ))}
      </ScrollView>

      <ModalLoading visible={modalLoading} />
    </SafeAreaView>
  );
};

export default memo(UploadProductScreen);

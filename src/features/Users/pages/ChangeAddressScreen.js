/* eslint-disable react-native/no-inline-styles */
import { Colors, Fonts, Gutters, Layout } from '@/assets/styles';
import { AppDropDown, AppText } from '@/components/GlobalComponents';
import axios from 'axios';
import React, {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Input } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch } from 'react-redux';
import ModalLoading from '~/components/utils/ModalLoading';
import { globalStyles } from '../../../assets/styles/globalStyles';
import { PRIMARY_COLOR } from '../../../components/constants';
import { patchAPI } from '../../../components/utils/base_API';
import { updateAddress } from '../userSlice';

const ChangeAddressScreen = ({ navigation, route }) => {
  const [itemsCity, setItemsCity] = useState([]);
  const [openCity, setOpenCity] = useState(false);
  const [valueCity, setValueCity] = useState(null);

  const [openDistrict, setOpenDistrict] = useState(false);
  const [valueDistrict, setValueDistrict] = useState(null);
  const [itemsDistrict, setItemsDistrict] = useState([]);

  const [openWard, setOpenWard] = useState(false);
  const [valueWard, setValueWard] = useState(null);
  const [itemsWard, setItemsWard] = useState([]);

  const [chosenCity, setChosenCity] = useState('');
  const [chosenDistrict, setChosenDistrict] = useState('');
  const [chosenWard, setChosenWard] = useState('');
  const [chosenStreet, setChosenStreet] = useState('');

  const existAddress = route.params;
  const dispatch = useDispatch();

  const [modalLoading, setModalLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Change Address',
      headerStyle: { backgroundColor: PRIMARY_COLOR },
      headerTintColor: 'white',
      headerShown: true,
      headerBackTitleStyle: {
        color: 'white',
      },
    });
  }, []);

  //Init value if exist address
  useEffect(() => {
    if (existAddress !== undefined) {
      setChosenCity(existAddress.city);
      setChosenDistrict(existAddress.district);
      setChosenWard(existAddress.ward);
      setChosenStreet(existAddress.street);
    }
  }, []);

  useEffect(() => {
    getCity();
  }, []);

  useEffect(() => {
    valueCity !== null && getDistrict(valueCity);
  }, [valueCity]);

  useEffect(() => {
    valueDistrict !== null && getWard(valueDistrict);
  }, [valueDistrict]);

  const getCity = useCallback(async () => {
    let list = [];
    await axios({
      method: 'get',
      url: 'https://provinces.open-api.vn/api/p/',
    })
      .then(res => {
        if (res.status === 200) {
          res.data.forEach(city =>
            list.push({
              label: city.name,
              value: city.code,
            }),
          );
          setItemsCity(list);
          setValueCity(
            list.filter(item => item.label === existAddress.city)[0]?.value ??
              null,
          );
        }
      })
      .catch(err => console.log(err));
  }, []);

  const getDistrict = useCallback(
    async code => {
      let list = [];

      await axios({
        method: 'get',
        url: `https://provinces.open-api.vn/api/p/${code}`,
        params: {
          depth: 2,
        },
      })
        .then(res => {
          if (res.status === 200) {
            res.data.districts.forEach(districts =>
              list.push({
                label: districts.name,
                value: districts.code,
              }),
            );
            setItemsDistrict(list);

            if (chosenCity === existAddress.city) {
              setValueDistrict(
                list.find(item => item.label === existAddress.district)
                  ?.value ?? null,
              );
            } else {
              setValueDistrict(null);
              setValueWard(null);
            }
          }
        })
        .catch(err => console.log(err));
    },
    [chosenCity],
  );

  const getWard = useCallback(
    async code => {
      let list = [];
      await axios({
        method: 'get',
        url: `https://provinces.open-api.vn/api/d/${code}`,
        params: {
          depth: 2,
        },
      })
        .then(res => {
          if (res.status === 200) {
            res.data.wards.forEach(wards =>
              list.push({
                label: wards.name,
                value: wards.code,
              }),
            );
            setItemsWard(list);

            chosenDistrict === existAddress.district
              ? setValueWard(
                  list.find(item => item.label === existAddress.ward)?.value ??
                    null,
                )
              : setValueWard(null);
          }
        })
        .catch(err => console.log(err));
    },
    [chosenDistrict],
  );

  const handleUpdateAddressClick = async () => {
    //Validate
    if (
      chosenStreet === '' ||
      chosenWard === '' ||
      chosenDistrict === '' ||
      chosenCity === ''
    ) {
      Alert.alert('Please fill in all field.');
    } else {
      setModalLoading(true);

      patchAPI({
        url: 'user/changeaddress',
        data: {
          street: chosenStreet,
          ward: chosenWard,
          district: chosenDistrict,
          city: chosenCity,
        },
      }).then(res => {
        if (res.status === 200) {
          setModalLoading(false);

          dispatch(updateAddress(res.data.newAddress));

          Alert.alert('Update successfully.', '', [
            {
              text: 'OK',
              onPress: () => {
                navigation.goBack();
              },
            },
          ]);
        }
      });
    }
  };

  return (
    <SafeAreaView style={[globalStyles.container, { paddingHorizontal: 0 }]}>
      <KeyboardAwareScrollView
        contentContainerStyle={[Layout.scroll, Gutters.tinyHPadding]}
      >
        <View style={[Gutters.tinyTMargin, styles.firstZIndex]}>
          <AppText style={[Fonts.textBold, Gutters.tinyBPadding]}>
            Choose your city
          </AppText>

          <AppDropDown
            open={openCity}
            value={valueCity}
            items={itemsCity}
            setOpen={setOpenCity}
            setValue={setValueCity}
            setItems={setItemsCity}
            placeholder={'Select your city'}
            onSelectItem={item => {
              setChosenCity(item.label);
              getDistrict(item.value);
            }}
          />
        </View>

        <View style={[Gutters.smallTMargin, styles.secondZIndex]}>
          <AppText style={[Fonts.textBold, Gutters.tinyBPadding]}>
            Choose your district
          </AppText>

          <AppDropDown
            open={openDistrict}
            value={valueDistrict}
            items={itemsDistrict}
            setOpen={setOpenDistrict}
            setValue={setValueDistrict}
            setItems={setItemsDistrict}
            placeholder={'Select your district'}
            onSelectItem={item => {
              getWard(item.value);
              setChosenDistrict(item.label);
            }}
          />
        </View>

        <View style={[Gutters.smallTMargin, styles.thirdZIndex]}>
          <AppText style={[Fonts.textBold, Gutters.tinyBPadding]}>
            Choose your ward
          </AppText>

          <AppDropDown
            open={openWard}
            value={valueWard}
            items={itemsWard}
            setOpen={setOpenWard}
            setValue={setValueWard}
            setItems={setItemsWard}
            placeholder={'Select your ward'}
            onSelectItem={item => setChosenWard(item.label)}
          />
        </View>

        <Input
          label="Please fill in your address"
          placeholder="Your detail address"
          containerStyle={{
            marginTop: 10,
            paddingHorizontal: 0,
          }}
          defaultValue={chosenStreet}
          inputContainerStyle={styles.textContainer}
          labelStyle={styles.labelStyle}
          inputStyle={{
            padding: 0,
            fontSize: 16,
            ...styles.textStyle,
          }}
          renderErrorMessage={false}
          onChangeText={text => setChosenStreet(text)}
        />

        <View style={Layout.fill} />

        <TouchableOpacity
          onPress={handleUpdateAddressClick}
          style={{
            ...globalStyles.button,
            alignSelf: 'center',
            marginBottom: 20,
          }}
        >
          <AppText style={globalStyles.textButton}>Update</AppText>
        </TouchableOpacity>
      </KeyboardAwareScrollView>

      <ModalLoading visible={modalLoading} />
    </SafeAreaView>
  );
};

export default memo(ChangeAddressScreen);

const styles = StyleSheet.create({
  firstZIndex: { zIndex: 100 },
  secondZIndex: { zIndex: 99 },
  thirdZIndex: { zIndex: 98 },
  textStyle: {
    color: Colors.black,
  },
  labelStyle: {
    color: Colors.black,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  textContainer: {
    ...globalStyles.input,
    width: '100%',
    marginTop: 0,
    borderBottomWidth: 0,
    paddingVertical: 5,
  },
});

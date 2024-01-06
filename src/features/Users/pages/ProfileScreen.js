/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import { Colors, Fonts, Layout } from '@/assets/styles';
import { AppText } from '@/components/GlobalComponents';
import { useIsFocused } from '@react-navigation/native';
import React, { memo, useEffect, useLayoutEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Avatar, Badge, Card, Tab, TabView } from 'react-native-elements';
import Toast from 'react-native-toast-message';
import Ion from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import ModalLoading from '~/components/utils/ModalLoading';
import { globalStyles } from '../../../assets/styles/globalStyles';
import {
  AVATAR_BORDER,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  convertTime,
} from '../../../components/constants';
import { getAPI } from '../../../components/utils/base_API';
import { ProductItem } from '../../Products/components';

const ProfileScreen = ({ navigation, route }) => {
  const currentUser = useSelector(state => state.user);

  const [myProductsList, setMyProductsList] = useState([]);
  const [myProductListNew, setMyProductListNew] = useState([]);
  const [myProductListSale, setMyProductListSale] = useState([]);
  const [myProductLisPriceDesc, setMyProductLisPriceDesc] = useState([]);
  const [myProductLisPriceAsc, setMyProductLisPriceAsc] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [filter, setFilter] = useState(true);
  const isCurrentStore =
    route.params[0] === currentUser.storeId ||
    route.params.storeId === currentUser.storeId;
  const [storeInfo, setStoreInfo] = useState([]);
  const isFocus = useIsFocused();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'My Store',
      headerStyle: { backgroundColor: PRIMARY_COLOR },
      headerTintColor: 'white',
      headerShown: true,
      headerBackTitleStyle: {
        color: 'white',
      },
    });
  }, []);

  useEffect(() => {
    Object.keys(currentUser).length !== 0 &&
      getAPI({
        url: 'product/me',
        params: {
          sortBy: `${
            index === 0
              ? 'pop'
              : index === 1
              ? 'new'
              : index === 2
              ? 'sale'
              : index === 3
              ? filter
                ? 'pricedesc'
                : 'priceacs'
              : ''
          }`,
        },
      })
        .then(res => {
          if (res.status === 200) {
            index === 0
              ? setMyProductsList(res.data.products)
              : index === 1
              ? setMyProductListNew(res.data.products)
              : index === 2
              ? setMyProductListSale(res.data.products)
              : index === 3
              ? filter
                ? setMyProductLisPriceDesc(res.data.products)
                : setMyProductLisPriceAsc(res.data.products)
              : setMyProductLisPriceAsc(res.data.products);
          }
        })
        .catch(err => console.log('Get Products: ', err));
  }, [index, filter, isFocus]);

  useEffect(() => {
    if (
      currentUser.storeId !== undefined &&
      isCurrentStore &&
      Object.keys(currentUser).length !== 0
    ) {
      setModalLoading(true);
      setIsLoading(true);

      getAPI({ url: `store/${route.params[0]}` })
        .then(res => {
          if (res.status === 200) {
            setStoreInfo(res.data.store);
            setModalLoading(false);
            setIsLoading(false);
          }
        })
        .catch(err => {
          setModalLoading(false);
          setIsLoading(false);
          console.log('Get Store: ', err);
        });
    }
  }, []);

  return !isLoading ? (
    <SafeAreaView
      style={{
        ...globalStyles.container,
        opacity: modalLoading ? 0.3 : 1,
      }}
    >
      <ModalLoading visible={modalLoading} />

      <Toast position="bottom" bottomOffset={70} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Card
          containerStyle={{
            ...globalStyles.cardContainer,
            marginTop: 10,
          }}
        >
          <View style={Layout.rowHCenter}>
            <View>
              <Avatar
                rounded
                size={'large'}
                source={{
                  uri: isCurrentStore
                    ? storeInfo.shopImage
                    : currentUser.avatar,
                }}
                avatarStyle={{
                  borderWidth: 1,
                  borderColor: AVATAR_BORDER,
                }}
              />

              <Badge
                value=" "
                status={
                  currentUser.onlineStatus === 'Online' ? 'success' : 'warning'
                }
                containerStyle={{
                  position: 'absolute',
                  bottom: 2,
                  right: 5,
                }}
              />
            </View>

            <View>
              <AppText style={Fonts.titleSmall}>
                {isCurrentStore ? storeInfo.displayName : currentUser.fullName}
              </AppText>

              <AppText
                style={{
                  marginLeft: 10,
                }}
              >
                {currentUser.onlineStatus === 'Online'
                  ? 'Online'
                  : convertTime(Date.parse(currentUser.updatedAt))}
              </AppText>

              <View
                style={[
                  Layout.rowHCenter,
                  {
                    marginLeft: 10,
                  },
                ]}
              >
                <Ion name="star" color="#FA8128" size={16} />
                <AppText
                  style={{
                    marginLeft: 5,
                  }}
                >
                  {storeInfo.rating}/5{'     '}|
                </AppText>

                <AppText>{'     '}</AppText>
                <Ion name="person" color={PRIMARY_COLOR} size={16} />
                <AppText
                  style={{
                    marginLeft: 5,
                  }}
                >
                  {storeInfo.followers.length} Followers
                </AppText>
              </View>
            </View>
          </View>

          {isCurrentStore && (
            <View>
              <AppText
                style={{
                  marginLeft: 85,
                }}
              >
                {storeInfo.description}
              </AppText>
            </View>
          )}
        </Card>

        <View
          style={{
            borderTopColor: Colors.black,
            borderTopWidth: 1,
            borderBottomColor: SECONDARY_COLOR,
            borderBottomWidth: 1,
            marginTop: 5,
          }}
        >
          <Tab
            indicatorStyle={{
              backgroundColor: PRIMARY_COLOR,
            }}
            value={index}
            onChange={setIndex}
          >
            <Tab.Item
              title="popular"
              titleStyle={{
                fontSize: 13,
                color: index === 0 ? PRIMARY_COLOR : Colors.black,
              }}
              buttonStyle={{
                padding: 0,
              }}
              containerStyle={[
                Layout.center,
                {
                  padding: 0,
                  margin: 0,
                  backgroundColor: Colors.white,
                },
              ]}
            />
            <Tab.Item
              title="newest"
              titleStyle={{
                fontSize: 13,
                color: index === 1 ? PRIMARY_COLOR : Colors.black,
              }}
              buttonStyle={{
                padding: 0,
              }}
              containerStyle={[
                Layout.center,
                {
                  padding: 0,
                  margin: 0,
                  backgroundColor: Colors.white,
                },
              ]}
            />
            <Tab.Item
              title="best sale"
              titleStyle={{
                fontSize: 13,
                color: index === 2 ? PRIMARY_COLOR : Colors.black,
              }}
              buttonStyle={{
                padding: 0,
              }}
              containerStyle={[
                Layout.center,
                {
                  padding: 0,
                  margin: 0,
                  backgroundColor: Colors.white,
                },
              ]}
            />
            <Tab.Item
              title="price"
              titleStyle={{
                fontSize: 13,
                color: index === 3 ? PRIMARY_COLOR : 'black',
              }}
              buttonStyle={{
                padding: 0,
              }}
              containerStyle={[
                Layout.center,
                {
                  padding: 0,
                  margin: 0,
                  backgroundColor: Colors.white,
                },
              ]}
              onPressIn={() => {
                setFilter(!filter);
              }}
              iconRight={true}
              icon={
                filter ? (
                  <Ion
                    name="arrow-down-outline"
                    size={16}
                    color={index === 3 ? PRIMARY_COLOR : Colors.black}
                  />
                ) : (
                  <Ion
                    name="arrow-up-outline"
                    size={16}
                    color={index === 3 ? PRIMARY_COLOR : Colors.black}
                  />
                )
              }
            />
          </Tab>
        </View>

        <TabView value={index} onChange={setIndex}>
          <TabView.Item style={{ width: '100%' }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}
              style={{
                paddingVertical: 5,
              }}
            >
              {myProductsList.map((data, index) => (
                <ProductItem key={index} data={data} navigation={navigation} />
              ))}
            </ScrollView>
          </TabView.Item>

          <TabView.Item style={{ width: '100%' }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}
              style={{
                paddingVertical: 5,
              }}
            >
              {myProductListNew.map((data, index) => (
                <ProductItem key={index} data={data} navigation={navigation} />
              ))}
            </ScrollView>
          </TabView.Item>
          <TabView.Item style={{ width: '100%' }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}
              style={{
                paddingVertical: 5,
              }}
            >
              {myProductListSale.map((data, index) => (
                <ProductItem key={index} data={data} navigation={navigation} />
              ))}
            </ScrollView>
          </TabView.Item>
          <TabView.Item style={{ width: '100%' }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}
              style={{
                paddingVertical: 5,
              }}
            >
              {filter
                ? myProductLisPriceDesc.map((data, index) => (
                    <ProductItem
                      key={index}
                      data={data}
                      navigation={navigation}
                    />
                  ))
                : myProductLisPriceAsc.map((data, index) => (
                    <ProductItem
                      key={index}
                      data={data}
                      navigation={navigation}
                    />
                  ))}
            </ScrollView>
          </TabView.Item>
        </TabView>
      </ScrollView>
    </SafeAreaView>
  ) : (
    <SafeAreaView
      style={{
        ...globalStyles.container,
      }}
    >
      {currentUser.storeId === undefined && (
        <TouchableOpacity
          onPress={() => navigation.navigate('Store')}
          style={{
            ...globalStyles.button,
            alignSelf: 'center',
            marginTop: '100%',
          }}
        >
          <Text style={globalStyles.textButton}>Regis New Store</Text>
        </TouchableOpacity>
      )}
      {Object.keys(currentUser).length !== 0 ? (
        <ModalLoading visible={modalLoading} />
      ) : (
        <TouchableOpacity
          onPress={() => navigation.replace('SignIn')}
          style={{
            ...globalStyles.button,
            alignSelf: 'center',
            marginTop: '100%',
          }}
        >
          <Text style={globalStyles.textButton}>Go to Sign In</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default memo(ProfileScreen);

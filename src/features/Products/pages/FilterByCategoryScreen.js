import React, {useEffect, useLayoutEffect, useState} from 'react'
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native'
import {Tab, TabView} from 'react-native-elements'
import Ion from 'react-native-vector-icons/Ionicons'
import ModalLoading from '~/components/utils/ModalLoading'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {PRIMARY_COLOR, SECONDARY_COLOR} from '../../../components/constants'
import {getAPI} from '../../../components/utils/base_API'
import {ProductItem} from '../components'

const FilterByCategoryScreen = ({navigation, route}) => {
    const [listProducts, setListProducts] = useState([])
    const [listProductsNew, setListProductsNew] = useState([])
    const [listProductsSale, setlistProductsSale] = useState([])
    const [listProductsPriceDesc, setListProductsPriceDesc] = useState([])
    const [listProductsPriceAcs, setListProductsPriceAcs] = useState([])
    const [modalLoading, setModalLoading] = useState(true)

    const [index, setIndex] = useState(0)
    const [filter, setFilter] = useState(true)

    useLayoutEffect(() => {
        navigation.setOptions({
            title: route.params.categoryName,
            headerStyle: {backgroundColor: PRIMARY_COLOR},
            headerTintColor: 'white',
            headerShown: true,
            headerBackTitleStyle: {
                color: 'white',
            },
        })
    }, [])

    //Get List Products
    useEffect(() => {
        setModalLoading(true)
        getAPI({
            url: `product/category/${route.params._id}`,
            params: {
                sortBy: `${
                    index == 0
                        ? 'pop'
                        : index == 1
                        ? 'new'
                        : index == 2
                        ? 'sale'
                        : index == 3
                        ? filter
                            ? 'pricedesc'
                            : 'priceacs'
                        : ''
                }`,
            },
        })
            .then(res => {
                if (res.status === 200) {
                    index == 0
                        ? setListProducts(res.data.products)
                        : index == 1
                        ? setListProductsNew(res.data.products)
                        : index == 2
                        ? setlistProductsSale(res.data.products)
                        : index == 3
                        ? filter
                            ? setListProductsPriceDesc(res.data.products)
                            : setListProductsPriceAcs(res.data.products)
                        : setListProductsPriceAcs(res.data.products)
                    setModalLoading(false)
                }
            })
            .catch(err => console.log('Get List Products: ', err))
    }, [index, filter])

    return !modalLoading ? (
        listProducts.length +
            listProductsNew.length +
            listProductsPriceAcs.length +
            listProductsPriceDesc.length +
            listProductsSale.length >
        0 ? (
            <SafeAreaView style={{...globalStyles.container}}>
                <ModalLoading visible={modalLoading} />

                {listProducts.length > 0 ? (
                    <View
                        style={{
                            marginTop: 5,
                            flex: 1,
                        }}>
                        <View style={styles.viewContainer}>
                            <Tab
                                indicatorStyle={{
                                    backgroundColor: PRIMARY_COLOR,
                                }}
                                value={index}
                                onChange={setIndex}>
                                <Tab.Item
                                    title="popular"
                                    titleStyle={{
                                        fontSize: 13,
                                        color:
                                            index == 0
                                                ? PRIMARY_COLOR
                                                : 'black',
                                    }}
                                    buttonStyle={{
                                        padding: 0,
                                    }}
                                    containerStyle={styles.tabContainer}
                                />

                                <Tab.Item
                                    title="newest"
                                    titleStyle={{
                                        fontSize: 13,
                                        color:
                                            index == 1
                                                ? PRIMARY_COLOR
                                                : 'black',
                                    }}
                                    buttonStyle={{
                                        padding: 0,
                                    }}
                                    containerStyle={styles.tabContainer}
                                />

                                <Tab.Item
                                    title="best sale"
                                    titleStyle={{
                                        fontSize: 13,
                                        color:
                                            index == 2
                                                ? PRIMARY_COLOR
                                                : 'black',
                                    }}
                                    buttonStyle={{
                                        padding: 0,
                                    }}
                                    containerStyle={styles.tabContainer}
                                />

                                <Tab.Item
                                    title="price"
                                    titleStyle={{
                                        fontSize: 13,
                                        color:
                                            index == 3
                                                ? PRIMARY_COLOR
                                                : 'black',
                                    }}
                                    buttonStyle={{
                                        padding: 0,
                                    }}
                                    containerStyle={styles.tabContainer}
                                    onPressIn={() => {
                                        setFilter(!filter)
                                    }}
                                    iconRight={true}
                                    icon={
                                        filter ? (
                                            <Ion
                                                name="arrow-down-outline"
                                                size={16}
                                                color={
                                                    index == 3
                                                        ? PRIMARY_COLOR
                                                        : 'black'
                                                }
                                            />
                                        ) : (
                                            <Ion
                                                name="arrow-up-outline"
                                                size={16}
                                                color={
                                                    index == 3
                                                        ? PRIMARY_COLOR
                                                        : 'black'
                                                }
                                            />
                                        )
                                    }
                                />
                            </Tab>
                        </View>

                        <TabView value={index} onChange={setIndex}>
                            <TabView.Item style={{width: '100%'}}>
                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={{
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                    }}
                                    style={{
                                        paddingVertical: 5,
                                    }}>
                                    {listProducts.map((data, index) => (
                                        <ProductItem
                                            key={index}
                                            data={data}
                                            navigation={navigation}
                                        />
                                    ))}
                                </ScrollView>
                            </TabView.Item>

                            <TabView.Item style={{width: '100%'}}>
                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={{
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                    }}
                                    style={{
                                        paddingVertical: 5,
                                    }}>
                                    {listProductsNew.map((data, index) => (
                                        <ProductItem
                                            key={index}
                                            data={data}
                                            navigation={navigation}
                                        />
                                    ))}
                                </ScrollView>
                            </TabView.Item>

                            <TabView.Item style={{width: '100%'}}>
                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={{
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                    }}
                                    style={{
                                        paddingVertical: 5,
                                    }}>
                                    {listProductsSale.map((data, index) => (
                                        <ProductItem
                                            key={index}
                                            data={data}
                                            navigation={navigation}
                                        />
                                    ))}
                                </ScrollView>
                            </TabView.Item>

                            <TabView.Item style={{width: '100%'}}>
                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={{
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                    }}
                                    style={{
                                        paddingVertical: 5,
                                    }}>
                                    {filter
                                        ? listProductsPriceDesc.map(
                                              (data, index) => (
                                                  <ProductItem
                                                      key={index}
                                                      data={data}
                                                      navigation={navigation}
                                                  />
                                              ),
                                          )
                                        : listProductsPriceAcs.map(
                                              (data, index) => (
                                                  <ProductItem
                                                      key={index}
                                                      data={data}
                                                      navigation={navigation}
                                                  />
                                              ),
                                          )}
                                </ScrollView>
                            </TabView.Item>
                        </TabView>
                    </View>
                ) : (
                    <View />
                )}
            </SafeAreaView>
        ) : (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    marginTop: '50%',
                }}>
                <Image
                    source={require('~/assets/images/notfound.png')}
                    style={{
                        width: 200,
                        height: 200,
                    }}
                />
                <Text
                    style={{
                        marginTop: 10,
                        color: PRIMARY_COLOR,
                        fontSize: 20,
                        fontWeight: '700',
                    }}>
                    This category is empty.
                </Text>
            </View>
        )
    ) : (
        <SafeAreaView>
            <ModalLoading visible={modalLoading} />
        </SafeAreaView>
    )
}

export default FilterByCategoryScreen

const styles = StyleSheet.create({
    viewContainer: {
        borderTopColor: 'black',
        borderTopWidth: 1,
        borderBottomColor: SECONDARY_COLOR,
        borderBottomWidth: 1,
        marginTop: 5,
    },

    tabContainer: {
        padding: 0,
        margin: 0,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
})

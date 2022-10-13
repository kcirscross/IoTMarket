import {StyleSheet, Text, View} from 'react-native'
import React from 'react'
import {useLayoutEffect} from 'react'
import {API_URL, PRIMARY_COLOR} from '../../../components/constants'
import {useEffect} from 'react'
import {useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import {SafeAreaView} from 'react-native'
import {ScrollView} from 'react-native'
import ProductItemHorizontal from '../../Products/components/ProductItemHorizontal'
import {globalStyles} from '../../../assets/styles/globalStyles'
import ModalLoading from '~/components/utils/ModalLoading'
import {useDispatch, useSelector} from 'react-redux'

const FavoriteScreen = ({navigation}) => {
    const [listFavoriteProducts, setListFavoriteProducts] = useState([])
    const [modalLoading, setModalLoading] = useState(false)

    const currentFavorite = useSelector(state => state.favorite)
    const dispatch = useDispatch()

    useLayoutEffect(() => {
        navigation.setOptions({
            title: '',
            headerStyle: {backgroundColor: PRIMARY_COLOR},
            headerTintColor: 'white',
            headerShown: true,
            headerBackTitleStyle: {
                color: 'white',
            },
        })
    }, [])
    return (
        <SafeAreaView
            style={{
                ...globalStyles.container,
                paddingTop: 5,
                opacity: modalLoading ? 0.5 : 1,
                flex: 1,
            }}>
            <ModalLoading visible={modalLoading} />
            {currentFavorite.length != 0 ? (
                <ScrollView
                    style={{flex: 1}}
                    showsVerticalScrollIndicator={false}>
                    {currentFavorite.map((product, index) => (
                        <ProductItemHorizontal
                            key={index}
                            navigation={navigation}
                            product={product}
                            type={'favorite'}
                        />
                    ))}
                </ScrollView>
            ) : (
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1,
                    }}>
                    <Text
                        style={{
                            color: PRIMARY_COLOR,
                            fontWeight: 'bold',
                            fontSize: 30,
                        }}>
                        No product found.
                    </Text>
                </View>
            )}
        </SafeAreaView>
    )
}

export default FavoriteScreen

const styles = StyleSheet.create({})

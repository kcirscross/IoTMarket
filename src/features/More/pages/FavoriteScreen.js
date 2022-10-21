import React, {useLayoutEffect} from 'react'
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native'
import {useSelector} from 'react-redux'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {PRIMARY_COLOR} from '../../../components/constants'
import ProductItemHorizontal from '../../Products/components/ProductItemHorizontal'

const FavoriteScreen = ({navigation}) => {
    const currentFavorite = useSelector(state => state.favorite)

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
                flex: 1,
            }}>
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

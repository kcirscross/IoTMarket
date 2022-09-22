import {Image, SafeAreaView, StyleSheet, Text, View} from 'react-native'
import React, {useEffect} from 'react'
import {globalStyles} from '~/assets/styles/globalStyles'

const SplashScreen = ({navigation}) => {
    useEffect(() => {
        setTimeout(() => {
            navigation.navigate('SignIn')
        }, 2000)
    }, [])

    return (
        <SafeAreaView
            style={{
                ...globalStyles.container,
                ...styles.container,
            }}>
            <Image source={require('~/assets/images/logo.jpg')} />
        </SafeAreaView>
    )
}

export default SplashScreen

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
})

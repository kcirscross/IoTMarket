import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import React, {useEffect, useLayoutEffect} from 'react'
import {useSelector} from 'react-redux'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {PRIMARY_COLOR} from '../../../components/constants'
import {Button, Input} from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome5'

const HomeScreen = ({navigation}) => {
    const currentUser = useSelector(state => state.user)

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerStyle: {
                backgroundColor: PRIMARY_COLOR,
            },
            headerTitle: () => (
                <View
                    style={{
                        width: 350,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                    }}>
                    <Input
                        placeholder="Search..."
                        inputContainerStyle={{
                            borderBottomWidth: 0,
                        }}
                        style={{
                            backgroundColor: 'white',
                            borderRadius: 10,
                            marginTop: 25,
                        }}
                    />
                    <TouchableOpacity>
                        <Icon name="bell" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            ),
        })
    }, [])

    return (
        <View>
            <Text>HomeScreen</Text>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({})

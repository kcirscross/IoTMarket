import React, {useLayoutEffect} from 'react'
import {SafeAreaView, StyleSheet, TouchableOpacity, View} from 'react-native'
import {Avatar, Input} from 'react-native-elements'
import {useSelector} from 'react-redux'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {PRIMARY_COLOR} from '../../../components/constants'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {useState} from 'react'
import {Text} from 'react-native'
import {TextInput} from 'react-native'
import {KeyboardAvoidingView} from 'react-native'
import {TouchableWithoutFeedback} from 'react-native'
import {Keyboard} from 'react-native'

const ChangeInfoScreen = ({navigation}) => {
    const currentUser = useSelector(state => state.user)
    const [change, setChange] = useState(false)
    const [fullName, setFullName] = useState('')

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
        <SafeAreaView style={globalStyles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior="padding"
                    style={{
                        width: '100%',
                        height: '100%',
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 10,
                        }}>
                        <TouchableOpacity>
                            <Avatar
                                rounded
                                source={{
                                    uri: currentUser.avatar,
                                }}
                                size={64}
                            />
                            <Icon
                                name="camera"
                                size={20}
                                color="black"
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    right: 0,
                                }}
                            />
                        </TouchableOpacity>
                        <View style={{flexDirection: 'row', flex: 1}}>
                            <View
                                style={{
                                    marginLeft: 10,
                                    width: '100%',
                                }}>
                                <Text
                                    style={{
                                        color: 'black',
                                    }}>
                                    Full Name
                                </Text>
                                <Input
                                    placeholder="Full Name"
                                    containerStyle={globalStyles.input}
                                    defaultValue={currentUser.fullName}
                                    inputContainerStyle={{
                                        borderBottomWidth: 0,
                                    }}
                                    renderErrorMessage={false}
                                    onChangeText={text => setFullName(text)}
                                    rightIcon={
                                        <Icon
                                            name="pen"
                                            size={24}
                                            color="black"
                                        />
                                    }
                                />
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

export default ChangeInfoScreen

const styles = StyleSheet.create({})

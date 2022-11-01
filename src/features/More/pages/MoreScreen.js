import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import React, {useLayoutEffect} from 'react'
import {
    Alert,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import {Avatar} from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Ion from 'react-native-vector-icons/Ionicons'
import {useDispatch, useSelector} from 'react-redux'
import {globalStyles} from '../../../assets/styles/globalStyles'
import {API_URL, PRIMARY_COLOR} from '../../../components/constants'
import {signOut} from '../../Users/userSlice'

const MoreScreen = ({navigation}) => {
    const currentUser = useSelector(state => state.user)
    const dispatch = useDispatch()

    const deleteRememberAccount = async () => {
        try {
            const token = await AsyncStorage.getItem('token')
            axios({
                method: 'patch',
                url: `${API_URL}/user/changeonlinestatus`,
                headers: {
                    authorization: `Bearer ${token}`,
                },
                data: {
                    status: 'Offline',
                },
            }).then(async () => {
                await AsyncStorage.removeItem('account')
                await AsyncStorage.removeItem('password')
                await AsyncStorage.removeItem('accountType')
                await AsyncStorage.removeItem('token')
            })
        } catch (error) {
            console.log('Error when delete remember account', error)
        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
            headerStyle: {
                backgroundColor: PRIMARY_COLOR,
            },
            headerTitle: '',
        })
    }, [])

    const handleSignOutClick = () => {
        Alert.alert('Confirm Sign Out?', '', [
            {
                text: 'Yes',
                onPress: () => {
                    axios({
                        method: 'post',
                        url: `${API_URL}/auth/logout`,
                        data: {
                            email: currentUser.email,
                        },
                    }).then(res => {
                        const action = signOut()
                        res.status == 200 && dispatch(action)

                        deleteRememberAccount()

                        navigation.navigate('SignIn')
                    })
                },
            },

            {
                text: 'Cancel',
            },
        ])
    }

    return (
        <SafeAreaView style={globalStyles.container}>
            <TouchableOpacity
                onPress={() => navigation.navigate('ChangeInfo')}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                }}>
                <Avatar
                    rounded
                    size={64}
                    source={{uri: currentUser.avatar}}
                    avatarStyle={{
                        borderWidth: 1,
                        borderColor: 'gray',
                    }}
                />
                <View
                    style={{
                        marginLeft: 10,
                    }}>
                    <Text
                        style={{
                            fontWeight: 'bold',
                            fontSize: 20,
                            color: 'black',
                        }}>
                        {currentUser.fullName || ''}
                    </Text>
                    <Text>
                        Following:{' '}
                        {currentUser.follows != undefined
                            ? currentUser.follows.length
                            : 0}
                    </Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate('Store')}
                style={styles.container}>
                <Icon name="store" size={24} color={'orange'} />
                <Text style={styles.textStyle}>My Store</Text>
                <View style={{flex: 1}} />
                <Ion name="chevron-forward-outline" size={24} color="black" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.container}>
                <Ion name="people-outline" size={28} color={'blue'} />
                <Text style={styles.textStyle}>Follow</Text>
                <View style={{flex: 1}} />
                <Ion name="chevron-forward-outline" size={24} color="black" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.container}>
                <Image
                    source={require('~/assets/images/buy.png')}
                    style={{
                        tintColor: 'red',
                    }}
                />
                <Text style={styles.textStyle}>Bought Products</Text>
                <View style={{flex: 1}} />
                <Ion name="chevron-forward-outline" size={24} color="black" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.container}>
                <Image
                    source={require('~/assets/images/sell.png')}
                    style={{
                        tintColor: 'green',
                    }}
                />
                <Text style={styles.textStyle}>Sold Products</Text>
                <View style={{flex: 1}} />
                <Ion name="chevron-forward-outline" size={24} color="black" />
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.container}
                onPress={() => navigation.navigate('Cart')}>
                <Ion name="cart-outline" size={25} color={PRIMARY_COLOR} />
                <Text style={styles.textStyle}>My Cart</Text>
                <View style={{flex: 1}} />
                <Ion name="chevron-forward-outline" size={24} color="black" />
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.container}
                onPress={() => navigation.navigate('Favorite')}>
                <Icon name="heart" color={'#FF4122'} solid={true} size={24} />
                <Text style={styles.textStyle}>Favorite Products</Text>
                <View style={{flex: 1}} />
                <Ion name="chevron-forward-outline" size={24} color="black" />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate('ChangeInfo')}
                style={styles.container}>
                <Icon
                    name="info-circle"
                    color={'#45B8FE'}
                    solid={true}
                    size={24}
                />
                <Text style={styles.textStyle}>Change Your Infomation</Text>
                <View style={{flex: 1}} />
                <Ion name="chevron-forward-outline" size={24} color="black" />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={handleSignOutClick}
                style={styles.container}>
                <Icon
                    name="sign-out-alt"
                    color={'black'}
                    solid={true}
                    size={24}
                />
                <Text style={styles.textStyle}>Sign Out</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default MoreScreen

const styles = StyleSheet.create({
    textStyle: {
        color: 'black',
        fontSize: 16,
        marginLeft: 10,
    },

    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
})

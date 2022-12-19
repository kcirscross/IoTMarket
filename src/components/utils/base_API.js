import AsyncStorage from '@react-native-async-storage/async-storage'
import messaging from '@react-native-firebase/messaging'
import {API_URL} from '../constants/index'

const {default: axios} = require('axios')
const getAPI = async ({url, params, data}) => {
    let result

    const token = await AsyncStorage.getItem('token')

    await axios({
        method: 'get',
        url: `${API_URL}/${url}`,
        params: params,
        headers: {
            authorization: token !== undefined ? `Bearer ${token}` : '',
        },
        data: data,
    })
        .then(res => {
            result = res
        })
        .catch(err => {
            result = err
        })

    return result
}

const patchAPI = async ({url, params, data}) => {
    let result

    const token = await AsyncStorage.getItem('token')

    await axios({
        method: 'patch',
        url: `${API_URL}/${url}`,
        params: params,
        headers: {
            authorization: token !== undefined ? `Bearer ${token}` : '',
        },
        data: data,
    })
        .then(res => {
            result = res
        })
        .catch(err => {
            result = console.log(err.response.data)
        })

    return result
}

const postAPI = async ({url, params, data}) => {
    let result

    await messaging().registerDeviceForRemoteMessages()
    const tokenFCM = await messaging().getToken()

    const token = await AsyncStorage.getItem('token')

    await axios({
        method: 'post',
        url: `${API_URL}/${url}`,
        params: params,
        headers: {
            authorization: token !== undefined ? `Bearer ${token}` : '',
            deviceTokenFCM: tokenFCM,
        },
        data: data,
    })
        .then(res => {
            result = res
        })
        .catch(err => {
            result = console.log(err.response.data)
        })

    return result
}

const deleteAPI = async ({url, params, data}) => {
    let result

    await messaging().registerDeviceForRemoteMessages()
    const tokenFCM = await messaging().getToken()

    const token = await AsyncStorage.getItem('token')

    await axios({
        method: 'delete',
        url: `${API_URL}/${url}`,
        params: params,
        headers: {
            authorization: token !== undefined ? `Bearer ${token}` : '',
            deviceTokenFCM: tokenFCM,
        },
        data: data,
    })
        .then(res => {
            result = res
        })
        .catch(err => {
            result = console.log(err.response.data)
        })

    return result
}

export {getAPI, patchAPI, postAPI, deleteAPI}

import {Alert} from 'react-native'

const PRIMARY_COLOR = '#63A1FF'
const SECONDARY_COLOR = '#F7F8F8'
const API_URL = 'http://192.168.1.202:3000/api/v1'
const REGEX_PHONE_NUMBER = /([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/
const AVATAR_BORDER = '#cecece'
const WEB_CLIENT_ID =
    '550636790404-jkka629ik6ag2jdh7rpajr3luctuf2nd.apps.googleusercontent.com'

const convertTime = ms => {
    let temp = (Date.now() - ms) / 1000
    if (temp < 120) {
        return 'Just now'
    } else if (temp >= 120 && temp / 60 / 60 < 1) {
        return (temp / 60).toFixed(0) + ' minutes ago'
    } else if (temp / 60 / 60 >= 1 && temp / 60 / 60 < 2) {
        return '1 hour ago'
    } else if (temp / 60 / 60 >= 2 && temp / 60 / 60 / 24 < 1) {
        return (temp / 60 / 60).toFixed(0) + ' hours ago'
    } else if (temp / 60 / 60 / 24 >= 1 && temp / 60 / 60 / 24 < 2) {
        return '1 day ago'
    } else {
        return (temp / 60 / 60 / 24).toFixed(0) + ' days ago'
    }
}

const AlertForSignIn = ({navigation}) => {
    Alert.alert('You must sign in for this function.', 'Go to sign in?', [
        {
            text: 'Yes',
            onPress: () => navigation.navigate('SignIn'),
        },
        {
            text: 'Cancel',
        },
    ])
}

export {
    PRIMARY_COLOR,
    SECONDARY_COLOR,
    API_URL,
    REGEX_PHONE_NUMBER,
    AVATAR_BORDER,
    convertTime,
    WEB_CLIENT_ID,
    AlertForSignIn,
}

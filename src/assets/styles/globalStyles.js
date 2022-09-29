import {StyleSheet} from 'react-native'
import {PRIMARY_COLOR, SECONDARY_COLOR} from '../../components/constants'

export const globalStyles = StyleSheet.create({
    container: {
        paddingLeft: 10,
        paddingRight: 10,
        flex: 1,
        backgroundColor: 'white',
    },

    textTitle: {
        fontWeight: 'bold',
        fontSize: 22,
        color: 'black',
    },

    input: {
        backgroundColor: SECONDARY_COLOR,
        width: '90%',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginTop: 10,
    },

    button: {
        width: '90%',
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        marginTop: 10,
    },

    textButton: {
        fontWeight: 'bold',
        fontSize: 18,
        color: 'white',
    },
    cardContainer: {
        margin: 0,
        padding: 0,
        borderRadius: 10,
    },
})

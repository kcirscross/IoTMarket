import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
    container: {
        paddingLeft: 10,
        paddingRight: 10,
        flex: 1,
        backgroundColor: 'white',
    },

    textTitle: {
        fontWeight: "bold",
        fontSize: 22,
        color: "black"
    },

    input: {
        backgroundColor: '#F7F8F8',
        width: "90%",
        borderRadius: 10,
        paddingHorizontal: 10,
        marginTop: 10
    },

    button: {
        width: '90%',
        backgroundColor: '#63A1FF',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        marginTop: 10
    },

    textButton:{
        fontWeight: 'bold',
        fontSize: 18,
        color: 'white'
    }
})
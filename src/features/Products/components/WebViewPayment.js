import React from 'react'
import {StyleSheet} from 'react-native'
import WebView from 'react-native-webview'
import {patchAPI} from '../../../components/utils/base_API'

const WebViewPayment = ({navigation, route}) => {
    const INJECTED_JAVASCRIPT = `(function() {
        window.ReactNativeWebView.postMessage(JSON.stringify(window.location.href));
    })();`

    return (
        <WebView
            source={{uri: route.params.url}}
            javaScriptEnabled={true}
            injectedJavaScript={INJECTED_JAVASCRIPT}
            onMessage={data => {
                if (
                    data.nativeEvent.data.startsWith(
                        '"https://iotmarket.herokuapp.com/api/v1/order/result',
                    )
                ) {
                    if (
                        data.nativeEvent.data.search('vnp_TransactionStatus=00')
                    ) {
                        navigation.reset({
                            index: 1,
                            routes: [{name: 'BottomNavBar'}, {name: 'Order'}],
                        })

                        // route.params.from === 'cart' &&
                        //     route.params.data.forEach(async product => {
                        //         await patchAPI({
                        //             url: 'user/removecart',
                        //             data: product,
                        //         })
                        //             .then(res => {
                        //                 console.log(res.data)
                        //             })
                        //             .catch(err =>
                        //                 console.log(
                        //                     'Remove Cart After Payment: ',
                        //                     err,
                        //                 ),
                        //             )
                        //     })
                    } else {
                        navigation.goBack()
                    }
                }
            }}
        />
    )
}

export default WebViewPayment

const styles = StyleSheet.create({})

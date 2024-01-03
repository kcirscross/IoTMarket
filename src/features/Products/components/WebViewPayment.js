import React from 'react';
import WebView from 'react-native-webview';
import { patchAPI } from '../../../components/utils/base_API';

const WebViewPayment = ({ navigation, route }) => {
  const INJECTED_JAVASCRIPT = `(function() {
        window.ReactNativeWebView.postMessage(JSON.stringify(window.location.href));
    })();`;

  return (
    <WebView
      source={{ uri: route.params.url }}
      javaScriptEnabled={true}
      injectedJavaScript={INJECTED_JAVASCRIPT}
      onMessage={data => {
        if (
          data.nativeEvent.data.includes(
            'http://192.168.1.202:3000/api/v1/order/result',
          )
        ) {
          if (data.nativeEvent.data.search('vnp_TransactionStatus=00')) {
            route.params.from === 'cart' &&
              patchAPI({
                url: 'user/removecart/',
                data: route.params.data,
              })
                .then(() => {
                  console.log('Remove cart successful.');
                })
                .catch(err => console.log('Remove Cart After Payment: ', err));

            navigation.reset({
              index: 1,
              routes: [{ name: 'BottomNavBar' }, { name: 'Order' }],
            });
          } else {
            navigation.goBack();
          }
        }
      }}
    />
  );
};

export default WebViewPayment;

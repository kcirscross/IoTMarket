import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import React from 'react'
import {StyleSheet} from 'react-native'
import {Provider} from 'react-redux'
import BottomNavBar from './src/components/utils/BottomNavBar'
import {HomeScreen} from './src/features/Home'
import MoreScreen from './src/features/More/pages/MoreScreen'
import {ProductDetail} from './src/features/Products'
import {ProductItem} from './src/features/Products/components'
import {
    ChangeInfoScreen,
    ProfileScreen,
    RecoverPasswordScreen,
    SignInScreen,
    SignUpScreen,
    SplashScreen,
} from './src/features/Users'
import {store} from './store'

const Stack = createNativeStackNavigator()
const globalSreenOptions = {
    headerShown: false,
}

export default function App() {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={globalSreenOptions}
                    initialRouteName="Splash">
                    <Stack.Screen name="Splash" component={SplashScreen} />
                    <Stack.Screen name="SignIn" component={SignInScreen} />
                    <Stack.Screen name="SignUp" component={SignUpScreen} />
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen
                        name="RecoverPassword"
                        component={RecoverPasswordScreen}
                    />
                    <Stack.Screen
                        name="BottomNavBar"
                        component={BottomNavBar}
                    />
                    <Stack.Screen name="ProductItem" component={ProductItem} />
                    <Stack.Screen
                        name="ProductDetail"
                        component={ProductDetail}
                    />
                    <Stack.Screen name="More" component={MoreScreen} />
                    <Stack.Screen name="Profile" component={ProfileScreen} />
                    <Stack.Screen
                        name="ChangeInfo"
                        component={ChangeInfoScreen}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    )
}

const styles = StyleSheet.create({})

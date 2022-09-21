import React from 'react';
import {
  StyleSheet,
} from 'react-native';
import { SplashScreen } from "./src/features/Users"
import { SignUpScreen } from "./src/features/Users"
import { SignInScreen } from "./src/features/Users"
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from './src/features/Home';
import { RecoverPasswordScreen } from './src/features/Users';
import BottomNavBar from './src/components/utils/BottomNavBar';

const Stack = createNativeStackNavigator();
const globalSreenOptions = {
  headerShown: false
}

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={globalSreenOptions}
        initialRouteName='Splash'
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="RecoverPassword" component={RecoverPasswordScreen} />
        <Stack.Screen name="BottomNavBar" component={BottomNavBar} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({});

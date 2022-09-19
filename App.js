import React from 'react';
import {
  StyleSheet,
} from 'react-native';
import { SplashScreen } from "./src/features/Splash"
import { SignUpScreen } from "./src/features/SignUp"
import { SignInScreen } from "./src/features/SignIn"
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
const globalSreenOptions = {
  headerShown: false
}

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={globalSreenOptions}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({});

import React from 'react';
import {
    createStackNavigator,
    createSwitchNavigator
} from 'react-navigation';

import InitialLoadScreen from '../screens/InitialLoadScreen';
import LoginScreen from '../screens/LoginScreen';
import OtpVerificationScreen from '../screens/OtpVerificationScreen';
import MainTabNavigator from './MainTabNavigator';

const AuthStack = createStackNavigator(
    {
        Login: LoginScreen,
        OtpVerification: OtpVerificationScreen,
    }
);

export default createSwitchNavigator(
    { 
        InitialLoad: InitialLoadScreen,
        Auth: AuthStack,
        Main: MainTabNavigator,
    },
    { 
        initialRouteName: 'InitialLoad'
    } 
);
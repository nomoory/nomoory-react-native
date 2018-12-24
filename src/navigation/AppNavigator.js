import React from 'react';
import {
    createStackNavigator,
    createSwitchNavigator
} from 'react-navigation';

import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import MainTabNavigator from './MainTabNavigator';

const AuthStack = createStackNavigator(
    {
        Login: LoginScreen
    }
);

export default createSwitchNavigator(
    { 
        AuthLoading: AuthLoadingScreen,
        Auth: AuthStack,
        Main: MainTabNavigator,
    },
    { 
        initialRouteName: 'Main'
    } 
);
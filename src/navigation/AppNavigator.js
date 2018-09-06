import React from 'react';
import { 
  createStackNavigator, 
  createSwitchNavigator 
} from 'react-navigation';

import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import SigninScreen from '../screens/SigninScreen';
import MainTabNavigator from './MainTabNavigator';

const AuthStack = createStackNavigator(
  { 
    Login: LoginScreen,
    Signin: SigninScreen
  }
);

export default createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    Auth: AuthStack,
    Main: MainTabNavigator,
  },
  {
    initialRouteName: 'Auth'
  }
);
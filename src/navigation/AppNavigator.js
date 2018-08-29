import React from 'react';
import { 
  createStackNavigator, 
  createSwitchNavigator 
} from 'react-navigation';

import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import SigninScreen from '../screens/SigninScreen';
import MainTabNavigator from './MainTabNavigator';

const AuthStackNavigator = createStackNavigator(
  { 
    Login: LoginScreen,
    Signin: SigninScreen
  }
);

export default createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    Auth: AuthStackNavigator,
    Main: MainTabNavigator,
  }
);
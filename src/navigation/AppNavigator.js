import {
    createStackNavigator,
    createSwitchNavigator,
    createAppContainer,
} from 'react-navigation';

import InitialLoadScreen from '../screens/InitialLoadScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import OtpVerificationScreen from '../screens/OtpVerificationScreen';
import MainTabNavigator from './MainTabNavigator';

const AuthStack = createStackNavigator(
    {
        Login: LoginScreen,
        Signup: SignupScreen,
        OtpVerification: OtpVerificationScreen,
    }
);

export default createAppContainer
(createSwitchNavigator(
    { 
        InitialLoad: InitialLoadScreen,
        Auth: AuthStack,
        Main: MainTabNavigator,
    },
    { 
        initialRouteName: 'InitialLoad'
    } 
));
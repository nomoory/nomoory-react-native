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
import TradingPairScreen from '../screens/TradingPairScreen';

const AuthStack = createStackNavigator(
    {
        Login: LoginScreen,
        Signup: SignupScreen,
        OtpVerification: OtpVerificationScreen,
    }
);

const TradingPairStack = createStackNavigator(
    {
        TradingPair: TradingPairScreen,
    }
);

export default createAppContainer
(createSwitchNavigator(
    { 
        InitialLoad: InitialLoadScreen,
        Auth: AuthStack,
        Main: MainTabNavigator,
        TradingPairStack: TradingPairStack,
    },
    { 
        initialRouteName: 'InitialLoad',
    } 
));
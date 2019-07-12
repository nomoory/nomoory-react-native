import React from 'react';
import {
    createStackNavigator,
    createSwitchNavigator,
    createAppContainer,
} from 'react-navigation';
import { Transition } from 'react-native-reanimated';
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';

import InitialLoadScreen from '../screens/InitialLoadScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import OtpVerificationScreen from '../screens/OtpVerificationScreen';
import MainTabNavigator from './MainTabNavigator';

import TradingPairScreen from '../screens/TradingPairScreen';
import AccountDepositWithdrawScreen from '../screens/AccountDepositWithdrawScreen';
import AnnouncementListScreen from '../screens/AnnouncementListScreen';
import AnnouncementDetailScreen from '../screens/AnnouncementDetailScreen';


import { fromLeft, fromRight, zoomIn, zoomOut } from 'react-navigation-transitions'

const handleCustomTransition = ({ scenes }) => {
    const prevScene = scenes[scenes.length - 2];
    const nextScene = scenes[scenes.length - 1];
    // Custom transitions go there
    // if (nextScene
    //     // && prevScene.route.routeName === 'ScreenA'
    //     && nextScene.route.routeName === 'TradingPair'
    // ) {
    //     return fromLeft();
    // }

    // if (prevScene
    //     && prevScene.route.routeName === 'TradingPair'
    //     // && nextScene.route.routeName === 'ScreenC'
    // ) {
    //     return fromRight();
    // }
    return fromRight();
}


const transitionConfig = () => {
    return {
        transitionSpec: {
            duration: 750,
            easing: Easing.out(Easing.poly(4)),
            timing: Animated.timing,
            useNativeDriver: true,
        },
        screenInterpolator: sceneProps => {
            const { layout, position, scene } = sceneProps

            const thisSceneIndex = scene.index
            const width = layout.initWidth

            const translateX = position.interpolate({
                inputRange: [thisSceneIndex - 1, thisSceneIndex],
                outputRange: [width, 0],
            })

            return { transform: [{ translateX }] }
        },
    }
}

const AuthStack = createStackNavigator(
    {
        Login: LoginScreen,
        Signup: SignupScreen,
        OtpVerification: OtpVerificationScreen,
    }
);


const MainStack = createStackNavigator(
    {
        Main: MainTabNavigator,
        Else: createStackNavigator( {
            TradingPair: TradingPairScreen,
            AccountDepositWithdraw: AccountDepositWithdrawScreen,
            AnnouncementList: AnnouncementListScreen,
            AnnouncementDetail: AnnouncementDetailScreen,  
        }, {
        })
    },
    {
        transitionConfig: (nav) => handleCustomTransition(nav),
        headerMode: 'none',
    },
);

export default createAppContainer
(createSwitchNavigator(
    {
        InitialLoad: InitialLoadScreen,
        Auth: AuthStack,
        MainStack: MainStack,
    },
    {
        initialRouteName: 'InitialLoad',
    }
));
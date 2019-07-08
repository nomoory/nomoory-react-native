import React from 'react';
import {
    createStackNavigator,
    createBottomTabNavigator
} from 'react-navigation';

// https://expo.github.io/vector-icons/
import * as Icon from '@expo/vector-icons'
import ExchangeScreen from '../screens/ExchangeScreen';
import ChatScreen from '../screens/ChatScreen';
import InvestmentScreen from '../screens/InvestmentScreen';
import AccountListScreen from '../screens/AccountListScreen';
import EtcScreen from '../screens/EtcScreen';
import commonStyle from '../styles/commonStyle';

const iconSize = 22;

const ExchangeStack = createStackNavigator(
    {
        Exchange: ExchangeScreen,
    },{
        defaultNavigationOptions: {
            headerTitleAllowFontScaling: false,
            headerBackAllowFontScaling: false,
            headerTitleStyle: {
                flex: 1,
                textAlign: "center",
            },
        }
    }
);

ExchangeStack.navigationOptions = {
    tabBarLabel: '거래소',
    tabBarIcon: ({ tintColor, focused }) => {
        if (focused) {
            return (
                <Icon.MaterialCommunityIcons
                    focused={focused}
                    name="home"
                    color={tintColor}
                    size={iconSize} 
                /> 
            );
        } else {
            return (
                <Icon.MaterialCommunityIcons
                    focused={focused}
                    name="home-outline"
                    color={tintColor}
                    size={iconSize} 
                /> 
            );
        }

    },
    headerLayoutPreset: 'center'
};

ExchangeStack.headerMode = 'none';


const ChatStack = createStackNavigator(
    {
        Chat: ChatScreen,
    },{
        defaultNavigationOptions: {
            headerTitleAllowFontScaling: false,
            headerBackAllowFontScaling: false,
            headerTitleStyle: {
                flex: 1,
                textAlign: "center",
            },
        }
    }
);

ChatStack.navigationOptions = {
    tabBarLabel: '채팅',
    tabBarIcon: ({ tintColor, focused }) => {
        if (focused) {
            return (
                <Icon.MaterialIcons
                    focused={focused}
                    name="chat-bubble"
                    color={tintColor}
                    size={iconSize} 
                /> 
            );
        } else {
            return (
                <Icon.MaterialIcons
                    focused={focused}
                    name="chat-bubble-outline"
                    color={tintColor}
                    size={iconSize} 
                /> 
            );
        }

    },
    headerLayoutPreset: 'center'
};

ChatStack.headerMode = 'none';

const InvestmentStack = createStackNavigator(
    {
        Investment: InvestmentScreen
    },
    // {
    //     defaultNavigationOptions: {
    //         headerTitleAllowFontScaling: false,
    //         headerBackAllowFontScaling: false,    
    //     }
    // }
);

InvestmentStack.navigationOptions = {
    header: {
        visible: false,
    },
    tabBarLabel: '투자내역',
    tabBarIcon: ({ tintColor, focused }) => {
        if (focused) {
            return (
                <Icon.MaterialCommunityIcons
                    focused={focused}
                    name="file-document-box"
                    color={tintColor}
                    size={iconSize} 
                /> 
            );
        } else {
            return (
                <Icon.MaterialCommunityIcons
                    focused={focused}
                    name="file-document-box-outline"
                    color={tintColor}
                    size={iconSize} 
                /> 
            );
        }
    },
};

const DepositWithdrawStack = createStackNavigator(
    {
        Accounts: AccountListScreen, 
    }, {
        defaultNavigationOptions: {
            headerTitleAllowFontScaling: false,
            headerBackAllowFontScaling: false,    
        }
    }
);

DepositWithdrawStack.navigationOptions = {
    header: {
        visible: false,
    },
    tabBarLabel: '입출금',
    tabBarIcon: ({ tintColor, focused }) => {
        if (focused) {
            return (
                <Icon.Ionicons
                    focused={focused}
                    name="md-swap"
                    color={tintColor}
                    size={iconSize} 
                /> 
            );
        } else {
            return (
                <Icon.Ionicons
                    focused={focused}
                    name="ios-swap"
                    color={tintColor}
                    size={iconSize} 
                /> 
            );
        }
    },

};

const EtcStack = createStackNavigator(
    {
        EtcMain: EtcScreen,
    }, {
        headerTitleStyle: {
            flex: 1,
            textAlign: "center", 
        },
        defaultNavigationOptions: {
            headerTitleAllowFontScaling: false,
            headerBackAllowFontScaling: false,
        }
    }
);

EtcStack.navigationOptions = {
    tabBarLabel: '내정보',
    tabBarIcon: ({ tintColor, focused }) => {
        if (focused) {
            return (
                <Icon.MaterialIcons
                    focused={focused}
                    name="person"
                    color={tintColor}
                    size={iconSize} 
                /> 
            );
        } else {
            return (
                <Icon.MaterialIcons
                    focused={focused}
                    name="person-outline"
                    color={tintColor}
                    size={iconSize} 
                /> 
            );
        }
    },

};

export default createBottomTabNavigator(
    {
        Exchange: ExchangeStack,
        Chat: ChatStack,
        Investment: InvestmentStack,
        DepositWithdraw: DepositWithdrawStack,
        Etc: EtcStack
    },
    {
        initialRouteName: 'Investment',
        tabBarOptions: {
            activeTintColor: 'white',
            inactiveTintColor: 'white',
            allowFontScaling: false,
            style: {
                backgroundColor: commonStyle.color.brandBlue,
                borderTopWidth: 0,
                shadowOffset: { width: 5, height: 3 },
                shadowColor: 'black',
                shadowOpacity: 0.5,
                elevation: 5
            },
        },

        /* Default header */
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: '#aa11aa',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
                alignSelf: 'center',
            },
            headerTitleAllowFontScaling: false,
            headerBackAllowFontScaling: false,
        },
    }
);

import React from 'react';
import {
    createStackNavigator,
    createBottomTabNavigator
} from 'react-navigation';

import * as Icon from '@expo/vector-icons'
import ExchangeScreen from '../screens/ExchangeScreen';
import TradingPairScreen from '../screens/TradingPairScreen';
import InvestmentScreen from '../screens/InvestmentScreen';
import AccountListScreen from '../screens/AccountListScreen';
import AccountDepositWithdrawScreen from '../screens/AccountDepositWithdrawScreen';
import EtcScreen from '../screens/EtcScreen';
import AnnouncementListScreen from '../screens/AnnouncementListScreen';
import AnnouncementDetailScreen from '../screens/AnnouncementDetailScreen';
import commonStyle from '../styles/commonStyle';

const ExchangeStack = createStackNavigator(
    {
        Exchange: ExchangeScreen,
        TradingPair: TradingPairScreen,
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
    tabBarIcon: ({ tintColor, focused }) => (
        <Icon.Ionicons
            focused={focused}
            name="ios-trending-up"
            color={tintColor}
            size={24}
        />
    ),
    headerLayoutPreset: 'center'

};

ExchangeStack.headerMode = 'none';

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
    tabBarIcon: ({ tintColor, focused }) => (
        <Icon.Ionicons
            focused={focused}
            name="ios-clipboard"
            color={tintColor}
            size={24}
        />
    )
};

const DepositWithdrawStack = createStackNavigator(
    {
        Accounts: AccountListScreen, 
        AccountDepositWithdraw:  AccountDepositWithdrawScreen
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
    tabBarLabel: '입금', // '입출금',
    tabBarIcon: ({ tintColor, focused }) => (
        <Icon.Ionicons
            focused={focused}
            name="ios-swap"
            color={tintColor}
            size={24}
        />
    )
};

const EtcStack = createStackNavigator(
    {
        EtcMain: EtcScreen,
        AnnouncementList: AnnouncementListScreen,
        AnnouncementDetail: AnnouncementDetailScreen,
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
    tabBarLabel: '더 보기',
    tabBarIcon: ({ tintColor, focused }) => (
        <Icon.Ionicons
            focused={focused}
            name="ios-menu"
            color={tintColor}
            size={24} 
        />
    ),

};

export default createBottomTabNavigator(
    {
        Exchange: ExchangeStack,
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

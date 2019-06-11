import React from 'react';
import {
    createStackNavigator,
    createBottomTabNavigator
} from 'react-navigation';

import { Icon } from 'expo';
import ExchangeScreen from '../screens/ExchangeScreen';
import TradingPairScreen from '../screens/TradingPairScreen';
import InvestmentScreen from '../screens/InvestmentScreen';
import AccountListScreen from '../screens/AccountListScreen';
import AccountDepositWithdrawScreen from '../screens/AccountDepositWithdrawScreen';
import EtcScreen from '../screens/EtcScreen';

const ExchangeStack = createStackNavigator(
    {
        Exchange: ExchangeScreen,
        TradingPair: TradingPairScreen,
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
};

ExchangeStack.headerMode = 'none';

const InvestmentStack = createStackNavigator({
    Investment: InvestmentScreen
});

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

const DepositWithdrawStack = createStackNavigator({
    Accounts: AccountListScreen, 
    AccountDepositWithdraw:  AccountDepositWithdrawScreen
});

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

const EtcStack = createStackNavigator({
    EtcMain: EtcScreen
});

EtcStack.navigationOptions = {
    tabBarLabel: '더 보기',
    tabBarIcon: ({ tintColor, focused }) => (
        <Icon.Ionicons
            focused={focused}
            name="ios-menu"
            color={tintColor}
            size={24}
        />
    )
};

export default createBottomTabNavigator(
    {
        Exchange: ExchangeStack,
        Investment: InvestmentStack,
        DepositWithdraw: DepositWithdrawStack,
        Etc: EtcStack
    },
    {
        initialRouteName: 'Exchange',
        tabBarOptions: {
            activeTintColor: 'black',
            inactiveTintColor: 'grey',
            style: {
                backgroundColor: 'white',
                borderTopWidth: 0,
                shadowOffset: { width: 5, height: 3 },
                shadowColor: 'black',
                shadowOpacity: 0.5,
                elevation: 5
            }
        },

        /* Default header */
        navigationOptions: {
            headerStyle: {
                // backgroundColor: commonStyle.color.coblicBlue,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        },
    }
);

import React from 'react';
import { 
  createStackNavigator, 
  createBottomTabNavigator
} from 'react-navigation';

import { Icon } from 'expo';

import ExchangeScreen from '../screens/ExchangeScreen';
import InvestmentScreen from '../screens/InvestmentScreen';
import DepositHistoryScreen from '../screens/DepositHistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';

const ExchangeStack = createStackNavigator(
  {
    Exchange: ExchangeScreen,
  }
);

ExchangeStack.navigationOptions = {
  tabBarLabel: '거래소',
  tabBarIcon: ({tintColor, focused}) => (
    <Icon.Ionicons 
      focused={focused}
      name="ios-trending-up" 
      color={tintColor} 
      size={24} />
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
  tabBarIcon: ({tintColor, focused}) => (
    <Icon.Ionicons 
      focused={focused}
      name="ios-clipboard-outline" 
      color={tintColor} 
      size={24} />
  )
};

const DepositHistoryStack = createStackNavigator({
  DepositHistory: DepositHistoryScreen
});

DepositHistoryStack.navigationOptions = {
  header: {
    visible: false,
  },
  tabBarLabel: '입출금',
  tabBarIcon: ({tintColor, focused}) => (
    <Icon.Ionicons 
      focused={focused}
      name="ios-swap-outline" 
      color={tintColor} 
      size={24} />
  )
};

const ProfileStack = createStackNavigator({
    Profile: ProfileScreen
});

ProfileStack.navigationOptions = {
  tabBarLabel: '내정보',
  tabBarIcon: ({tintColor, focused}) => (
    <Icon.Ionicons 
      focused={focused}
      name="ios-person-outline" 
      color={tintColor} 
      size={24} />
  )
};

export default createBottomTabNavigator(
  {
    Exchange: ExchangeStack,
    Investment: InvestmentStack,
    DepositHistory: DepositHistoryStack,
    Profile: ProfileStack
  },
  {
    initialRouteName: 'Exchange',
    tabBarOptions: {
      activeTintColor: 'black',
      inactiveTintColor: 'grey',
      style: {
        backgroundColor: 'white',
        borderTopWidth: 0,
        shadowOffset: {width:5, height:3},
        shadowColor: 'black',
        shadowOpacity: 0.5,
        elevation: 5
      }
    }
  }
);

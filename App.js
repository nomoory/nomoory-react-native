import React from 'react';
import { StyleSheet, View, StatusBar, Platform } from 'react-native';
import { Provider } from 'mobx-react';
import stores from './src/stores';
import AppNavigator from './src/navigation/AppNavigator';
import MainTabNavigator from './src/navigation/MainTabNavigator';

export default class App extends React.Component {
  render() {
    return (
      <Provider {...stores}>
        <View style={styles.container}>
            {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
            <MainTabNavigator />
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

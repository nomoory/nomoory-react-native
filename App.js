import React from 'react';
import { StyleSheet, View, StatusBar, Platform } from 'react-native';
import { Provider } from 'mobx-react';
import stores from './src/stores';
import AppNavigator from './src/navigation/AppNavigator';
import api from './src/utils/api';
import Pubnub from './src/utils/Pubnub';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.pubnub = new Pubnub(this, stores);
  }
  render() {
    return (
      <Provider {...stores}
        api={api}
        pubnub={this.pubnub}
      >
        <View style={styles.container}>
            {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
            <AppNavigator />
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

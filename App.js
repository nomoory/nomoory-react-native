import React from 'react';
import { StyleSheet, View, StatusBar, Platform } from 'react-native';
import { Provider } from 'mobx-react';
import stores from './src/stores';
import AppNavigator from './src/navigation/AppNavigator';
import api from './src/utils/api';
import Pubnub from './src/utils/Pubnub';
import CommonModal from './src/components/CommonModal';

import { StyleProvider } from 'native-base';
import getTheme from './src/styles/native-base-theme/components';
import commonColor from './src/styles/native-base-theme/variables/commonColor';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.pubnub = new Pubnub(this, stores);
  }
  render() {
    return (
      <StyleProvider style={getTheme(commonColor)}>
        <Provider {...stores}
          api={api}
          pubnub={this.pubnub}
        >
          <View style={styles.container}>
              {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
              <AppNavigator />
              <CommonModal />
          </View>
        </Provider>
      </StyleProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

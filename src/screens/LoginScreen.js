import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { inject, observer } from 'mobx-react';

@inject('stubStore')
@observer
export default class LoginScreen extends Component {
  static navigationOptions = {
    title: 'Please sign in',
  };

  render() {
    return (
      <View style={styles.container}>
        <Text> Login </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({  
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
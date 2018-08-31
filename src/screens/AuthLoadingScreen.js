import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { inject, observer } from 'mobx-react';

@inject('stubStore', 'api')
@observer
export default class AuthLoadingScreen extends Component {
  componentDidMount() {
  }
  render() {
    return (
      <View>
        <Text onPress={() => {this.props.navigation.navigate('Auth')}}> AuthLoadingScreen </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
    
})

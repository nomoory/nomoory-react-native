import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { inject, observer } from 'mobx-react';

// @inject('')
@observer
export default class InvestmentScreen extends Component {
  render() {
    return (
      <View>
        <Text> Investment </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
    
})

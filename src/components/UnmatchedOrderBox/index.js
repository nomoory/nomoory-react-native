import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';

export default class UnmatchedOrderBox extends Component {
  render() {
    return (
      <View style={ styles.contrainer }>
        <Text> UnmatchedOrder box </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})

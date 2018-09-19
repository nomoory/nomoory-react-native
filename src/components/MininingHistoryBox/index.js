import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';

export default class MiningHistoryBox extends Component {
  render() {
    return (
      <View style={ styles.contrainer }>
        <Text> balance box </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})

import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import TotalAssetsEvaluation from './TotalAssetsEvaluation';
import AssetsAndEvaluationList from './AssetsAndEvaluationList';
import { inject, observer } from 'mobx-react';

@observer
export default class AssetsAndEvaluationBox extends Component {
  render() {
    return (
      <View style={ styles.container }>
        <TotalAssetsEvaluation />
        <AssetsAndEvaluationList />
      </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },

})

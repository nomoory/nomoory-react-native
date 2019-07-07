import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import TotalAssetsEvaluation from './TotalAssetsEvaluation';
import AssetsAndEvaluationList from './AssetsAndEvaluationList';
import { observer } from 'mobx-react';
import commonStyle from '../../styles/commonStyle';

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
        // backgroundColor: commonStyle.color.borderColor
    },
})

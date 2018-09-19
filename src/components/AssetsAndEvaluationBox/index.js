import React, { Component } from 'react';
import { Text, StyleSheet } from 'react-native';
import { View } from 'native-base';
import TotalAssetsEvaluation from './TotalAssetsEvaluation';
import AssetsAndEvaluationList from './AssetsAndEvaluationList';
import { inject, observer } from 'mobx-react';

@observer
export default class AssetsAndEvaluationBox extends Component {
  constructor(props) {
    super(props);
    // this.pubnubChannel = "";
  }

  componentDidMount() {
    // this.props.pubnub.subscribe(this.pubnubChannel);
  }
  componentWillUnmount() {
    // this.props.pubnub.unsubscribe(this.pubnubChannel);
  }

  render() {
    return (
      <View style={ styles.container }>
        <TotalAssetsEvaluation></TotalAssetsEvaluation>
        <AssetsAndEvaluationList></AssetsAndEvaluationList>
      </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },

})

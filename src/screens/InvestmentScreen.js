import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { inject, observer } from 'mobx-react';

@inject('pubnub', 'stubStore')
@observer
export default class InvestmentScreen extends Component {
  constructor(props) {
    super(props);
    this.pubnubChannel = "Channel-2b7qcypeg";
  }

  componentWillMount() {
    this.props.pubnub.subscribe(this.pubnubChannel);
  }

  componentWillUnmount() {
    this.props.pubnub.unsubscribe(this.pubnubChannel);
  }

  render() {
    return (
      <View>
        <Text> Investment {this.props.stubStore.stubValue} </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
    
})

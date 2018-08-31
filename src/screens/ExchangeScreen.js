import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';

@inject('pubnub', 'stubStore')
@observer
export default class ExchangeScreen extends Component {
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
        <Text onPress={()=>{console.log('exchange')}}> exchange {this.props.stubStore.message} </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
    
})

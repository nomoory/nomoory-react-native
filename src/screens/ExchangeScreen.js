import React, { Component } from 'react';
import { Text, StyleSheet, View, Button } from 'react-native';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';

@inject('pubnub', 'stubStore')
@observer
export default class ExchangeScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: '거래소',
      // headerLeft: (
      //   <Button onPress={ () => navigation.goback() }
      //   title={ "cancelButtonName" }></Button>
      // ),
    };
  };

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
        <Text> exchange {this.props.stubStore.message} </Text>
      </View>
    )
  }

}

const styles = StyleSheet.create({
    
})

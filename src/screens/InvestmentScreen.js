import React, { Component } from 'react';
import { Container, Header, Tab, Tabs, TabHeading, Text } from 'native-base';
import { StyleSheet, View } from 'react-native';
import { inject, observer } from 'mobx-react';

@inject('pubnub')
@observer
export default class InvestmentScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: '투자내역',
    };
  };

  constructor(props) {
    super(props);
    this.pubnubChannel = "";
  }

  componentWillMount() {
    // this.props.pubnub.subscribe(this.pubnubChannel);
  }

  componentWillUnmount() {
    // this.props.pubnub.unsubscribe(this.pubnubChannel);
  }

  render() {
    return (
      <Container style={ styles.container }>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1
    }
})

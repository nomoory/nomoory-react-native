import React, { Component } from 'react';
import { Container, Header, Tab, Tabs, TabHeading, Text } from 'native-base';
import { StyleSheet, View } from 'react-native';
import { inject, observer } from 'mobx-react';
import OrderBox from '../components/OrderBox';

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
        <Tabs>
          <Tab heading={ <TabHeading><Text>주문</Text></TabHeading>}>
            <OrderBox></OrderBox>
          </Tab>
          <Tab heading={ <TabHeading><Text>호가</Text></TabHeading>}>
            <View><Text>호가</Text></View>
          </Tab>
          <Tab heading={ <TabHeading><Text>차트</Text></TabHeading>}>
            <View><Text>차트</Text></View>
          </Tab>
          <Tab heading={ <TabHeading><Text>시세</Text></TabHeading>}>
            <View><Text>시세</Text></View>
          </Tab>
          <Tab heading={ <TabHeading><Text>정보</Text></TabHeading>}>
            <View><Text>정보</Text></View>
          </Tab>
        </Tabs>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1
    }
})

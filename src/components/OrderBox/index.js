import React, { Component } from 'react';
import { 
  StyleSheet,
  View,
} from 'react-native';
import { } from 'native-base';
import { 
    inject, 
    observer 
} from 'mobx-react';
import { observable, computed } from 'mobx';
import OrderBook from './OrderBook';
import OrderForm from './OrderForm';

// @inject('tradingPairStore')
@observer
class OrderBox extends Component {
  // @computed

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
      <View style={styles.container}>
        <OrderBook></OrderBook>
        <OrderForm></OrderForm>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
});

export default OrderBox;
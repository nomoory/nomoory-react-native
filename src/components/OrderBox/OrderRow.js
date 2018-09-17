import React, { Component } from 'react';
import { 
  StyleSheet,
  View,
  TouchableOpacity
} from 'react-native';
import { Text } from 'native-base';
import { 
    inject, 
    observer 
} from 'mobx-react';
import { observable, computed } from 'mobx';

@inject('orderStore')
@observer
class OrderRow extends Component {
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
    const { side, order } = this.props;
    const isSellOrder = side === 'SELL';
    const orderRowStyle = isSellOrder ? styles.sellOrderRow : styles.buyOrderRow;
    return (
      <TouchableOpacity 
        style={ [styles.container, orderRowStyle] }
        onPress={ this._onPressOrderRow }
      >
        <View style={ styles.price }>
          <Text>{ order.price }</Text>
        </View>
        <View style={ styles.volume }>
          <Text>{ order.volume }</Text>
        </View>
      </TouchableOpacity>
    );
  }

  _onPressOrderRow = () => {
    const { side, order } = this.props;
    this._changeOrderPrice(side, order);
  }
  _changeOrderPrice = (side, order) => {
    const { orderStore } = this.props;
    orderStore.setSide(side);
    orderStore.setPrice(order.price);
  }
}

const styles = StyleSheet.create({
  container: {
    height: 20,
    flexDirection: 'row',
  },
  sellOrderRow: {
    backgroundColor: 'blue',
  },
  buyOrderRow: {
    backgroundColor: 'red'
  },
  price: {
    flex: 3
  },
  volume: {
    flex: 2
  }
});

export default OrderRow;
import React, { Component } from 'react';
import { 
  StyleSheet,
  View,
} from 'react-native';
import { Container, Header, Text, Button, Item, Input } from 'native-base';
import { 
    inject, 
    observer 
} from 'mobx-react';
import { observable, computed } from 'mobx';

@inject('tradingPairStore', 'orderStore')
@observer
class OrderForm extends Component {
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
    const order = this.props.orderStore.order;
    console.log(order);
    return (
      <Container style={ styles.container }>
        <View style={ styles.buttons }>
          <Button style={ styles.button } onPress={ this._onPressBuy }>
            <Text style={ this._isSideBuy() ? styles.selected : styles.unselected }
            >매수</Text>
          </Button>
          <Button style={ styles.button } onPress={ this._onPressSell }>
            <Text style={ this._isSideBuy() ? styles.unselected : styles.selected }
            >매도</Text>
          </Button>
        </View>
        <View style={ styles.available }>
          <Text>거래 가능</Text> 
          <Text>14,400 KRW</Text>
        </View>
        <View style={ styles.price }>
          <Text>가격</Text> 
          <Item underline>
            <Input value={ `${order.price}` } />
          </Item>
        </View>
        <View style={ styles.volume }>
          <Text>수량</Text> 
          <Item underline>
            <Input value={ `${order.volume}` } />
          </Item>
        </View>        
        <View style={ styles.limit }>
          <Text>최소주문금액</Text> 
          <Text>{ order.volumn }</Text>
        </View>        
        <View style={ styles.fee }>
          <Text>수수료(부가세 포함)</Text> 
          <Text>{ order.fee }</Text>
        </View>
        <Text style={  this._isSideBuy ? styles.selected : styles.unselected }
        >매수</Text>
      </Container>

    );
  }

  _onPressBuy = (e) => {
    this.props.orderStore.setSide('BUY');

  }
  _onPressSell = (e) => {
    this.props.orderStore.setSide('SELL');
  }
  _isSideBuy = () => {
    return this.props.orderStore.side === 'BUY';
  }

_
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    margin: 10,
    flex: 1
  },
  selected: {
    flex: 1
  },
  unselected: {
    flex: 1
  },
});

export default OrderForm;
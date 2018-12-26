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
import { observable, computed, reaction } from 'mobx';

@inject('tradingPairStore', 'orderStore')
@observer
class OrderForm extends Component {

  constructor(props) {
    super(props);
    // this.pubnubChannel = "";

    const inProgressReaction = reaction(
      () => this.props.orderStore.inProgress,
      (inProgress) => {
        // inProgress 상태에 따라 Spinner를 보여줌
      }
    )

  }

  componentDidMount() {
    // this.props.pubnub.subscribe(this.pubnubChannel);
  }
  componentWillUnmount() {
    // this.props.pubnub.unsubscribe(this.pubnubChannel);
  }

  render() {
    const { tradingPairStore, orderStore } = this.props;
    const { order, fee, amount} = orderStore;
    const { 
      base_symbol,
      quote_symbol,
    } = tradingPairStore.selectedTradingPair;
    const isSideBuy = order.side === 'BUY';

    return (
      <Container style={ styles.container }>
        <View style={ styles.buttons }>
          <Button style={ styles.button } onPress={ this._onPressBuy }>
            <Text style={ isSideBuy ? styles.selected : styles.unselected }
            >매수</Text>
          </Button>
          <Button style={ styles.button } onPress={ this._onPressSell }>
            <Text style={ isSideBuy ? styles.unselected : styles.selected }
            >매도</Text>
          </Button>
        </View>
        <View style={ styles.available }>
          <Text>거래 가능</Text> 
          <Text>14,400 { quote_symbol }</Text>
        </View>
        <View style={ styles.price }>
          <Text>{ `가격 (${base_symbol})` }</Text> 
          <Item underline>
            <Input 
              onChangeText={ this.onChangePrice }
              value={ `${order.price}` } 
              keyboardType={ 'numeric' }
            />
          </Item>
        </View>
        <View style={ styles.volume }>
          <Text>{ `수량 (${quote_symbol})` }</Text> 
          <Item underline>
            <Input 
              onChangeText={ this.onChangeVolume }
              placeholder={`최소 ${0.01}`} 
              keyboardType={ 'numeric' }   
              value={ `${order.volume}` }
            />
          </Item>
        </View>  
        <View style={ styles.limit }>
          <Text>{ (isSideBuy ? '구매' : '판매') + ' 금액' }</Text> 
          <Text>{ amount + ' ' + base_symbol }</Text>
        </View>
        <View style={ styles.fee }>
          <Text>수수료(부가세 포함)</Text> 
          <Text>{ fee + '%' }</Text>
        </View>
        <Button onPress={ this._onPressOrder }>
          <Text>{ isSideBuy ? '구매' : '판매' }</Text>
        </Button>
      </Container>
    );
  }

  _onPressBuy = (e) => {
    this.props.orderStore.setSide('BUY');
  }
  _onPressSell = (e) => {
    this.props.orderStore.setSide('SELL');
  }
  _onPressOrder = (e) => {
    this.props.orderStore.registerOrder();
  }
  _onChangePrice = (text) => {
    this.props.orderStore.setPrice(parseFloat(text));
  }
  _onChangeVolume = (text) => {
    this.props.orderStore.setVolume(parseFloat(text));
  }
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
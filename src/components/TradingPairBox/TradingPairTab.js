import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Container, Content, Button, Text} from 'native-base';
import { 
  inject, 
  observer 
} from 'mobx-react';
import { observable } from 'mobx';

const buttons = [
  { title: '원화거래', symbol: 'KRW' },
  { title: 'BTC', symbol: 'BTC' },
  { title: 'CT', symbol: 'CT' },
  { title: 'USDT', symbol: 'USDT' },
];

@inject('tradingPairStore')
@observer
class TradingPairTab extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        {
          buttons.map(button => {
            return (
              <Button key={button.symbol} onPress={this._onPressTab(button.symbol)}>
                <Text>{button.title}</Text>
              </Button>
            );
          })
        }
      </View>
    );
  }
  
  _onPressTab = (symbol) => {
    return (e) => {
      this.props.tradingPairStore.setSelectedTradingPairTab(symbol);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 50
  }
})
export default TradingPairTab;
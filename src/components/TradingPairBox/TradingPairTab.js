import React, { Component } from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';
import { inject, observer } from 'mobx-react';

const buttons = [
    { title: '원화거래', symbol: 'KRW' },
    { title: 'BTC', symbol: 'BTC' },
    { title: 'CT', symbol: 'CT' },
    { title: 'USDT', symbol: 'USDT' },
];

@inject('tradingPairStore')
@observer
class TradingPairTab extends Component {
    _onPressTab = (symbol) => (e) => {
        this.props.tradingPairStore.setSelectedTradingPairTab(symbol);
    }

    render() {
        return (
            <View style={styles.container}>
                {
                    buttons.map(button => (
                        <Button key={button.symbol} onPress={this._onPressTab(button.symbol)}>
                            <Text>{button.title}</Text>
                        </Button>
                    ))
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 50
    }
})
export default TradingPairTab;
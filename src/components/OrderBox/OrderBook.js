import React, { Component } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { inject, observer } from 'mobx-react';
import OrderRow from './OrderRow';
import commonStyle from '../../styles/commonStyle';

@inject('pubnub', 'orderbookStore', 'tradingPairStore')
@observer
export default class Orderbook extends Component {
    constructor(props) {
        super(props);
        this.pubnubChannel = `ORDERBOOK_${this.props.tradingPairStore.selectedTradingPairName}`;
        this.props.pubnub.subscribe(this.pubnubChannel);
    }
    
    componentWillUnmount() { this.props.pubnub.unsubscribe(this.pubnubChannel); }

    render() {
        const { sellOrders, buyOrders } = this.props.orderbookStore;
        const { close_price } = this.props.tradingPairStore.selectedTradingPair || {};
    
        return (
            <View style={styles.container}>
                <ScrollView style={styles.scrollContainer}>
                    {
                        sellOrders.map((order, index) =>
                            <OrderRow key={'sell_' + index} side={'SELL'} order={order} closePrice={close_price} />
                        )
                    }
                    {
                        buyOrders.map((order, index) =>
                            <OrderRow key={'buy_' + index} side={'BUY'} order={order} closePrice={close_price}/>
                        )
                    }
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fafafa',
        flex: 1,
        
    },
    styleContainer: {
        flex: 1
    },
});

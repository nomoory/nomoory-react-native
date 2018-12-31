import React, { Component } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { inject, observer } from 'mobx-react';
import OrderRow from './OrderRow';

@inject('pubnub', 'orderbookStore')
@observer
export default class Orderbook extends Component {
    constructor(props) {
        super(props);
        this.pubnubChannel = "ORDERBOOK";
    }
    componentDidMount() { this.props.pubnub.subscribe(this.pubnubChannel); }
    componentWillUnmount() { this.props.pubnub.unsubscribe(this.pubnubChannel); }

    render() {
        const { sellOrders, buyOrders } = this.props.orderbookStore;

        return (
            <View style={styles.container}>
                <ScrollView style={styles.scrollContainer}>
                    {
                        sellOrders.map((order, index) =>
                            <OrderRow key={'sell_' + index} side={'SELL'} order={order} />
                        )
                    }
                    {
                        buyOrders.map((order, index) =>
                            <OrderRow key={'buy_' + index} side={'BUY'} order={order} />
                        )
                    }
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        
        borderStyle: 'solid',
        borderRightWidth: 1,
        borderRightColor: '#dedfe0',
    },
    styleContainer: {
        flex: 1
    },
});

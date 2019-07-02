import React, { Component } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { inject, observer } from 'mobx-react';
import OrderRow from './OrderRow';
import commonStyle from '../../styles/commonStyle';
import { computed } from 'mobx';

@inject('orderbookStore', 'tradingPairStore')
@observer
export default class Orderbook extends Component {
    @computed
    get orders() {
        const { sellOrders, buyOrders } = this.props.orderbookStore;
        return [ ...sellOrders, ...buyOrders ];
    }
    render() {
        const { close_price, open_price } = this.props.tradingPairStore.selectedTradingPair || {};

        return (
            <View style={styles.container}>
                <FlatList
                    data={this.orders}
                    initialNumToRender={30}
                    // onEndReachedThreshold={1}
                    // onEndReached={this.onEndReached}
                    // refreshing={this.state.refreshing}
                    // onRefresh={this.onRefresh}
                    enableEmptySections={true}
                    renderItem={({item, index}) => {
                        return (
                            <OrderRow
                                key={`sell_${index}`}
                                side={item.side}
                                order={item}
                                closePrice={close_price}
                                openPrice={open_price}
                            />
                        );
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fafafa',
        flex: 1,
    },
});

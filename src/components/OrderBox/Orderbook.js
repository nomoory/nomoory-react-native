import React, { Component } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { inject, observer } from 'mobx-react';
import OrderRow from './OrderRow';
import commonStyle from '../../styles/commonStyle';
import { computed, reaction } from 'mobx';
import { rowHeight } from './OrderRow';

@inject('orderbookStore', 'tradingPairStore')
@observer
export default class Orderbook extends Component {    
    componentDidMount() {
        setTimeout(() => {
            this.flatListRef.scrollToIndex({
                animated: false,
                index: 9,
            });
        }, 0);
    }

    componentWillUnmount() {
        if (this.orderLengthReaction) {
            this.orderLengthReaction();
        }
    }

    @computed
    get orders() {
        if (this.props.orderbookStore.selectedOrderbook) {
            const sellOrders = this.props.orderbookStore.selectedOrderbook.sellOrders || {};

            const buyOrders = this.props.orderbookStore.selectedOrderbook.buyOrders || {};
            return [...sellOrders, ...buyOrders];
        } else {
            return [];
        }
    }

    getItemLayout = (data, index) => (
        { length: rowHeight, offset: rowHeight * index, index }
    )

    render() {
        const { close_price, open_price } = this.props.tradingPairStore.selectedTradingPair || {};
    
        return (
            <View style={styles.container}>
                <FlatList
                    ref={(ref) => { this.flatListRef = ref; }}
                    getItemLayout={this.getItemLayout}
                    data={this.orders.length ? this.orders : []}
                    // initialScrollIndex={8}
                    initialNumToRender={30}
                    // onEndReachedThreshold={1}
                    // onEndReached={this.onEndReached}
                    // refreshing={this.state.refreshing}
                    // onRefresh={this.onRefresh}
                    enableEmptySections={true}
                    emptyView={() => null}
                    renderItem={({ item, index }) => {
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

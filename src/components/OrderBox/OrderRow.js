import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { inject, observer } from 'mobx-react';
import Decimal from '../../utils/decimal';
import number from '../../utils/number';

@inject('orderStore', 'orderbookStore')
@observer
export default class OrderRow extends Component {
    _onPressOrderPrice = () => {
        const { order } = this.props;
        this.props.orderStore.setPrice(order.price);
    }

    _onPressOrderVolume = () => {
        const { order } = this.props;
        this.props.orderStore.setVolume(order.volume);
    }

    render() {
        const { side, order } = this.props;
        const isSellOrder = side === 'SELL';
        const orderRowStyle = isSellOrder ? styles.sellOrderRow : styles.buyOrderRow;
        const { maxOrderVolume } = this.props.orderbookStore;
        const dynamicStyle = 
            StyleSheet.create({
                volumnBar: {
                    width: 
                        order.volume && maxOrderVolume ? 
                        Decimal(order.volume).div(maxOrderVolume).mul(100).toFixed(0, Decimal.ROUND_FLOOR) + '%' :
                        0
                }
            });
        return (
            <View
                style={[styles.container, orderRowStyle, styles[this.props.side], 
                    order.price && this.props.closePrice && Decimal(order.price).equals(this.props.closePrice) ? 
                    styles.recentlyTraded : null]}
            >
                <TouchableOpacity style={[styles.price]} onPress={this._onPressOrderPrice}>
                    <Text style={styles.priceText}>{number.putComma(Decimal(order.price).toFixed())}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.volume} onPress={this._onPressOrderVolume}>
                    <View style={[dynamicStyle.volumnBar, styles['volumeBar'], styles['volumeBar_' + side]]} />
                    <Text style={styles.volumeText}>{number.putComma(Decimal(order.volume).toFixed())}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 42,
        flexDirection: 'row',
        alignItems: 'center',
        borderStyle: 'solid',
        borderTopWidth: 1,
        borderTopColor: '#dedfe0',
        width: '100%'
    },
    sellOrderRow: {
        backgroundColor: '#f3fbff',
    },
    buyOrderRow: {
        backgroundColor: '#fff4f8'
    },
    price: {
        flex: 4,
        alignItems: 'flex-end',
        // paddingRight: 4,     
        height: '100%',
        justifyContent: 'center',

        borderStyle: 'solid',
        borderRightWidth: 1,
        borderRightColor: '#dedfe0',
    },
    priceText: {
        fontSize: 13,
        fontWeight: '600',
        marginRight: 4,     
    },
    volume: {
        flex: 5,
        alignItems: 'flex-start',
        height: '100%',
        justifyContent: 'center',
    },
    volumeBar: {
        position: 'absolute',
        height: '100%',
    },
    volumeBar_SELL: {
        backgroundColor: '#cbf5fe'
    },
    volumeBar_BUY: {
        backgroundColor: '#ffdeea'
    },
    volumeText: {
        fontSize: 11,
        fontWeight: '500',
        marginLeft: 4
    },

});
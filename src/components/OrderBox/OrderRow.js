import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { inject, observer } from 'mobx-react';
import Decimal from '../../utils/decimal';
import number from '../../utils/number';
import commonStyle from '../../styles/commonStyle';

@inject('orderStore', 'orderbookStore')
@observer
export default class OrderRow extends Component {
    _onPressOrderPrice = () => {
        const { order } = this.props;
        this.props.orderStore.setPrice(order.price);
    }

    render() {
        const { side, order } = this.props;
        const isSellOrder = side === 'SELL';
        const orderRowStyle = isSellOrder ? styles.sellOrderRow : styles.buyOrderRow;

        if (!order) {
            return (
                <View
                    style={[
                        styles.container, orderRowStyle, styles[this.props.side], 
                    ]}
                >
                    <TouchableOpacity style={[styles.price]} />
                    <TouchableOpacity style={styles.volume} />
                </View>
            );
        }
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
        const openPrice = this.props.openPrice;
        const isLessThanOpenPrice = openPrice && order.price && Decimal(order.price).lessThan(openPrice);
        const isBiggerThanOpenPrice = openPrice && order.price && Decimal(order.price).greaterThan(openPrice);
    
        return (
            <View
                style={[
                    styles.container, orderRowStyle, styles[this.props.side], 
                    order.price && this.props.closePrice && Decimal(order.price).equals(this.props.closePrice) ? 
                    styles.recentlyTraded : null]}
            >
                <TouchableOpacity style={[styles.price]} onPress={this._onPressOrderPrice}>
                    <Text 
                        style={[
                            styles.priceText,
                            isLessThanOpenPrice ? styles.blueText : null,
                            isBiggerThanOpenPrice ? styles.redText : null,
                        ]}>
                            {number.putComma(Decimal(order.price).toFixed())}
                    </Text>
                </TouchableOpacity>
                <View style={styles.volume}>
                    <View style={[dynamicStyle.volumnBar, styles['volumeBar'], styles['volumeBar_' + side]]} />
                    <Text style={styles.volumeText}>{
                        Decimal(order.volume).greaterThan(10)
                        ? number.putComma(Decimal(order.volume).toFixed(0))
                        : number.putComma(Decimal(order.volume).toFixed(3))
                    }</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 32,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',

        borderStyle: 'solid',
        borderWidth: 0.5,
        borderColor: '#dedfe0',
    },
    sellOrderRow: {
        backgroundColor: '#f3fbff',
    },
    buyOrderRow: {
        backgroundColor: '#fff4f8'
    },
    price: {
        flex: 3,
        alignItems: 'flex-end',
        height: '100%',
        justifyContent: 'center',

        borderStyle: 'solid',
        borderRightWidth: 1,
        borderRightColor: '#dedfe0',
    },
    priceText: {
        fontSize: 12,
        marginRight: 4,     
    },
    volume: {
        flex: 2,
        alignItems: 'flex-start',
        height: '100%',
        justifyContent: 'center',
    },
    volumeBar: {
        position: 'absolute',
        height: '100%',
    },
    volumeBar_SELL: {
        backgroundColor: '#dbf0ff'
    },
    volumeBar_BUY: {
        backgroundColor: '#ffdbe8'
    },
    volumeText: {
        fontSize: 10,
        fontWeight: '400',
        marginLeft: 4
    },
    recentlyTraded: {
        borderColor: 'black',
        borderWidth: 2
    },
    blueText: {
        color: commonStyle.color.coblicBlue
    },
    redText: {
        color: commonStyle.color.coblicRed
    },

});
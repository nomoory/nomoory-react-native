import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { inject, observer } from 'mobx-react';
import Decimal from '../../utils/decimal';
import number from '../../utils/number';
import commonStyle from '../../styles/commonStyle';
import { computed } from 'mobx';

export const rowHeight = 40;

@inject('orderStore', 'orderbookStore', 'tradingPairStore')
@observer
export default class OrderRow extends Component {
    @computed
    get percentage_decimal() {
        let tradingPair = this.props.tradingPairStore.selectedTradingPair || {};
        let price = this.props.order ? this.props.order.price : '';
        let percentage = '';
        let price_decimal = Decimal(price);
        if (tradingPair.open_price) {
            percentage = price_decimal.minus(tradingPair.open_price).div(tradingPair.open_price).mul(100).toFixed(2, Decimal.ROUND_DOWN);
        } else {
            return null;
        }
        let percentage_decimal = Decimal(percentage || 0);
        return percentage_decimal;
    }
    _onPressOrderPrice = () => {
        const { order } = this.props;
        this.props.orderStore.setPrice(order.price);
    }

    render() {
        const { side, order } = this.props;
        const isSellOrder = side === 'SELL';
        const orderRowStyle = isSellOrder ? styles.sellOrderRow : styles.buyOrderRow;

        if (
            !order.key
        ) {
            return (
                <View
                    style={[
                        styles.container, orderRowStyle, styles[side], 
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
                    <Text 
                        style={[
                            styles.dayBeforeRateText,
                            isLessThanOpenPrice ? styles.blueText : null,
                            isBiggerThanOpenPrice ? styles.redText : null,
                        ]}>
                            {
                                this.percentage_decimal === null 
                                ? '-'
                                : number.putComma(this.percentage_decimal.toFixed())
                            }%
                    </Text>
                </TouchableOpacity>
                <View style={styles.volume}>
                    <View
                        style={[
                            dynamicStyle.volumnBar,
                            styles['volumeBar'],
                            styles['volumeBar_' + side],
                        ]}
                    />
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
        height: rowHeight,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',

        borderStyle: 'solid',
        borderWidth: 0.7,
        borderColor: 'white',
    },
    sellOrderRow: {
        backgroundColor: '#f0f6fe',
    },
    buyOrderRow: {
        backgroundColor: '#fcf0ef'
    },
    price: {
        flex: 3,
        alignItems: 'flex-end',
        height: '100%',
        justifyContent: 'center',

        borderStyle: 'solid',
        borderRightWidth: 1.4,
        borderRightColor: 'white',
    },
    priceText: {
        fontSize: 12,
        marginRight: 4,     
    },
    dayBeforeRateText: {
        fontSize: 10,
        fontWeight: '200',
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
        top: '20%',
        height: '60%',
    },
    volumeBar_SELL: {
        backgroundColor: '#d1e0f4'
    },
    volumeBar_BUY: {
        backgroundColor: '#f2d9d7'
    },
    volumeText: {
        fontSize: 10,
        fontWeight: '400',
        marginLeft: 4
    },
    recentlyTraded: {
        borderColor: 'black',
        borderWidth: 1.2
    },
    blueText: {
        color: commonStyle.color.brandBlue
    },
    redText: {
        color: commonStyle.color.coblicRed
    },

});
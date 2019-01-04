import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text } from 'native-base';
import { inject, observer } from 'mobx-react';
import Decimal from '../../utils/decimal';

@inject('orderStore')
@observer
export default class OrderRow extends Component {

    _onPressOrderRow = () => {
        const { side, order } = this.props;
        this._changeOrderPrice(side, order);
    }
    _changeOrderPrice = (side, order) => {
        const { orderStore } = this.props;
        orderStore.setSide(side);
        orderStore.setPrice(order.price);
    }

    render() {
        const { side, order } = this.props;
        const isSellOrder = side === 'SELL';
        const orderRowStyle = isSellOrder ? styles.sellOrderRow : styles.buyOrderRow;
        return (
            <TouchableOpacity
                style={[styles.container, orderRowStyle, styles[this.props.side]]}
                onPress={this._onPressOrderRow}
            >
                <View style={styles.price}>
                    <Text style={styles.priceText}>{Decimal(order.price).toFixed()}</Text>
                </View>
                <View style={styles.volume}>
                    <Text style={styles.volumeText}>{Decimal(order.volume).toFixed()}</Text>
                </View>
            </TouchableOpacity>
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
        paddingRight: 4,     
        height: '100%',
        justifyContent: 'center',

        borderStyle: 'solid',
        borderRightWidth: 1,
        borderRightColor: '#dedfe0',
    },
    priceText: {
        fontSize: 12
    },
    volume: {
        flex: 3,
        alignItems: 'flex-start',
        height: '100%',
        justifyContent: 'center',
        paddingLeft: 4,
    },
    volumeText: {
        fontSize: 12
    },

});
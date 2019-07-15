import React, { Component } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { inject, observer } from 'mobx-react';
import number from '../../utils/number'; 
import momentHelper from '../../utils/momentHelper';
import Decimal from '../../utils/decimal';
import { computed } from 'mobx';
import commonStyle from '../../styles/commonStyle';

@inject('realtimeTradeHistoryStore', 'tradingPairStore')
@observer
export default class MiniRealtimeTradeHistory extends Component {
    @computed
    get colorClassName_display() {
        const { price } = this.props.realtimeTradeHistoryStore;
        let style = null;

        if (!price) return style;
        let { open_price } = this.props.tradingPairStore.selectedTradingPair || {};
        if (open_price) {
            if (Decimal(open_price).lessThan(price)) {
                style = styles.RED;
            }
            if (Decimal(open_price).greaterThan(price)) {
                style = styles.BLUE;
            }
        }

        return style;
    }

    @computed
    get price_display() {
        const price = this.props.realtimeTrade.price;
        if (!price) return '-';
        return putComma(getFixedValueBySymbol(price, this.props.orderStore.baseSymbol));
    }

    @computed
    get volume_display() {
        const volume = this.props.realtimeTrade.volume;
        if (!volume) return '-';
        return putComma(Decimal(volume).toFixed());
    }

    @computed
    get amount_display() {
        const { price, volume } = this.props.realtimeTrade
        if (!price || !volume) return '-';
        let amount = Decimal(price).mul(volume).toFixed();
        if (amount[0] == '0') return amount;
        return putComma(getFixedValueBySymbol(amount, this.props.orderStore.quoteSymbol));
    }

    @computed
    get dateAndTime() { return momentHelper.getLocaleDatetime(this.props.realtimeTrade.created).split(' '); }


    @computed
    get realtimeTradeHistoryHead() {
        return (
            <View style={[styles.head]}>
                <View style={[styles.column, styles.time]}>
                    <Text style={[styles.headColumnText]}>실시간</Text>
                </View>
                <View style={[styles.column]}>
                    <Text style={[styles.headColumnText]}>체결가격</Text>
                </View>
                <View style={[styles.column]}>
                    <Text style={[styles.headColumnText]}>체결수량</Text>
                </View>
            </View>
        );
    };

    render() {
        const { realtimeTrades } = this.props.realtimeTradeHistoryStore;

        return (
            <View style={[styles.container]}>
                {this.realtimeTradeHistoryHead}                    
                <FlatList
                    style={[styles.container]}
                    data={realtimeTrades ? realtimeTrades : []}
                    enableEmptySections={true}
                    renderItem={({item, index}) => {
                        let {
                            price,
                            volume,
                            created,
                            side,
                        } = item || {};
                        let time = momentHelper.getLocaleHourMinuteSecond(created);
                        

                        return (
                            <View 
                                key={index}
                                style={[styles.tuple, index % 2 === 0 ? styles['even'] : styles['odd']]}
                            >
                                <View style={[
                                    styles.column,
                                    styles.created,
                                    styles.time
                                ]}
                                >
                                    <Text style={[styles.tupleColumnText, styles.timeText]}>{time ? time : ''}</Text>
                                </View>
                                <View style={[
                                    styles.column,
                                    styles.price
                                ]}>
                                    <Text style={[
                                        styles.tupleColumnText,
                                        styles.priceText,
                                        styles[side],
                                    ]}>
                                        {number.putComma(Decimal(price).toFixed())}
                                    </Text>
                                </View>
                                <View style={[
                                    styles.column,
                                    styles.volume,
                                ]}>
                                    <Text style={[
                                        styles.tupleColumnText,
                                        styles.volumeText,
                                        styles[side],
                                    ]}>
                                        {
                                            number.putComma(
                                                Decimal(volume).greaterThan(10)
                                                    ? Decimal(Decimal(volume).toFixed(2)).toFixed()
                                                    : Decimal(volume).toFixed()
                                            )
                                        }
                                    </Text>
                                </View>
                            </View>
                        );
                    }}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        flexDirection: 'column'
    },
    head: {
        width: '100%',
        height: 35,
        flexDirection: 'row',
        backgroundColor: commonStyle.color.borderColor,

        borderStyle: 'solid',

    },
    headColumnText: {
        fontSize: 11,
    },
    column: {
        flex: 1,
        flexDirection: 'column',
        borderStyle: 'solid',

        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    tuple: {
        width: '100%',
        height: 35,
        flexDirection: 'row',
        borderStyle: 'solid',
        borderRightWidth: 1,
        borderRightColor: commonStyle.color.borderColor,
    },
    odd: {
        backgroundColor: '#f7f8fa',
    },
    tupleColumnText: {
        fontSize: 11
    },
    created: {
        flexDirection: 'row'
    },
    time: {
        flex: 0.8,
    },
    timeText: {
        color: '#747474'
    },
    SELL: {
        color: '#da5f6e',
    },
    BUY: {
        color: '#0052f3',
    }
});
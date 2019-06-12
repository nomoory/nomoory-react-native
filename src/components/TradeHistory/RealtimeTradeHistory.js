import React, { Component } from 'react';
import { StyleSheet, View, Text, ListView } from 'react-native';
import { inject, observer } from 'mobx-react';
import number from '../../utils/number';
import momentHelper from '../../utils/momentHelper';
import Decimal from '../../utils/decimal';
import { computed } from 'mobx';

@inject('realtimeTradeHistoryStore', 'tradingPairStore')
@observer
export default class RealtimeTradeHistory extends Component {
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
        if (!price || !volume ) return '-';
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
                <View style={[styles.column, styles.columnItem]}>
                    <Text style={[styles.headColumnText]}>체결시간</Text>
                </View>
                <View style={[styles.column, styles.columnItem]}>
                    <Text style={[styles.headColumnText]}>체결가격</Text>
                </View>
                <View style={[styles.column, styles.columnItem]}>
                    <Text style={[styles.headColumnText]}>체결수량</Text>
                </View>
                <View style={[styles.column, styles.columnItem]}>
                    <Text style={[styles.headColumnText]}>체결금액</Text>
                </View>
            </View>
        );
    };

    _renderRealtimeTradeHistoryBody() {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const dataSource = ds.cloneWithRows(this.props.realtimeTradeHistoryStore.realtimeTrades);
        return (
            <ListView style={[styles.container]}
                dataSource={dataSource}
                renderRow={(realtimeTrade, mode, index) => {
                    let { 
                        price,
                        volume,
                        created,
                        side,
                    } = realtimeTrade;
                    console.log(realtimeTrade);
                    let amount = Decimal(price || 0).mul(volume || 0).toFixed();
                    let dateAndTime_string = momentHelper.getLocaleDatetime(created);
                    let [ date, time ] = dateAndTime_string ? dateAndTime_string.split(' ') : [];

                    return (
                        <View style={[styles.tuple, index % 2 === 0 ? styles['even'] : styles['odd'] ]} key={index}>
                            <View style={[
                                styles.column, 
                                styles.columnItem,
                                styles.created]}
                            >
                                <Text style={[styles.tupleColumnText, styles.dateText]}>{date ? date : ''} </Text>
                                <Text style={[styles.tupleColumnText, styles.timeText]}>{time ? time : ''}</Text> 
                            </View>
                            <View style={[
                                styles.column,
                                styles.columnItem,
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
                                styles.columnItem,
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
                                            ? Decimal(Decimal(volume).toFixed(3)).toFixed()
                                            : Decimal(volume).toFixed()
                                        )
                                    }
                                </Text>
                            </View>
                            <View style={[
                                styles.column,
                                styles.columnItem,
                                styles.amount,
                            ]}>
                                <Text style={[
                                    styles.tupleColumnText,
                                    styles.amountText,
                                    styles[side],
                                ]}>
                                    {number.putComma(Decimal(amount).toFixed(0))}
                                </Text>
                            </View>
                        </View>
                    );
                }}
            />
        );
    }

    render() {
        return (
            <View style={[styles.container]}>
                {this.realtimeTradeHistoryHead}
                {this._renderRealtimeTradeHistoryBody()}
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
        backgroundColor: "#f7f8fa",

        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: '#dedfe0',
        borderTopWidth: 1,
        borderTopColor: '#dedfe0',
        
    },
    headColumnText: {
        color: '#333333',
        fontSize: 14,
    },
    column: {
        flex: 1,
        flexDirection: 'column',
        width: '100%'
    }, 
    columnItem: {
        borderStyle: 'solid',
        borderWidth: 0.5,
        borderColor: '#dedfe0',

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
        borderRightColor: '#dedfe0',
    },
    odd: {
        backgroundColor: '#f7f8fa',
    },
    tupleColumnText: {
        fontSize: 12
    },
    created: {
        flexDirection: 'row'
    },
    dateText: {
        color: '#333'
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
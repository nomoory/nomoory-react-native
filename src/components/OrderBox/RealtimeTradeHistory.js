import React, { Component } from 'react';
import commonStyle from '../../styles/commonStyle';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { inject, observer } from 'mobx-react';
import number from '../../utils/number';
import Decimal from '../../utils/decimal';
import { reaction } from 'mobx';

@inject('pubnub', 'tradingPairStore', 'realtimeTradeHistoryStore')
@observer
export default class RealtimeTradeHistory extends Component {
    constructor(props) {
        super(props);
        this.trading_pair_reaction = reaction(
            () => props.tradingPairStore.selectedTradingPairName,
            (tradingPairName) => {
                this.props.pubnub.unsubscribe(this.pubnub_channel);
                this.pubnub_channel = `TRADE_${tradingPairName}`;
                this.props.pubnub.subscribe(this.pubnub_channel);
            }
        );
        this.pubnub_channel = `TRADE_${this.props.tradingPairStore.selectedTradingPairName}`;
        this.props.pubnub.subscribe(this.pubnub_channel);
    }
    
    componentWillUnmount() {
        this.props.pubnub.unsubscribe(this.pubnub_channel);
    }

    render() {
        let { realtimeTrades } = this.props.realtimeTradeHistoryStore;
        let { quote_symbol } = this.props.tradingPairStore.selectedTradingPair || {};

        return (
            <View style={[styles.container]}>
                <View style={[styles.realtimeTradeHead]}>
                    <View style={[styles.priceTitle, styles.headColumn]}>
                        <Text style={[styles.realtimeTradeHeadText]}>체결가</Text>
                    </View>
                    <View style={[styles.volumeTitle, styles.headColumn]}>
                        <Text style={[styles.realtimeTradeHeadText]}>체결량</Text>
                    </View>
                </View>
                <ScrollView style={[styles.realtimeTradeBody]}>
                    <View>
                        {realtimeTrades.map((realtimeTrade, index) => {
                            let { price, volume, side } = realtimeTrade;
                            return (
                                <View style={[styles.realtimeTradeRow]}>
                                    <View style={[styles.realtimeTradePrice, styles.priceColumn]}>
                                        <Text style={[styles.realtimeTradePriceText]}>{
                                            number.putComma(number.getFixedPrice(price, quote_symbol))
                                        }</Text>
                                    </View>
                                    <View style={[styles.realtimeTradeVolume, styles[side], styles.volumeColumn]}>
                                        <Text style={[styles.realtimeTradePriceText, commonStyle[side]]}>{
                                            number.putComma(volume, 4)
                                        }</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    realtimeTradeHead: {
        height: 26,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 12,
        paddingRight: 12,
    },
    realtimeTradeHeadText: {
        fontWeight: '600'
    },
    headColumn: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    realtimeTradeBody: {
        paddingTop: 6,
        flex: 1,
    },
    realtimeTradeRow: {
        height: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',        
        paddingLeft: 12,
        paddingRight: 12,

    },
});

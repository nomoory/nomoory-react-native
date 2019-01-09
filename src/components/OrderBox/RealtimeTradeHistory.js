import React, { Component } from 'react';
import commonStyle from '../../styles/commonStyle';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Container, Header, Text, Button, Item, Input } from 'native-base';
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
C    }

    render() {
        let { realtimeTrades } = this.props.realtimeTradeHistoryStore;
        let { quote_symbol } = this.props.tradingPairStore.selectedTradingPair || {};

        return (
            <Container style={[styles.container, styles.realtimeTradeTable]}>
                <View style={[styles.realtimeTradeHead]}>
                    <View style={[styles.priceTitle, styles.priceColumn]}><Text >체결가</Text></View>
                    <View style={[styles.volumeTitle, styles.volumeColumn]}><Text >체결량</Text></View>
                </View>
                <View style={[styles.realtimeTradeBody]}>
                    <ScrollView>
                        {realtimeTrades.map((realtimeTrade, index) => {
                            let { price, volume, side } = realtimeTrade;
                            return (
                                <View style={[styles.realtimeTradeRow]} key={index}>
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
                    </ScrollView>
                </View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        flexDirection: 'column'
    },
    realtimeTradeHead: {
        height: 30,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    realtimeTradeBody: {
        flex: 1,
        flexDirection: 'column'
    },
    realtimeTradeRow: {
        height: 30,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
});

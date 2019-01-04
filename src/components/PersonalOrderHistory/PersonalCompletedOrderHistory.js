import React, { Component } from 'react';
import commonStyle from '../../styles';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Container, Header, Text, Button, Item, Input } from 'native-base';
import { inject, observer } from 'mobx-react';
import number from '../../utils/number';
import Decimal from '../../utils/decimal';

@inject('pubnub', 'tradingPairStore', 'realtimeTradeHistoryStore')
@observer
export default class PersonalCompletedOrderHistory extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        let { realtimeTrades } = this.props.realtimeTradeHistoryStore;
        let { quote_symbol } = this.props.tradingPairStore.selectedTradingPair || {};

        return (
            <Container style={[styles.container]}>
                <View style={[styles.container]}>
                    <View style={[styles.priceTitle, styles.priceColumn]}><Text >체결가</Text></View>
                    <View style={[styles.volumeTitle, styles.volumeColumn]}><Text >체결량</Text></View>
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
});

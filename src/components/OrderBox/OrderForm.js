import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Container, Text } from 'native-base';
import { inject, observer } from 'mobx-react';
import { observable, action } from 'mobx';
import BuyOrderForm from './BuyOrderForm';
import SellOrderForm from './SellOrderForm';
import RealtimeTradeHistory from './RealtimeTradeHistory';

@inject('orderStore')
@observer
export default class OrderForm extends Component {
    @observable selectedTabType = 'BUY';

    _onPressBuy = action((e) => {
        this.props.orderStore.setSide('BUY');
        this.selectedTabType = 'BUY';
    });
    _onPressSell = action((e) => {
        this.props.orderStore.setSide('SELL');
        this.selectedTabType = 'SELL';
    });
    _onPressRealtimeTrade = action((e) => {
        this.selectedTabType = 'REALTIME_TRADE_HISTORY';
    });

    render() {
        return (
            <Container style={styles.container}>
                <View style={styles.buttons}>
                    <TouchableOpacity style={[styles.button, this.selectedTabType === 'BUY' ? styles.selected : styles.unselected]} onPress={this._onPressBuy}>
                        <Text style='button-text'>매수</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, this.selectedTabType === 'SELL' ? styles.selected : styles.unselected]} onPress={this._onPressSell}>
                        <Text style='button-text'>매도</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, this.selectedTabType === 'REALTIME_TRADE_HISTORY' ? styles.selected : styles.unselected]} onPress={this._onPressRealtimeTrade}>
                        <Text style='button-text'>실시간</Text>
                    </TouchableOpacity>
                </View>
                { this.selectedTabType === 'BUY' && <BuyOrderForm /> }
                { this.selectedTabType === 'SELL' && <SellOrderForm /> }
                { this.selectedTabType === 'REALTIME_TRADE_HISTORY' && <RealtimeTradeHistory /> }
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttons: {
        height: 40,
        width: '100%',
        flexDirection: 'row',
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selected: {
        flex: 1,
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: '#26282d',
    },
    unselected: {
        flex: 1,   
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: '#dedfe0',
    },
});
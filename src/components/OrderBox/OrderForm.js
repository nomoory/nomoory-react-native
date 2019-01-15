import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
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
            <View style={styles.container}>
                <View style={styles.buttons}>
                    <TouchableOpacity style={[styles.button, this.selectedTabType === 'BUY' ? styles.selectedBuy : styles.unselected]} onPress={this._onPressBuy}>
                        <Text style={[styles.buttonText, this.selectedTabType === 'BUY' ? styles.selectedBuyText : null ]}>매수</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, this.selectedTabType === 'SELL' ? styles.selectedSell : styles.unselected]} onPress={this._onPressSell}>
                        <Text style={[styles.buttonText, this.selectedTabType === 'SELL' ? styles.selectedSellText : null ]}>매도</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, this.selectedTabType === 'REALTIME_TRADE_HISTORY' ? styles.selectedHistory : styles.unselected]} onPress={this._onPressRealtimeTrade}>
                        <Text style={[styles.buttonText, this.selectedTabType === 'REALTIME_TRADE_HISTORY' ? styles.selectedHistoryText : null]}>실시간</Text>
                    </TouchableOpacity>
                </View>
                { this.selectedTabType === 'BUY' && <BuyOrderForm orderFormStyle={orderFormStyle}/> }
                { this.selectedTabType === 'SELL' && <SellOrderForm orderFormStyle={orderFormStyle}/> }
                { this.selectedTabType === 'REALTIME_TRADE_HISTORY' && <RealtimeTradeHistory /> }
            </View>
        );
    }
}

const orderFormStyle = StyleSheet.create({
    // liquid
    liquidContainer: {
        flexDirection: 'column',
        marginTop: 5
    },
    liquidTitle: {
        fontWeight: '600',
        fontSize: 16,
    },
    liquidContentContainer: {
        marginTop: 6,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    liquidContentText: {
        fontWeight: '400',
        fontSize: 15
    },
    liquidContentUnitText: {
        fontWeight: '600',
        fontSize: 15,
        color: '#747474',
        marginLeft: 6
    },

    // price text input
    inputContainer: {
        marginTop: 10,
        width: '100%',
        flexDirection: 'row',
    },
    textInput: {
        width: '100%',
        paddingRight: 42,
        borderWidth: 1,
        textAlign: 'right',
        height: 36,
        borderRadius: 4,
        backgroundColor: '#ffffff',
        borderColor: '#a2abb6',
        backgroundWidth: 0.5,
        fontSize: 12,
    },
    inputTitleContainer: {
        left: 10,
        top: 10.5,
        position: 'absolute',
    },
    inputTitle: {
        color: '#747474',
        fontWeight: '500',
    },
    inputUnitContainer: {
        right: 10,
        top: 11.5,
        position: 'absolute',
    },
    inputUnit: {
        color: '#747474',
        fontWeight: '500',
        fontSize: 11
    },
    setPriceButtonsContainer: {
        marginTop: 6,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%',
    },
    setPriceButtons: {
        flexDirection: 'row',
        borderRadius: 5,
        borderWidth: 1.5,
        borderColor: '#d8dbde',
    },
    emptySpace: {
        flex: 1,
    },
    priceButton: {
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#d8dbde',
        width: 30,
        height: 30,
    },
    minusButton: {
        borderLeftWidth: 1.5,
        borderLeftColor: '#d8dbde',
    },
    // set volume buttons
    setVolumeButtons: {
        marginTop: 6,
        flexDirection: 'row',
        borderRadius: 5,
        borderWidth: 1.5,
        borderColor: '#d8dbde',
        width: '100%',
        height: 36,
        alignItems: 'cneter'
    },
    setVolumeButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    setVolumeButtonNotInFirst: {
        borderLeftWidth: 1.5,
        borderLeftColor: '#d8dbde',
    },
    setVolumeButtonText: {
    },

    // infos
    maxFeePercentageContainer: {
        marginTop: 4,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    maxFeePercentageContent: {
        color: '#747474',
        fontSize: 11,
    },
    infoContainer: {
        marginTop: 7,
        alignItems: 'flex-end',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    infoTitle: {
        fontWeight: '500'
    },
    infoContent: {
        fontSize: 12,
    },
    minimumOrderAmountContainer: {
        marginTop: 4,
        flexDirection: 'row',
        justifyContent: 'flex-end'

    },
    minimumOrderAmountContent: {
        color: '#747474',
        fontSize: 11        
    },

    // button
    button: {
        marginTop: 8,
        borderRadius: 5,
        width: '100%',
        height: 36,
        justifyContent: 'center',
        alignItems: 'center'
    },
    blueButton: {
        backgroundColor: '#0042b7'

    },
    redButton: {
        backgroundColor: '#c45664'
    },
    buttonText: {
        color: 'white'
    }

})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        paddingTop: 14,
        padding: 10
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
        height: 30
    },
    buttonText: {
        color: '#747474',
        fontSize: 15
    },
    selectedBuyText: {
        color: '#da5f6e',
    },
    selectedSellText: {
        color: '#0042b7',
    },
    selectedHistoryText: {

    },
    selectedBuy: {
        flex: 1,
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: '#da5f6e',
    },
    selectedSell: {
        flex: 1,
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: '#0042b7',
    },
    selectedHistory: {
        flex: 1,
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: '#26282d',
    },
    unselected: {
        flex: 1,   
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#dedfe0',
    },
});
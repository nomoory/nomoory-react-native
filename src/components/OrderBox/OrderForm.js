import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { inject, observer } from 'mobx-react';
import { observable, action } from 'mobx';
import BuyOrderForm from './BuyOrderForm';
import SellOrderForm from './SellOrderForm';
import RealtimeTradeHistory from './RealtimeTradeHistory';
import commonStyle from '../../styles/commonStyle';

@inject('orderStore')
@observer
export default class OrderForm extends Component {
    @observable selectedTabType = 'BUY';

    _onPressBuy = action((e) => {
        this.props.orderStore.setSide('BUY');
        this.props.orderStore.setOrderFormSelectedTabType('BUY');
    });
    _onPressSell = action((e) => {
        this.props.orderStore.setSide('SELL');
        this.props.orderStore.setOrderFormSelectedTabType('SELL');
    });
    _onPressRealtimeTrade = action((e) => {
        this.props.orderStore.setOrderFormSelectedTabType('REALTIME_TRADE_HISTORY');
    });

    render() {
        let { orderFormSelectedTabType } = this.props.orderStore || {};
        return (
            <View style={styles.container}>
                <View style={styles.buttons}>
                    <TouchableOpacity style={[styles.button, orderFormSelectedTabType === 'BUY' ? styles.selectedBuy : styles.unselected]} onPress={this._onPressBuy}>
                        <Text style={[styles.buttonText, orderFormSelectedTabType === 'BUY' ? styles.selectedBuyText : null ]}>매수</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, orderFormSelectedTabType === 'SELL' ? styles.selectedSell : styles.unselected]} onPress={this._onPressSell}>
                        <Text style={[styles.buttonText, orderFormSelectedTabType === 'SELL' ? styles.selectedSellText : null ]}>매도</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, orderFormSelectedTabType === 'REALTIME_TRADE_HISTORY' ? styles.selectedHistory : styles.unselected]} onPress={this._onPressRealtimeTrade}>
                        <Text style={[styles.buttonText, orderFormSelectedTabType === 'REALTIME_TRADE_HISTORY' ? styles.selectedHistoryText : null]}>실시간</Text>
                    </TouchableOpacity>
                </View>
                { orderFormSelectedTabType === 'BUY' && <BuyOrderForm orderFormStyle={orderFormStyle}/> }
                { orderFormSelectedTabType === 'SELL' && <SellOrderForm orderFormStyle={orderFormStyle}/> }
                { orderFormSelectedTabType === 'REALTIME_TRADE_HISTORY' && <RealtimeTradeHistory /> }
            </View>
        );
    }
}

const orderFormStyle = StyleSheet.create({
    // liquid
    liquidContainer: {
        flexDirection: 'column',
        marginTop: 4
    },
    liquidTitle: {
        fontWeight: '600',
        fontSize: 16,
    },
    liquidContentContainer: {
        marginTop: 4,
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
        marginTop: 8,
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
        borderWidth: 0.5,
        fontSize: 12,
    },
    inputTitleContainer: {
        left: 10,
        top: 9,
        position: 'absolute',
    },
    inputTitle: {
        color: '#747474',
        fontWeight: '500',
    },
    inputUnitContainer: {
        right: 10,
        top: 10.5,
        position: 'absolute',
    },
    inputUnit: {
        color: '#747474',
        fontWeight: '500',
        fontSize: 11
    },
    setPriceButtonsContainer: {
        marginTop: 4,
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
        marginTop: 4,
        flexDirection: 'row',
        borderRadius: 5,
        borderWidth: 1.5,
        borderColor: '#d8dbde',
        width: '100%',
        height: 36,
        alignItems: 'center'
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
        marginTop: 5,
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
        backgroundColor: commonStyle.color.coblicBlue,
    },
    redButton: {
        backgroundColor: commonStyle.color.coblicRed,
    },
    yellowButton: {
        backgroundColor: commonStyle.color.coblicYellow,
    },
    buttonText: {
        color: 'white'
    }

})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        padding: 10,
        backgroundColor: 'white'
    },
    buttons: {
        height: 36,
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
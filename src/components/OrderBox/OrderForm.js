import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { inject, observer } from 'mobx-react';
import { observable, action } from 'mobx';
import BuyOrderForm from './BuyOrderForm';
import SellOrderForm from './SellOrderForm';
import TransactionHistory from './TransactionHistory';
import commonStyle from '../../styles/commonStyle';
import MiniRealtimeTradeHistory from '../MiniRealtimeTradeHistory';

const TAB_TYPES = {
    BUY: 'BUY',
    SELL: 'SELL',
    TRANSACTION_HISTORY: 'TRANSACTION_HISTORY',
};

@inject('orderStore')
@observer
export default class OrderForm extends Component {
    @observable
    selectedTabType = TAB_TYPES.BUY;

    _onPressTab = (tabType) => action((e) => {
        this.props.orderStore.setSide(tabType);
        this.props.orderStore.setOrderFormSelectedTabType(tabType);
    })

    render() {
        const { orderFormSelectedTabType } = this.props.orderStore || {};
        const isBuy = orderFormSelectedTabType === TAB_TYPES.BUY;
        const isSell = orderFormSelectedTabType === TAB_TYPES.SELL;
        const isTransactionHistory = orderFormSelectedTabType === TAB_TYPES.TRANSACTION_HISTORY;

        return (
            <View style={styles.container}>
                <View style={styles.buttons}>
                    <TouchableOpacity 
                        style={[
                            styles.button, isBuy ? styles.selectedBuy : styles.unselected
                        ]}
                        onPress={this._onPressTab(TAB_TYPES.BUY)}
                    >
                        <Text style={[styles.buttonText, isBuy ? styles.selectedBuyText : null ]}
                        >매수</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            isSell ? styles.selectedSell : styles.unselected
                        ]}
                        onPress={this._onPressTab(TAB_TYPES.SELL)}
                    >
                        <Text style={[styles.buttonText, isSell ? styles.selectedSellText : null ]}
                        >매도</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            isTransactionHistory ? styles.selectedSell : styles.unselected
                        ]}
                        onPress={this._onPressTab(TAB_TYPES.TRANSACTION_HISTORY)}
                    >
                        <Text style={[styles.buttonText, isTransactionHistory ? styles.selectedSellText : null ]}
                        >거래내역</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.tabBody}>
                    { isBuy && <BuyOrderForm orderFormStyle={orderFormStyle}/> }
                    { isSell && <SellOrderForm orderFormStyle={orderFormStyle}/> }
                    { isTransactionHistory && <TransactionHistory /> }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        minWidth: 220,
        maxWidth: 220,
        height: '100%',
        backgroundColor: 'white'
    },
    buttons: {
        height: 36,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    },
    buttonText: {
        color: 'black',
        fontWeight: '400',
        fontSize: 13,
    },
    selectedBuyText: {
        color: commonStyle.color.coblicRed,
    },
    selectedSellText: {
        color: commonStyle.color.brandBlue,
    },
    selectedHistoryText: {

    },
    
    selectedBuy: {
        flex: 1,
    },
    selectedSell: {
        flex: 1,
    },
    selectedHistory: {
        flex: 1,
    },
    unselected: {
        flex: 1,
        backgroundColor: '#eeee',
    },
    tabBody: {
        flex: 1,
        padding: 13,
    },

});

const marginBetween = 6;

const orderFormStyle = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 6,
    },
    // liquid
    liquidContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: marginBetween,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    liquidTitle: {
        fontWeight: '200',
        fontSize: 11,
        color: '#343434'
    },
    liquidContentContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    liquidContentText: {
        fontWeight: '500',
        fontSize: 13
    },
    liquidContentUnitText: {
        fontWeight: '500',
        fontSize: 13,
    },

    // price text input
    priceInputContiner: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 8,
        width: '100%',
        height: 30,
    },
    inputContainer: {
        flex: 1,
        marginRight: 2,
    },
    textInput: {
        paddingRight: 6,
        paddingLeft: 34,
        textAlign: 'right',
        height: '100%',
        backgroundColor: '#ffffff',
        borderColor: '#a2abb6',
        borderWidth: 0.5,
        fontSize: 11,
    },
    inputTitleContainer: {
        left: 8,
        top: 8,
        position: 'absolute',
    },
    inputTitle: {
        color: '#343434',
        fontSize: 11,
        fontWeight: '300'
    },
    inputUnitContainer: {
        right: 8,
        top: 11,
        position: 'absolute',
    },
    inputUnit: {
        color: '#747474',
        fontWeight: '500',
        fontSize: 11
    },
    setPriceButtons: {
        flexDirection: 'row',
        // borderWidth: 1,
        // borderColor: commonStyle.color.borderColor,
    },
    priceButton: {
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: commonStyle.color.borderColor,
        backgroundColor: commonStyle.color.borderColor,
        marginLeft: 2,
        width: 30,
        height: 30,
    },
    plusButton: {
        //borderLeftWidth: 1.5,
        borderLeftWidth: 1,
        borderLeftColor: commonStyle.color.borderColor,
    },
    volumeButton: {
        width: 62,
        height: 30,
        backgroundColor: commonStyle.color.borderColor,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    volumeInputContainer: {
        flex: 1,
        height: '100%',
        marginRight: 4,
    },
    volumeRow: {
        marginTop: marginBetween,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        flex: 0,
        height: 30,
    },
    // set volume buttons
    setVolumeButton: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        height: 30,
        width: 62,
    },
    setVolumeButtonText: {
        fontSize: 12,
    },
    dropdownStyle: {
        height: 123,
    },

    // infos
    maxFeePercentageContainer: {
        marginTop: marginBetween,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    maxFeePercentageContent: {
        color: '#747474',
        fontSize: 11,
    },

    amountContainer: {
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 36,
    },
    infoContainer: {
        marginTop: 10,
        marginBottom: 10,
        paddingLeft: 4,
        paddingRight: 4,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: '#a2abb6',
        borderWidth: 0.5,
        height: 36,
    },
    infoTitle: {
        fontWeight: '300',
        color: '#a2abb6',
    },
    infoContent: {
        fontSize: 12,
        color: 'black',
    },
    minorInfoRows: {
        marginBottom: 20,
    },
    minorInfoRow: {
        flexDirection: 'row',
        marginTop: 3,
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    minorInfoRowText: {
        color: '#444444',
        fontSize: 11        
    },

    // button
    button: {
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    blueButton: {
        backgroundColor: commonStyle.color.coblicSellButtonBackground,
        height: 30,
        flex: 1,
    },
    redButton: {
        backgroundColor: commonStyle.color.coblicBuyButtonBackground,
        height: 30,
        flex: 1,
    },
    initButton: {
        marginRight: 3,
        backgroundColor: '#777777',
        flex: 1,
    },
    yellowButton: {
        backgroundColor: commonStyle.color.coblicYellow,
    },
    buttonText: {
        fontWeight: '500',
        color: 'white'
    },
    buttons: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 10,
    }

});
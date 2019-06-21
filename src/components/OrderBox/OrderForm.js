import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { inject, observer } from 'mobx-react';
import { observable, action } from 'mobx';
import BuyOrderForm from './BuyOrderForm';
import SellOrderForm from './SellOrderForm';
import TransactionHistory from './TransactionHistory';
import commonStyle from '../../styles/commonStyle';

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
        flex: 1,
        height: '100%',
        backgroundColor: 'white'
    },
    buttons: {
        height: 30,
        width: '100%',
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
        fontWeight: '300',
        fontSize: 13,
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
    // liquid
    liquidContainer: {
        flexDirection: 'row',
        marginTop: marginBetween,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    liquidTitle: {
        fontWeight: '300',
        fontSize: 13,
        color: '#747474',
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
        marginLeft: 3
    },

    // price text input
    priceInputContiner: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 8,
        width: '100%',
        height: 36,
    },
    inputContainer: {
        flex: 1,
        marginRight: 4,
    },
    textInput: {
        flex: 1,
        paddingRight: 42,
        textAlign: 'right',
        height: 36,
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
    setPriceButtons: {
        flex: '0 0 70',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#d8dbde',
    },
    priceButton: {
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#d8dbde',
        width: 36,
        height: 36,
    },
    plusButton: {
        //borderLeftWidth: 1.5,
        borderRightWidth: 1,
        borderLeftColor: '#d8dbde',
    },

    volumeInputContainer: {
        marginTop: marginBetween,
        height: 36,
    },

    // set volume buttons
    setVolumeButtons: {
        marginTop: marginBetween,
        flexDirection: 'row',
        borderWidth: 1,
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
        marginTop: marginBetween,
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
        marginTop: marginBetween,
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

});
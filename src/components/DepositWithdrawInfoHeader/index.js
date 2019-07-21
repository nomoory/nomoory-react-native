import React, { Component } from 'react';
import commonStyle from '../../styles/commonStyle';
import { Text, StyleSheet, View } from 'react-native';
import { inject, observer } from 'mobx-react';
import { QUOTE_SYMBOL } from '../../stores/accountStore';
import number from '../../utils/number';
import Decimal from '../../utils/decimal';

@inject('accountStore')
@observer
export default class DepositWithdrawInfoHeader extends Component {
    render() {
        let { selectedAccount, selectedAccountSymbol } = this.props.accountStore || {};

        let {
            balance,
            value_present,
            pending_withdrawal,
            liquid,
            pending_order_amount,
            pending_order,
        } = selectedAccount || {};
        let withdrawable_decimal = Decimal(liquid || 0);
        let withdrawable = '0';

        if (withdrawable_decimal.greaterThan(0)) {
            withdrawable = Decimal(withdrawable_decimal.toFixed(8)).toFixed();
        }

        return (
            <View style={[styles.container]}>
                <View style={[styles.balanceContainer]}>
                    <Text style={[styles.assetBalanceText]}>총 보유금액</Text>
                    <View style={[styles.assetBalanceValues]}>
                        <Text style={[styles.balanceText]}>{`${number.putComma(number.getFixedVolume(balance || '0', selectedAccountSymbol))}`} {selectedAccountSymbol}</Text>
                        { 
                            selectedAccountSymbol !== 'KRW' &&
                            <Text style={[styles.evaluatedBalanceText]}>{`${value_present ? '≈' + number.putComma(Decimal(value_present).toFixed(0)) : '-'}`} {QUOTE_SYMBOL}</Text>
                        }
                    </View>
                </View>

                <View style={[styles.withdrawableContainer]}>
                    <View style={[styles.titleAndValueContainer]}>
                        <Text style={[styles.title]}>거래대기</Text>
                        <View style={[styles.amountContainer]}>
                            <Text style={[styles.numberText]}>{pending_order_amount || pending_order ? `${number.putComma(number.getFixedVolume(pending_order_amount || pending_order, selectedAccountSymbol))}` : '-'}</Text>
                            <Text style={[styles.unitText ]}>{selectedAccountSymbol}</Text>
                        </View>
                    </View>
                    <View style={[styles.titleAndValueContainer]}>
                        <Text style={[styles.title]}>출금대기</Text>
                        <View style={[styles.amountContainer]}>
                            <Text style={[styles.numberText]}>{pending_withdrawal ? `${number.putComma(number.getFixedVolume(pending_withdrawal, selectedAccountSymbol))}` : '-'}</Text>
                            <Text style={[styles.unitText ]}>{selectedAccountSymbol}</Text>
                        </View>
                    </View>
                    <View style={[styles.titleAndValueContainer]}>
                        <Text style={[styles.title]}>출금가능</Text>
                        <View style={[styles.amountContainer]}>
                            <Text style={[styles.numberText ]}>{withdrawable ? `${number.putComma(number.getFixedVolume(withdrawable, selectedAccountSymbol))}` : '-'}</Text>
                            <Text style={[styles.unitText ]}>{selectedAccountSymbol}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const paddingTopAndBottom = 24;
const paddingSide = 15;
const styles = StyleSheet.create({
    container: {
        padding: paddingSide,
        paddingTop: paddingTopAndBottom,
        paddingBottom: paddingTopAndBottom,
        flexDirection: 'column',
        backgroundColor: '#f7f8fa'
    },
    balanceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    assetBalanceText: {
        fontSize: 14,
        color: '#333333',
        fontWeight: '500'
    },
    balanceText: {
        fontSize: 20,
        fontWeight: '700'
    },
    evaluatedBalanceText: {
        marginTop: 4,
        fontSize: 14,
        color: '#333333',
    },
    withdrawableContainer: {
        marginTop: 4,
        flexDirection: 'column',
    },
    assetBalanceValues: {
        alignItems: 'flex-end',
    },
    titleAndValueContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 2,
        paddingBottom: 2,
    },
    title:{
        marginTop: 3,
    },
    amountContainer: {
        marginTop: 3,
        flexDirection: 'row',
    },
    numberText: {
        marginRight: 6,
    },
    unitText: {
        fontWeight: '500',
    }
})

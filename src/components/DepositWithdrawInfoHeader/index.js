import React, { Component } from 'react';
import commonStyle from '../../styles';
import { Text, StyleSheet, View } from 'react-native';
import { Container } from 'native-base';
import { inject, observer } from 'mobx-react';
import { QUOTE_SYMBOL } from '../../stores/accountStore';
import number from '../../utils/number';
import Decimal from '../../utils/decimal';

@inject('accountStore')
@observer
export default class MiningHistoryBox extends Component {
    render() {
        let { selectedAccount, selectedAccountSymbol } = this.props.accountStore || {};
        let { 
            balance, 
            evaluated_in_base_currency, 
            pending_withdrawal, 
            liquid, 
            pending_order_amount,
            pending_order
        } = selectedAccount || {};
        let withdrawable_decimal = Decimal(liquid || 0);
        let withdrawable = '0';

        if (withdrawable_decimal.greaterThan(0)) {
            withdrawable = Decimal(withdrawable_decimal.toFixed(8)).toFixed();
        }

        return (
            <View style={[styles.container]}>
                <View style={[styles.balanceContainer]}>
                    <Text style={[styles.assetBalanceText]}>보유수량</Text>
                    <View style={[styles.assetBalanceValues]}>
                        <Text style={[styles.balanceText]}>{`${number.putComma(number.getFixedVolume(balance || '0', selectedAccountSymbol))}`} {selectedAccountSymbol}</Text>
                        { 
                            selectedAccountSymbol !== 'KRW' &&
                            <Text style={[styles.title, styles.grey]}>{`${evaluated_in_base_currency ? number.putComma(Decimal(evaluated_in_base_currency).toFixed(0)) : ''}`} {QUOTE_SYMBOL}</Text>
                        }
                    </View>
                </View>

                <View style={[styles.withdrawableContainer]}>
                    <View style={[styles.titleAndValueContainer]}>
                        <Text style={[styles.title, styles.grey]}>거래대기</Text>
                        <View style={[styles.amountContainer]}>
                            <Text style={[styles.amountText, styles.numberText]}>{`${number.putComma(number.getFixedVolume(pending_order_amount || pending_order, selectedAccountSymbol))}`}</Text>
                            <Text style={[styles.amountText, styles.unitText, styles.grey ]}>{selectedAccountSymbol}</Text>
                        </View>
                    </View>
                    <View style={[styles.titleAndValueContainer]}>
                        <Text style={[styles.title, styles.grey]}>출금대기</Text>
                        <View style={[styles.amountContainer]}>
                            <Text style={[styles.amountText, styles.numberText]}>{`${number.putComma(number.getFixedVolume(pending_withdrawal, selectedAccountSymbol))}`}</Text>
                            <Text style={[styles.amountText, styles.unitText, styles.grey ]}>{selectedAccountSymbol}</Text>
                        </View>
                    </View>
                    <View style={[styles.titleAndValueContainer]}>
                        <Text style={[styles.title, styles.grey]}>출금가능</Text>
                        <View style={[styles.amountContainer]}>
                            <Text style={[styles.amountText, styles.numberText]}>{`${number.putComma(number.getFixedVolume(withdrawable, selectedAccountSymbol))}`}</Text>
                            <Text style={[styles.amountText, styles.unitText, styles.grey ]}>{selectedAccountSymbol}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
    },
    balanceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    assetBalanceValues: {
        alignItems: 'flex-end',
    },
    withdrawableContainer: {
        flexDirection: 'column',
    },
    titleAndValueContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    title: {

    }, 
    amountContainer: {
        flexDirection: 'row',
    }

})

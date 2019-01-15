import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Container } from 'native-base';
import { inject, observer } from 'mobx-react';
import Decimal from '../../utils/decimal.js';
import number from '../../utils/number';
import images from './images';
import { withNavigation } from 'react-navigation';

@withNavigation
@inject('accountStore')
@observer
export default class AccountItem extends Component {
    _onPressBalanceItemrRow = (currency) => (e) => {
        console.log(currency)
        this.props.accountStore.setSelectedAccountSymbol(currency);
        this._openDepositWithdrawScreen(currency);
    }

    _openDepositWithdrawScreen = (currency) => {
        console.log('cur', currency)
        this.props.navigation.navigate('AccountDepositWithdraw', {
            currency: currency,
        });
    }
    render() {
        const { account, accountStore } = this.props;
        let { asset_symbol, asset_korean_name, balance, evaluated_in_base_currency } = account || {}
        let { total_evaluated_price_in_quote } = accountStore.totalAssetsEvaluation || {};
        let balanceWeight = '0';
        if (total_evaluated_price_in_quote && total_evaluated_price_in_quote !== '0') {
            balanceWeight = Decimal(evaluated_in_base_currency).div(total_evaluated_price_in_quote).mul(100).toFixed(2);
        }

        console.log(account)
        return (
            <TouchableOpacity style={[styles.container]}
                onPress={this._onPressBalanceItemrRow(asset_symbol)}
            >
                <View style={[styles.left]}>
                    <Image
                        style={{ width: 28, height: 28 }}
                        source={images.logos[asset_symbol]}
                    />
                    <View style={[styles.coinNameAndSymbol]}>
                        <Text style={[styles.coinName]}>{asset_korean_name}</Text>
                        <Text style={[styles.coinSymbol]}>{asset_symbol}</Text>
                    </View>
                </View>

                <View style={[styles.right]}>
                    <View style={[styles.balanceAndPriceContainer]}>
                        <View style={[styles.balanceAmount]}>
                            <Text style={[styles.assetAmount]}>{balance ? number.putComma(number.getFixedPrice(balance, asset_symbol)) : '-'}</Text>
                            <Text style={[styles.assetUnit]}> {asset_symbol}</Text>
                        </View>
                        {
                            asset_symbol !== 'KRW' ?
                            <View style={[styles.evaluatedBalanceAmount]}>
                                <Text style={[styles.amount]}>
                                    {evaluated_in_base_currency ? number.putComma(number.getFixedPrice(evaluated_in_base_currency, 'KRW')) : '-'}
                                </Text>
                                <Text style={[styles.unit]}> {'KRW'}</Text>
                            </View> :
                            null
                        }
                    </View>
                    {/* <View style={[styles.balanceWeight]}>
                        <Text style={[styles.balanceWeightText]}>{`${balanceWeight}%`}</Text>
                    </View> */}
                    <View style={[styles.emptyColumn]}>
                        <Image
                            style={{ width: 15, resizeMode: 'contain' }}
                            source={images.buttons.account}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        height: 80,

        borderStyle: 'solid',
        borderTopWidth: 0.5,
        borderTopColor: '#dedfe0',
        borderBottomWidth: 0.5,
        borderBottomColor: '#dedfe0',
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    coinNameAndSymbol: {
        marginLeft: 12,
    },
    coinName: {
        fontWeight: '500',
        fontSize: 16
    },
    coinSymbol: {
        marginTop: 4,
        fontSize: 14,
        color: '#747474'
    },
    balanceAndPriceContainer: {
        alignItems: 'flex-end',
        flexDirection: 'column',
        marginRight: 12 
    },
    balanceAmount: {
        flexDirection: 'row'
    },
    evaluatedBalanceAmount: {
        marginTop: 4,
        flexDirection: 'row'
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    assetAmount: {
        fontWeight: '500',
        fontSize: 14

    },
    assetUnit: {
        fontWeight: '500',
        fontSize: 14
    },
})
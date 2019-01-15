import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Container } from 'native-base';
import { inject, observer } from 'mobx-react';
import Decimal from '../../utils/decimal.js';
import number from '../../utils/number';
import images from './images';
import { withNavigation } from 'react-navigation';

@withNavigation
@inject('accountStore', 'modalStore')
@observer
export default class AccountItem extends Component {
    _onPressBalanceItemrRow = (currency) => (e) => {
        if (                    
            // !account.is_depositable || 
            ['KRW', 'CT', 'TOKA'].includes(currency)
        ) { /* show 입금 불가 modal */ 

            this.props.modalStore.openModal({
                type: 'preset',
                title: currency === 'KRW' ? '입금 미지원' : '입금 불가',
                content: currency === 'KRW' ? `현재 앱을 통한 원화의 입금은 지원하지 않습니다.` : `현재 ${currency}에 대한 입금은 지원하지 않습니다.`
            });
        
        } else {
            this.props.accountStore.setSelectedAccountSymbol(currency);
            this._openDepositWithdrawScreen(currency);    
        }
    }

    _openDepositWithdrawScreen = (currency) => {
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
                        { 
                            !['KRW', 'CT', 'TOKA'].includes(asset_symbol) ?
                            <Image
                                style={{ width: 15, resizeMode: 'contain' }}
                                source={images.buttons.account}
                            /> : 
                            null
                        }
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
        // borderTopWidth: 0.5,
        // borderTopColor: '#dedfe0',
        borderBottomWidth: 1,
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
    }
})
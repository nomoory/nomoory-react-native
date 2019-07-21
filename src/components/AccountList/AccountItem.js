import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { inject, observer } from 'mobx-react';
import Decimal from '../../utils/decimal.js';
import number from '../../utils/number';
import images from './images';
import { withNavigation } from 'react-navigation';
import commonStyle from '../../styles/commonStyle';

@withNavigation
@inject('accountStore', 'modalStore')
@observer
export default class AccountItem extends Component {
    _onPressBalanceItemrRow = (account = {}) => (e) => {
        if (                    
            account.is_depositable === false
        ) { /* show 입금 불가 modal */
            this.props.modalStore.openModal({
                type: 'preset',
                title: account.asset_symbol === 'KRW' ? '입금 미지원' : '입금 불가',
                content: account.asset_symbol === 'KRW' ? `현재 앱을 통한 원화의 입금은 지원하지 않습니다.` : `현재 ${account.asset_symbol}에 대한 입금은 지원하지 않습니다.`
            });
        } else {
            this._openDepositWithdrawScreen(account.asset_symbol);    
        }
    }

    _openDepositWithdrawScreen = (currency) => {
        this.props.accountStore.setSelectedAccountSymbol(account.asset_symbol);
        this.props.navigation.navigate('AccountDepositWithdraw', {
            currency: currency,
        });
    }

    render() {
        const { account, accountStore } = this.props;
        let { 
            asset_symbol,
            asset_korean_name,
            balance,
            evaluated_in_base_currency,
            is_depositable,
        } = account || {}
        let { total_evaluated_price_in_quote } = accountStore.totalAssetsEvaluation || {};
        let balanceWeight = '0';
        if (total_evaluated_price_in_quote && total_evaluated_price_in_quote !== '0') {
            balanceWeight = Decimal(evaluated_in_base_currency).div(total_evaluated_price_in_quote).mul(100).toFixed(1);
        }

        return (
            <TouchableOpacity style={[styles.container]}
                onPress={this._onPressBalanceItemrRow(account)}
            >
                <View style={[styles.left]}>
                    <Image
                        style={{ width: 28,
                            height: 28 }}
                        source={{ uri: `${Expo.Constants.manifest.extra.LOGO_ASSET_ORIGIN}/logos/${asset_symbol}.png` }}
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
                                <Text style={[styles.evaluatedAmount]}>
                                    {evaluated_in_base_currency ? `≈ ${number.putComma(number.getFixedPrice(evaluated_in_base_currency, 'KRW'))}` : '-'}
                                </Text>
                                <Text style={[styles.evaluatedUnit]}> {'KRW'}</Text>
                            </View> :
                            null
                        }
                    </View>
                    <View style={[styles.balanceWeight]}>
                        <Text style={[styles.balanceWeightText]}>{`${balanceWeight}%`}</Text>
                    </View>
                    <View style={[styles.emptyColumn]}>
                        { 
                            is_depositable === true ?
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
        height: 60,

        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: commonStyle.color.borderColor,
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
        fontSize: 13
    },
    coinSymbol: {
        marginTop: 4,
        fontSize: 13,
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
        fontSize: 13

    },
    assetUnit: {
        fontWeight: '500',
        fontSize: 13
    },
    evaluatedAmount: {
        fontSize: 11,
    },
    evaluatedUnit: {
        fontSize: 11,
    },
    balanceWeightText: {
        fontWeight: '300',
        fontSize: 13,
    }
})
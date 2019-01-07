import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Container } from 'native-base';
import { inject, observer } from 'mobx-react';
import Decimal from '../../utils/decimal.js';
import number from '../../utils/number';
import images from './images';


@inject('accountStore')
@observer
export default class AccountItem extends Component {
    _clickBalanceItemrRow = (currency) => async (e) => {
        console.log('test');
        // await this.props.accountStore.loadAccounts();
        // this.props.history.push({
        //     pathname: '/balances/',
        //     search: `?currency=${currency}`
        // });
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
                onPress={this._clickBalanceItemrRow(asset_symbol)}
            >
                <View style={[styles.left]}>
                    <Image
                        style={{ width: 24, height: 24 }}
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
                            <Text style={[styles.amount]}>{number.putComma(number.getFixedPrice(balance, asset_symbol))}</Text>
                            <Text style={[styles.unit]}>{asset_symbol}</Text>
                        </View>
                        {
                            asset_symbol !== 'KRW' ?
                            <View style={[styles.evaluatedBalanceAmount]}>
                                <Text style={[styles.amount]}>
                                    {number.putComma(number.getFixedPrice(evaluated_in_base_currency, 'KRW'))}
                                </Text>
                                <Text style={[styles.unit]}>{'KRW'}</Text>
                            </View> :
                            null
                        }
                    </View>
                    <View style={[styles.balanceWeight]}>
                        <Text style={[styles.balanceWeightText]}>{`${balanceWeight}%`}</Text>
                    </View>
                    <View style={[styles.emptyColumn]}>
                        <Image
                            style={{ height: 24 }}
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
        height: 70,

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
    balanceAndPriceContainer: {
        alignItems: 'flex-end',
        flexDirection: 'column'
    },
    balanceAmount: {
        flexDirection: 'row'
    },
    evaluatedBalanceAmount: {
        flexDirection: 'row'
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center'
    },
})
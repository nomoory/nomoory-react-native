import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { inject, observer } from 'mobx-react';
import number from '../../utils/number';
import Decimal from '../../utils/decimal';
import commonStyle from '../../styles/commonStyle';

@inject('accountStore')
@observer
export default class TotalAssetsEvaluation extends Component {
    render() {
        const { accountStore } = this.props;
        const {
            total_evaluated_price_in_quote,
            holding_quote,
            total_token_buying_price,
            total_tokens_evaluated_price_in_quote,
            evaluated_revenue_ratio,
            evaluated_revenue,
        } = accountStore.totalAssetsEvaluation || {};
        const evaluatedRevenueRatio_decimal = Decimal(evaluated_revenue || '0');

        return (
            <View style={ styles.container }>
                <View style={ styles.assetInfoContainer }>
                    <Text style={ styles.assetInfoTitle }>총보유자산</Text>
                    <View style={[styles.assetInfoContentContainer]}>
                        <View style={[styles.assetItemContainer]}>
                            <Text style={[styles.assetItemTitle]}>보유 KRW</Text>
                            <Text style={[styles.assetItemValue]}>{ 
                                holding_quote
                                ? number.putComma(Decimal(holding_quote).toFixed(0, Decimal.ROUND_FLOOR))
                                : '-'} 원</Text>
                        </View>
                        <View style={[styles.assetItemContainer]}>
                            <Text style={[styles.assetItemTitle]}>총자산 평가액</Text>
                            <Text style={[styles.assetItemValue]}>{
                                total_evaluated_price_in_quote
                                ? number.putComma(Decimal(total_evaluated_price_in_quote).toFixed(0, Decimal.ROUND_FLOOR))
                                : '-' } 원
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={ styles.investInfoContainer }>
                    <View style={[styles.investInfoSubContainer]}>
                        <View style={[styles.investInfoItemContainer]}>
                            <Text style={[styles.investInfoTitle]}>총매수금액</Text>
                            <Text style={[styles.investInfoValue]}>{
                                total_token_buying_price
                                ? number.putComma(Decimal(total_token_buying_price).toFixed(0))
                                : '-'} 원
                            </Text>
                        </View>
                        <View style={[styles.investInfoItemContainer]}>
                            <Text style={[styles.investInfoTitle]}>총평가금액</Text>
                            <Text style={[styles.investInfoValue]}>{
                                total_tokens_evaluated_price_in_quote
                                ? number.putComma(Decimal(total_tokens_evaluated_price_in_quote).toFixed(0))
                                : '-'} 원
                           </Text>
                        </View>
                    </View>
                    <View style={[styles.investInfoSubContainer]}>
                        <View style={[styles.investInfoItemContainer]}>
                            <Text style={[styles.investInfoTitle]}>총평가손익</Text>
                            <Text style={[
                                evaluatedRevenueRatio_decimal.greaterThan(0) ? styles.rise : 
                                (evaluatedRevenueRatio_decimal.lessThan(0) ? styles.fall : null)                        
                            ]}>
                                { evaluatedRevenueRatio_decimal.greaterThan(0) ? '+' : '' }
                                { evaluated_revenue ? number.putComma(Decimal(evaluated_revenue).toFixed(0)) : '-'} 원
                            </Text>
                        </View>
                        <View style={[styles.investInfoItemContainer]}>
                            <Text style={[styles.investInfoTitle]}>손익률</Text>
                            <Text style={[
                                evaluatedRevenueRatio_decimal.greaterThan(0) ? styles.rise : 
                                (evaluatedRevenueRatio_decimal.lessThan(0) ? styles.fall : null)
                            ]}>
                                { evaluatedRevenueRatio_decimal.greaterThan(0) ? '+' : '' }
                                { evaluated_revenue_ratio ? number.putComma(Decimal(Decimal(evaluated_revenue_ratio).toFixed(2)).toFixed()) : '-'} %
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        )
  }
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        paddingTop: 18,
        paddingBottom: 18,
        borderBottomColor: '#dedfe0',
        borderBottomWidth: 1,
        backgroundColor: 'white'
    },
    assetInfoContainer: {
        marginBottom: 18,
    },
    assetInfoTitle: {
        marginBottom: 16,
        fontWeight: '600',
        fontSize: 17
    },
    assetInfoContentContainer: {
        flexDirection: 'row',
    },
    assetItemContainer: {
        flex: 1
    },
    assetItemTitle: {
        fontWeight: '500',
        fontSize: 14,
        color: '#747474',
        marginBottom: 4,
    },
    assetItemValue: {
        fontWeight: '600',
        fontSize: 20,
    },

    // investment info
    investInfoContainer: {
        marginTop: 10,
        flexDirection: 'row',
    },
    investInfoSubContainer: {
        flex: 1,
        alignItems: 'stretch'
    },
    investInfoItemContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    investInfoTitle: {
        textAlign: 'left',
        fontWeight: '500',
        color: '#747474'
    },
    investInfoValue: {
        paddingRight: 14,
        textAlign: 'left',
    },
    rise: {
        color: commonStyle.color.coblicRed
    },
    fall: {
        color: commonStyle.color.coblicBlue
    }
})

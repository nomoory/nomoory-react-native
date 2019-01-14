import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { inject, observer } from 'mobx-react';
import constants from '../../global/constants';
import number from '../../utils/number';
import Decimal from '../../utils/decimal';
import commonStyle from '../../styles/commonStyle';

@inject('accountStore')
@observer
export default class TotalAssetsEvaluation extends Component {
    constructor(props) {
        super(props);
        // this.pubnubChannel = "";
    }

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
                    <View style={ styles.assetInfoTitleContainer }>
                        <Text style={ styles.assetInfoTitle }>나의 보유자산</Text>
                    </View>
                    <View style={[styles.assetInfoContentContainer]}>
                        <View style={[styles.assetItemContainer]}>
                            <Text style={[styles.assetItemTitle]}>보유 KRW</Text>
                            <Text style={[styles.assetItemValue]}>{ holding_quote ? number.putComma(Decimal(holding_quote).toFixed(0, Decimal.ROUND_FLOOR)) : '-'}원</Text>
                        </View>
                        <View style={[styles.assetItemContainer]}>
                            <Text style={[styles.assetItemTitle]}>총자산 평가액</Text>
                            <Text style={[styles.assetItemValue]}>{ total_evaluated_price_in_quote ? number.putComma(Decimal(total_evaluated_price_in_quote).toFixed(0, Decimal.ROUND_FLOOR)) : '-' }원</Text>
                        </View>
                    </View>
                </View>
                <View style={ styles.investInfoContainer }>
                    <View style={[styles.investInfoSubContainer]}>
                        <Text style={[styles.investInfoTitle]}>총 매수금액</Text>
                        <Text style={[styles.investInfoValue]}>{ total_token_buying_price ? number.putComma(Decimal(total_token_buying_price).toFixed(0)) : '-'}원</Text>
                        <Text style={[styles.investInfoTitle]}>매수자산 평가금액</Text>
                        <Text style={[styles.investInfoValue]}>{ total_tokens_evaluated_price_in_quote ? number.putComma(Decimal(total_tokens_evaluated_price_in_quote).toFixed(0)) : '-'}원</Text>
                    </View>
                    <View style={[styles.investInfoSubContainer]}>
                        <Text style={[styles.investInfoTitle]}>평가 수익률</Text>
                        <Text style={[styles.investInfoValue, 
                            evaluatedRevenueRatio_decimal.greaterThan(0) ? styles.rise : 
                            (evaluatedRevenueRatio_decimal.lessThan(0) ? styles.fall : null)                        
                        ]}>
                            { 
                                evaluatedRevenueRatio_decimal.greaterThan(0) ? '+' : ''
                            }
                            { evaluated_revenue_ratio ? number.putComma(Decimal(Decimal(evaluated_revenue_ratio).toFixed(2)).toFixed()) : '-'}%</Text>
                        <Text style={[styles.investInfoTitle]}>평가 손익</Text>
                        <Text style={[styles.investInfoValue, 
                            evaluatedRevenueRatio_decimal.greaterThan(0) ? styles.rise : 
                            (evaluatedRevenueRatio_decimal.lessThan(0) ? styles.fall : null)                        
                        ]}>
                            { 
                                evaluatedRevenueRatio_decimal.greaterThan(0) ? '+' : ''
                            }
                            { evaluated_revenue ? number.putComma(Decimal(evaluated_revenue).toFixed(0)) : '-'}원
                        </Text>
                    </View>
                </View>
            </View>
        )
  }
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        paddingTop: 22,
        paddingBottom: 20,
        borderBottomColor: '#dedfe0',
        borderBottomWidth: '2',
    },
    assetInfoTitleContainer: {

    },
    assetInfoTitle: {
        fontWeight: '700',
        fontSize: 20
    },
    assetInfoContentContainer: {
        marginTop: 15,
        flexDirection: 'row',
    },
    assetItemContainer: {
        flex: 1
    },
    assetItemTitle: {
        fontWeight: '500',
        fontSize: 16,
        color: '#747474'
    },
    assetItemValue: {
        marginTop: 4,
        fontWeight: '700',
        fontSize: 16,
    },

    // investment info
    investInfoContainer: {
        marginTop: 15,
        flexDirection: 'row',
    },
    investInfoSubContainer: {
        flex: 1,
        alignItems: 'stretch'
    },
    investInfoTitle: {
        marginTop: 10,
        textAlign: 'left',
        fontWeight: '500',
        color: '#747474'
    },
    investInfoValue: {
        marginTop: 4,
        textAlign: 'left',
    },
    rise: {
        color: commonStyle.color.coblicRed
    },
    fall: {
        color: commonStyle.color.coblicBlue
    }
})

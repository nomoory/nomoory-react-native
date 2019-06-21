import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { inject, observer } from 'mobx-react';
import number, { Decimal } from '../../utils/number';
import commonStyle from '../../styles/commonStyle';

@inject('accountStore')
@observer
class AccountStatus extends Component {
    render() {
        const {
            total_evaluated_price_in_quote,
            holding_quote,
            total_token_buying_price,
            total_tokens_evaluated_price_in_quote,
            evaluated_revenue_ratio,
            evaluated_revenue,
        } = this.props.accountStore.totalAssetsEvaluation || {};
        const evaluatedRevenueRatio_decimal = Decimal(evaluated_revenue || '0');

        return (
            <View style={[styles.container]}>
                <View style={[styles.column]}>
                    <View style={[styles.row]}>
                        <Text style={[styles.label]}>총매수</Text>
                        <Text style={[styles.numberCommon]}>{
                                total_token_buying_price
                                ? number.putComma(Decimal(total_token_buying_price).toFixed(0))
                                : '-'
                            } 원
                        </Text>
                    </View>
                    <View style={[styles.row]}>
                        <Text style={[styles.label]}>총평가</Text>
                        <Text style={[styles.numberCommon]}>{
                                total_evaluated_price_in_quote
                                ? number.putComma(Decimal(total_evaluated_price_in_quote).toFixed(0, Decimal.ROUND_FLOOR))
                                : '-' 
                            } 원
                        </Text>
                    </View>
                </View>
                <View style={[styles.column]}>
                    <View style={[styles.row]}>
                        <Text style={[styles.label]}>평가손익</Text>
                        <Text style={[styles.numberCommon,
                            evaluatedRevenueRatio_decimal.greaterThan(0) ? styles.rise : 
                            (evaluatedRevenueRatio_decimal.lessThan(0) ? styles.fall : null)
                        ]}>
                            { evaluatedRevenueRatio_decimal.greaterThan(0) ? '+' : '' }
                            { evaluated_revenue ? number.putComma(Decimal(evaluated_revenue).toFixed(0)) : '-'} 원
                        </Text>
                    </View>
                    <View style={[styles.row]}>
                        <Text style={[styles.label]}>손익률</Text>
                        <Text style={[styles.numberCommon,
                            evaluatedRevenueRatio_decimal.greaterThan(0) ? styles.rise : 
                            (evaluatedRevenueRatio_decimal.lessThan(0) ? styles.fall : null)
                        ]}>
                           { evaluatedRevenueRatio_decimal.greaterThan(0) ? '+' : '' }
                            { evaluated_revenue_ratio ? number.putComma(Decimal(Decimal(evaluated_revenue_ratio).mul(100).toFixed(2)).toFixed()) : '-'} %
                        </Text>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection:'row',
        justifyContent: 'space-around',
        borderBottomWidth: 0.5,
        borderBottomColor: '#bebfc0',

    },
    column: {
        flex: 1,
        flexDirection:'column',
        padding: 10,
    },
    row: {
        flexDirection:'row',
        justifyContent: 'space-between'
    },
    label: {
        color: 'rgb(90, 90, 90)',
        fontSize: 11,
        fontWeight: '200',
    },
    numberCommon: {
        fontSize: 11,
        fontWeight: '200',
    },
    rise: {
        color: commonStyle.color.coblicRed
    },
    fall: {
        color: commonStyle.color.coblicBlue
    }
});

export default AccountStatus;
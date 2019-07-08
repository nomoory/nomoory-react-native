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
            <View style={styles.container}>
                <View style={styles.assetInfoContainer}>
                    <Text style={styles.assetInfoTitle}>
                        총보유자산
                    </Text>
                </View>
                <View style={[styles.assetInfoContentContainer]}>
                    <View style={[styles.assetItemContainer]}>
                        <Text style={[styles.assetItemTitle]}>
                            보유KRW
                        </Text>
                        <Text style={[styles.assetItemValue]}>
                            {
                                holding_quote
                                    ? number.putComma(Decimal(holding_quote).toFixed(0, Decimal.ROUND_FLOOR))
                                    : '-'
                            }
                        </Text>
                    </View>
                    <View style={styles.verticalBorder} />
                    <View style={[styles.assetItemContainer]}>
                        <Text style={[styles.assetItemTitle]}>
                            총자산 평가액
                        </Text>
                        <Text style={[styles.assetItemValue]}>
                            {
                                total_evaluated_price_in_quote
                                ? number.putComma(Decimal(total_evaluated_price_in_quote).toFixed(0, Decimal.ROUND_FLOOR))
                                : '-'
                            }
                        </Text>
                    </View>
                </View>
                <View style={styles.investInfoContainer}>
                    <View style={[styles.investInfoSubContainer]}>
                        <View style={[styles.investInfoItemContainer]}>
                            <Text style={[styles.investInfoTitle]}>
                                총매수금액
                            </Text>
                            <Text style={[styles.investInfoValue]}>
                                {
                                    total_token_buying_price
                                    ? number.putComma(Decimal(total_token_buying_price).toFixed(0))
                                    : '-'
                                }
                            </Text>
                        </View>
                        <View style={[styles.investInfoItemContainer]}>
                            <Text style={[styles.investInfoTitle]}>
                                총평가금액
                            </Text>
                            <Text style={[styles.investInfoValue]}>
                                {
                                    total_tokens_evaluated_price_in_quote
                                    ? number.putComma(Decimal(total_tokens_evaluated_price_in_quote).toFixed(0))
                                    : '-'
                                }
                           </Text>
                        </View>
                    </View>
                    <View style={[styles.investInfoSubContainer]}>
                        <View style={[styles.investInfoItemContainer]}>
                            <Text style={[styles.investInfoTitle]}>
                                총평가손익
                            </Text>
                            <Text style={[
                                evaluatedRevenueRatio_decimal.greaterThan(0)
                                ? styles.rise
                                : (
                                    evaluatedRevenueRatio_decimal.lessThan(0)
                                    ? styles.fall
                                    : null
                                )
                            ]}>
                                {evaluatedRevenueRatio_decimal.greaterThan(0) ? '+' : ''}
                                {evaluated_revenue ? number.putComma(Decimal(evaluated_revenue).toFixed(0)) : '-'}
                            </Text>
                        </View>
                        <View style={[styles.investInfoItemContainer]}>
                            <Text style={[styles.investInfoTitle]}>
                                손익률
                            </Text>
                            <Text style={[
                                evaluatedRevenueRatio_decimal.greaterThan(0)
                                ? styles.rise
                                : (
                                    evaluatedRevenueRatio_decimal.lessThan(0)
                                    ? styles.fall
                                    : null
                                )
                            ]}>
                                {evaluatedRevenueRatio_decimal.greaterThan(0) ? '+' : ''}
                                {evaluated_revenue_ratio ? number.putComma(Decimal(Decimal(evaluated_revenue_ratio).mul(100).toFixed(2)).toFixed()) : '- '}%
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

const paddingSide = 13;

const styles = StyleSheet.create({
    container: {
        paddingTop: 18,
        paddingBottom: 16,
    },
    assetInfoContainer: {
        marginBottom: 14,
        padding: paddingSide,
        paddingTop: 0,
        paddingBottom: 0,
    },
    assetInfoTitle: {
        fontWeight: '500',
        fontSize: 15
    },
    assetInfoContentContainer: {
        marginBottom: 10,
        flexDirection: 'row',
    },
    assetItemContainer: {
        flex: 1,
        paddingLeft: paddingSide,
        paddingRight: paddingSide,
    },
    assetItemTitle: {
        fontWeight: '400',
        fontSize: 13,
        marginBottom: 2,
        color: commonStyle.color.subTitleGreyColor,
    },
    assetItemValue: {
        fontWeight: '300',
        fontSize: 21,
    },
    verticalBorder: {
        height: '100%',
        borderRightWidth: 1.2,
        borderRightColor: commonStyle.color.borderColor,
    },
    // investment info
    investInfoContainer: {
        flexDirection: 'row',
    },
    investInfoSubContainer: {
        flex: 1,
        alignItems: 'stretch',
        padding: paddingSide,
    },
    investInfoItemContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    investInfoTitle: {
        textAlign: 'left',
        fontWeight: '400',
        fontSize: 12,
        color: commonStyle.color.subTitleGreyColor,
    },
    investInfoValue: {
        paddingRight: 14,
        textAlign: 'left',
    },
    rise: {
        color: commonStyle.color.coblicRed
    },
    fall: {
        color: commonStyle.color.fall
    }
})

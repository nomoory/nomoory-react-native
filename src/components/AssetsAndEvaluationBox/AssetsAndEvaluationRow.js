import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { inject, observer } from 'mobx-react';
import Decimal from '../../utils/decimal';
import number from '../../utils/number';
import commonStyle from '../../styles/commonStyle';

@inject('accountStore')
@observer
export default class AssetsAndEvaluationRow extends Component {
    render() {
        const {
            asset_symbol,
            asset_korean_name,
            avg_fiat_buy_price, // 매수평균가
            balance, // 보유수량
            liquid, // 유동자산
            value_bought, // 매수 금액
            value_present, // 현재 가치
            value_change, // 평가 손익
            value_change_rate, // 수익률
            asset_close_price // asset의 현재가
        } = this.props.portfolio;
        const valueChange_decimal = Decimal(value_change || '0');
        const isRise = valueChange_decimal.greaterThan(0);
        const isFall = valueChange_decimal.lessThan(0);

        return (
            <View style={ styles.container }>
                <View style={[styles.upperContainer]}>
                    <View style={[styles.upperLeftContainer]}>
                        <Text style={[styles.assetNameText]}>
                            {`${asset_korean_name} (${ asset_symbol })`}
                        </Text>
                    </View>
                    <View style={[styles.upperRightContainer]}>
                        <View style={[styles.upperRightItemContainer]}>
                            <Text style={[styles.upperRightItemTitle]}>평가손익</Text>
                            <Text style={[
                                styles.upperRightItemValue,
                                isFall ? commonStyle.FALL : null,
                                isRise ? commonStyle.RISE : null,
                            ]}>
                                { 
                                    value_change
                                    ? number.putComma(Decimal(value_change).toFixed(0))
                                    : '-'
                                }
                            </Text>
                        </View>
                        <View style={[styles.upperRightItemContainer]}>
                            <Text style={[styles.upperRightItemTitle]}>
                                평가수익률
                            </Text>
                            <Text style={[
                                styles.upperRightItemValue,
                                isFall ? commonStyle.FALL : null,
                                isRise ? commonStyle.RISE : null,
                            ]}>
                                {
                                    value_change_rate
                                    ? number.putComma(Decimal(value_change_rate).mul(100).toFixed(2))
                                    : '- '
                                } %
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={ styles.bottomContainer }>
                    <View style={[styles.bottomSubContainer, { paddingRight: 20 }]}>
                        <View style={styles.bottomItemContainer}>
                            <View style={styles.flexRow}>
                                <Text style={[styles.bottomItemValue]}>
                                    { balance ? number.putComma(number.getFixedPrice(balance, asset_symbol)) : '- ' }
                                </Text>
                                <Text style={styles.unitText}> {asset_symbol}</Text>
                            </View>
                            <Text style={[styles.bottomItemTitle]}>
                                보유수량
                            </Text>
                        </View>
                        <View style={styles.bottomItemContainer}>
                            <View style={styles.flexRow}>
                                <Text style={[styles.bottomItemValue]}>{ avg_fiat_buy_price ? number.putComma(Decimal(avg_fiat_buy_price).toFixed(0)) : '- ' } </Text><Text style={styles.unitText}></Text>
                                <Text style={styles.unitText}>KRW</Text>
                            </View>
                            <Text style={[styles.bottomItemTitle]}>
                                매수평균가
                            </Text>
                        </View>
                    </View>
                    <View style={ styles.bottomSubContainer }>
                        <View style={styles.bottomItemContainer}>
                            <View style={styles.flexRow}>
                                <Text style={[styles.bottomItemValue]}>
                                    { value_present ? number.putComma(number.getFixedPrice(value_present, 'KRW')) : '-' }
                                </Text>
                                <Text style={styles.unitText}> KRW</Text>
                            </View>
                            <Text style={[styles.bottomItemTitle]}>평가금액</Text>
                        </View>
                        <View style={styles.bottomItemContainer}>
                            <View style={styles.flexRow}>
                                <Text style={[styles.bottomItemValue]}>
                                    { 
                                        value_bought
                                        ? number.putComma(Decimal(value_bought).toFixed(0))
                                        : '- '
                                    } </Text>
                                <Text style={styles.unitText}>
                                    KRW
                                </Text>
                            </View>
                            <Text style={[styles.bottomItemTitle]}>매수금액</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        backgroundColor: 'white',
        padding: 15,
        paddingTop: 0,
        paddingBottom: 0,
        borderBottomWidth: 1,
        borderBottomColor: commonStyle.color.borderColor,
    },
    
    upperContainer: {
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',

        borderBottomWidth: 0.8,
        borderBottomColor: commonStyle.color.borderColor,

    },
    upperLeftContainer: {
        flex: 1,
    },
    assetNameText: {
        fontSize: 15,
        fontWeight: '700',
        color: commonStyle.color.headerTextColor,
    },
    upperRightContainer: {
        flexDirection: 'column',
        width: 180,
        alignItems: 'stretch'
    },
    upperRightItemContainer: {
        marginBottom: 6,
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    upperRightItemTitle: {
        fontSize: 12,
        fontWeight: '400',
    },
    upperRightItemValue: {
        fontSize: 12,
        fontWeight: '400',
    },
    bottomContainer: {
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: 'row',

        borderBottomWidth: 0.5,
        borderBottomColor: commonStyle.color.borderColor,
    },
    bottomSubContainer: {
        flex: 1,
        flexDirection: 'column',
        width: '100%'
    },
    bottomItemContainer: {
        alignItems: 'flex-end',
        marginBottom: 6,
    },
    bottomItemTitle: {
        color: '#747474',
        fontWeight: '300',
        fontSize: 12,
        marginBottom: 2,
    },
    bottomItemValue: {
    },
    unitText: {
        fontWeight: '500',
    },
    flexRow: {
        flexDirection: 'row',
        paddingTop: 4,
        paddingBottom: 4,
    }
})

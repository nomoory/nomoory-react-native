import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { inject, observer } from 'mobx-react';
import Decimal from '../../utils/decimal';
import number from '../../utils/number';

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
                        <Text style={[styles.assetName]}>{`${asset_korean_name} (${ asset_symbol })`}</Text>
                    </View>
                    <View style={[styles.upperRightContainer]}>
                        <View style={[styles.upperRightItemContainer]}>
                            <Text style={[styles.upperRightItemTitle]}>평가 손익</Text>
                            <Text style={[
                                styles.upperRightItemValue,
                                // isFall ? styles.fall : null,
                                // isRise ? styles.rise : null,
                            ]}>
                                {/* {isRise ? '+' : ''}{ value_change ? number.putComma(Decimal(value_change).toFixed(0)) : '- ' } */}
                                - 원</Text>
                        </View>
                        <View style={[styles.upperRightItemContainer]}>
                            <Text style={[styles.upperRightItemTitle]}>평가 수익률</Text>
                            <Text style={[
                                styles.upperRightItemValue,
                                // isFall ? styles.fall : null,
                                // isRise ? styles.rise : null,
                            ]}>
                                {/* {isRise ? '+' : ''}{ value_change_rate ? number.putComma(Decimal(value_change_rate).toFixed(2)) : '- ' } */}
                                - %</Text>
                        </View>
                    </View>
                </View>

                <View style={ styles.bottomContainer }>
                    <View style={ styles.bottomSubContainer }>
                        <View style={styles.bottomItemContainer}>
                            <Text style={[styles.bottomItemTitle]}>보유수량</Text>
                            <Text style={[styles.bottomItemValue]}>{ balance ? number.putComma(number.getFixedPrice(balance, asset_symbol)) : '- ' } {asset_symbol}</Text>
                        </View>
                        {/* <View style={styles.bottomItemContainer}>
                            <Text style={[styles.bottomItemTitle]}>매수 평균가</Text>
                            <Text style={[styles.bottomItemValue]}>{ avg_fiat_buy_price ? number.putComma(Decimal(avg_fiat_buy_price).toFixed(0)) : '- ' }원</Text>
                        </View> */}
                    </View>
                    <View style={ styles.bottomSubContainer }>
                        <View style={styles.bottomItemContainer}>
                            <Text style={[styles.bottomItemTitle]}>현재 가치</Text>
                            <Text style={[styles.bottomItemValue]}>{ value_present ? number.putComma(number.getFixedPrice(value_present, 'KRW')) : '-' } 원</Text>
                        </View>
                        {/* <View style={styles.bottomItemContainer}>
                            <Text style={[styles.bottomItemTitle]}>매수 금액</Text>
                            <Text style={[styles.bottomItemValue]}>{ value_bought ? number.putComma(Decimal(value_bought).toFixed(0)) : '- ' }원</Text>
                        </View> */}
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        backgroundColor: 'white'
    },
    upperContainer: {
        padding: 15,
        paddingTop: 8,
        paddingBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#f7f8fa',

        borderTopWidth: 0.5,
        borderTopColor: '#dedfe0',
    },
    upperLeftContainer: {
        flex: 4
    },
    assetName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0042b7'
    },
    upperRightContainer: {
        flexDirection: 'column',
        flex: 5,
        width: 300,
        alignItems: 'stretch'
    },
    upperRightItemContainer: {
        marginBottom: 6,
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    upperRightItemTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#747474'
    },
    upperRightItemValue: {
        fontSize: 14,
        fontWeight: '500',
    },
    rise: {
        color: '#da5f6e',
    },
    fall: {
        color: '#0042b7',
    },

    bottomContainer: {
        padding: 15,
        paddingTop: 12,
        paddingBottom: 7,
        flexDirection: 'row',

        borderBottomWidth: 0.5,
        borderBottomColor: '#dedfe0',
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
        fontWeight: '500',
        marginBottom: 2,
    },
    bottomItemValue: {
    }
})

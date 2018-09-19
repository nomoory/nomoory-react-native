import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { inject, observer } from 'mobx-react';
import constants from '../../global/constants';

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
            totalEvaluatedValueInKRW,
            holdingKRW,
            totalBuyingPrice,
            evaluatedPriceOfAccountsWithoutKRW,
            evaluatedRevenue,
            evaluatedRevenueRatio
        } = accountStore.totalAssetsEvaluation;
        return (
            <View style={ styles.contrainer }>
                <View style={ styles.header }>
                    <Text style={ styles.title }>총 보유자산</Text>
                </View>
                <View style={ styles.body }>
                    <View style={ styles.bodyLeft }>
                        <Text>자산 평가액 (KRW)</Text>
                        <Text>{ totalEvaluatedValueInKRW }</Text>
                        <Text>보유 KRW</Text>
                        <Text>{ holdingKRW }</Text>
                    </View>
                    <View style={ styles.bodyRight }>
                        <Text>매수 금액</Text>
                        <Text>{ totalBuyingPrice }</Text>
                        <Text>평가 금액</Text>
                        <Text>{ evaluatedPriceOfAccountsWithoutKRW }</Text>
                        <Text>평가 수익률</Text>
                        <Text>{ evaluatedRevenueRatio }</Text> 
                        <Text>평가 손익</Text>
                        <Text>{ evaluatedRevenue }</Text>
                    </View>
                </View>
            </View>
        )
  }
}

const styles = StyleSheet.create({
    container: {
    },
    header: {
        flexDirection: 'row',
    },
    title: {
        padding: constants.style.padding,
    },
    body: {
        padding: constants.style.padding,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    bodyLeft: {
        alignItems: 'flex-start'
    },
    bodyRight: {
        alignItems: 'flex-end'
    }
})

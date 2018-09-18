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
        const totalEvaluatedValueInKRW =  accountStore.evaluatedTotalAssetsValueInKRW;
        const balanceOfKRW = accountStore.getAccountByAssetSymbol('KRW');

        return (
            <View style={ styles.contrainer }>
                <View style={ styles.header }>
                    <Text style={ styles.title }>총 보유자산</Text>
                </View>
                <View style={ styles.body }>
                    <View style={ styles.bodyLeft }>
                        <Text>자산 평가액 (KRW)</Text>
                        <Text>{ '131,600' }</Text>
                        <Text>보유 KRW</Text>
                        <Text>{ '1,900' }</Text>
                    </View>
                    <View style={ styles.bodyRight }>
                        <Text>매수 금액</Text>
                        <Text>{ '131,600' }</Text>
                        <Text>평가 금액</Text>
                        <Text>{ '129,700' }</Text>
                        <Text>평가 수익률</Text>
                        <Text>{ '0.16%' }</Text> 
                        <Text>평가 손익</Text>
                        <Text>{ '799' }</Text>
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

import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { inject, observer } from 'mobx-react';
import { observe } from 'mobx';
import constants from '../../global/constants';

@inject('accountStore')
@observer
export default class AssetsAndEvaluationRow extends Component {
    constructor(props) {
        super(props);
        // this.pubnubChannel = "";
    }

    render() {
        const { account } = this.props;
        const {
            uuid,
            balance,
            asset_symbol,
            asset_english_name,
            asset_korean_name,
            pending_order,
            pending_withdrawl,
            avg_fiat_buy_price,
            is_avg_fiat_buy_price_modified,
            asset_close_price
        } = this.props.account;

        const fiatBuyPrice = avg_fiat_buy_price * balance;
        const evaluatedPrice = asset_close_price * balance;
        const evaluatedRevenue = evaluatedPrice - fiatBuyPrice;
        const evaluatedRevenueRatio = evaluatedRevenue / fiatBuyPrice;

        return (
            <View style={ styles.contrainer }>
                <View style={ styles.left }>
                    <Text style={ {} }>{ asset_korean_name }</Text>
                    <Text style={ {} }>{ asset_symbol }</Text>
                    <Text style={ {} }>보유수량</Text>
                    <Text style={ {} }>{ balance }</Text>    
                </View>
                <View style={ styles.right }>
                    <View style={ styles.titles }>
                        <Text style={ {} }>매수 금액</Text>
                        <Text style={ {} }>매수 평균가</Text>
                        <Text style={ {} }>평가 금액</Text>
                        <Text style={ {} }>평가 수익률</Text>
                        <Text style={ {} }>평가 손익</Text>
                    </View>
                    <View style={ styles.contents }>
                        <Text style={ {} }>{ avg_fiat_buy_price * balance }</Text>
                        <Text style={ {} }>{ avg_fiat_buy_price }</Text>
                        <Text style={ {} }>{ evaluatedPrice}</Text>
                        <Text style={ {} }>{ evaluatedRevenueRatio +'%' }</Text>
                        <Text style={ {} }>{ evaluatedRevenue }</Text>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: constants.style.padding
    },
    left: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    right: {
        flex: 1,
        flexDirection: 'row',
    },
    titles: {
        flexDirection: 'column',
        alignItems: 'flex-start'
    },
    contents: {
        flexDirection: 'column',
        alignItems: 'flex-end'
    }
})

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import { inject, observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import number from '../../utils/number';
import Decimal from '../../utils/decimal';
import TRANSLATIONS from '../../TRANSLATIONS';
import commonStyle from '../../styles/commonStyle';
import { computed } from 'mobx';

@withNavigation
@inject('tradingPairStore')
@observer
class TradingPairRow extends Component {
    _onPressTradingPairRow = (e) => {
        this.props.tradingPairStore.setSelectedTradingPairName(this.props.tradingPair.name);
        this._openTradingPairScreen();
    }

    _openTradingPairScreen = () => {
        let tradingPair = this.props.tradingPair;
        this.props.navigation.navigate('TradingPair', {
            baseKoreanName: tradingPair.base_korean_name,
            tradingPairName: tradingPair.name
        });
    }

    @computed get changeRate() {
        let { change_rate, change } = this.props.tradingPair || {};
        return ` ${change === 'RISE' ? '+' : ''}${change === 'FALL' ? '-' : ''}${change_rate ? number.putComma(Decimal(Decimal(change_rate).mul(100).toFixed(2)).toFixed()) : '- '}`
    }

    render() {
        const { 
            close_price, signed_change_rate, acc_trade_value_24h, 
            base_korean_name, base_english_name, name, 
            open_price
        } = this.props.tradingPair || {};
        const tokenNameForSelectedLanguage = this.props.tradingPairStore.languageForTokenName === 'ko' ?
            base_korean_name :
            base_english_name;
        const result = number.getNumberAndPowerOfTenFromNumber_kr(acc_trade_value_24h);
        const isIncreased = close_price && open_price && Decimal(close_price).lessThan(open_price);
        const isDecreased = close_price && open_price && Decimal(close_price).greaterThan(open_price);


        return (
            <TouchableOpacity
                key={this.props.index}
                style={[styles.container]}
                onPress={this._onPressTradingPairRow}
            >
                <View style={[styles.name]}>
                    <Text style={[styles.tokenNameText]}>{tokenNameForSelectedLanguage}</Text>
                    <Text style={[styles.tradingPairNameText]}>{name}</Text>
                </View>                
                <View style={[ styles.closePrice, styles.column ]}>
                    <Text
                        style={[
                            isIncreased ? styles.blueText : null,
                            isDecreased ? styles.redText : null,
                        ]}
                    >{close_price ? number.putComma(Decimal(close_price).toFixed()) : '-'} 원</Text>
                </View>
                <View style={[styles.signedChangeRate, styles.column]}>
                    <Text
                        style={[
                            isIncreased ? styles.blueText : null,
                            isDecreased ? styles.redText : null,
                        ]}
                    >{this.changeRate} %</Text>
                </View>
                <View style={[styles.accTradeValue, styles.column]}>
                    <Text>{result.number ? number.putComma(Decimal(result.number).toFixed()) : '-'} {TRANSLATIONS[result.type]}원</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        height: 60,
        flexDirection: 'row',

        borderStyle: 'solid',
        borderWidth: 0.5,
        borderColor: '#e9eaea',
    },
    name: {
        paddingLeft: 10,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    accTradeValue: {
        paddingRight: 10,
    },
    closePrice: {
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    column: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    blueText: {
        color: commonStyle.color.coblicBlue
    },
    redText: {
        color: commonStyle.color.coblicRed
    },
})
export default TradingPairRow;
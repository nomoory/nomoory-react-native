import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import { inject, observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import number, { getNumberAndPowerOfTenFromNumber, Decimal } from '../../utils/number';
import TRANSLATIONS from '../../TRANSLATIONS';
import commonStyle from '../../styles/commonStyle';
import { computed } from 'mobx';

@withNavigation
@inject('tradingPairStore')
@observer
class TradingPairRow extends Component {
    _onPressTradingPairRow = (e) => {
        this.props.tradingPairStore.setSelectedTradingPairName(this.props.tradingPair.name);
        let tradingPair = this.props.tradingPair;
        this._openTradingPairScreen(tradingPair);
    }

    _openTradingPairScreen = (tradingPair) => {
        this.props.navigation.navigate('TradingPair', {
            baseKoreanName: tradingPair.base_korean_name,
            tradingPairName: tradingPair.name
        });
    }

    @computed
    get changeRate() {
        let { change_rate, change } = this.props.tradingPair || {};
        if (Decimal(change_rate || 0).equals(0)) return '0.00';
        return ` ${change === 'RISE' ? '+' : ''}${change === 'FALL' ? '-' : ''}${change_rate ? number.putComma(Decimal(Decimal(change_rate).mul(100).toFixed(2)).toFixed()) : '-'}`
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
        const result = getNumberAndPowerOfTenFromNumber(acc_trade_value_24h);
        const isIncreased = close_price && open_price && Decimal(close_price).lessThan(open_price);
        const isDecreased = close_price && open_price && Decimal(close_price).greaterThan(open_price);
        let textStyle = null;
        if (isIncreased) textStyle = styles.blueText;
        if (isDecreased) textStyle = styles.redText;

        return (
            <TouchableOpacity
                key={this.props.index}
                style={[styles.container]}
                onPress={this._onPressTradingPairRow}
            >
                <View style={[styles.name]}>
                    <Text style={[styles.textSizeNormal]}>{tokenNameForSelectedLanguage}</Text>
                    <Text style={[styles.textSizeNormal]}>{name}</Text>
                </View>
                <View style={[ styles.closePrice, styles.column ]}>
                    <Text style={[textStyle, styles.textSizeNormal]}
                    >{close_price ? number.putComma(Decimal(close_price).toFixed()) : '-'} 원</Text>
                </View>
                <View style={[styles.column, styles.signedChangeRate]}>
                    <Text style={[textStyle, styles.textSizeNormal]}
                    >{this.changeRate} %</Text>
                    <Text style={[textStyle, styles.textSizeSmall]}
                    >{number.putComma(Decimal(close_price).minus(open_price).abs().toFixed())}
                    </Text>
                </View>
                <View style={[styles.accTradeValue, styles.column]}>
                    <Text style={[styles.textSizeNormal]}>{result.number ? number.putComma(Decimal(result.number).toFixed()) : '-'} {TRANSLATIONS[result.type]} 원</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        height: 48,
        paddingTop: 3,
        paddingBottom: 3,
        flexDirection: 'row',

        borderStyle: 'solid',
        borderWidth: 0.6,
        borderColor: '#e9eaea',
    },
    name: {
        paddingLeft: 10,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
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
    signedChangeRate: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    textSizeNormal: {
        fontSize: 13,
    },
    textSizeSmall: {
        fontSize: 11,
    }
})
export default TradingPairRow;
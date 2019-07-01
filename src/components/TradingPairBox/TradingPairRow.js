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
            baseName: 
                this.props.tradingPairStore.languageForTokenName === 'ko' ? tradingPair.base_korean_name : tradingPair.base_english_name,
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
        const isKorean = this.props.tradingPairStore.languageForTokenName === 'ko';
        const isEnglish = !isKorean;
        const tokenName = isKorean ?
            base_korean_name :
            base_english_name;

        const result = getNumberAndPowerOfTenFromNumber(acc_trade_value_24h);
        const isIncreased = close_price && open_price ? Decimal(close_price).lessThan(open_price) : false;
        const isDecreased = close_price && open_price ? Decimal(close_price).greaterThan(open_price) : false;
        let textStyle = null;
        if (isIncreased) textStyle = styles.blueText;
        if (isDecreased) textStyle = styles.redText;

        return (
            <TouchableOpacity
                key={this.props.index}
                style={[styles.container]}
                onPress={this._onPressTradingPairRow}
            >
                <View style={[styles.name, styles.paddingTop]}>
                    <Text 
                        style={[
                            styles.textSizeBig,
                            isKorean && 6 < tokenName.length && styles.textSizeNormal,
                            isKorean && 8 < tokenName.length && styles.textSizeSmall,
                            isEnglish && 8 < tokenName.length && styles.textSizeNormal,
                            isEnglish && 10 < tokenName.length && styles.textSizeSmall,
                        ]}
                        ellipsizeMode='tail'
                        numberOfLines={1}
                    >
                        {tokenName}
                    </Text>
                    <Text style={[styles.textSizeNormal]}>{name}</Text>
                </View>
                <View style={[ styles.closePrice, styles.column, styles.paddingTop ]}>
                    <Text style={[textStyle, styles.textSizeNormal]}
                    >{close_price ? number.putComma(Decimal(close_price ||0 ).toFixed()) : '-'}</Text>
                </View>
                <View style={[styles.signedChangeRate, styles.paddingTop]}>
                    <Text style={[textStyle, styles.textSizeNormal]}
                    >{this.changeRate}%</Text>
                    <Text style={[textStyle, styles.textSizeSmall]}
                    >{number.putComma(Decimal(close_price || 0).minus(open_price || 0).abs().toFixed())}
                    </Text>
                </View>
                <View style={[styles.accTradeValue, styles.column, styles.paddingTop]}>
                    <Text style={[styles.textSizeNormal]}>{result.number ? number.putComma(Decimal(result.number || 0).toFixed()) : '-'}{TRANSLATIONS[result.type]}</Text>
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
        width: 100,
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
        alignItems: 'flex-start',
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
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
    },
    textSizeBig: {
        fontSize: 13,
        fontWeight:'200'
    },
    textSizeNormal: {
        fontSize: 12,
        fontWeight:'200'
    },
    textSizeSmall: {
        fontSize: 11,
        fontWeight:'200'
    },
    paddingTop: {
        paddingTop: 2
    }
})
export default TradingPairRow;
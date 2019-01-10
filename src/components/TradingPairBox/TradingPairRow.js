import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import { Container, } from 'native-base';
import { inject, observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import number from '../../utils/number';
import Decimal from '../../utils/decimal';

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

    render() {
        const tradingPairStore = this.props.tradingPairStore;
        const { close_price, signed_change_rate, acc_trade_value_24h, base_korean_name, base_english_name, name } = this.props.tradingPair || {};
        const tokenNameForSelectedLanguage = tradingPairStore.languageForTokenName === 'ko' ?
            base_korean_name :
            base_english_name;

        return (
            <TouchableOpacity
                style={[styles.container]}
                onPress={this._onPressTradingPairRow}
            >
                <View style={[styles.name]}>
                    <Text style={[styles.tokenNameText]}>{tokenNameForSelectedLanguage}</Text>
                    <Text style={[styles.tradingPairNameText]}>{name}</Text>
                </View>                
                <View style={[styles.closePrice, styles.column]}>
                    <Text>{close_price ? number.putComma(Decimal(close_price).toFixed()) : '-'}</Text>
                </View>
                <View style={[styles.signedChangeRate, styles.column]}>
                    <Text>{signed_change_rate ? number.putComma(Decimal(signed_change_rate).toFixed()) : '-'} %</Text>
                </View>
                <View style={[styles.accTradeValue, styles.column]}>
                    <Text>{acc_trade_value_24h ? number.putComma(Decimal(acc_trade_value_24h).toFixed()) : '-'}</Text>
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
    }
})
export default TradingPairRow;
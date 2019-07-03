import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { inject, observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import number, {
    getNumberAndPowerOfTenFromNumber,
    Decimal
} from '../../utils/number';
import TRANSLATIONS from '../../TRANSLATIONS';
import commonStyle from '../../styles/commonStyle';
import { computed, action } from 'mobx';

let turnBackTimeout = null;
@withNavigation
@inject('tradingPairStore')
@observer
class TradingPairRow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFirstLoad: true,
            prevClosePrice: props.tradingPair ? props.tradingPair.close_price : 0,
            value: new Animated.Value(0),
        };
    }

    componentDidMount() {
        this.color = this.state.value.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: ['#d60000', '#ffffff', '#0051c7'],
        });
        this.setState({
            isFirstLoad: false
        })
    }
    componentWillUnmount() {
        this.setState({value: 0})
        clearTimeout(turnBackTimeout);
    }

    // 현재가 변동시 깜빡이는 UI Test용, feature 개발이 완료되면 지워도됩니다. _ 준혁
    // _changeClosePriceState = action(() => {
    //     this.props.tradingPair.close_price =
    //         Math.random() > 0.5
    //             ?
    //             Decimal(this.props.tradingPair.close_price).add(1000).toFixed()
    //             :
    //             Decimal(this.props.tradingPair.close_price).minus(1000).toFixed()
    //         ;
    //     // console.log(this.props.tradingPair.close_price)
    // })

    static getDerivedStateFromProps(props, state) {
        const prevClosePrice = state.prevClosePrice;
        const nextClosePrice = props.tradingPair.close_price;
        if (prevClosePrice && prevClosePrice !== nextClosePrice) {
            try {
                if (Decimal(nextClosePrice).lessThan(prevClosePrice)) { // 하락 = 파랑
                    Animated.timing(
                        state.value, {
                            toValue: 1,
                            duration: 0,
                            delay: 0
                        }).start()
                }
                if (Decimal(nextClosePrice).greaterThan(prevClosePrice)) { // 상승 = 빨강       
                    Animated.timing(
                        state.value, {
                            toValue: -1,
                            duration: 0,
                            delay: 0
                        }).start()
                }
            } catch (err) {
    
            }
            state.prevClosePrice = nextClosePrice;
            clearTimeout(turnBackTimeout);
            turnBackTimeout = setTimeout(() => {
                Animated.timing(
                    state.value, {
                        toValue: 0,
                        duration: 1500,
                        delay: 0
                    }).start()
            }, 0);
        }
        return true;
    }

    _onPressTradingPairRow = (e) => {
        let tradingPair = this.props.tradingPair;
        this.props.tradingPairStore.setSelectedTradingPairName(tradingPair.name);
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
                <View style={[
                    styles.name,
                    styles.paddingTop
                ]}>
                    <Text
                        style={[
                            styles.nameText,
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
                    <Text style={[
                        styles.textSizeSmall
                    ]}>{name}
                    </Text>
                </View>
                <Animated.View style={[
                    styles.closePrice,
                    styles.column,
                    styles.paddingTop,
                    this.state.isFirstLoad 
                    ? 
                    {}
                    : 
                    {
                        borderStyle: 'solid',
                        borderWidth: 0.5,
                        borderColor: this.color,
                    }
                ]}>
                    <Text style={[
                        textStyle, 
                        styles.textSizeNormal
                    ]}
                    >{close_price ? number.putComma(Decimal(close_price || 0).toFixed()) : '-'}
                    </Text>
                </Animated.View>
                <View style={[styles.signedChangeRate, styles.paddingTop]}>
                    <Text style={[textStyle, styles.textSizeNormal]}
                    >{this.changeRate}%</Text>
                    <Text style={[textStyle, styles.textSizeSmall]}
                    >{number.putComma(Decimal(close_price || 0).minus(open_price || 0).abs().toFixed())}
                    </Text>
                </View>
                <View style={[styles.accTradeValue, styles.column, styles.paddingTop]}>
                    <Text style={[styles.textSizeNormal]}>{result.number ? number.putComma(Decimal(result.number || 0).toFixed(), 0) : '-'}{TRANSLATIONS[result.type]}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        height: 48,
        paddingTop: 4,
        paddingBottom: 4,
        flexDirection: 'row',

        borderBottomWidth: 1,
        borderBottomColor: '#dedfe0',
    },
    name: {
        width: 100,
        paddingLeft: 10,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
    },
    nameText: {
        paddingLeft: 1,
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
        color: commonStyle.color.brandBlue
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
        fontWeight: '200'
    },
    textSizeNormal: {
        fontSize: 12,
        fontWeight: '200'
    },
    textSizeSmall: {
        fontSize: 11,
        fontWeight: '200'
    },
    paddingTop: {
        paddingTop: 2
    }
})
export default TradingPairRow;
import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { inject, observer } from 'mobx-react';
import NavigationService from '../../utils/NavigationService';
import commonStyle from '../../styles/commonStyle';

@inject('tradingPairStore', 'modalStore')
@observer
export default class TradingPairSelectionModal extends Component {
    _onPressTradingPairRow = (tradingPairName) => () => {
        this.props.tradingPairStore.setSelectedTradingPairName(tradingPairName);
        let tradingPair = this.props.tradingPairStore.selectedTradingPair;
        this._openTradingPairScreen(tradingPair);
    }

    _openTradingPairScreen = (tradingPair) => {
        NavigationService.navigate('TradingPair', {
            baseName: 
                this.props.tradingPairStore.languageForTokenName === 'ko' ? tradingPair.base_korean_name : tradingPair.base_english_name,
            tradingPairName: tradingPair.name
        });
        this.props.modalStore.closeCustomModal();
    }
    render() {
        const { allTradingPairs, selectedTradingPairName, languageForTokenName } = this.props.tradingPairStore || {};
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text>거래소</Text>
                </View>
                <ScrollView>
                    {
                        (allTradingPairs && allTradingPairs.length > 0) ?
                        allTradingPairs.map((tradingPair, index) => {
                            const {
                                close_price,
                                signed_change_rate,
                                acc_trade_value_24h,
                                base_korean_name,
                                base_english_name,
                                name,
                                open_price,
                            } = tradingPair || {};

                            return (
                                <TouchableOpacity
                                    style={styles.selection}
                                    onPress={this._onPressTradingPairRow(name)}
                                >
                                    <Text
                                        style={[
                                            styles.selectionText,
                                            name === selectedTradingPairName && styles.selectedText
                                        ]}
                                    >
                                    { `${
                                        languageForTokenName === 'ko' ?
                                        base_korean_name
                                        : base_english_name
                                    } (${name.split('-').join('/')})` }</Text>
                                </TouchableOpacity>
                            );
                        }) :
                        null
                    }
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '80%',
        height: '40%',
        backgroundColor: 'white',
    },
    header: {
        height: 30,
        fontSize: 12,
        fontWeight: '400',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eeeeee',
    },
    selection: {
        height: 32,
        fontSize: 14,
    },
    selectionText: {

    },
    selectedText: {
        color: commonStyle.color.brandBlue,
    }
});
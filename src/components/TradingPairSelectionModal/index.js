import React, { Component } from 'react';
import {
    StyleSheet,
    Image,
    View,
    Text,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import {
    inject,
    observer,
} from 'mobx-react';
import NavigationService from '../../utils/NavigationService';
import commonStyle from '../../styles/commonStyle';

@inject(
    'tradingPairStore',
    'modalStore',
)
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
        const {
            selecetedQuoteTradingPairs,
            selectedTradingPairName,
            selectedTradingPair,
            languageForTokenName,
        } = this.props.tradingPairStore || {};

        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text
                        style={{ fontSize: 16, fontWeight: '500' }}
                    >거래소 ({selectedTradingPair.quote_symbol})</Text>
                </View>
                <FlatList
                    style={{ margin: 10 }}
                    data={(selecetedQuoteTradingPairs && selecetedQuoteTradingPairs.length > 0) ?
                        selecetedQuoteTradingPairs : []}
                    // refreshing={this.state.refreshing}
                    // onRefresh={this.onRefresh}
                    enableEmptySections={true}
                    renderItem={({ item, index }) => {
                        const {
                            close_price,
                            signed_change_rate,
                            acc_trade_value_24h,
                            base_korean_name,
                            base_english_name,
                            base_symbol,
                            name,
                            open_price,
                        } = item || {};

                        return (
                            <TouchableOpacity
                                style={styles.selection}
                                onPress={this._onPressTradingPairRow(name)}
                            >
                                <Image
                                    style={{ marginRight: 10, width: 28, height: 28 }}
                                    source={{ uri: `${Expo.Constants.manifest.extra.LOGO_ASSET_ORIGIN}/logos/${base_symbol}.png` }}
                                />
                                <Text
                                    style={[
                                        styles.selectionText,
                                        name === selectedTradingPairName && styles.selectedText
                                    ]}
                                >
                                    {`${
                                        languageForTokenName === 'ko' ?
                                            base_korean_name
                                            : base_english_name
                                        } (${name.split('-').join('/')})`}</Text>
                            </TouchableOpacity>
                        );
                    }}
                // emptyView={this._renderEmptyView}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '80%',
        height: '60%',
        backgroundColor: 'white',
    },
    header: {
        height: 40,
        fontSize: 12,
        fontWeight: '600',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eeeeee',
    },
    selection: {
        padding: 10,
        fontSize: 14,
        borderBottomWidth: 0.5,
        borderBottomColor: '#aaaaaa',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectionText: {

    },
    selectedText: {
        color: commonStyle.color.brandBlue,
    }
});
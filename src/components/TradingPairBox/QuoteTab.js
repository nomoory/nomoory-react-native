import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { observer, inject } from 'mobx-react';
import { action } from 'mobx';
import commonStyle from '../../styles/commonStyle';

@inject('tradingPairStore')
@observer
export default class QuoteTab extends Component {
    _onPressTab = (tabType) => action((e) => {
        this.props.tradingPairStore.changeSelectedQuoteTabType(tabType);
    })

    _renderTabButtons = () => {
        let sortedQuoteTabTypes = [];
        let quoteTabTypeOrigin = this.props.tradingPairStore.quoteTabTypes;
        let quoteTabTypes = Object.keys(quoteTabTypeOrigin);
        if (quoteTabTypes.length) {
            if (quoteTabTypes.includes('KRW')) sortedQuoteTabTypes.push('KRW');
            if (quoteTabTypes.includes('BTC')) sortedQuoteTabTypes.push('BTC');
            if (quoteTabTypes.includes('ETH')) sortedQuoteTabTypes.push('ETH');
            if (quoteTabTypes.includes('USDT')) sortedQuoteTabTypes.push('USDT');

            sortedQuoteTabTypes.push(...quoteTabTypes.filter((tabType) => {
                return !['KRW', 'BTC', 'ETH', 'USDT'].includes(tabType);
            }));
            let selected = false;
            let selectedOnLeft = false;

            return sortedQuoteTabTypes.map((quoteTabType, idx) => {
                selectedOnLeft = selected;
                selected = quoteTabType === this.props.tradingPairStore.selectedQuoteTabType
                return (
                    <TouchableOpacity 
                        key={quoteTabType}
                        style={[
                            styles.tab,
                            idx !== sortedQuoteTabTypes.length - 1 ? styles.tabNotLast : {},
                            selected
                            && styles.selectedTab,
                            selectedOnLeft
                            && styles.selectedOnLeft,
                        ]}
                        onPress={this._onPressTab(quoteTabType)}
                    >
                        <Text 
                            style={[
                                styles.tabText, 
                                quoteTabType === this.props.tradingPairStore.selectedQuoteTabType
                                && styles.selectedText]}
                        >{quoteTabType}
                        </Text>
                    </TouchableOpacity>
                    )
                }
            );               
        }
    }

    render() {

        return (
            <View style={styles.container}>
                <View style={styles.tabs}>
                    {this._renderTabButtons()}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 12,
    },
    tabs: {
        display: 'flex',
        flexDirection: 'row',
        height: 34,
        borderColor: '#6c6c6c',
    },
    tab: {
        height: '100%',
        width: 60,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderStyle: 'solid',
        borderWidth: 0.5,
        borderColor: '#6c6c6c',
    },
    tabNotLast: {
        borderRightWidth: 0,
    },
    selectedTab: {
        borderWidth: 1,
        borderRightWidth: 1,
        borderColor: commonStyle.color.brandBlue,
    },
    selectedOnLeft: {
        borderLeftWidth: 0,
    },
    tabText: {
        fontSize: 16,
        color: '#6c6c6c',
    },
    selectedText: {
        color: commonStyle.color.brandBlue,
    },
    tabBody: {
        paddingTop: 15,
        paddingBottom: 15,
        flex: 1,
        width: '100%',
    }
});

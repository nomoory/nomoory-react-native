import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { observer, inject } from 'mobx-react';
import { action } from 'mobx';
import commonStyle from '../../styles/commonStyle';

@inject('tradingPairStore')
@observer
export default class QutoeTab extends Component {
    _onPressTab = (tabType) => action((e) => {
        this.props.tradingPairStore.changeSelectedQuoteTabType(tabType);
    })

    _renderTabButtons = () => {
        let sortedQuoteTabTypes = [];
        let quoteTabTypeOrigin = this.props.tradingPairStore.quoteTabTypes;
        let quoteTabTypes = Object.keys(quoteTabTypeOrigin);
        if (quoteTabTypes.length) {
            if (quoteTabTypeOrigin['KRW']) sortedQuoteTabTypes.push['KRW'];
            if (quoteTabTypeOrigin['BTC']) sortedQuoteTabTypes.push['BTC'];
            if (quoteTabTypeOrigin['ETH']) sortedQuoteTabTypes.push['ETH'];
            if (quoteTabTypeOrigin['USDT']) sortedQuoteTabTypes.push['USDT'];

            sortedQuoteTabTypes.push(...quoteTabTypes.filter((tabType) => {
                return !['KRW', 'BTC', 'ETH', 'USDT'].includes(tabType);
            }))
            console.log(quoteTabTypes);
            return quoteTabTypes.map((quoteTabType, idx) => (
                <TouchableOpacity 
                    key={quoteTabType}
                    style={[
                        styles.tab, 
                        quoteTabType === this.props.tradingPairStore.selectedQuoteTabType
                        && styles.selectedTab
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
            ));               
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
        padding: 8,
    },
    tabs: {
        display: 'flex',
        flexDirection: 'row',
        height: 26,
    },
    tab: {
        height: '100%',
        width: 50,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderStyle: 'solid',
        borderWidth: 0.5,
        borderColor: '#7c7c7c',
    },
    selectedTab: {
        borderWidth: 1,
        borderColor: commonStyle.color.brandBlue,
    },
    tabText: {
        fontSize: 13,
        color: '#7c7c7c',
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

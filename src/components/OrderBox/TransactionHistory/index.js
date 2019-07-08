import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { observer, inject } from 'mobx-react';
import { observable, action } from 'mobx';
import PlacedOrder from './PlacedOrder';
import CompletedOrder from './CompletedOrder';
import commonStyle from '../../../styles/commonStyle';

const TAB_TYPES = {
    PLACED_ORDER: 'PLACED_ORDER',
    COMPLETD_ORDER: 'COMPLETD_ORDER',
};

@inject('placedOrderHistoryStore', 'tradingPairStore')
@observer
export default class TransactionHistory extends Component {
    @observable
    selectedTabType = TAB_TYPES.PLACED_ORDER;

    _onPressTab = (tabType) => action((e) => {
        this.selectedTabType = tabType;
    })

    render() {
        let isPlacedOrderTab = this.selectedTabType === TAB_TYPES.PLACED_ORDER;
        let isCompletedOrderTab = this.selectedTabType === TAB_TYPES.COMPLETD_ORDER;

        return (
            <View style={styles.container}>
                <View style={styles.tabs}>
                    <TouchableOpacity 
                        style={[styles.tab, isPlacedOrderTab && styles.selectedTab]}
                        onPress={this._onPressTab(TAB_TYPES.PLACED_ORDER)}
                    >
                        <Text 
                            style={[styles.tabText, isPlacedOrderTab && styles.selectedText]}
                        >미체결</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.tab, isCompletedOrderTab && styles.selectedTab]}
                        onPress={this._onPressTab(TAB_TYPES.COMPLETD_ORDER)}
                    >
                        <Text 
                            style={[styles.tabText, isCompletedOrderTab && styles.selectedText]}
                        >체결</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.tabBody}>
                    {
                        isPlacedOrderTab
                        ? 
                        <PlacedOrder 
                            targetTradingPairName={this.props.tradingPairStore.selectedTradingPairName}
                        /> 
                        : null}
                    {
                        isCompletedOrderTab
                        ? 
                        <CompletedOrder
                            targetTradingPairName={this.props.tradingPairStore.selectedTradingPairName}
                        />
                        : null}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingBottom: 0,
        alignItems: 'center',
    },
    tabs: {
        display: 'flex',
        flexDirection: 'row',
        width: '80%',
        height: 30,
    },
    tab: {
        height: '100%',
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderStyle: 'solid',
        borderWidth: 0.5,
        borderColor: 'black',
    },
    selectedTab: {
        borderWidth: 0.5,
        borderColor: commonStyle.color.brandBlue,
    },
    tabText: {
        color: 'black',
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

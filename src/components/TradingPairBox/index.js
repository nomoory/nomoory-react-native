import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { inject, observer } from 'mobx-react';
import TradingPairSearchBar from './TradingPairSearchBar';
import AccountStatus from './AccountStatus';
import TradingPairTable from './TradingPairTable';
import QutoeTab from './QuoteTab';

@inject('tradingPairStore')
@observer
export default class TradingPairBox extends Component {
    render() {
        return (
            <View style={styles.container}>
                <TradingPairSearchBar />
                <AccountStatus />
                <QutoeTab />
                <View style={styles.tradingPairTableContainer}>
                    <TradingPairTable />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tradingPairTableContainer: {
        flex: 1
    }
});
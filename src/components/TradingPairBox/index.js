import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { inject, observer } from 'mobx-react';
import TradingPairSearchBar from './TradingPairSearchBar';
import AccountStatus from './AccountStatus';
// import TradingPairTab from './TradingPairTab'; // 원화 이외의 quote open시 적용
import TradingPairTable from './TradingPairTable';

@inject('tradingPairStore')
@observer
class TradingPairBox extends Component {
    render() {
        return (
            <View style={styles.container}>
                <TradingPairSearchBar />
                <AccountStatus />
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

export default TradingPairBox;
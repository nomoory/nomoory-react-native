import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { inject, observer } from 'mobx-react';
import { observable, computed } from 'mobx';
import TradingPairSearchBar from './TradingPairSearchBar';
// import TradingPairTab from './TradingPairTab'; // 원화 이외의 quote open시 적용
import TradingPairTable from './TradingPairTable';

@inject('tradingPairStore', 'pubnub')
@observer
class TradingPairBox extends Component {
    render() {
        return (
            <View style={styles.container}>
                <TradingPairSearchBar />
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
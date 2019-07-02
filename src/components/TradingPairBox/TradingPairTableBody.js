import React, { Component } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { inject, observer } from 'mobx-react';
import TradingPairRow from './TradingPairRow';
import { computed } from 'mobx';

@inject('tradingPairStore')
@observer
export default class TradingPairTableBody extends Component {
    @computed
    get tradingPairList() {
        const tradingPairList = [];
        const { tradingPairs } = this.props.tradingPairStore || {};
        if (tradingPairs && tradingPairs.length > 0) {
            
            return tradingPairs.map((tradingPair, index) => {
                return (
                    <TradingPairRow
                        key={index}
                        index={index}
                        tradingPair={tradingPair}
                    />
                );
            })
        }
        return tradingPairList;

    }
    render() {
        return (
            <ScrollView style={styles.container}>
                { this.tradingPairList }
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
});

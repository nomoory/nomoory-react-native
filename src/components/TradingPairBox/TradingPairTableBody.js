import React, { Component } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { inject, observer } from 'mobx-react';
import TradingPairRow from './TradingPairRow';

// TODO 정렬, 필터 정보 받아서 이에 맞게 rows 걸러주기

@inject('tradingPairStore')
@observer
class TradingPairTableBody extends Component {
    render() {
        const { tradingPairs } = this.props.tradingPairStore || {};
        console.log('TradingPairTableBody:tradingPairs', tradingPairs)
        return (
            <ScrollView style={styles.container}>
                {
                    tradingPairs && tradingPairs.length > 0 ?
                    tradingPairs.map((tradingPair, index) => {
                        return (
                            <TradingPairRow
                                key={index}
                                index={index}
                                tradingPair={tradingPair}
                            />
                        );
                    }

                    ) :
                    null
                }
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
})
export default TradingPairTableBody;
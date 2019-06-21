import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { inject, observer } from 'mobx-react';
import headerStyle from '../styles/headerStyle';
import TradingPairBox from '../components/TradingPairBox';
import tradingPairStore from '../stores/tradingPairStore'

@inject('tradingPairStore')
@observer
export default class ExchangeScreen extends Component {
    static navigationOptions = ({ navigation, navigationOptions }) => {        
        tradingPairStore.loadTradingPairs();
        console.log('loadTradingPairs')
        return {
            title: '거래소',
            // headerLeft: (
            //   <Button onPress={ () => navigation.goback() }
            //   title={ "cancelButtonName" }></Button>
            // ),
            ...headerStyle.white,
        };
    };
    _openBTCKRWForDevelopTradingPairScreen = () => {
        this.props.tradingPairStore.setSelectedTradingPairName('TOKA-KRW');
        this.props.navigation.navigate('TradingPair', {
            baseKoreanName: '토카',
            tradingPairName: 'TOKA-KRW'
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <TradingPairBox />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

import React, { Component } from 'react';
import { Text, StyleSheet, View, Button } from 'react-native';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import commonStyle from '../styles/commonStyle';
import headerStyle from '../styles/headerStyle';
import TradingPairBox from '../components/TradingPairBox';

@inject('pubnub', 'tradingPairStore')
@observer
export default class ExchangeScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '거래소',
            // headerLeft: (
            //   <Button onPress={ () => navigation.goback() }
            //   title={ "cancelButtonName" }></Button>
            // ),
            ...headerStyle.blue
        };
    };

    constructor(props) {
        super(props);

        // this._openBTCKRWForDevelopTradingPairScreen();
    }

    _openBTCKRWForDevelopTradingPairScreen = () => {
        this.props.tradingPairStore.setSelectedTradingPairName('TOKA-KRW');
        this.props.navigation.navigate('TradingPair', {
            baseKoreanName: '토카',
            tradingPairName: 'TOKA-KRW'
        });
    }
    componentDidMount() {
        // this.pubnubChannel = `TEMP|TICKER`;
        // this.props.pubnub.subscribe(this.pubnubChannel);
    }

    componentWillUnmount() { 
        // this.props.pubnub.unsubscribe(this.pubnubChannel);
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

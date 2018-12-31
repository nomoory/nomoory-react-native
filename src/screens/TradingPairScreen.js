import React, { Component } from 'react';
import { Container, Header, Tab, Tabs, TabHeading, Text } from 'native-base';
import { StyleSheet, View } from 'react-native';
import { inject, observer } from 'mobx-react';
import { reaction, computed } from 'mobx';
import OrderBox from '../components/OrderBox';
import Decimal from '../utils/decimal';
import number from '../utils/number';

@inject('pubnub', 'tradingPairStore')
@observer
export default class TradingPairScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        this.baseKoreanName= navigation.getParam('baseKoreanName', '토큰');
        this.tradingPairName = navigation.getParam('tradingPairName', '');
        return {
            title: `${this.baseKoreanName} ${this.tradingPairName}`,
            tabBarVisible: false, 
        };
    };
    @computed get changeRate() {
        let tradingPair = this.props.tradingPairStore.selectedTradingPair;
        let { change_rate, change } = tradingPair || {};
        return ` ${change === 'RICE' ? '+' : ''}${change === 'FALL' ? '-' : ''}${number.putComma(Decimal(change_rate).mul(100).toFixed(2))}`
    }
    @computed get changePrice() {
        let tradingPair = this.props.tradingPairStore.selectedTradingPair;
        let { change, change_price } = tradingPair || {};
        return ` ${change === 'RICE' ? '+' : ''}${change === 'FALL' ? '-' : ''}${number.putComma(Decimal(change_price).toFixed())} 원`
    }

    constructor(props) {
        super(props);
        this.pubnubChannel = "TEMP|TICKER";
    }

    componentDidMount() { this.props.pubnub.subscribe(this.pubnubChannel); }
    componentWillUnmount() { this.props.pubnub.unsubscribe(this.pubnubChannel); }

    render() {
        let tradingPair = this.props.tradingPairStore.selectedTradingPair;
        let {
            close_price,
            change, // 'RICE' | 'FALL'
        } = tradingPair || {};
        return (
            <Container style={styles.container}>
                <View style={styles.tradingPairSummaryContainer}>
                    <View style={styles.leftContainer}>
                        <View style={styles.closePrice}>
                            <Text style={styles.closePriceText}>{number.putComma(Decimal(close_price).toFixed())} 원</Text>
                        </View>
                        <View style={styles.tradingPairSubInfo}>
                            <Text>24시간대비</Text>
                            <Text style={styles[change]}>{this.changeRate}</Text>
                            <Text style={styles[change]}>{this.changePrice}</Text>
                        </View>
                    </View>
                    <View style={styles.rightContainer}>
                    </View>
                </View>
                <Tabs >
                    <Tab heading={<TabHeading><Text>주문</Text></TabHeading>}>
                        <OrderBox></OrderBox>
                    </Tab>
                    <Tab heading={<TabHeading><Text>차트</Text></TabHeading>}>
                        <View><Text>차트</Text></View>
                    </Tab>
                    <Tab heading={<TabHeading><Text>시세</Text></TabHeading>}>
                        <View><Text>시세</Text></View>
                    </Tab>
                    <Tab heading={<TabHeading><Text>미체결</Text></TabHeading>}>
                        <View><Text>미체결</Text></View>
                    </Tab>
                </Tabs>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    tradingPairSummaryContainer: {
        height: 60,
        width: '100%',
        flexDirection: 'row'
    },
    closePriceText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000'
    },
    RISE: {
        color: '#da5f6e'
    },
    FALL: {
        color: '#0052f3'
    },
    tradingPairSubInfo: {
        flexDirection: 'row'
    }
})

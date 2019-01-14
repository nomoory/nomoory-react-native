import React, { Component } from 'react';
import commonStyle from '../styles/commonStyle';
import headerStyle from '../styles/headerStyle';

import { Container, Tab, Tabs, TabHeading} from 'native-base';
import { StyleSheet, View, Text, Image } from 'react-native';
import { inject, observer } from 'mobx-react';
import { reaction, computed } from 'mobx';
import OrderBox from '../components/OrderBox';
import PersonalOrderHistory from '../components/PersonalOrderHistory';
import Decimal from '../utils/decimal';
import number from '../utils/number';
import riseIcon from '../../assets/images/exchange/ic_up_s.png';
import fallIcon from '../../assets/images/exchange/ic_down_s.png';


@inject('pubnub', 'tradingPairStore')
@observer
export default class TradingPairScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        this.baseKoreanName= navigation.getParam('baseKoreanName', '토큰');
        this.tradingPairName = navigation.getParam('tradingPairName', '');

        return {
            title: `${this.baseKoreanName} ${this.tradingPairName}`,
            tabBarVisible: false, 
            ...headerStyle.white
        };
    };

    constructor(props) {
        super(props);
        this.pubnubChannel = `ORDERBOOK_${this.tradingPairName}`;
        this.props.pubnub.subscribe(this.pubnubChannel);
    }

    componentWillMount() { console.log('TradingPairScreen will mount |'); }
    componentWillUnmount() { 
        console.log('TradingPairScreen | will unmount |');
        this.props.pubnub.unsubscribe(this.pubnubChannel); 
    }

    @computed get changeRate() {
        let tradingPair = this.props.tradingPairStore.selectedTradingPair;
        let { change_rate, change } = tradingPair || {};
        return ` ${change === 'RISE' ? '+' : ''}${change === 'FALL' ? '-' : ''}${change_rate ? number.putComma(Decimal(Decimal(change_rate).mul(100).toFixed(2)).toFixed()) : '- '}`
    }
    @computed get changePrice() {
        let tradingPair = this.props.tradingPairStore.selectedTradingPair;
        let { change, change_price } = tradingPair || {};
        return ` ${change === 'RISE' ? '+' : ''}${change === 'FALL' ? '-' : ''}${change_price ? number.putComma(Decimal(change_price).toFixed()) : '- '}`
    }

    render() {
        console.log('TradingPairScreen | render |')
        let tradingPair = this.props.tradingPairStore.selectedTradingPair;
        let {
            close_price,
            change, // 'RISE' | 'FALL'
        } = tradingPair || {};
        return (
            <Container style={styles.container}>
                <View style={styles.tradingPairSummaryContainer}>
                    <View style={styles.leftContainer}>
                        <View style={styles.closePrice}>
                            <Text style={styles.closePriceText}>
                                {close_price ? number.putComma(Decimal(close_price).toFixed()) : '-'} 원
                            </Text>
                        </View>
                        <View style={styles.tradingPairSubInfo}>
                            <Text style={[styles.subText]}>24시간대비</Text>                            
                            <Text style={[styles.subText, commonStyle[change]]}>
                                {this.changeRate}%
                            </Text>
                            {   (change === 'FALL' || change === 'RISE') ? 
                                <Image
                                    style={{ width: 16, height: 8 }}                                
                                    source={ change === 'FALL' ? fallIcon : riseIcon }
                                /> : null
                            }
                            <Text style={[styles.subText, commonStyle[change]]}>
                                {this.changePrice}원
                            </Text>
                        </View>
                    </View>
                    <View style={styles.rightContainer}>
                    </View>
                </View>
                <Tabs initialPage={0}>
                    <Tab heading={<TabHeading style={styles.tabStyle}><Text>주문</Text></TabHeading>}>
                        <OrderBox />
                    </Tab>
                    {/* <Tab heading={<TabHeading style={styles.tabStyle}><Text>차트</Text></TabHeading>}>
                        <View><Text>차트</Text></View>
                    </Tab> */}                   
                    {/* <Tab heading={<TabHeading style={styles.tabStyle}><Text>시세</Text></TabHeading>}>
                        <View><Text>시세</Text></View>
                    </Tab> */}
                    <Tab heading={<TabHeading style={styles.tabStyle}><Text>거래내역</Text></TabHeading>}>
                        <PersonalOrderHistory />
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
        flexDirection: 'row',
        padding: 6,
        paddingLeft: 12
    },
    closePriceText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000000'
    },
    subText: {
        fontSize: 16,
        fontWeight: '500',
        marginRight: 10
    },

    tradingPairSubInfo: {
        marginTop: 4,
        flexDirection: 'row',
        alignItems: 'center'
    },
    tabStyle: {
        backgroundColor: 'white',
        borderBottomWidth: 0,
        height: 40
    }
})

import React, { Component } from 'react';
import commonStyle from '../styles/commonStyle';
import headerStyle from '../styles/headerStyle';

import { Tab, Tabs, TabHeading } from 'native-base';

import { TabView, TabBar, SceneMap } from 'react-native-tab-view';

import { StyleSheet, View, Text, Image, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { inject, observer } from 'mobx-react';
import { reaction, computed, observable, action } from 'mobx';
import OrderBox from '../components/OrderBox';
import PersonalOrderHistory from '../components/PersonalOrderHistory';
import Decimal from '../utils/decimal';
import number from '../utils/number';
import riseIcon from '../../assets/images/exchange/ic_up_s.png';
import fallIcon from '../../assets/images/exchange/ic_down_s.png';
// import { Constants } from 'expo';


@inject('pubnub', 'tradingPairStore')
@observer
export default class TradingPairScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        this.baseKoreanName = navigation.getParam('baseKoreanName', '토큰');
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

        this.state = {
            index: 0,
            routes: [
                { key: 'OrderBox', title: '주문' },
                { key: 'PersonalOrderHistory', title: '거래내역' },
            ],
        };
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

    _renderTabBar = props => {
        const inputRange = props.navigationState.routes.map((x, i) => i);

        return (
            <View style={styles.tabBar}>
                {props.navigationState.routes.map((route, i) => {
                    const color = props.position.interpolate({
                        inputRange,
                        outputRange: inputRange.map(
                            inputIndex => (inputIndex === i ? commonStyle.color.coblicBlue : '#222')
                        ),
                    });
                    return (
                        <TouchableOpacity
                            style={[styles.tabItem, this.state.index === i ? styles.selectedTabItem : null]}
                            onPress={() => this.setState({ index: i })}>
                            <Animated.Text style={[ { color, fontWeight: '600', fontSize: 16 }, ]}>{route.title}</Animated.Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };

    render() {
        console.log('TradingPairScreen | render |')
        let tradingPair = this.props.tradingPairStore.selectedTradingPair;
        let {
            close_price,
            change, // 'RISE' | 'FALL'
        } = tradingPair || {};
        return (
            <View style={styles.container}>
                <View style={styles.tradingPairSummaryContainer}>
                    <View style={styles.leftContainer}>
                        <View style={styles.closePrice}>
                            <Text style={styles.closePriceText}>
                                현재가 {close_price ? number.putComma(Decimal(close_price).toFixed()) : '-'} 원
                            </Text>
                        </View>
                        <View style={styles.tradingPairSubInfo}>
                            <Text style={[styles.subText]}>24시간대비</Text>
                            <Text style={[styles.subText, commonStyle[change]]}>
                                {this.changeRate}%
                            </Text>
                            {(change === 'FALL' || change === 'RISE') ?
                                <Image
                                    style={{ width: 16, height: 8 }}
                                    source={change === 'FALL' ? fallIcon : riseIcon}
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
                {/* <Tabs initialPage={0}>
                    <Tab heading={<TabHeading style={styles.tabStyle}><Text>주문</Text></TabHeading>}>
                        <OrderBox />
                    </Tab>
                    <Tab heading={<TabHeading style={styles.tabStyle}><Text>차트</Text></TabHeading>}>
                        <View><Text>차트</Text></View>
                    </Tab>                    
                    <Tab heading={<TabHeading style={styles.tabStyle}><Text>시세</Text></TabHeading>}>
                        <View><Text>시세</Text></View>
                    </Tab>
                    <Tab heading={<TabHeading style={styles.tabStyle}><Text>거래내역</Text></TabHeading>}>
                        <PersonalOrderHistory />
                    </Tab>
                </Tabs> */}

                <TabView
                    navigationState={this.state}
                    renderScene={SceneMap({
                        OrderBox: () => <OrderBox />,
                        PersonalOrderHistory: PersonalOrderHistory,
                    })}
                    onIndexChange={index => this.setState({ index })}
                    renderTabBar={this._renderTabBar}
                    initialLayout={{ width: Dimensions.get('window').width }}
                />
            </View>
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
        paddingLeft: 12,
        backgroundColor: 'white'
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
    },

    // tab
    tabBar: {
        flexDirection: 'row',
        // paddingTop: Constants.statusBarHeight,
    },
    selectedTabItem: {
        borderBottomWidth: 6,
        borderBottomColor: commonStyle.color.coblicBlue 
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'white'
    },
})

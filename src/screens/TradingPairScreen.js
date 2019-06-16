import React, { Component } from 'react';
import commonStyle from '../styles/commonStyle';
import headerStyle from '../styles/headerStyle';
import tabStyle from '../styles/tabStyle';
import { TabView, SceneMap } from 'react-native-tab-view';
import TradingPairSelectionModal from '../components/TradingPairSelectionModal';

import {
    StyleSheet,
    View,
    Text,
    Image,
    Dimensions,
    TouchableOpacity,
    Animated,
    Picker,
} from 'react-native';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import OrderBox from '../components/OrderBox';
import ChartBox from '../components/ChartBox';
import TradeHistory from '../components/TradeHistory';
import Decimal from '../utils/decimal';
import number from '../utils/number';
import riseIcon from '../../assets/images/exchange/ic_up_s.png';
import fallIcon from '../../assets/images/exchange/ic_down_s.png';
import modalStore from '../stores/modalStore';
import { withNavigation } from 'react-navigation';

@withNavigation
@inject('tradingPairStore', 'modalStore')
@observer
export default class TradingPairScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        this.baseName = navigation.getParam('baseName', '토큰');
        this.tradingPairName = navigation.getParam('tradingPairName', '');

        return {
            title: (
                <Text 
                    style={{fontSize: 15, textDecorationLine: 'underline'}}
                    onPress={() => {
                        modalStore.openCustomModal({
                            modal: 
                            <TradingPairSelectionModal />,
                        })
                    }}
                >{`${baseName} (${this.tradingPairName.split('-').join('/')})`}
                </Text>
            ),
            tabBarVisible: false,
            ...headerStyle.white,
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            index: 0,
            routes: [
                { key: 'OrderBox', title: '주문' },
                { key: 'ChartBox', title: '차트' },
                { key: 'TradeHistory', title: '시세' },
            ],
        };
    }

    @computed
    get changeRate() {
        let tradingPair = this.props.tradingPairStore.selectedTradingPair;
        let { change_rate, change } = tradingPair || {};
        return ` ${change === 'RISE' ? '+' : ''}${change === 'FALL' ? '-' : ''}${change_rate ? number.putComma(Decimal(Decimal(change_rate).mul(100).toFixed(2)).toFixed()) : '- '}`
    }

    @computed
    get changePrice() {
        let tradingPair = this.props.tradingPairStore.selectedTradingPair;
        let { change, change_price } = tradingPair || {};
        if (!change_price) return '0 ';
        return `${change_price ? number.putComma(Decimal(change_price).toFixed()) : '- '}`
    }

    _renderTabBar = (props) => {
        const inputRange = props.navigationState.routes.map((x, i) => i);

        return (
            <View style={tabStyle.tabBar}>
                {props.navigationState.routes.map((route, i) => {
                    const color = props.position.interpolate({
                        inputRange,
                        outputRange: inputRange.map(
                            inputIndex => (inputIndex === i ? commonStyle.color.coblicBlue : '#222')
                        ),
                    });
                    return (
                        <TouchableOpacity
                            key={route.key}
                            style={[tabStyle.tabItem]}
                            onPress={() => this.setState({ index: i })}>
                            <Animated.Text style={[ 
                                { color },
                                tabStyle.tabText,
                                this.state.index === i  ? tabStyle.selectedTabText : null
                            ]}>{route.title}</Animated.Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };

    render() {
        let tradingPair = this.props.tradingPairStore.selectedTradingPair;
        let {
            close_price,
            change, // 'RISE' | 'FALL'
        } = tradingPair || {};

        return (
            <View style={styles.container}>
                <View style={styles.tradingPairSummaryContainer}>
                    <Text style={[styles.closePriceText, commonStyle[change]]}>
                        {close_price ? number.putComma(Decimal(close_price).toFixed()) : '-'}
                    </Text>
                    <View style={styles.bottomContainer}>
                        <Text style={styles.title}>전일대비</Text>
                        <Text style={[styles.subText, commonStyle[change]]}>
                            {this.changeRate}%
                        </Text>
                        <View style={{ 
                            marginLeft: 10, 
                            flexDirection:'row',
                            alignItems: 'center'
                        }}>
                            {(change === 'FALL' || change === 'RISE') ?
                                <Image
                                    style={{ width: 10, height: 6 }}
                                    source={change === 'FALL' ? fallIcon : riseIcon}
                                /> : null
                            }
                            <Text style={[styles.subText, commonStyle[change]]}>
                                {this.changePrice}
                            </Text>
                        </View>
                    </View>
                </View>
                <TabView
                    navigationState={this.state}
                    renderScene={SceneMap({
                        OrderBox,
                        ChartBox,
                        TradeHistory,
                    })}
                    onIndexChange={(index) => {this.setState({ index })}}
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
        display: 'flex',
        flexDirection: 'column',
        height: 60,
        width: '100%',
        padding: 10,
        paddingLeft: 14,
        backgroundColor: 'white',
        justifyContent: 'space-between',
    },
    closePriceText: {
        fontSize: 18,
        fontWeight: '400',
        color: '#000000',
    },
    leftContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    bottomContainer: {
        marginTop: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        color: '#777777',
        fontSize: 12,
    },
    subText: {
        fontSize: 12,
    },
})

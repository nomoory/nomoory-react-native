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

const TAB_BODY = {
    OrderBox: () => <OrderBox />,
    ChartBox: () => <ChartBox />,
    TradeHistory: () => <TradeHistory />
};

@withNavigation
@inject('tradingPairStore', 'modalStore')
@observer
export default class TradingPairScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        this.baseName = navigation.getParam('baseName', '토큰');
        this.tradingPairName = navigation.getParam('tradingPairName', '');
        
        return {
            headerTitle: (
                <View style={styles.headerContainer}>
                    <Text 
                        style={styles.headerText}
                        onPress={() => {
                            modalStore.openCustomModal({
                                modal: 
                                <TradingPairSelectionModal />,
                            })
                        }}
                        maxFontSizeMultiplier={20}
                        allowFontScaling={false}
                    >
                        {`${baseName} (${this.tradingPairName.split('-').join('/')}) `}
                        <Image
                            style={styles.headerImage}
                            source={fallIcon}
                        /> 
                    </Text>
                </View>
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
                            style={[
                                tabStyle.tabItem,
                                // this.state.index === i
                                // ? tabStyle.selectedTabItem
                                // : null
                            ]}
                            onPress={(e) => {this._onIndexChange(i)}}
                        >
                            <Animated.Text style={[ 
                                // { color },
                                tabStyle.tabText,
                                this.state.index === i  ? tabStyle.selectedTabText : null
                            ]}>{route.title}</Animated.Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };
        
    _onIndexChange = (index) => {
        this.setState({ index });
    }

    render() {
        let {
            close_price,
            change, // 'RISE' | 'FALL'
        } = this.props.tradingPairStore.selectedTradingPair || {};
        console.log(this.state.routes[this.state.index].key);
        console.log('asdfklasjdfkljsadkljaskldjaskld')
        return (
            <View style={styles.container}>
                <View style={styles.tradingPairSummaryContainer}>
                    <Text style={[styles.closePriceText, commonStyle[change]]}>
                        {close_price ? number.putComma(Decimal(close_price).toFixed()) : '-'}
                    </Text>
                    <View style={styles.bottomContainer}>
                        <Text style={styles.title}>전일대비</Text>
                        <Text style={[styles.rateText, commonStyle[change]]}>
                            {this.changeRate}%
                        </Text>
                        <View style={{ 
                            marginLeft: 13, 
                            flexDirection:'row',
                            alignItems: 'center'
                        }}>
                            {(change === 'FALL' || change === 'RISE') ?
                                <Image
                                    style={{ 
                                        marginRight: 3,
                                        width: 10, 
                                        height: 6,
                                    }}
                                    source={change === 'FALL' ? fallIcon : riseIcon}
                                /> : null
                            }
                            <Text style={[styles.subText, commonStyle[change]]}>
                                {this.changePrice}
                            </Text>
                        </View>
                    </View>
                </View>
                {/* <TabView
                    navigationState={this.state}
                    renderScene={SceneMap({
                        OrderBox,
                        ChartBox: () => <ChartBox />,
                        TradeHistory,
                    })}
                    onIndexChange={this._onIndexChange}
                    renderTabBar={this._renderTabBar}
                    initialLayout={{ width: Dimensions.get('window').width }}
                /> */}
                <View style={styles.tabs}>
                    { this.state.routes.map((tab, index) => {
                        return (
                            <TouchableOpacity style={[
                                styles.tab,
                                index === this.state.index ? 
                                styles.selectedTab :
                                null
                            ]}
                                onPress={() => { this.setState({index})}}
                            >
                                <Text style={[
                                    styles.tabText,
                                    index === this.state.index ? 
                                    styles.selectedTabText :
                                    null
                                ]}>{tab.title}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
                <View style={styles.tabBody}>
                    {TAB_BODY[this.state.routes[this.state.index].key]()}
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    headerContainer: {
        // display: 'flex',
        // flexDirection: 'row',
        // alignItems:'center'
    },
    headerText: {
        fontSize: 16, 
        color: commonStyle.color.coblicBlue
    },
    headerImage: { width: 10, height: 10 },
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
    rateText: {
        marginLeft: 13,
        fontSize: 12,
        fontWeight: '300',
    },
    subText: {
        fontSize: 12,
        fontWeight: '300',
    },


    tabs: {
        width: '100%',
        height: 30,
        display: 'flex',
        flexDirection: 'row',
    },
    tab: {
        height: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: commonStyle.color.coblicBlue,
    },
    tabText: {
        fontWeight: '400', 
        fontSize: 13,
        color: 'white',
    },
    selectedTabText: {
        fontWeight: '900',
        fontSize: 13,
        color: 'white',
    },
    tabBody: {
        flex: 1,
    }

})

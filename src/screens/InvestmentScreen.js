import React, { Component } from 'react';
import headerStyle from '../styles/headerStyle';
import commonStyle from '../styles/commonStyle';
import { Tab, Tabs, TabHeading } from 'native-base';
import { StyleSheet, View, Text, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { inject, observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';


import AssetsAndEvaluationBox from '../components/AssetsAndEvaluationBox';
import TradeHistoryBox from '../components/TradeHistoryBox';
import UnmatchedOrderBox from '../components/UnmatchedOrderBox';
// import DividendHistoryBox from '../components/DividenHistroyBox';
// import MiningHistoryBox from '../components/MiningHistoryBox';
import TransactionHistoryBox from '../components/TransactionHistoryBox';

@withNavigation
@inject('pubnub', 'userStore', 'transactionHistoryStore', 'authStore')
@observer
export default class InvestmentScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '투자내역',
            ...headerStyle.blue
        };
    };

    constructor(props) {
        super(props);
        this.pubnubChannel = "";

        this.state = {
            index: 0,
            routes: [
                { key: 'AssetsAndEvaluationBox', title: '보유자산' },
                { key: 'ALL_TRANSACTIONS', title: '모든내역' },
                { key: 'MINING', title: '채굴내역' },
                { key: 'DIVIDEND', title: '배당내역' },
            ],
        };
    }

    componentDidMount() {
        if (!this.props.userStore.isLoggedIn) {
            this.props.navigation.navigate('Login', {
                from: 'Investment'
            });
        }

        // this.props.pubnub.subscribe(this.pubnubChannel);
    }

    componentWillUnmount() {
        // this.props.pubnub.unsubscribe(this.pubnubChannel);
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
                            onPress={() => {
                                this.props.transactionHistoryStore.clear();        
                                this.setState({ index: i });
                                try {
                                    this.props.transactionHistoryStore.changeSelectedOption(this.state.routes[i].key);
                                } catch (err) { }
                            }}>
                            <Animated.Text style={[{ color, fontWeight: '600', fontSize: 16 },]}>{route.title}</Animated.Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };
    _renderScene = ({ route }) => {
        switch (route.key) {
            case 'AssetsAndEvaluationBox':
                return <AssetsAndEvaluationBox />;
            case 'ALL_TRANSACTIONS':
                return <TransactionHistoryBox type='ALL_TRANSACTIONS'/>;
            case 'MINING':
                return<TransactionHistoryBox type='MINING'/>;
            case 'DIVIDEND':
                return <TransactionHistoryBox type='DIVIDEND'/>;
            default:
                return null;
        }

    }

    render() {
        return (
            <View style={styles.container}>
                {/* <Tabs 
                    onChangeTab={this._onChangeTab} 
                    // tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
                    style={styles.tabStyle}
                    >
                    <Tab heading={<TabHeading style={styles.tabStyle}><Text>보유자산</Text></TabHeading>}>
                        <AssetsAndEvaluationBox />
                    </Tab>
                    <Tab heading={<TabHeading style={styles.tabStyle}><Text>모든내역</Text></TabHeading>}>
                        <TransactionHistoryBox type='ALL_TRANSACTIONS'/>
                    </Tab>
                    <Tab heading={<TabHeading style={styles.tabStyle}><Text>채굴내역</Text></TabHeading>}>
                        <TransactionHistoryBox type='MINING'/>
                    </Tab>
                    <Tab heading={<TabHeading style={styles.tabStyle}><Text>배당내역</Text></TabHeading>}>
                        <TransactionHistoryBox type='DIVIDEND'/>
                    </Tab>
                </Tabs> */}
                <TabView
                    navigationState={this.state}
                    renderScene={SceneMap({
                        AssetsAndEvaluationBox: AssetsAndEvaluationBox,
                        ALL_TRANSACTIONS: () => <TransactionHistoryBox type='ALL_TRANSACTIONS' />,
                        MINING: () => <TransactionHistoryBox type='MINING' />,
                        DIVIDEND: () => <TransactionHistoryBox type='DIVIDEND' />,
                    })}
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
    tab: {
        flex: 1,
    },
    activeTextStyle: {
        fontColor: commonStyle.color.coblicBlue
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

import React, { Component } from 'react';
import headerStyle from '../styles/headerStyle';
import commonStyle from '../styles/commonStyle';
import tabStyle from '../styles/tabStyle';
import { StyleSheet, View, Text, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { inject, observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';

import AssetsAndEvaluationBox from '../components/AssetsAndEvaluationBox';
import TransactionHistoryBox from '../components/TransactionHistoryBox';
import OrderHistory from '../components/OrderHistory';

@withNavigation
@inject('userStore', 'transactionHistoryStore', 'authStore')
@observer
export default class InvestmentScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '투자내역',
            ...headerStyle.white,
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            index: 0,
            routes: [
                { key: 'AssetsAndEvaluationBox', title: '보유코인' },
                { key: 'ALL_TRANSACTIONS', title: '모든내역' },
                { key: 'ORDER_HISTORY', title: '주문내역' },
            ],
        };
    }

    componentDidMount() {
        if (!this.props.userStore.isLoggedIn) {
            this.props.navigation.navigate('Login', {
                from: 'Investment'
            });
        }
    }

    _renderTabBar = props => {
        const inputRange = props.navigationState.routes.map((x, i) => i);

        return (
            <View style={customTabStyles.tabBar}>
                {props.navigationState.routes.map((route, i) => {
                    const color = props.position.interpolate({
                        inputRange,
                        outputRange: inputRange.map(
                            inputIndex => (inputIndex === i ? commonStyle.color.brandBlue : '#222')
                        ),
                    });
                    return (
                        <TouchableOpacity
                            key={route.key}
                            style={[
                                customTabStyles.tabItem,
                                this.state.index === i ? customTabStyles.selectedTabItem : null
                            ]}
                            onPress={(e) => {this._onIndexChange(i)}}>
                            <Animated.Text style={[
                                customTabStyles.tabText,
                                this.state.index === i ? customTabStyles.selectedTabText : null
                            ]}>{route.title}</Animated.Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };
    
    _onIndexChange = (index) => {
        this.setState({ index });
        try {
            this.props.transactionHistoryStore.changeSelectedOption(this.state.routes[index].key);
        } catch (err) { }
    }

    render() {
        return (
            <View style={styles.container}>
                <TabView
                    navigationState={this.state}
                    renderScene={SceneMap({
                        AssetsAndEvaluationBox,
                        ALL_TRANSACTIONS: () => <TransactionHistoryBox type='ALL_TRANSACTIONS' />,
                        ORDER_HISTORY: () => <OrderHistory />,
                    })}
                    onIndexChange={this._onIndexChange}
                    renderTabBar={this._renderTabBar}
                    initialLayout={{ 
                        width: Dimensions.get('window').width,
                        height: Dimensions.get('window').height,
                    }}
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
        color: commonStyle.color.brandBlue
    },
    tabStyle: {
        backgroundColor: 'white',
        borderBottomWidth: 0,
        height: 40
    },
})

const customTabStyles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        height: 34, 
    },
    tabItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1.5,
        borderBottomColor: 'white',
    },
    selectedTabItem: {
        borderBottomColor: commonStyle.color.brandBlue,
    },
    tabText: {
        fontWeight: '300', 
        fontSize: 13,
    },
    selectedTabText: {
        color: commonStyle.color.brandBlue,
    },
})
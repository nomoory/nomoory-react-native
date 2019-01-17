import React, { Component } from 'react';
import headerStyle from '../styles/headerStyle';
import commonStyle from '../styles/commonStyle';
import { Container, Header, Tab, Tabs, TabHeading, Text } from 'native-base';
import { StyleSheet, View } from 'react-native';
import { inject, observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';

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
    _onChangeTab = (e) => {
        this.props.transactionHistoryStore.clear();
        try {
            this.props.transactionHistoryStore.changeSelectedOption(e.ref.props.children.props.type);
        } catch (err) { }
    }

    render() {
        return (
            <Container style={styles.container}>
                <Tabs 
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
                </Tabs>
            </Container>
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
    }
})

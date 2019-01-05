import React, { Component } from 'react';
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
@inject('pubnub', 'userStore', 'transactionHistoryStore')
@observer
export default class InvestmentScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '투자내역',
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
            this.props.transactionHistoryStore.load(e.ref.props.children.props.type);
        } catch (err) {

        }
    }

    render() {
        return (
            <Container style={styles.container}>
                <Tabs onChangeTab={this._onChangeTab}>
                    <Tab heading={<TabHeading><Text>보유자산</Text></TabHeading>}
                        styles={styles.tab}>
                        <AssetsAndEvaluationBox />
                    </Tab>
                    <Tab heading={<TabHeading><Text>거래내역</Text></TabHeading>}>
                        <TransactionHistoryBox type='ALL_TRANSACTIONS'/>
                    </Tab>
                    <Tab heading={<TabHeading><Text>채굴내역</Text></TabHeading>}>
                        <TransactionHistoryBox type='MINING'/>
                    </Tab>
                    <Tab heading={<TabHeading><Text>배당내역</Text></TabHeading>}>
                        <TransactionHistoryBox type='DIVIDEND'/>
                    </Tab>
                    <Tab heading={<TabHeading><Text>미체결</Text></TabHeading>}>
                       <TransactionHistoryBox type='TRADE'/>
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
        flex: 1
    }
})

import React, { Component } from 'react';
import { Container, Header, Tab, Tabs, TabHeading, Text } from 'native-base';
import { StyleSheet, View } from 'react-native';
import { inject, observer } from 'mobx-react';

import AssetsAndEvaluationBox from '../components/AssetsAndEvaluationBox';
import TradeHistoryBox from '../components/TradeHistoryBox';
import UnmatchedOrderBox from '../components/UnmatchedOrderBox';
// import DividendHistoryBox from '../components/DividenHistroyBox';
// import MiningHistoryBox from '../components/MiningHistoryBox';

@inject('pubnub')
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
        // this.props.pubnub.subscribe(this.pubnubChannel);
    }

    componentWillUnmount() {
        // this.props.pubnub.unsubscribe(this.pubnubChannel);
    }

    render() {
        return (
            <Container style={styles.container}>
                <Tabs>
                    <Tab heading={<TabHeading><Text>보유자산</Text></TabHeading>}
                        styles={styles.tab}>
                        <AssetsAndEvaluationBox></AssetsAndEvaluationBox>
                    </Tab>
                    <Tab heading={<TabHeading><Text>거래내역</Text></TabHeading>}>
                        <View><Text>거래내역</Text></View>
                    </Tab>
                    <Tab heading={<TabHeading><Text>미체결</Text></TabHeading>}>
                        <View><Text>미체결</Text></View>
                    </Tab>
                    <Tab heading={<TabHeading><Text>배당내역</Text></TabHeading>}>
                        <View><Text>배당내역</Text></View>
                    </Tab>
                    <Tab heading={<TabHeading><Text>채굴내역</Text></TabHeading>}>
                        <View><Text>채굴내역</Text></View>
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

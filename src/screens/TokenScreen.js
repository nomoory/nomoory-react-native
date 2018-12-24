import React, { Component } from 'react';
import { Container, Header, Tab, Tabs, TabHeading, Text } from 'native-base';
import { StyleSheet, View } from 'react-native';
import { inject, observer } from 'mobx-react';
import { reaction } from 'mobx';
import OrderBox from '../components/OrderBox';

@inject('tradingPairStore')
@observer
export default class InvestmentScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        const tokenName = navigation.getParam('tokenName', '토큰');
        const tradingPairName = navigation.getParam('tradingPairName', '');
        return {
            title: `${tokenName} ${tradingPairName}`,
            tabBarVisible: false,
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
                    <Tab heading={<TabHeading><Text>주문</Text></TabHeading>}>
                        <OrderBox></OrderBox>
                    </Tab>
                    <Tab heading={<TabHeading><Text>차트</Text></TabHeading>}>
                        <View><Text>차트</Text></View>
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
    }
})

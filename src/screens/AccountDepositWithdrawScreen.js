import React, { Component } from 'react';
import commonStyle from '../styles/commonStyle';
import { Text, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { Container } from 'native-base';
import { inject, observer } from 'mobx-react';
import { QUOTE_SYMBOL } from '../stores/accountStore';
import number from '../utils/number';
import Decimal from '../utils/decimal';
import DepositWithdrawInfoHeader from '../components/DepositWithdrawInfoHeader';
import DepositBox from '../components/DepositBox';

@inject('pubnub', 'accountStore')
@observer
export default class AccountDepositWithdrawScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        this.currency= navigation.getParam('currency', '');

        return {
            title: `${this.currency} 입금`,
            tabBarVisible: false, 
        };
    };


    constructor(props) {
        super(props);
        // this.pubnubChannel = "ACCOUNT";
    }

    componentWillMount() { 
        console.log('AccountDepositWithdrawScreen will mount |'); 
    }
    componentDidMount() { 
        console.log('AccountDepositWithdrawScreen did mount |')
        // this.props.pubnub.subscribe(this.pubnubChannel); 
    }
    componentWillUnmount() { this.props.pubnub.unsubscribe(this.pubnubChannel); }

    render() {

        return (
            <Container style={styles.container}>
                <DepositWithdrawInfoHeader />
                <DepositBox />
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        hegith: '100%',
        flexDirection: 'column'
    }
})

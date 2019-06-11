import React, { Component } from 'react';
import commonStyle from '../styles/commonStyle';
import headerStyle from '../styles/headerStyle';
import { Text, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { inject, observer } from 'mobx-react';
import { QUOTE_SYMBOL } from '../stores/accountStore';
import number from '../utils/number';
import Decimal from '../utils/decimal';
import DepositWithdrawInfoHeader from '../components/DepositWithdrawInfoHeader';
import DepositBox from '../components/DepositBox';

@inject('accountStore')
@observer
export default class AccountDepositWithdrawScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        this.currency= navigation.getParam('currency', '');

        return {
            title: `${this.currency} 입금`,
            // tabBarVisible: false, 
            ...headerStyle.white
        };
    };
    render() {

        return (
            <View style={styles.container}>
                <DepositWithdrawInfoHeader />
                <DepositBox />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        backgroundColor: 'white'
    }
})

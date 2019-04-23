import React, { Component } from 'react';
import { Text, StyleSheet, View, Button } from 'react-native';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';

import TradingPairBox from '../components/TradingPairBox';

@inject('stubStore')
@observer
export default class ExchangeScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'header name',
            // headerLeft: (
            //   <Button onPress={ () => navigation.goback() }
            //   title={ "cancelButtonName" }></Button>
            // ),
        };
    };
    render() {
        return (
            <View>
                <TradingPairBox></TradingPairBox>
            </View>
        )
    }
}

const styles = StyleSheet.create({

})

import React, { Component } from 'react';
import { Text, StyleSheet, View, Button } from 'react-native';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';

import TradingPairBox from '../components/TradingPairBox';

@inject('pubnub')
@observer
export default class ExchangeScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: '거래소',
            // headerLeft: (
            //   <Button onPress={ () => navigation.goback() }
            //   title={ "cancelButtonName" }></Button>
            // ),
        };
    };

    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={styles.container}>
                <TradingPairBox />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

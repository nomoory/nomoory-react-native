import React, { Component } from 'react';
import { Text, StyleSheet, View, Button } from 'react-native';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import commonStyle from '../styles/commonStyle';

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
            headerStyle: {
                backgroundColor: commonStyle.color.coblicBlue,
                height: 50,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        };
    };

    constructor(props) {
        super(props);
        console.log('ExchangeScreen | construct |');
        this.pubnubChannel = `TEMP|TICKE`;
        this.props.pubnub.subscribe(this.pubnubChannel);
    }

    componentWillUnmount() { 
        console.log('ExchangeScreen | will unmount |');
        this.props.pubnub.unsubscribe(this.pubnubChannel); 
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

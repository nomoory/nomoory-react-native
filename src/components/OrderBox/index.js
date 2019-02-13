import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react';
import Orderbook from './Orderbook';
import OrderForm from './OrderForm';

@observer
export default class OrderBox extends Component {
    componentDidMount() {
    }
    render() {
        return (
            <View style={styles.container}>
                <Orderbook />
                <OrderForm />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
});

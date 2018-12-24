import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { inject, observer } from 'mobx-react';

// @inject('')
@observer
export default class DepositHistoryScreen extends Component {
    render() {
        return (
            <View>
                <Text> Deposit History </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({

})

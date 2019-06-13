import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

class AccountStatus extends Component {
    render() {
        return (
            <View style={[styles.container]}>
                <View style={[styles.column]}>
                    <View style={[styles.row]}>
                        <Text style={[styles.label]}>총매수</Text>
                        <Text style={[styles.numberCommon]}>1234</Text>
                    </View>
                    <View style={[styles.row]}>
                        <Text style={[styles.label]}>총평가</Text>
                        <Text style={[styles.numberCommon]}>1234</Text>
                    </View>
                </View>
                <View style={[styles.column]}>
                    <View style={[styles.row]}>
                        <Text style={[styles.label]}>평가손익</Text>
                        <Text style={[styles.numberCommon]}>1234</Text>
                    </View>
                    <View style={[styles.row]}>
                        <Text style={[styles.label]}>손익률</Text>
                        <Text style={[styles.numberCommon]}>1234</Text>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection:'row',
        justifyContent: 'space-around',
    },
    column: {
        flex: 1,
        flexDirection:'column',
        padding: 10,
    },
    row: {
        flexDirection:'row',
        justifyContent: 'space-between'
    },
    label: {
        color: 'rgb(90, 90, 90)',
        fontSize: 11,
        fontWeight: '200',
    },
    numberCommon: {
        fontSize: 11
    }
});

export default AccountStatus;
import React, { Component } from 'react';
import commonStyle, { color } from '../../styles/commonStyle';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { inject, observer } from 'mobx-react';
import PlacedOrderHistory from './PlacedOrderHistory';
import CompletedOrderHistory from './CompletedOrderHistory';
import { observable, action } from 'mobx';

@inject('tradingPairStore', 'transactionHistoryStore')
@observer
export default class OrderHistory extends Component {
    @observable selectedTabType = 'PlacedOrderHistory'

    _onPressPlacedOrderHistoryTab = action(() => {
        this.selectedTabType = 'PlacedOrderHistory';
    });

    _onPressCompletedOrderHistoryTab = action(() => {
        this.selectedTabType = 'CompletedOrderHistory';         
    });

    render() {
        return (
            <View style={[styles.container]}>
                <View style={[styles.tabs]}>
                    <TouchableOpacity 
                        style={[
                            styles.tab,
                            styles[this.selectedTabType === 'PlacedOrderHistory' && 'selected']
                        ]}
                        onPress={this._onPressPlacedOrderHistoryTab}
                    >
                        <Text style={[
                            styles.tabText,
                            styles[this.selectedTabType === 'PlacedOrderHistory' && 'selectedText']
                        ]}>미체결</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[
                            styles.tab,
                            styles[this.selectedTabType === 'CompletedOrderHistory' && 'selected']
                        ]}
                        onPress={this._onPressCompletedOrderHistoryTab}
                    >
                        <Text style={[
                            styles.tabText,
                            styles[this.selectedTabType === 'CompletedOrderHistory' && 'selectedText'
                        ]]}>체결</Text>
                    </TouchableOpacity>
                </View>
                { this.selectedTabType === 'PlacedOrderHistory' && <PlacedOrderHistory />}
                { this.selectedTabType === 'CompletedOrderHistory' && <CompletedOrderHistory />}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        flexDirection: 'column',
         
        backgroundColor: 'white'
    },
    tabs: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 15,
        marginRight: 15,

        flexDirection: 'row',
    },
    tab: {
        flex: 1,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',

        borderStyle: 'solid',
        borderWidth: 0.5,
        borderColor: color.coblicPaleGrey,
        color: '#747474'
    },
    selected: {
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: color.brandPaleBlue,
    },
    selectedText: {
        color: color.brandBlue,
    }
});

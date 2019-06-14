import React, { Component } from 'react';
import commonStyle, { color } from '../../styles/commonStyle';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { inject, observer } from 'mobx-react';
import RealtimeTradeHistory from './RealtimeTradeHistory';
import DailyTradeHistory from './DailyTradeHistory';
import { observable, action } from 'mobx';

@inject('tradingPairStore', 'transactionHistoryStore')
@observer
export default class TradeHistory extends Component {
    @observable selectedTabType = 'RealtimeTradeHistory'

    _onPressRealtimeTradeHistoryTab = action(() => {
        this.selectedTabType = 'RealtimeTradeHistory';
    });

    _onPressDailyTradeHistoryTab = action(() => {
        this.selectedTabType = 'DailyTradeHistory';         
    });

    render() {
        return (
            <View style={[styles.container]}>
                <View style={[styles.tabs]}>
                    <TouchableOpacity 
                        style={[
                            styles.tab,
                            styles[this.selectedTabType === 'RealtimeTradeHistory' && 'selected']
                        ]}
                        onPress={this._onPressRealtimeTradeHistoryTab}
                    >
                        <Text style={[
                            styles.tabText,
                            styles[this.selectedTabType === 'RealtimeTradeHistory' && 'selectedText']
                        ]}>실시간</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[
                            styles.tab,
                            styles[this.selectedTabType === 'DailyTradeHistory' && 'selected']
                        ]}
                        onPress={this._onPressDailyTradeHistoryTab}
                    >
                        <Text style={[
                            styles.tabText,
                            styles[this.selectedTabType === 'DailyTradeHistory' && 'selectedText'
                        ]]}>일별</Text>
                    </TouchableOpacity>
                </View>
                { this.selectedTabType === 'RealtimeTradeHistory' && <RealtimeTradeHistory />}
                { this.selectedTabType === 'DailyTradeHistory' && <DailyTradeHistory />}
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
        borderColor: color.coblicPaleBlue,
    },
    selectedText: {
        color: color.coblicBlue,
    }
});

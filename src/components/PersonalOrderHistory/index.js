import React, { Component } from 'react';
import commonStyle, { color } from '../../styles/commonStyle';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Container, Header, Text, Button, Item, Input } from 'native-base';
import { inject, observer } from 'mobx-react';
import number from '../../utils/number';
import Decimal from '../../utils/decimal';
import PersonalPlacedOrderHistory from './PersonalPlacedOrderHistory';
import PersonalCompletedOrderHistory from './PersonalCompletedOrderHistory';
import { observable, action } from 'mobx';

@inject('pubnub', 'tradingPairStore')
@observer
export default class PersonalOrderHistory extends Component {
    @observable selectedTabType = 'PersonalPlacedOrderHistory'

    _onPressPlacedOrderHistoryTab = action(() => { this.selectedTabType = 'PersonalPlacedOrderHistory'; });
    _onPressCompletedOrderHistoryTab = action(() => { this.selectedTabType = 'PersonalCompletedOrderHistory'; });

    render() {
        return (
            <Container style={[styles.container]}>
                <View style={[styles.tabs]}>
                    <TouchableOpacity 
                        style={[
                            styles.tab, styles.personalPlacedOrderHistoryTab, 
                            styles[this.selectedTabType === 'PersonalPlacedOrderHistory' && 'selected']
                        ]}
                        onPress={this._onPressPlacedOrderHistoryTab}
                    >
                        <Text style={[
                            styles.tabText,
                            styles[this.selectedTabType === 'PersonalPlacedOrderHistory' && 'selectedText']
                        ]}>미체결</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[
                            styles.tab, styles.personalCompletedOrderHistoryTab,
                            styles[this.selectedTabType === 'PersonalCompletedOrderHistory' && 'selected']
                        ]}
                        onPress={this._onPressCompletedOrderHistoryTab}
                    >
                        <Text style={[
                            styles.tabText,
                            styles[this.selectedTabType === 'PersonalCompletedOrderHistory' && 'selectedText'
                        ]]}>체결</Text>
                    </TouchableOpacity>
                </View>
                { this.selectedTabType === 'PersonalPlacedOrderHistory' && <PersonalPlacedOrderHistory />}
                { this.selectedTabType === 'PersonalCompletedOrderHistory' && <PersonalCompletedOrderHistory />}
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        flexDirection: 'column'
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
        borderColor: color.coblicGrey,
        color: '#747474'
    },
    selected: {
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: color.coblicPaleBlue,
    },
    selectedText: {
        color: color.coblicBlue,
    }
});

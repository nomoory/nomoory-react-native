import React, { Component } from 'react';
import commonStyles, {font }from '../../styles/commonStyle';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Container, Header, Text, Button, Item, Input } from 'native-base';
import { inject, observer } from 'mobx-react';
import number from '../../utils/number';
import momentHelper from '../../utils/momentHelper';
import Decimal from '../../utils/decimal';
import { reaction, computed } from 'mobx';

@inject('personalOrderHistoryStore', 'tradingPairStore')
@observer
export default class PersonalPlacedOrderHistory extends Component {
    componentDidMount() {
        reaction(
            () => this.props.tradingPairStore.selectedTradingPairName,
            (selectedTradingPairName) => {
                this.props.personalOrderHistoryStore.load();
            }
        );

        this.props.personalOrderHistoryStore.load();
    }

    _onPressDeleteOrder = (order_uuid) => () => {
        this.props.personalOrderHistoryStore.deletePlacedOrder(order_uuid);
    }
    
    @computed get personalPlacedOrderHistoryHead() {
        return (
            <View style={[styles.head]}>
                <View style={[styles.column]}>
                    <View style={[styles.columnItem]}>
                        <Text style={[styles.headColumnText]}>주문유형</Text>
                    </View>
                    <View style={[styles.columnItem]}>
                        <Text style={[styles.headColumnText]}>주문시간</Text>
                    </View>
                </View>
                <View style={[styles.column]}>
                    <View style={[styles.columnItem]}>
                        <Text style={[styles.headColumnText]}>가격</Text>
                    </View>
                    <View style={[styles.columnItem]}>
                        <Text style={[styles.headColumnText]}>수량</Text>
                    </View>
                </View>
                <View style={[styles.column]}>
                    <View style={[styles.columnItem]}>
                        <Text style={[styles.headColumnText]}>체결량</Text>
                    </View>
                    <View style={[styles.columnItem]}>
                        <Text style={[styles.headColumnText]}>마체결</Text>
                    </View>
                </View>
                <View style={[styles.column, styles.columnItem]}>
                    <Text style={[styles.headColumnText]}>취소</Text>
                </View>
            </View>
        );
    };

    _renderPersonalPlacedOrderHistoryBody() {
        const tradingPair = this.props.tradingPairStore.selectedTradingPair;
        const { base_symbol, quote_symbol } = tradingPair || {};
        return (
            <ScrollView style={[styles.body]}>
                <View style={[styles.tuples]}>
                    {this.props.personalOrderHistoryStore.selectedTradingPairPlacedOrders.map((placedOrder, index) => {
                        let { uuid, created, side, price, volume, volume_filled, volume_remaining} = placedOrder;
                        let dateAndTime_string = momentHelper.getLocaleDatetime(created);
                        let [ date, time ] = dateAndTime_string ? dateAndTime_string.split(' ') : [];
                        return (
                            <View style={[styles.tuple, index % 2 === 0 ? styles['even'] : styles['odd'] ]} key={uuid}>
                                <View style={[styles.column]}>
                                    <View style={[styles.columnItem, commonStyles[side]]}>
                                        <Text style={[styles.tupleColumnText, commonStyles[side]]}>
                                            { side === 'SELL' ? '매도' : '매수' }
                                        </Text>
                                    </View>
                                    <View style={[styles.columnItem, styles.created]}> 
                                        <Text style={[styles.tupleColumnText, styles.dateText]}>{date ? date + ' ' : ''} </Text>
                                        <Text style={[styles.tupleColumnText, styles.timeText]}>{time ? time : ''}</Text> 
                                    </View>
                                </View>
                                <View style={[styles.column]}>
                                    <View style={[styles.columnItem, styles.price]}>
                                        <Text style={[styles.tupleColumnText, styles.priceText]}>
                                            {number.putComma(Decimal(Decimal(price).toFixed()).toFixed())} {quote_symbol}
                                        </Text>
                                    </View>
                                    <View style={[styles.columnItem, styles.volume]}>
                                        <Text style={[styles.tupleColumnText, styles.volumeText]}>
                                            {number.putComma(Decimal(volume).toFixed())} {base_symbol}
                                        </Text>
                                    </View>               
                                </View>
                                <View style={[styles.column]}>
                                    <View style={[styles.columnItem, styles.filled ]}>
                                        <Text style={[styles.tupleColumnText, styles.volumeText]}>
                                            {number.putComma(Decimal(volume_filled).toFixed())} {base_symbol}
                                        </Text>
                                    </View>
                                    <View style={[styles.columnItem, styles.remaining]}>
                                        <Text style={[styles.tupleColumnText, styles.volumeText]}>
                                            {number.putComma(Decimal(volume_remaining).toFixed())} {base_symbol}
                                        </Text>
                                    </View>        
                                </View>
                                <View style={[styles.column, styles.columnItem]}>{
                                    <Button onPress={this._onPressDeleteOrder(uuid)} title={'취소'}></Button>
                                }</View>
                            </View>
                        );
                    })}
                    {/* <ScrollLoading
                        isLoading={this.props.personalOrderHistoryStore.loadValues.isLoading} 
                        isLoadable={this.props.personalOrderHistoryStore.isLoadable}
                    /> */}
                </View>
            </ScrollView>
        );
    }

    render() {
        return (
            <Container style={[styles.container]}>
                {/* <Loading isOpened={this.props.personalOrderHistoryStore.isLoading} /> */}
                {this.personalPlacedOrderHistoryHead}
                {this._renderPersonalPlacedOrderHistoryBody()}
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        flexDirection: 'column'
    },
    head: {
        width: '100%',
        height: 70,
        flexDirection: 'row',
        backgroundColor: "#f7f8fa",

        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: '#dedfe0',
        borderTopWidth: 1,
        borderTopColor: '#dedfe0',
        
    },
    column: {
        flex: 1,
        flexDirection: 'column',
        width: '100%'
    }, 
    columnItem: {
        borderStyle: 'solid',
        borderWidth: 0.5,
        borderColor: '#dedfe0',

        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    tuple: {        
        width: '100%',
        height: 70,
        flexDirection: 'row',
        borderStyle: 'solid',
        borderRightWidth: 1,
        borderRightColor: '#dedfe0',
    },
    odd: {
        backgroundColor: '#f7f8fa',
    },
    tupleColumnText: {
        fontSize: 10
    },
    created: {
        flexDirection: 'row'
    },
    dateText: {
        color: '#333'
    },
    timeText: {
        color: '#747474'
    }
});
import React, { Component } from 'react';
import commonStyle from '../../styles';
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

    _onPressDeleteOrder = (order_uuid) => {
        this.props.personalOrderHistoryStore.deletePlacedOrder(order_uuid);
    }
    
    @computed get personalPlacedOrderHistoryHead() {
        return (
            <View style={[styles.head]}>
                <View style={[styles.column]}>
                    <View style={[styles.columnItem]}>
                        <Text style={[styles.columnText]}>주문유형</Text>
                    </View>
                    <View style={[styles.columnItem]}>
                        <Text style={[styles.columnText]}>주문시간</Text>
                    </View>
                </View>
                <View style={[styles.column]}>
                    <View style={[styles.columnItem]}>
                        <Text style={[styles.columnText]}>가격</Text>
                    </View>
                    <View style={[styles.columnItem]}>
                        <Text style={[styles.columnText]}>수량</Text>
                    </View>
                </View>
                <View style={[styles.column]}>
                    <View style={[styles.columnItem]}>
                        <Text style={[styles.columnText]}>체결량</Text>
                    </View>
                    <View style={[styles.columnItem]}>
                        <Text style={[styles.columnText]}>마체결</Text>
                    </View>
                </View>
                <View style={[styles.column, styles.columnItem]}>
                    <Text style={[styles.columnText]}>취소</Text>
                </View>
            </View>
        );
    };

    _renderPersonalPlacedOrderHistoryBody() {
        return (
            <ScrollView style={[styles.body]}>
                <View style={[styles.tuples]}>
                    {this.props.personalOrderHistoryStore.selectedTradingPairPlacedOrders.map((placedOrder, index) => {
                        let { uuid, created, side, price, volume, volume_filled, volume_remaining} = placedOrder;
                        let dateAndTime_string = momentHelper.getLocaleDatetime(created);
                        let [ date, time ] = dateAndTime_string ? dateAndTime_string.split(' ') : [];
                        return (
                            <View style={[styles.tuple, index % 2 ? styles['even'] : styles['odd'] ]} key={uuid}>
                                <View style={[styles.column]}>
                                    <View style={[styles.columnItem, styles[side]]}>
                                        <Text style={[styles.columnText]}>
                                            { side === 'SELL' ? '매도' : '매수' }
                                        </Text>
                                    </View>
                                    <View style={[styles.columnItem]}> 
                                        <Text style={[styles.columnText, styles.dateText]}>{date}</Text>
                                        <Text style={[styles.columnText, styles.timeText]}>{time}</Text> 
                                    </View>
                                </View>
                                <View style={[styles.column]}>
                                    <View style={[styles.columnItem, styles.price]}>
                                        <Text style={[styles.columnText, styles.priceText]}>
                                            {number.putComma(Decimal(Decimal(price).toFixed()).toFixed())} {quote_symbol}
                                        </Text>
                                    </View>
                                    <View style={[styles.columnItem, styles.volume]}>
                                        <Text style={[styles.columnText, styles.volumeText]}>
                                            {number.putComma(Decimal(volume).toFixed())} {base_symbol}
                                        </Text>
                                    </View>               
                                </View>
                                <View style={[styles.column]}>
                                    <View style={[styles.columnItem, styles.filled ]}>
                                        <Text style={[styles.columnText, styles.volumeText]}>
                                            {number.putComma(Decimal(volume_filled).toFixed())} {base_symbol}
                                        </Text>
                                    </View>
                                    <View style={[styles.columnItem, styles.remaining]}>
                                        <Text style={[styles.columnText, styles.volumeText]}>
                                            {number.putComma(Decimal(volume_remaining).toFixed())} {base_symbol}
                                        </Text>
                                    </View>        
                                </View>
                                <View style={[styles.column, styles.columnItem]}>{
                                    <Button onPress={this._onPressDeleteOrder(uuid)}>취소</Button>
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
        const { t } = this.props;
        const tradingPair = this.props.tradingPairStore.selectedTradingPair
        const { base_symbol, quote_symbol } = tradingPair || {};
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
        backgroundColor: "#f7f8fa"
    },
    column: {
        flex: 1,
        flexDirection: 'column',
        width: '100%'
    }, 
    columnItem: {
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#dedfe0',

        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    tuple: {        
        borderStyle: 'solid',
        borderRightWidth: 1,
        borderRightColor: '#dedfe0',
    },

});
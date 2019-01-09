import React, { Component } from 'react';
import commonStyles, { font }from '../../styles/commonStyle';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Container, Header, Text, Button, Item, Input } from 'native-base';
import { inject, observer } from 'mobx-react';
import number from '../../utils/number';
import momentHelper from '../../utils/momentHelper';
import Decimal from '../../utils/decimal';
import { reaction, computed } from 'mobx';
import TRANSLATIONS from '../../TRANSLATIONS'

@inject('pubnub', 'transactionHistoryStore', 'tradingPairStore')
@observer
export default class TransactionHistoryBox extends Component {
    componentDidMount() {
        // this.reaciton = reaction(
        //     () => this.props.tradingPairStore.selectedTradingPairName,
        //     (selectedTradingPairName) => {
        //         this.props.transactionHistoryStore.load(this.props.type);
        //     }
        // );
        
        /* 
         *  mount시 내부에 필요한 데이터를 호출하는게 아닌, 외부 tab에 의해 호출합니다. 
         *  TODO tab 형태가 변경되면 로드해오는 방식도 변경할 여지가 있습니다.
         */
        // this.props.transactionHistoryStore.clear();
        // this.props.transactionHistoryStore.load(this.props.type || 'ALL_TRANSACTIONS');
    }
    
    @computed get personalCompletedOrderHistoryHead() {
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
                <View style={[styles.column, styles.columnItem]}>
                    <Text style={[styles.headColumnText]}>가격</Text>
                </View>
                <View style={[styles.column, styles.columnItem]}>
                    <Text style={[styles.headColumnText]}>수량</Text>
                </View>
                <View style={[styles.column, styles.columnItem]}>
                    <Text style={[styles.headColumnText]}>수수료</Text>
                </View>
                <View style={[styles.column, styles.columnItem]}>
                    <Text style={[styles.headColumnText]}>총금액</Text>
                </View>
            </View>
        );
    };

    _renderPersonalCompoletedOrderHistoryBody() {
        return (
            <ScrollView style={[styles.body]}>
                <View style={[styles.tuples]}>
                    {this.props.transactionHistoryStore.transactionHistory.map((transaction, index) => {
                        let { 
                            uuid, 
                            amount, price, volume, fee,
                            base_symbol, quote_symbol, 
                            transaction_created, transaction_type 
                        } = transaction;
                        let dateAndTime_string = momentHelper.getLocaleDatetime(transaction_created);
                        let [ date, time ] = dateAndTime_string ? dateAndTime_string.split(' ') : [];
                        return (
                            <View style={[styles.tuple, index % 2 === 0 ? styles['even'] : styles['odd'] ]} key={uuid}>
                                <View style={[styles.column]}>
                                    <View style={[styles.columnItem, commonStyles[transaction_type]]}>
                                        <Text style={[styles.tupleColumnText, commonStyles[transaction_type]]}>
                                            { TRANSLATIONS[transaction_type] }
                                        </Text>
                                    </View>
                                    <View style={[styles.columnItem, styles.created]}> 
                                        <Text style={[styles.tupleColumnText, styles.dateText]}>{date ? date + ' ' : ''} </Text>
                                        <Text style={[styles.tupleColumnText, styles.timeText]}>{time ? time : ''}</Text> 
                                    </View>
                                </View>
                                <View style={[styles.column, styles.columnItem, styles.price]}>
                                    <Text style={[styles.tupleColumnText, styles.priceText]}>
                                        {number.putComma(Decimal(price).toFixed())} {quote_symbol}
                                    </Text>     
                                </View>
                                <View style={[styles.column, styles.columnItem, styles.volume ]}>
                                    <Text style={[styles.tupleColumnText, styles.volumeText]}>
                                        {number.putComma(Decimal(volume).toFixed())} {base_symbol}
                                    </Text>
                                </View>
                                <View style={[styles.column, styles.columnItem, styles.fee]}>
                                    <Text style={[styles.tupleColumnText, styles.feeText]}>
                                        {number.putComma(Decimal(fee).toFixed())} { transaction_type === 'SELL' ? quote_symbol : base_symbol }
                                    </Text>
                                </View>
                                <View style={[styles.column, styles.columnItem, styles.amount]}>
                                    <Text style={[styles.tupleColumnText, styles.amountText]}>
                                        {number.putComma(Decimal(amount).toFixed())} {quote_symbol}
                                    </Text>
                                </View>
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
                {this.personalCompletedOrderHistoryHead}
                {this._renderPersonalCompoletedOrderHistoryBody()}
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
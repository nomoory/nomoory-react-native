import React, { Component } from 'react';
import commonStyle from '../../styles/commonStyle';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
} from 'react-native';
import {
    inject,
    observer,
} from 'mobx-react';
import number from '../../utils/number';
import momentHelper from '../../utils/momentHelper';
import Decimal from '../../utils/decimal';
import {
    reaction,
    computed,
} from 'mobx';
import ScrollLoading from '../ScrollLoading';

@inject('transactionHistoryStore', 'tradingPairStore')
@observer
export default class CompletedOrderHistory extends Component {
    constructor(props) {
        super(props);
        reaction(
            () => this.props.tradingPairStore.selectedTradingPairName,
            (selectedTradingPairName) => {
                this.props.transactionHistoryStore.clearTradeHistoryRegistry();
                this.props.transactionHistoryStore.loadTradeHistory();
            }
        );
        this.props.transactionHistoryStore.clearTradeHistoryRegistry();
        this.props.transactionHistoryStore.loadTradeHistory();

    }
    
    @computed get completedOrderHistoryHead() {
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
                    <Text style={[styles.headColumnText]}>체결가격</Text>
                </View>
                <View style={[styles.column, styles.columnItem]}>
                    <Text style={[styles.headColumnText]}>체결수량</Text>
                </View>
                <View style={[styles.column, styles.columnItem]}>
                    <Text style={[styles.headColumnText]}>체결금액</Text>
                </View>
            </View>
        );
    };

    _renderCompoletedOrderHistoryBody() {
        const isLoading = this.props.transactionHistoryStore.loadMoreValuesTradeHistory.isLoading;
        const message_code = this.props.transactionHistoryStore.isTradeHistoryLoadable.message_code;
        const isLoadable = this.props.transactionHistoryStore.isTradeHistoryLoadable;
        
        return (
            <FlatList 
                style={[styles.container]}
                onEndReachedThreshold={30}
                onEndReached={(e) => {
                    if (message_code === 'has_next_load') {
                        this.props.transactionHistoryStore.loadNextTradeHistory();
                    }
                }}
                data={this.props.transactionHistoryStore.tradeHistory || []}
                // refreshing={this.state.refreshing}
                // onRefresh={this.onRefresh}
                enableEmptySections={true}
                renderItem={({ item, index }) => {
                    let { 
                        uuid, 
                        amount, price, volume, 
                        base_symbol, quote_symbol, 
                        transaction_created, transaction_type 
                    } = item;
                    let dateAndTime_string = momentHelper.getLocaleDatetime(transaction_created);
                    let [ date, time ] = dateAndTime_string ? dateAndTime_string.split(' ') : [];
                    return (
                        <View style={[styles.tuple, index % 2 === 0 ? styles['even'] : styles['odd'] ]} key={uuid}>
                            <View style={[styles.column]}>
                                <View style={[styles.columnItem, commonStyle[transaction_type]]}>
                                    <Text style={[styles.tupleColumnText ]}>{ base_symbol } </Text>
                                    <Text style={[styles.tupleColumnText, commonStyle[transaction_type]]}>
                                        { transaction_type === 'SELL' ? '매도' : '매수' }
                                    </Text>
                                </View>
                                <View style={[styles.columnItem, styles.created]}> 
                                    <Text style={[styles.tupleColumnText, styles.dateText]}>{date ? date : ''} </Text>
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
                            <View style={[styles.column, styles.columnItem, styles.amount]}>
                                <Text style={[styles.tupleColumnText, styles.amountText]}>
                                    {number.putComma(Decimal(amount).toFixed())} {quote_symbol}
                                </Text>
                            </View>
                        </View>
                    );
                }}
                ListFooterComponent={() => {
                    return (
                        <ScrollLoading
                            isLoading={isLoading} 
                            isLoadable={isLoadable}
                        />
                    );
                }}
            />
        );
    }

    render() {
        return (
            <View style={[styles.container]}>
                {this.completedOrderHistoryHead}
                {this._renderCompoletedOrderHistoryBody()}
            </View>
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
        borderBottomWidth: 0.5,
        borderBottomColor: commonStyle.color.borderColor,
        borderTopWidth: 0.5,
        borderTopColor: commonStyle.color.borderColor,
        
    },
    headColumnText: {
        color: '#333333',
        fontSize: 14,
    },
    column: {
        flex: 1,
        flexDirection: 'column',
        width: '100%'
    }, 
    columnItem: {
        borderStyle: 'solid',
        borderWidth: 0.5,
        borderColor: commonStyle.color.borderColor,

        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    tuple: {        
        width: '100%',
        height: 70,
        flexDirection: 'row',
        borderStyle: 'solid',
        borderRightWidth: 1,
        borderRightColor: commonStyle.color.borderColor,
    },
    odd: {
        backgroundColor: '#f7f8fa',
    },
    tupleColumnText: {
        fontSize: 11
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
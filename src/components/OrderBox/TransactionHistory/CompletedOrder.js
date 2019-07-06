import React, { Component } from 'react';
import commonStyles from '../../../styles/commonStyle';
import { StyleSheet, View, Text, ListView } from 'react-native';
import { inject, observer } from 'mobx-react';
import number, { Decimal } from '../../../utils/number';
import momentHelper from '../../../utils/momentHelper';
import { reaction } from 'mobx';
import ScrollLoading from '../../ScrollLoading';

@inject('transactionHistoryStore', 'tradingPairStore')
@observer
export default class CompletedOrder extends Component {
    componentDidMount() {
        reaction(
            () => this.props.targetTradingPairName,
            (targetTradingPairName) => {
                this.props.transactionHistoryStore.loadSelectedTradeHistory(targetTradingPairName);
            }
        );
        this.props.transactionHistoryStore.loadSelectedTradeHistory(this.props.targetTradingPairName);

    }

    _renderCompoletedOrderHistoryBody() {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const dataSource = ds.cloneWithRows(this.props.transactionHistoryStore.selectedTradeHistory);
        const isLoading = this.props.transactionHistoryStore.loadMoreValuesTradeHistory.isLoading;
        const message_code = this.props.transactionHistoryStore.isTradeHistoryLoadable.message_code;
        const isLoadable = this.props.transactionHistoryStore.isTradeHistoryLoadable;
        
        return (
            <ListView style={[styles.container]}
                onEndReachedThreshold={30}
                onEndReached={(e) => {
                    if (message_code === 'has_next_load') {
                        this.props.transactionHistoryStore.loadNextSelectedTradeHistory();
                    }
                }}
                dataSource={dataSource}
                renderRow={(completedOrder, mode, index) => {
                    let { 
                        amount, price, volume, 
                        base_symbol, quote_symbol, 
                        transaction_created, transaction_type 
                    } = completedOrder;
                    let dateAndTime_string = momentHelper.getLocaleDatetime(transaction_created);
                    let [ date, time ] = dateAndTime_string ? dateAndTime_string.split(' ') : [];
                    return (
                        <View style={[styles.tuple]}>
                            <View style={[styles.row]}>
                                <Text style={[styles.orderType, commonStyles[transaction_type]]}>
                                    { transaction_type === 'SELL' ? '매도' : '매수' }
                                </Text>
                                <View style={[styles.created]}> 
                                    <Text style={[styles.dateText]}>{date ? date + ' ' : ''} </Text>
                                    <Text style={[styles.timeText]}>{time ? time : ''}</Text> 
                                </View>
                            </View>
                            <View style={[styles.row]}>
                                <Text style={[styles.title]}>체결가격</Text>
                                <Text style={[styles.content]}>
                                    {number.putComma(Decimal(price).toFixed())} {quote_symbol}
                                </Text>
                            </View>
                            <View style={[styles.row]}>
                                <Text style={[styles.title]}>체결수량</Text>
                                <Text style={[styles.content]}>
                                    {number.putComma(Decimal(volume).toFixed())} {base_symbol}
                                </Text>
                            </View>

                            <View style={[styles.row]}>
                                <Text style={[styles.title]}>체결금액</Text>
                                <Text style={[styles.content]}>
                                    {number.putComma(Decimal(amount).toFixed())} {quote_symbol}
                                </Text>
                            </View>
                        </View>
                    );
                }}
                renderFooter={() => {
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
    tuple: {        
        width: '100%',
        flexDirection: 'column',
        borderStyle: 'solid',
        display: 'flex',
        borderBottomWidth: 1,
        paddingTop: 5,
        paddingBottom: 5,
        borderBottomColor: '#dedfe0',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 3,
    },
    orderType: {
        fontSize: 12,
        fontWeight: '500',
    },
    title: {
        fontSize: 10,
    },
    content: {
        fontSize: 10,
    },
    tupleColumnText: {
        fontSize: 10
    },
    created: {
        flexDirection: 'row'
    },
    dateText: {
        fontSize: 10,
        color: '#333'
    },
    timeText: {
        fontSize: 10,
        color: '#747474'
    },
});
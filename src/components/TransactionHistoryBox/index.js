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
import { computed } from 'mobx';
import TRANSLATIONS from '../../TRANSLATIONS';
import ScrollLoading from '../ScrollLoading';

@inject(
    'transactionHistoryStore',
    'tradingPairStore',
)
@observer
export default class TransactionHistoryBox extends Component {
    @computed
    get completedOrderHistoryHead() {
        return (
            <View style={[styles.head]}>
                <View style={[styles.column, styles.firstColumn]}>
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
                        <Text style={[styles.headColumnText]}>수수료</Text>
                    </View>
                    <View style={[styles.columnItem]}>
                        <Text style={[styles.headColumnText]}>총금액</Text>
                    </View>
                </View>
            </View>
        );
    };

    _renderCompletedOrderHistoryBody() {
        const isLoading = this.props.transactionHistoryStore.loadMoreValues.isLoading;
        const isLoadable = this.props.transactionHistoryStore.isLoadable;

        return (
            <FlatList
                style={[styles.container]}
                onEndReachedThreshold={30}
                onEndReached={(e) => {
                    if (this.props.transactionHistoryStore.isLoadable.message_code === 'has_next_load') {
                        this.props.transactionHistoryStore.loadNext();
                    }
                }}
                data={this.props.transactionHistoryStore.transactionHistory || []}

                // refreshing={this.state.refreshing}
                // onRefresh={this.onRefresh}
                enableEmptySections={true}
                renderItem={({ item, index }) => {
                    let {
                        uuid,
                        amount, price, volume, fee,
                        base_symbol, quote_symbol,
                        transaction_created, transaction_type
                    } = item;
                    let dateAndTime_string = momentHelper.getLocaleDatetime(transaction_created);
                    let [date, time] = dateAndTime_string ? dateAndTime_string.split(' ') : [];
                    return (
                        <View style={[styles.tuple, index % 2 === 0 ? styles['even'] : styles['odd']]} key={uuid}>
                            <View style={[styles.column, styles.firstColumn]}>
                                <View style={[
                                    styles.columnItem,
                                    commonStyle[transaction_type],
                                ]}>
                                    <Text style={[
                                        styles.tupleColumnText,
                                        styles.dateText
                                    ]}>
                                        {base_symbol + ' '}
                                    </Text>
                                    <Text style={[
                                        styles.tupleColumnText,
                                        commonStyle[transaction_type]
                                    ]}>{TRANSLATIONS[transaction_type]}
                                    </Text>
                                </View>
                                <View style={[styles.columnItem, styles.created]}>
                                    <Text style={[styles.tupleColumnText, styles.dateText]}>
                                        {date ? date + ' ' : ''}
                                    </Text>
                                    <Text style={[styles.tupleColumnText, styles.timeText]}>
                                        {time ? time : ''}
                                    </Text>
                                </View>
                            </View>
                            <View style={[styles.column]}>
                                <View style={[
                                    styles.columnItem,
                                    styles.price,
                                    styles.textRight
                                ]}>
                                    <Text style={[
                                        styles.tupleColumnText,
                                        styles.priceText
                                    ]}>
                                        {price ? number.putComma(number.getFixedPrice(price, quote_symbol)) : '-'} {quote_symbol}
                                    </Text>
                                </View>
                                <View style={[
                                    styles.columnItem,
                                    styles.volume,
                                    styles.textRight
                                ]}>
                                    <Text style={[
                                        styles.tupleColumnText,
                                        styles.volumeText
                                    ]}>
                                        {volume ? number.putComma(number.getFixedPrice(volume, base_symbol)) : '-'} {base_symbol}
                                    </Text>
                                </View>
                            </View>
                            <View style={[styles.column]}>
                                <View style={[
                                    styles.columnItem,
                                    styles.fee,
                                    styles.textRight
                                ]}>
                                    <Text style={[styles.tupleColumnText, styles.feeText]}>
                                        {fee ? number.putComma(number.getFixedPrice(fee, transaction_type === 'SELL' ? quote_symbol : base_symbol)) : '-'} {transaction_type === 'SELL' ? quote_symbol : base_symbol}
                                    </Text>
                                </View>
                                <View style={[
                                    styles.columnItem,
                                    styles.amount,
                                    styles.textRight
                                ]}>
                                    <Text style={[styles.tupleColumnText, styles.amountText]}>
                                        {amount ? number.putComma(number.getFixedPrice(amount, quote_symbol)) : '-'} {quote_symbol}
                                    </Text>
                                </View>
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
                {this._renderCompletedOrderHistoryBody()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white'
    },
    head: {
        width: '100%',
        height: 70,
        flexDirection: 'row',
        backgroundColor: "#f7f8fa",

        borderStyle: 'solid',
        borderBottomWidth: 0.5,
        borderBottomColor: commonStyle.color.borderColor,
    },
    headColumnText: {
        color: '#333333',
        fontSize: 14,
    },
    firstColumn: {
        flex: 0.6,
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
        fontSize: 12,
        textAlign: 'right'
    },
    created: {
        flexDirection: 'row'
    },
    dateText: {
        color: '#333',
        marginRight: 4
    },
    timeText: {
        color: '#747474'
    },
    textRight: {
        justifyContent: 'flex-end',
        paddingRight: 6,
    }
});
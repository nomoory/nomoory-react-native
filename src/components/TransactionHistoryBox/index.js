import React, { Component } from 'react';
import commonStyles, { font }from '../../styles/commonStyle';
import { StyleSheet, View, ListView, Text } from 'react-native';
import { inject, observer } from 'mobx-react';
import number from '../../utils/number';
import momentHelper from '../../utils/momentHelper';
import Decimal from '../../utils/decimal';
import { reaction, computed } from 'mobx';
import TRANSLATIONS from '../../TRANSLATIONS';
import ScrollLoading from '../ScrollLoading';

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

    _renderPersonalCompoletedOrderHistoryBody() {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const dataSource = ds.cloneWithRows(this.props.transactionHistoryStore.transactionHistory);
        const isLoading = this.props.transactionHistoryStore.loadMoreValues.isLoading;
        const isLoadable = this.props.transactionHistoryStore.isLoadable;
        return (
            <ListView style={[styles.container]}
                onEndReachedThreshold={30}
                onEndReached={(e) => {
                    if (this.props.transactionHistoryStore.isLoadable.message_code === 'has_next_load') {
                        this.props.transactionHistoryStore.loadNext();
                    }
                }}
                dataSource={dataSource}
                renderRow={(transaction, mode, index) => {
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
                            <View style={[styles.column, styles.firstColumn]}>
                                <View style={[styles.columnItem, commonStyles[transaction_type], ]}>
                                    <Text style={[styles.tupleColumnText, styles.dateText]}>{base_symbol} </Text>
                                    <Text style={[styles.tupleColumnText, commonStyles[transaction_type]]}>
                                        { TRANSLATIONS[transaction_type] }
                                    </Text>
                                </View>
                                <View style={[styles.columnItem, styles.created]}> 
                                    <Text style={[styles.tupleColumnText, styles.dateText]}>{date ? date + '' : ''} </Text>
                                    <Text style={[styles.tupleColumnText, styles.timeText]}>{time ? time : ''}</Text> 
                                </View>
                            </View>
                            <View style={[styles.column]}>
                                <View style={[styles.columnItem, styles.price, styles.textRight]}>
                                    <Text style={[styles.tupleColumnText, styles.priceText]}>
                                        {number.putComma(Decimal(price).toFixed())} {quote_symbol}
                                    </Text>     
                                </View>
                                <View style={[styles.columnItem, styles.volume, styles.textRight]}>
                                    <Text style={[styles.tupleColumnText, styles.volumeText]}>
                                        {number.putComma(Decimal(volume).toFixed())} {base_symbol}
                                    </Text>
                                </View>
                            </View>
                            <View style={[styles.column]}>
                                <View style={[styles.columnItem, styles.fee, styles.textRight]}>
                                    <Text style={[styles.tupleColumnText, styles.feeText]}>
                                        {number.putComma(Decimal(fee).toFixed())} { transaction_type === 'SELL' ? quote_symbol : base_symbol }
                                    </Text>
                                </View>
                                <View style={[styles.columnItem, styles.amount, styles.textRight]}>
                                    <Text style={[styles.tupleColumnText, styles.amountText]}>
                                        {number.putComma(Decimal(amount).toFixed())} {quote_symbol}
                                    </Text>
                                </View>
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
                {this.personalCompletedOrderHistoryHead}
                {this._renderPersonalCompoletedOrderHistoryBody()}
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
        borderBottomWidth: 1,
        borderBottomColor: '#dedfe0',     
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
        borderColor: '#dedfe0',

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
        borderRightColor: '#dedfe0',
    },
    odd: {
        backgroundColor: '#f7f8fa',
    },
    tupleColumnText: {
        fontSize: 12
    },
    created: {
        flexDirection: 'row'
    },
    dateText: {
        color: '#333'
    },
    timeText: {
        color: '#747474'
    },
    textRight: {
        justifyContent: 'flex-end',
        paddingRight: 6,
    }
});
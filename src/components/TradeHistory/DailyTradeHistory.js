import React, { Component } from 'react';
import commonStyle from '../../styles/commonStyle';
import { StyleSheet, View, Text, ListView } from 'react-native';
import { inject, observer } from 'mobx-react';
import number from '../../utils/number';
import momentHelper from '../../utils/momentHelper';
import { reaction, computed } from 'mobx';
import ScrollLoading from '../ScrollLoading';

@inject('dailyTradeHistoryStore', 'tradingPairStore')
@observer
export default class DailyTradeHistory extends Component {

    componentDidMount() {
        this.props.dailyTradeHistoryStore.clear();
        this.props.dailyTradeHistoryStore.loadDailyTrades(this.props.tradingPairStore.selectedTradingPairName);
        this._loadNextIfHasNextToLoadAndNotScrollable();
    }

    _onDailyTradeTableScroll = (event) => {
        this.props.dailyTradeHistoryStore.listenScrollEvent(event);
    }

    _loadNextIfHasNextToLoadAndNotScrollable = () => {
        reaction(
            () => this.props.dailyTradeHistoryStore.loadValues.nextUrl,
            (nextUrl) => {
                if (
                    nextUrl
                ) {
                    this.props.dailyTradeHistoryStore.loadNextDailyTrades();
                }
            }
        )
    }

    
    @computed get
    realtimeTradeHistoryHead() {
        return (
            <View style={[styles.head]}>
                <View style={[styles.column, styles.columnItem]}>
                    <Text style={[styles.headColumnText]}>일자</Text>
                </View>
                <View style={[styles.column, styles.columnItem]}>
                    <Text style={[styles.headColumnText]}>종가</Text>
                </View>
                <View style={[styles.column, styles.columnItem]}>
                    <Text style={[styles.headColumnText]}>전일대비</Text>
                </View>
                <View style={[styles.column, styles.columnItem]}>
                    <Text style={[styles.headColumnText]}>체결량</Text>
                </View>
            </View>
        );
    };

    _renderDailyTradeHistoryBody() {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const dataSource = ds.cloneWithRows(this.props.dailyTradeHistoryStore.dailyTrades);
        const isLoading = this.props.dailyTradeHistoryStore.loadValues.isLoading;
        const isLoadable = this.props.dailyTradeHistoryStore.isLoadable;
        
        return (
            <ListView style={[styles.container]}
                onEndReachedThreshold={30}
                onEndReached={(e) => {
                    if (this.props.dailyTradeHistoryStore.loadValues.nextUrl) {
                        this.props.dailyTradeHistoryStore.loadNextDailyTrades();
                    }
                }}
                dataSource={dataSource}
                renderRow={(dailyTrade, mode, index) => {
                    let {
                        candle_start_date_time,
                        prev_close_price,
                        candle_acc_trade_volume,
                        signed_change_rate,
                        close_price
                    } = dailyTrade;
                    let [date, time] = momentHelper.getLocaleDatetime(candle_start_date_time).split(' ');
                    console.log({dailyTrade})
                    signed_change_rate = parseFloat(number.getFixed(signed_change_rate, 2));
                    let sign = '';

                    if (signed_change_rate > 0) {
                        sign = 'RED';
                    } else if (signed_change_rate < 0) {
                        sign = 'BLUE';
                    }

                    let formatedSignedChangeRate = number.putComma(number.getFixed(signed_change_rate));

                    return (
                        <View style={[styles.tuple, index % 2 === 0 ? styles['even'] : styles['odd'] ]} key={candle_start_date_time}>
                            <View style={[
                                styles.column,
                                styles.columnItem,
                                styles.price
                            ]}>
                                <Text style={[
                                    styles.tupleColumnText,
                                    styles.priceText
                                ]}>{date}
                                </Text>     
                            </View>
                            <View style={[
                                styles.column,
                                styles.columnItem,
                                styles.price
                            ]}>
                                <Text style={[
                                    styles.tupleColumnText,
                                    styles.priceText
                                ]}>{
                                    close_price
                                    ? number.putComma(number.getFixed(close_price))
                                    : '-'
                                }
                                </Text>     
                            </View>
                            <View style={[
                                styles.column,
                                styles.columnItem,
                                styles.volume
                            ]}>
                                <Text style={[
                                    styles.tupleColumnText, 
                                    styles.volumeText
                                ]}>
                                    {
                                        `${sign === 'RED' ? '+' : ''} ${formatedSignedChangeRate ? formatedSignedChangeRate + '%' : '-'}`
                                    }
                                </Text>
                            </View>
                            <View style={[
                                styles.column,
                                styles.columnItem,
                                styles.amount
                            ]}>
                                <Text style={[styles.tupleColumnText, styles.amountText]}>
                                    {number.putComma(candle_acc_trade_volume, 4)}
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
                {this.realtimeTradeHistoryHead}
                {this._renderDailyTradeHistoryBody()}
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
        height: 35,
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
        height: 35,
        flexDirection: 'row',
        borderStyle: 'solid',
        borderRightWidth: 1,
        borderRightColor: commonStyle.color.borderColor,
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
    }
});
import React, { Component } from 'react';
import commonStyle from '../../styles/commonStyle';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import {
    inject,
    observer
} from 'mobx-react';
import number from '../../utils/number';
import momentHelper from '../../utils/momentHelper';
import Decimal from '../../utils/decimal';
import {
    computed
} from 'mobx';
import ScrollLoading from '../ScrollLoading';

@inject('placedOrderHistoryStore', 'tradingPairStore')
@observer
export default class PlacedOrderHistory extends Component {
    componentDidMount() {
        this.props.placedOrderHistoryStore.loadAllPersonalPlacedOrders();
    }

    _onPressDeleteOrder = (order_uuid) => () => {
        this.props.placedOrderHistoryStore.deletePlacedOrder(order_uuid);
    }
    
    @computed get placedOrderHistoryHead() {
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
                        <Text style={[styles.headColumnText]}>미체결</Text>
                    </View>
                </View>
                <View style={[styles.column, styles.columnItem]}>
                    <Text style={[styles.headColumnText]}>취소</Text>
                </View>
            </View>
        );
    };

    _renderPlacedOrderHistoryBody() {
        const isLoading = this.props.placedOrderHistoryStore.loadValues.isLoading;
        const isLoadable = this.props.placedOrderHistoryStore.isLoadable;
        const message_code = isLoadable.message_code;
        return (
            <FlatList 
                style={[styles.container, styles.tuples]}
                onEndReachedThreshold={30}
                onEndReached={(e) => {
                    if (message_code === 'has_next_load') {
                        this.props.placedOrderHistoryStore.loadNextPersonalPlacedOrders();
                    }
                }}
                            data={this.props.placedOrderHistoryStore.placedOrders || []}
                // refreshing={this.state.refreshing}
                // onRefresh={this.onRefresh}
                enableEmptySections={true}
                renderItem={({ item, index }) => {
                    let { 
                        uuid, created, side, 
                        price, volume, volume_filled, volume_remaining, 
                        trading_pair_name
                    } = item || {};
                    let [ base_symbol, quote_symbol ] = trading_pair_name ? trading_pair_name.split('-') : [];
                    let dateAndTime_string = momentHelper.getLocaleDatetime(created);
                    let [ date, time ] = dateAndTime_string ? dateAndTime_string.split(' ') : [];
                    return (
                        <View style={[styles.tuple,
                            // index % 2 === 0 ? styles['even'] : styles['odd'] 
                        ]}>
                            <View style={[styles.column]}>
                                <View style={[styles.columnItem, commonStyle[side]]}>
                                    <Text style={[styles.tupleColumnText ]}>{ base_symbol } </Text>
                                    <Text style={[styles.tupleColumnText, commonStyle[side]]}>
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
                                <TouchableOpacity style={[styles.cancleButton]}
                                    onPress={this._onPressDeleteOrder(uuid)}>
                                    <Text style={[styles.cancleButtonText]}>취소</Text>
                                </TouchableOpacity>
                            }</View>
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
                {/* <Loading isOpened={this.props.placedOrderHistoryStore.isLoading} /> */}
                {this.placedOrderHistoryHead}
                {this._renderPlacedOrderHistoryBody()}
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
        borderBottomWidth: 1,
        borderBottomColor: commonStyle.color.borderColor,
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
    },
    cancleButton: { 
        width: 50,
        height: 30,
        borderRadius: 4,
        backgroundColor: '#da5f6e',
        justifyContent: 'center',
        alignItems: 'center'
    },
    cancleButtonText: { 
        borderRadius: 4,
        fontWeight: '600',
        color: 'white'
    }
});
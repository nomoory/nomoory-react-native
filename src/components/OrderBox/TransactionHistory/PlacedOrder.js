import React, { Component } from 'react';
import commonStyle from '../../../styles/commonStyle';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import { inject, observer } from 'mobx-react';
import number from '../../../utils/number';
import momentHelper from '../../../utils/momentHelper';
import Decimal from '../../../utils/decimal';
import ScrollLoading from '../../ScrollLoading';
import { reaction } from 'mobx';

@inject('placedOrderHistoryStore', 'tradingPairStore')
@observer
export default class PlacedOrder extends Component {
    componentDidMount() {
        this.props.placedOrderHistoryStore.loadPersonalOrders(this.props.targetTradingPairName);
        
        this.loadTradingPairReaction = reaction(
            () => this.props.targetTradingPairName,
            targetTradingPairName => {
                this.props.placedOrderHistoryStore.loadPersonalOrders(targetTradingPairName);
            }
        )
    }

    componentWillUnmount() {
        if (this.loadTradingPairReaction) this.loadTradingPairReaction();
    }

    _onPressDeleteOrder = (order_uuid) => () => {
        this.props.placedOrderHistoryStore.deletePlacedOrder(order_uuid);
    }

    _renderPlacedOrderHistoryBody() {
        const isLoading = this.props.placedOrderHistoryStore.loadValues.isLoading;
        const isLoadable = this.props.placedOrderHistoryStore.isLoadable;
        const message_code = isLoadable.message_code;
        return (

            <FlatList 
                style={[styles.container]}
                data={this.props.placedOrderHistoryStore.placedOrders || []}
                onEndReachedThreshold={30}
                onEndReached={(e) => {
                    if (message_code === 'has_next_load') {
                        this.props.placedOrderHistoryStore.loadNextPersonalPlacedOrders();
                    }
                }}


                // refreshing={this.state.refreshing}
                // onRefresh={this.onRefresh}
                enableEmptySections={true}
                renderItem={(item, mode, index) => {
                    let { 
                        uuid, created, side, 
                        price, volume, volume_filled, volume_remaining, 
                        trading_pair_name
                    } = item || {};
                    let [ base_symbol, quote_symbol ] = trading_pair_name ? trading_pair_name.split('-') : [];
                    let dateAndTime_string = momentHelper.getLocaleDatetime(created);
                    let [ date, time ] = dateAndTime_string ? dateAndTime_string.split(' ') : [];
                    return (
                        <View style={[styles.tuple]}>
                            <View style={styles.orderInfo}>
                                <View style={[styles.row]}>
                                    <Text style={[styles.orderType, commonStyle[side]]}>
                                        { side === 'SELL' ? '매도' : '매수' }
                                    </Text>
                                    <View style={[styles.created]}> 
                                        <Text style={[styles.dateText]}>{date ? date + ' ' : ''} </Text>
                                        <Text style={[styles.timeText]}>{time ? time : ''}</Text> 
                                    </View>
                                </View>
                                <View style={[styles.row]}>
                                    <Text style={[styles.title]}>주문가격</Text>
                                    <Text style={[styles.content]}>
                                        {number.putComma(Decimal(Decimal(price).toFixed()).toFixed())} {quote_symbol}
                                    </Text>
                                </View>
                                <View style={[styles.row]}>
                                    <Text style={[styles.title]}>총주문량</Text>
                                    <Text style={[styles.content]}>
                                        {number.putComma(Decimal(volume).toFixed())} {base_symbol}
                                    </Text>
                                </View>

                                <View style={[styles.row]}>
                                    <Text style={[styles.title]}>미체결량</Text>
                                    <Text style={[styles.content]}>
                                        {number.putComma(Decimal(volume_remaining).toFixed())} {base_symbol}
                                    </Text>
                                </View>
                            </View>
                            <View style={[styles.cancle]}>{
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
    tuple: {        
        width: '100%',
        flexDirection: 'row',
        borderStyle: 'solid',
        display: 'flex',
    },
    orderInfo: {
        flex: 1,
        flexDirection: 'column',
        borderBottomWidth: 1,
        paddingTop: 5,
        paddingBottom: 5,
        borderBottomColor: commonStyle.color.borderColor,
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
    cancle: {
        width: 50,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancleButton: { 
        width: 30,
        height: 20,
        borderRadius: 4,
        backgroundColor: '#da5f6e',
        justifyContent: 'center',
        alignItems: 'center'
    },
    cancleButtonText: { 
        fontSize: 10,
        borderRadius: 4,
        fontWeight: '600',
        color: 'white'
    }
});
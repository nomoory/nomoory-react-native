import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import commonStyle from '../../styles/commonStyle';

@inject('tradingPairStore')
@observer
class TradingPairTableHeader extends Component {
    @observable
    variable = 4;

    _toggleLanguageForTokenName = () => {
        this.props.tradingPairStore.toggleLanguageForTokenName();
    };

    _toggleSortDirectionOf = (target) => () => {
            this.props.tradingPairStore.toggleSortDirectionOf(target);
    };

    _renderDisplayNameByName = (name) => {
        if ( name === 'close_price') return '현재가';
        if ( name === 'signed_change_rate') return '전일대비';
        if ( name === 'acc_trade_value_24h') return '거래대금';
    }

    render() {
        const { displayNameOfLanguageForTokenName } = this.props.tradingPairStore || {};
        return (
            <View style={styles.container}>
                <TouchableOpacity style={[styles.column, this.props.columStyles[0] ]}
                    onPress={this._toggleLanguageForTokenName}
                >
                    <Text style={styles.headerFont}>
                        {displayNameOfLanguageForTokenName}
                    </Text>
                    <Image style={{ width: 15, height: 14 }}
                        source={require('../../../assets/images/exchange/ic_change_s.png')} 
                    />
                </TouchableOpacity>
                {
                    this.props.tradingPairStore.sorts.map((sort, index) => {
                        let source = require('../../../assets/images/exchange/ic_arow_default_s.png');
                        if (sort.direction === 'desc') source = require('../../../assets/images/exchange/ic_arow_up_s.png');
                        if (sort.direction === 'asc') source = require('../../../assets/images/exchange/ic_arow_down_s.png');

                        return (
                            <TouchableOpacity key={sort.name} 
                                onPress={this._toggleSortDirectionOf(sort.name)}
                                style={[
                                    this.props.columStyles[index + 1],
                                    styles.column,
                                    styles[sort.name]
                                ]}
                            >
                                <Text style={styles.headerFont}>
                                    {this._renderDisplayNameByName(sort.name) + ' '}
                                </Text>
                                <Image
                                    style={{ width: 15, height: 13 }} 
                                    source={source}
                                /> 
                            </TouchableOpacity>
                        );
                    })
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 33,
        flexDirection: 'row',
        alignItems: 'center',

        borderStyle: 'solid',
        borderTopWidth: 0.8,
        borderTopColor: '#9e9f90',
        borderBottomWidth: 0.8,
        borderBottomColor: commonStyle.color.borderColor,
    },
    column: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerFont: {
        fontSize: 14,
        color: '#888',
    },
})
export default TradingPairTableHeader;
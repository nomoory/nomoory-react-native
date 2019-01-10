import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import commonStyle from '../../styles/commonStyle';

@inject('tradingPairStore')
@observer
class TradingPairTableHeader extends Component {
    @observable variable = 4;
    _toggleLanguageForTokenName = () => {
        this.props.tradingPairStore.toggleLanguageForTokenName();
    };
    _toggleSortDirectionOf = (target) => () => {
            this.props.tradingPairStore.toggleSortDirectionOf(target);
    };
    _renderDisplayNameByName = (name) => {
        if ( name === 'close_price') return '현재가';
        if ( name === 'signed_change_rate') return '24시간대비';
        if ( name === 'acc_trade_value_24h') return '거래대금';
    }
    render() {
        const { displayNameOfLanguageForTokenName } = this.props.tradingPairStore || {};
        return (
            <View style={styles.container}>
                <View style={[styles.column, this.props.columStyles[0] ]}>
                    <Text style={styles.headerFont}
                        onPress={this._toggleLanguageForTokenName}>
                        {displayNameOfLanguageForTokenName}
                    </Text>
                    <Image style={{ width: 10, height: 13 }} 
                        source={require('../../../assets/images/exchange/ic_change_s.png')} /> 
                </View>
                {
                    this.props.tradingPairStore.sorts.map((sort, index) => {
                        return (
                            <View key={sort.name} 
                                style={[this.props.columStyles[index + 1], styles.column]}>
                                <Text style={styles.headerFont}
                                    onPress={this._toggleSortDirectionOf(sort.name)}>
                                    {this._renderDisplayNameByName(sort.name) + ' '}
                                    {
                                        sort.direction === 'asc' ? 
                                        <Image style={{ width: 10, height: 13 }} 
                                            source={require('../../../assets/images/exchange/ic_arow_up_s.png')} /> 
                                            :
                                        null
                                    }
                                    {
                                        sort.direction === 'desc' ? 
                                        <Image style={{ width: 10, height: 13 }} 
                                            source={require('../../../assets/images/exchange/ic_arow_down_s.png')} /> 
                                            :
                                        null
                                    }
                                    {
                                        !sort.direction ? 
                                        <Image style={{ width: 10, height: 13 }} 
                                            source={require('../../../assets/images/exchange/ic_arow_default_s.png')} /> 
                                            :
                                        null
                                    }
                                </Text>
                            </View>
                        );
                    })
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 32,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f7f8fa',

        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: '#dedfe0',
    },
    column: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerFont: {
        fontSize: 13
    }
})
export default TradingPairTableHeader;
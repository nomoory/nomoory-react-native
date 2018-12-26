import React, { Component } from 'react';
import {
    StyleSheet,
    Button,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import { } from 'native-base';
import {
    inject,
    observer
} from 'mobx-react';
import { observable } from 'mobx';

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
                <View style={this.props.columStyles[0]}>
                    <Text onPress={this._toggleLanguageForTokenName}>
                        {displayNameOfLanguageForTokenName}
                    </Text>
                </View>
                {
                    this.props.tradingPairStore.sorts.map((sort, index) => {
                        return (
                            <View key={sort.name} style={this.props.columStyles[index + 1]}>
                                <Text onPress={this._toggleSortDirectionOf(sort.name)}>
                                    {this._renderDisplayNameByName(sort.name) + ' ' + sort.direction}
                                </Text>
                            </View>
                        )
                    })
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        height: 30,
        flexDirection: 'row',
    },
    column: {
        flex: 1,
    }
})
export default TradingPairTableHeader;
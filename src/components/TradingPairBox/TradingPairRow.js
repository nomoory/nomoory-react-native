import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import { Container, } from 'native-base';
import { inject, observer } from 'mobx-react';
import { withNavigation } from 'react-navigation';

@withNavigation
@inject('tradingPairStore')
@observer
class TradingPairRow extends Component {
    _onPressTradingPairRow = (e) => {
        this.props.tradingPairStore.setSelectedTradingPairName(this.props.tradingPair.name);
        this._openTradingPairScreen();
    }

    _openTradingPairScreen = () => {
        let tradingPair = this.props.tradingPair;
        this.props.navigation.navigate('TradingPair', {
            baseKoreanName: tradingPair.base_korean_name,
            tradingPairName: tradingPair.name
        });
    }

    render() {
        const tradingPairStore = this.props.tradingPairStore;
        const tradingPair = this.props.tradingPair;
        const tokenNameForSelectedLanguage = tradingPairStore.languageForTokenName === 'ko' ?
            tradingPair['base_korean_name'] :
            tradingPair['base_english_name'];

        return (
            <TouchableOpacity
                style={styles.container}
                onPress={this._onPressTradingPairRow}
            >
                <View style={this.props.columStyles[0]}>
                    <Text>
                        {tokenNameForSelectedLanguage + ' ' + tradingPair.name}
                    </Text>
                </View>
                {
                    tradingPairStore.sorts.map((sort, index) => (
                        this.props.columStyles[index + 1] ?
                            <View key={sort.name} style={this.props.columStyles[index + 1]}>
                                <Text>{tradingPair[sort.name]}</Text>
                            </View>
                            :
                            null
                    ))
                }
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        height: 30,
        flexDirection: 'row'
    }
})
export default TradingPairRow;
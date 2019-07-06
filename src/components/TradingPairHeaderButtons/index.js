import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { inject, observer } from 'mobx-react';
import commonStyle from '../../styles/commonStyle';
import * as Icon from '@expo/vector-icons';
// https://expo.github.io/vector-icons/
@inject('tradingPairStore', 'commonStore')
@observer
export default class TradingPairHeaderButtons extends Component {

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => {
                        this.props.commonStore.toggleFavoriteTradingPair(this.props.tradingPairStore.selectedTradingPairName);
                    }}
                >
                    {
                        this.props.tradingPairStore.selectedTradingPair
                        && this.props.tradingPairStore.selectedTradingPair.isFavorite
                        ? <Icon.FontAwesome
                            name="star"
                            size={21} color={commonStyle.color.brandBlue}
                            // style={styles.favoriteIcon}
                        />
                        : <Icon.FontAwesome
                            name="star-o"
                            size={21} color={commonStyle.color.brandBlue}
                            // style={styles.favoriteIcon}
                        />
                        
                    }
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    }
});
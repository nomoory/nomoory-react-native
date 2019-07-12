import React, { Component } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { inject, observer } from 'mobx-react';
import TradingPairSearchBar from './TradingPairSearchBar';
import AccountStatus from './AccountStatus';
import TradingPairTable from './TradingPairTable';
import QuoteTab from './QuoteTab';
import { TouchableOpacity } from 'react-native-gesture-handler';
import commonStyle from '../../styles/commonStyle';
import * as Icon from '@expo/vector-icons';

@inject('tradingPairStore')
@observer
export default class TradingPairBox extends Component {
    _onPressFavoriteOnly = () => {
        this.props.tradingPairStore.toggleFavorite();
    }

    render() {
        return (
            <View style={styles.container}>
                <TradingPairSearchBar />
                <AccountStatus />
                <View 
                    style={styles.filterContainer}
                >
                    <QuoteTab />

                    <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={this._onPressFavoriteOnly}
                    >
                        {
                            this.props.tradingPairStore.favoriteOnly
                            ? <Icon.FontAwesome
                                name="star"
                                size={18} color={commonStyle.color.brandBlue}
                                // style={styles.favoriteIcon}
                            />
                            : <Icon.FontAwesome
                                name="star-o"
                                size={18} color={commonStyle.color.brandBlue}
                                // style={styles.favoriteIcon}
                            />
                        }
                    </TouchableOpacity>

                </View>
                <View style={styles.tradingPairTableContainer}>
                    <TradingPairTable />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tradingPairTableContainer: {
        flex: 1
    },
    filterContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 10,
    },
    favoriteButton: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    favoriteText: {
        color: 'black',
        fontWeight: '400',
        fontSize: 13,
        marginLeft: 4,
    },
});
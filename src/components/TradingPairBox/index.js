import React, { Component } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { inject, observer } from 'mobx-react';
import TradingPairSearchBar from './TradingPairSearchBar';
import AccountStatus from './AccountStatus';
import TradingPairTable from './TradingPairTable';
import QuoteTab from './QuoteTab';
import { TouchableOpacity } from 'react-native-gesture-handler';
import commonStyle from '../../styles/commonStyle';

@inject('tradingPairStore')
@observer
export default class TradingPairBox extends Component {
    _onPressFavoriteOnly = () => {
        this.props.tradingPairStore.toggleFavorite();
    }

    render() {
        const checkBackgroundStyle = 
            this.props.tradingPairStore.favoriteOnly
            ? styles.checked
            : styles.unchecked;

        console.log(`${Expo.Constants.manifest.extra.REACT_APP_ASSET_ORIGIN}/commons/check-small.png` )
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
                        <View
                            style={[styles.check, checkBackgroundStyle]}
                        >
                            <Image
                                style={{ width: 10, height: 8 }}
                                source={require(`../../../assets/images/commons/check-small.png`)
                                }
                            />
                        </View>
                        <Text 
                            style={styles.favoriteText}
                        >
                            관심
                        </Text>
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
    },
    check: {
        borderRadius: 50,
        width: 16,
        height: 16,
        borderWidth: 1.4,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 4,
    },
    checked: {
        backgroundColor: commonStyle.color.brandBlue,
        borderColor: commonStyle.color.brandBlue,
    },
    unchecked: {
        backgroundColor: 'white',
        borderColor: '#acacac',
    }
});
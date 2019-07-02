import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator, Image } from 'react-native';
import { inject, observer } from 'mobx-react';
import commonStyle from '../styles/commonStyle';
import * as SecureStore from 'expo-secure-store';
import { withNavigation } from 'react-navigation';

@withNavigation
@inject('userStore', 'authStore', 'orderFeeStore', 'tradingPairStore')
@observer
export default class InitialLoadScreen extends Component {
    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        this.props.orderFeeStore.loadOrderFee();

        let accessToken = await SecureStore.getItemAsync('access_token');
        let userUuid = await SecureStore.getItemAsync('user_uuid');
        if (accessToken) {
            try {
                this.props.authStore.setAccessTokenOnStore(accessToken);
                this.props.authStore.setUserUuidOnStore(userUuid);
                await this.props.userStore.loadUser(userUuid);
            } catch (err) {
                this.props.authStore.destroyAccessToken();
            }
        }

        this._moveToExchangeScreen();
    }

    _moveToExchangeScreen = () => {
        this.props.navigation.navigate('Exchange');
        // this._onPressTradingPairRow();
    }

    _onPressTradingPairRow = () => {
        this.props.tradingPairStore.setSelectedTradingPairName('BTC-KRW');
        let tradingPair = this.props.tradingPairStore.selectedTradingPair;
        this._openTradingPairScreen(tradingPair);
    }

    _openTradingPairScreen = (tradingPair) => {
        this.props.navigation.navigate('TradingPair', {
            baseName: this.props.tradingPairStore.languageForTokenName === 'ko' ? tradingPair.base_korean_name : tradingPair.base_english_name,
            tradingPairName: tradingPair.name
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={[styles.logoContainer]}>
                    <Image
                        style={{
                            width: '100%',
                            resizeMode: 'contain'
                        }}
                        source={require('../../assets/splash_icon.png')}
                    />
                </View>
                <ActivityIndicator
                    style={[styles.loadingIndicator]}
                    size="large"
                    color={commonStyle.color.coblicPaleBlue}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: commonStyle.color.brandBlue,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%'
    },
    logoContainer: {
        width: '100%',
    },
    loadingIndicator: {
        position: 'absolute',
        bottom: 30,
    }
})
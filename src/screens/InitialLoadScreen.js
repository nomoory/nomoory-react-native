import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator, Image } from 'react-native';
import { inject, observer } from 'mobx-react';
import commonStyle from '../styles/commonStyle'
import { SecureStore } from 'expo';
import { withNavigation } from 'react-navigation';

@withNavigation
@inject('pubnub', 'userStore', 'authStore', 'orderFeeStore', 'tradingPairStore')
@observer
export default class InitialLoadScreen extends Component {
    ticker_pubnub_channel = 'TEMP|TICKER';
    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        // 거의 모든 페이지에서 trading pair의 close pirce를 참조하기에 실시간 변동을 위해 subscribe 함
        this.props.pubnub.subscribe(this.ticker_pubnub_channel);
        await this.props.orderFeeStore.loadOrderFee();
        // await this.props.tradingPairStore.loadTradingPairs();
        let accessToken = await SecureStore.getItemAsync('access_token');
        let userUuid = await SecureStore.getItemAsync('user_uuid');
        if (accessToken) { 
            await this.props.userStore.loadUser(userUuid);
        }

        // if (!this.props.userStore.isLoggedIn) { await this.props.authStore.login(); } 

        this._moveToMainStack();
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={[styles.logoContainer]}>
                    <Image
                        style={{width: '100%', resizeMode: 'contain'}}
                        source={require('../../assets/splash_icon.png')}
                    />
                </View>
                <ActivityIndicator style={[styles.loadingIndicator]}size="large" color={commonStyle.color.coblicPaleBlue}/>
            </View>
        )            
    }

    _moveToMainStack = () => {
        this.props.navigation.navigate('Exchange');
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: commonStyle.color.coblicBlue,
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

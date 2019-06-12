import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator, Image } from 'react-native';
import { inject, observer } from 'mobx-react';
import commonStyle from '../styles/commonStyle';
import { SecureStore } from 'expo';
import { withNavigation } from 'react-navigation';

@withNavigation
@inject('userStore', 'authStore', 'orderFeeStore', 'tradingPairStore')
@observer
export default class InitialLoadScreen extends Component {
    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        await this.props.orderFeeStore.loadOrderFee(); 

        // await this.props.tradingPairStore.loadTradingPairs();
        let accessToken = await SecureStore.getItemAsync('access_token');
        let userUuid = await SecureStore.getItemAsync('user_uuid');
        if (accessToken) { 
            try {
                await this.props.userStore.loadUser(userUuid);                
            } catch (err) {
                this.props.authStore.destroyAccessToken();
            }
        }
        
        this._moveToExchangeScreen();
    }

    _moveToExchangeScreen = () => {
        this.props.navigation.navigate('Exchange');
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

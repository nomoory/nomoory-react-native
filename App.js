import './init';
import React from 'react';
import { StyleSheet, View, StatusBar, Platform, AppState } from 'react-native';
import { Provider } from 'mobx-react';
import stores from './src/stores';
import AppNavigator from './src/navigation/AppNavigator';
import CommonModal from './src/components/CommonModal';
import CustomModal from './src/components/CustomModal';

import { enableLogging } from 'mobx-logger';
import { reaction } from 'mobx';

import NavigationService from './src/utils/NavigationService';


enableLogging({
    predicate: () => __DEV__ && Boolean(window.navigator.userAgent),
    action: __DEV__ && Boolean(window.navigator.userAgent),
    reaction: __DEV__ && Boolean(window.navigator.userAgent),
    transaction: __DEV__ && Boolean(window.navigator.userAgent),
    compute: __DEV__ && Boolean(window.navigator.userAgent)
});

export default class App extends React.Component {
    state = {
      appState: AppState.currentState,
    };

    constructor(props) {
        super(props);
        
        // 필수로 load하고 subscribe 해야 할 데이터 처리
        stores.socketStore.loadAndSubscribeOnInit();
        // 유저에 따라 load하고 subscribe 해야 할 데이터 처리
        const login_reaction = reaction(
            () => stores.userStore.isLoggedIn,
            isLoggedIn => {
                if (isLoggedIn) {
                    stores.socketStore.authenticateOnUserChange();
                    stores.socketStore.loadAndSubscribeOnLogin();
                } else {
                    stores.socketStore.unsubscribeOnLogout();
                }
            }
        );

        // 선택된 trading pair에 따라 load하고 subscribe 해야 할 데이터 처리
        const subscribe_reaction_on_tradingpair_change = reaction(
            () => stores.tradingPairStore.selectedTradingPairName,
            (tradingPairName) => {
                stores.socketStore.loadAndSubscribeOnTradingPairChange();
                if (tradingPairName) {
                    stores.placedOrderHistoryStore.loadPersonalOrders(tradingPairName);
                }
                stores.orderStore.setOrderValueByTradingPair(stores.tradingPairStore.selectedTradingPair || {});
            }
        );
    }

    _reloadAndResubscribeOnBackToForeground() {
        stores.socketStore.loadAndSubscribeOnInit();

        if (stores.userStore.isLoggedIn) {
            stores.socketStore.authenticateOnUserChange();
            stores.socketStore.loadAndSubscribeOnLogin();
        }

        stores.socketStore.loadAndSubscribeOnTradingPairChange();
        if (stores.tradingPairStore.selectedTradingPairName) {
            stores.placedOrderHistoryStore.loadPersonalOrders(stores.tradingPairStore.selectedTradingPairName);
        }
        stores.orderStore.setOrderValueByTradingPair(stores.tradingPairStore.selectedTradingPair || {});
    }

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState) => {
        if (
            this.state.appState.match(/inactive|background/) &&
            nextAppState === 'active'
        ) {
            console.log('App has come to the foreground!');
            this._reloadAndResubscribeOnBackToForeground();
        }
        this.setState({ appState: nextAppState });
    };


    render() {
        return (
            <Provider
                {...stores}
            >
                <View style={styles.container}>
                    {typeof Platform && Platform.OS === 'ios' && <StatusBar barStyle="default" />}
                    <AppNavigator
                        ref={navigatorRef => {
                            NavigationService.setTopLevelNavigator(navigatorRef);
                        }}
                    />
                    <CommonModal />
                    <CustomModal />
                </View>
            </Provider>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
import './init';
import React from 'react';
import { StyleSheet, View, StatusBar, Platform } from 'react-native';
import { Provider } from 'mobx-react';
import stores from './src/stores';
import AppNavigator from './src/navigation/AppNavigator';
import CommonModal from './src/components/CommonModal';

import { enableLogging } from 'mobx-logger';
import { observable, reaction } from 'mobx';

enableLogging({
    predicate: () => __DEV__ && Boolean(window.navigator.userAgent),
    action: __DEV__ && Boolean(window.navigator.userAgent),
    reaction: __DEV__ && Boolean(window.navigator.userAgent),
    transaction: __DEV__ && Boolean(window.navigator.userAgent),
    compute: __DEV__ && Boolean(window.navigator.userAgent)
});

export default class App extends React.Component {
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
            }
        );
    }
    render() {
        return (
            <Provider
                {...stores}
            >
                <View style={styles.container}>
                    {typeof Platform && Platform.OS === 'ios' && <StatusBar barStyle="default" />}
                    <AppNavigator />
                    <CommonModal />
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

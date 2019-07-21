import './init';
import React from 'react';
import {
    Notifications,
    // NetInfo,
} from 'expo';
import {
    StyleSheet,
    View,
    StatusBar,
    Platform,
    AppState,
    NetInfo
} from 'react-native';
import { Provider } from 'mobx-react';
import stores from './src/stores';
import AppNavigator from './src/navigation/AppNavigator';
import CommonModal from './src/components/CommonModal';
import CustomModal from './src/components/CustomModal';
// import NetInfo from "@react-native-community/netinfo";
import { reaction } from 'mobx';
import Sentry from './src/utils/Sentry';

// SEE event source for chat
// https://www.npmjs.com/package/react-native-event-source
import RNEventSource from 'react-native-event-source';

// push notification
import NavigationService from './src/utils/NavigationService';
import { registerForPushNotificationsAsync } from './src/utils/pushHelper';

// import { enableLogging } from 'mobx-logger';
// enableLogging({
//     predicate: () => __DEV__ && Boolean(window.navigator.userAgent),
//     action: __DEV__ && Boolean(window.navigator.userAgent),
//     reaction: __DEV__ && Boolean(window.navigator.userAgent),
//     transaction: __DEV__ && Boolean(window.navigator.userAgent),
//     compute: __DEV__ && Boolean(window.navigator.userAgent)
// });

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
            async (isLoggedIn) => {
                if (isLoggedIn) {
                    stores.socketStore.authenticateOnUserChange();
                    stores.socketStore.loadAndSubscribeOnLogin();
                    Sentry.setUser(stores.userStore.currentUser);
                    await this._enrollPushNitification();
                } else {
                    stores.socketStore.unsubscribeOnLogout();
                }
            }
        );

        // 로드된 trading pair List를 바탕으로 따라 load하고 subscribe 해야 할 데이터 처리
        const subscribe_reaction_on_tradingpair_loaded = reaction(
            () => stores.tradingPairStore.tradingPairLoaded,
            (tradingPairLoaded) => {
                if (tradingPairLoaded) {
                    stores.socketStore.addListenersForAllOrderbookChannels();
                    console.log('[TEST] subscribe_reaction_on_tradingpair_loaded')
                    stores.socketStore.loadAndSubscribeOrderbooksAfterTradingPairLoaded();
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


    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
        this._enrollChatConnection();

        NetInfo.addEventListener('connectionChange', this._handleInternetConnection);
    }

    _handleInternetConnection = (state) => {
        const {
            effectiveType, // ex. 4g
            type, // ex. cellular
        } = state;

        if (['none', 'unknow'].includes(type) || !type) {
            alert(`네트워크에 연결되어있지 않습니다. (${type})`);
        } else {
            if (this.reloadSetTimeout) clearTimeout(this.reloadSetTimeout);
            this.reloadSetTimeout = setTimeout(() => {
                this._reloadAndResubscribeOnBackToForeground();
            }, 0);
        }
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
        this._closeAllChatConnection();

        NetInfo.removeEventListener(
            'connectionChange',
            this._handleInternetConnection,
        );
    }

    _enrollChatConnection() {
        const options = {}; //{ headers: { Authorization: 'Bearer ...' } };

        if (this.eventSource) {
            this.eventSource.removeAllListeners();
            this.eventSource.close();
        }

        this.eventSource = new RNEventSource(
            `${Expo.Constants.manifest.extra.RAZZLE_CHATTING_API_ENDPOINT}/stream`
            // , options
        );

        stores.chatStore.loadMessages();

        this.eventSource.addEventListener('message', (event) => {
            const { type, data } = event;
            // 이미 있는 채팅에 새로 받은 메시지 추가
            const newMessages = [JSON.parse(data)];
            stores.chatStore.appendMessage(newMessages);
        });

        this.eventSource.addEventListener('error', (event) => {
            const { type, data } = event;
            // 에러 발생시 연결을 끊고 다시 리스너 등록합니다.
            this._enrollChatConnection();
        });
    }

    _closeAllChatConnection() {
        this.eventSource.removeAllListeners();
        this.eventSource.close();
    }

    _enrollPushNitification = async () => {
        await registerForPushNotificationsAsync();
        // this._notificationSubscription = Notifications.addListener(this._handleNotification);
    }

    _handleNotification = (notification) => {
        console.log("notification: ");
        console.log({ notification });
        switch (notification.oigin) {
            case 'received': { // app is open and foegrounded
                console.log('received');
                break;
            }
            case 'selected': { // app is not displayed(both background or not opened) and notification selected
                console.log('selected');
                break;
            }
            default: { // 아이콘을 눌러 열렸거나, 백그라운드에 있는데 notificaion 클릭 안했을 경우
                console.log('not selected, not received');
                break;
            }
        }
    };

    _handleAppStateChange = (nextAppState) => {
        if (
            this.state.appState.match(/inactive|background/) &&
            nextAppState === 'active'
        ) {
            console.log('App has come to the foreground!');
            // NetInfo.getConnectionInfo().then(this._handleInternetConnection);
        }
        this.setState({ appState: nextAppState });
    };

    _reloadAndResubscribeOnBackToForeground = async () => {
        await stores.socketStore.loadAndSubscribeOnInit();
        stores.socketStore.loadAndSubscribeOrderbooksAfterTradingPairLoaded();
        
        if (stores.userStore.isLoggedIn) {
            stores.socketStore.authenticateOnUserChange();
            stores.socketStore.loadAndSubscribeOnLogin();
        }

        if (stores.tradingPairStore.selectedTradingPairName) {
            stores.socketStore.loadAndSubscribeOnTradingPairChange();
            stores.placedOrderHistoryStore.loadPersonalOrders(stores.tradingPairStore.selectedTradingPairName);
        }
        stores.orderStore.setOrderValueByTradingPair(stores.tradingPairStore.selectedTradingPair || {});
    }

    render() {
        return (
            <Provider
                {...stores}
            >
                <View
                    style={styles.container}
                >
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
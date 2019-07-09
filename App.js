import './init';
import React from 'react';
import {
    Notifications,
} from 'expo';
import {
    StyleSheet,
    View,
    StatusBar,
    Platform,
    AppState,
    YellowBox
} from 'react-native';
import { Provider } from 'mobx-react';
import stores from './src/stores';
import AppNavigator from './src/navigation/AppNavigator';
import CommonModal from './src/components/CommonModal';
import CustomModal from './src/components/CustomModal';

import { reaction } from 'mobx';

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

YellowBox.ignoreWarnings(['Remote debugger']);

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
                    this._enrollPushNitification();
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

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
        this._enrollChatConnection();
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
        this._closeAllChatConnection();
    }

    _enrollChatConnection() {
        const options = {}; //{ headers: { Authorization: 'Bearer ...' } };
        this.eventSource = new RNEventSource(`${Expo.Constants.manifest.extra.REACT_APP_DEV_API_ENDPOINT}/stream`, options);

        this.eventSource.addEventListener('onopen', (event) => {
            const { type, data } = event;
            // 이전 채팅 데이터 불러옴
            stores.chatStore.loadMessages();
          });

        this.eventSource.addEventListener('message', (event) => {
            const { type, data } = event;

            // 이미 있는 채팅에 새로 받은 메시지 추가
            const newMessages = [];
            stores.chatStore.appendMessage(newMessages);
          });

        this.eventSource.addEventListener('onerror', (event) => {
            const { type, data } = event;
            // 일단 사용하지 않음
            console.log('error on chatting');
            console.log({ type, data });
          });
    }
    _closeAllChatConnection() {
        this.eventSource.removeAllListeners();
        this.eventSource.close();
    }

    _enrollPushNitification = () => {
        // registerForPushNotificationsAsync();
        this._notificationSubscription = Notifications.addListener(this._handleNotification);
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
            this._reloadAndResubscribeOnBackToForeground();
        }
        this.setState({ appState: nextAppState });
    };

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
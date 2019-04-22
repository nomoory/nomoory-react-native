import './init';
import React from 'react';
import { StyleSheet, View, StatusBar, Platform } from 'react-native';
import { Provider } from 'mobx-react';
import stores from './src/stores';
import AppNavigator from './src/navigation/AppNavigator';
import Pubnub from './src/utils/Pubnub';
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
const pubnub = new Pubnub(this, stores);

export default class App extends React.Component {
    @observable order_pubnub_channel = null;
    @observable accuount_pubnub_channel = null;
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

        // // 유저가 등록되면 ORDER pubnub을 subscribe함
        // // ORDER: 주문의 발생으로 인한 알림이 언제나 떠야하기에 아래의 reaction을 넣음
        // // ACCOUNT: 내 계좌의 입출금 정보는 항상 최신 사항을 반영해야하며, 투자와 입출금 페이지 및 거래소에서도 사용되므로 항상 subscribe 하게함
        // // pubnub을 호출하려면 component에서 가능하기에 store에서 실행하지 않음
        // let loginReaction = reaction(
        //     () => stores.userStore.currentUser,
        //     currentUser => {
        //         if (currentUser) {
        //             this.order_pubnub_channel = `ORDER_${currentUser.personal_pubnub_uuid}`;
        //             pubnub.subscribe(this.order_pubnub_channel);
        //             this.accuount_pubnub_channel = `ACCOUNT_${currentUser.personal_pubnub_uuid}`;
        //             pubnub.subscribe(this.accuount_pubnub_channel);
        //         } else {
        //             if (this.order_pubnub_channel) {
        //                 pubnub.unsubscribe(this.order_pubnub_channel);
        //             }
        //             if (this.accuount_pubnub_channel) {
        //                 pubnub.unsubscribe(this.accuount_pubnub_channel);
        //             }
        //         }
        //     }
        // );

        // if (stores.userStore.currentUser) {
        //     if (this.order_pubnub_channel) {
        //         pubnub.unsubscribe(this.order_pubnub_channel);
        //     }
        //     if (this.accuount_pubnub_channel) {
        //         pubnub.unsubscribe(this.accuount_pubnub_channel);
        //     }            
        //     this.order_pubnub_channel = `ORDER_${currentUser.personal_pubnub_uuid}`;
        //     pubnub.subscribe(this.order_pubnub_channel);
        //     this.accuount_pubnub_channel = `ACCOUNT_${currentUser.personal_pubnub_uuid}`; 
        //     pubnub.subscribe(this.accuount_pubnub_channel);
        // }
    }
    render() {
        return (
            <Provider
                {...stores}
                pubnub={pubnub}
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

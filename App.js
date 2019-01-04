import './init';
import React from 'react';
import { StyleSheet, View, StatusBar, Platform } from 'react-native';
import { Provider } from 'mobx-react';
import stores from './src/stores';
import AppNavigator from './src/navigation/AppNavigator';
import Pubnub from './src/utils/Pubnub';
import CommonModal from './src/components/CommonModal';

import { StyleProvider } from 'native-base';
import getTheme from './src/global/styles/native-base-theme/components';
import commonColor from './src/global/styles/native-base-theme/variables/commonColor';
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
    }

    async componentDidMount() {
        console.log('tests');
        // 유저가 등록되면 ORDER pubnub을 subscribe함

        // ORDER: 주문의 발생으로 인한 알림이 언제나 떠야하기에 아래의 reaction을 넣음
        // ACCOUNT: 내 계좌의 입출금 정보는 항상 최신 사항을 반영해야하며, 투자와 입출금 페이지 및 거래소에서도 사용되므로 항상 subscribe 하게함
        // pubnub을 호출하려면 component에서 가능하기에 store에서 실행하지 않음
        let loginReaction = reaction(
            () => stores.userStore.isLoggedIn,
            isLoggedIn => {
                if (isLoggedIn) {
                    // pubnub 모듈에서 channel 명 뒤에 login user의 pubnub uuid를 뒤에 붙여줌
                    this.order_pubnub_channel = `ORDER`;
                    pubnub.subscribe(this.order_pubnub_channel);
                    // Pubnub에서 unsubscribe 하기 위함
                    this.order_pubnub_channel = `ORDER_${stores.userStore.currentUser.personal_pubnub_uuid}`; 

                    // pubnub 모듈에서 channel 명 뒤에 login user의 pubnub uuid를 뒤에 붙여줌
                    this.accuount_pubnub_channel = `ACCOUNT`;
                    pubnub.subscribe(this.accuount_pubnub_channel);
                    // Pubnub에서 unsubscribe 하기 위함
                    this.accuount_pubnub_channel = `ACCOUNT_${stores.userStore.currentUser.personal_pubnub_uuid}`; 
                } else {
                    if (this.order_pubnub_channel) {
                        pubnub.unsubscribe(this.order_pubnub_channel);
                    }
                    if (this.accuount_pubnub_channel) {
                        pubnub.unsubscribe(this.accuount_pubnub_channel);
                    }
                }
            }
        );
        
        // 거의 모든 페이지에서 trading pair의 close pirce를 참조하기에 실시간 변동을 위해 subscribe 함
        this.ticker_pubnub_channel = 'TEMP|TICKER';
        pubnub.subscribe(this.ticker_pubnub_channel);
        
        if (stores.commonStore.token) {
            await stores.userStore.loadUser();
        }

        stores.orderFeeStore.loadOrderFee();
        stores.commonStore.setAppLoaded(true);
        await stores.tradingPairStore.loadTradingPairs();
        // await stores.accountStore.loadAccounts();

        // TODO test 후 지우기
        stores.authStore.login();
    }
    render() {
        return (
            <StyleProvider style={getTheme(commonColor)}>
                <Provider
                    {...stores}
                    pubnub={pubnub}
                >
                    <View style={styles.container}>
                        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
                        <AppNavigator />
                        <CommonModal />
                    </View>
                </Provider>
            </StyleProvider>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

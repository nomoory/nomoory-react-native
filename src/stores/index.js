import accountStore from './accountStore';
import authStore from './authStore';
import commonStore from './commonStore';
import modalStore from './modalStore';
import orderStore from './orderStore';
import orderbookStore from './orderbookStore';
import tradingPairStore from './tradingPairStore';
import userStore from './userStore';
import orderFeeStore from './orderFeeStore';
import cryptoWithdrawStore from './cryptoWithdrawStore';
import realtimeTradeHistoryStore from './realtimeTradeHistoryStore';
import personalOrderHistoryStore from './personalOrderHistoryStore';
import WhitelistedWithdrawalWalletAddressStore from './WhitelistedWithdrawalWalletAddressStore';

const stores = {
    accountStore,
    authStore,
    commonStore,
    modalStore,
    orderStore,
    orderbookStore,
    tradingPairStore,
    userStore,
    orderFeeStore,
    cryptoWithdrawStore,
    realtimeTradeHistoryStore,
    personalOrderHistoryStore,
    WhitelistedWithdrawalWalletAddressStore
};

export default stores;
import accountStore from './accountStore';
import authStore from './authStore';
import modalStore from './modalStore';
import orderStore from './orderStore';
import orderbookStore from './orderbookStore';
import tradingPairStore from './tradingPairStore';
import userStore from './userStore';
import orderFeeStore from './orderFeeStore';
import cryptoWithdrawStore from './cryptoWithdrawStore';
import realtimeTradeHistoryStore from './realtimeTradeHistoryStore';
// import personalOrderHistoryStore from './personalOrderHistoryStore';
import whitelistedWithdrawalWalletAddressStore from './whitelistedWithdrawalWalletAddressStore';
import transactionHistoryStore from './transactionHistoryStore';
import socketStore from './socketStore';
import placedOrderHistoryStore from './placedOrderHistoryStore';
import dailyTradeHistoryStore from './dailyTradeHistoryStore';

const stores = {
    accountStore,
    authStore,
    modalStore,
    orderStore,
    orderbookStore,
    tradingPairStore,
    userStore,
    orderFeeStore,
    cryptoWithdrawStore,
    realtimeTradeHistoryStore,
    // personalOrderHistoryStore,
    whitelistedWithdrawalWalletAddressStore,
    transactionHistoryStore,
    socketStore,
    placedOrderHistoryStore,
    dailyTradeHistoryStore,
};

export default stores;
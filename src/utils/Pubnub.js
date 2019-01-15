import PubNubReact from 'pubnub-react';

import userStore from '../stores/userStore';
import accountStore from '../stores/accountStore';
import tradingPairStore from '../stores/tradingPairStore';
import orderbookStore from '../stores/orderbookStore';
import realtimeTradeHistoryStore from '../stores/realtimeTradeHistoryStore';
import personalOrderHistoryStore from '../stores/personalOrderHistoryStore';
// import coblicTokenStatusStore from '../stores/coblicTokenStatusStore';
// import dividendStore from '../stores/dividendStore';

export default class Pubnub {
    constructor(container, stores) {
        this.pubnub = new PubNubReact({
            subscribeKey:
                __DEV__ ? 
                Expo.Constants.manifest.extra.REACT_APP_DEV_PUBNUB_SUBSCRIBE_KEY :
                Expo.Constants.manifest.extra.REACT_APP_PUBNUB_SUBSCRIBE_KEY
        });
        this.stores = stores;
        this._addListenerToUpdateStoreOnReceiveMessage();
        this.pubnub.init(container);
        this.subscribeCounts = {}; // channelName: count
    }

    /* 
     * 이곳에 등록되는 channel이 message를 받았을 때 수행되길 원하는 
     * store의 action을 호출하면 됩니다.
     */
    _onReceiveMessage = (msg) => {
        let [channelScope, identifier] = this._retrieveTypeAndIdentifierFromChannelName(msg.channel);
        let message = msg.message;
        // store에 업데이트 시 method에 identification을 넘깁니다.
        // store에서 UUID와 authStore를 비교하여 업데이트 할지 여부를 결정합니다.
        console.log('channelScope',channelScope)
        console.log('msg',msg)
        switch (channelScope) {
            case 'ORDERBOOK':
                orderbookStore.setOrderbook(message);
                break;
            // case 'TICKER':
            //     tradingPairStore.updateTickerInTradingPair(message);
            //     break;            
            case 'TEMP|TICKER':
                tradingPairStore.updateTickerInTradingPair(message);
                break;
            case 'ORDER':
                message.forEach((personalOrder) => {
                    this._handleOrderByStatus(personalOrder);
                    personalOrderHistoryStore.setPersonalOrder(personalOrder);
                });
                break;
            case 'TRADE':
                realtimeTradeHistoryStore.setRealTimeTrades(message);
                break;
            case 'ACCOUNT':
                accountStore.setAccount(message);
                break;
            case 'CT':
                // coblicTokenStatusStore.setStatus(message);
                break;
            case 'SUMMARY':
                // coblicTokenStatusStore.setStatus(message);
                break;
            default:
                break;
        }
    }

    _handleOrderByStatus = (personalOrder) => {
        let { order_status, price, volume_filled, trading_pair_name } = personalOrder;
        let quoteSymbol = trading_pair_name.split('-')[1];
        switch (order_status) {
            case 'PENDING':
                // snackbarHelper.info(`성공적으로 주문을 등록하였습니다.`);
                break;
            case 'PLACED':
                // snackbarHelper.info(`성공적으로 주문을 등록하였습니다.`);
                break;
            case 'PARTIALLY_FILLED':
                // snackbarHelper.success(`일부 주문이 체결되었습니다.`);
                break;
            case 'REJECTED':
                // snackbarHelper.success(`요청하신 주문이 반려되었습니다.`);
                break;
            case 'COMPLETED':
                // snackbarHelper.success(`주문이 체결되었습니다.`);
                break;
            case 'CANCELLED':
                // snackbarHelper.success(`주문이 취소되었습니다.`);
                break;
            default:
                break;
        }
    }

    async _loadDataByChannel(channel) {
        let channelScope = channel.split('_')[0];
        if (!this.subscribeCounts[channel]) { // 이미 해당 채널을 구독하고 있으면 새로 데이터를 로드할 필요 없음
            switch (channelScope) {
                case 'ORDERBOOK':
                    await orderbookStore.loadOrderbook();
                    break;
                // case 'TICKER':
                //     tradingPairStore.loadTradingPairs();
                //     break;
                case 'TEMP|TICKER':
                    tradingPairStore.loadTradingPairs();
                    break;
                case 'ORDER':
                    personalOrderHistoryStore.load();
                    break;
                case 'TRADE':
                    realtimeTradeHistoryStore.load();
                    break;
                case 'ACCOUNT':
                    await accountStore.loadAccounts();
                    break;
                case 'CT':
                    // coblicTokenStatusStore.loadCoblicTokenStatus();
                    break;
                case 'SUMMARY':
                    // dividendStore.loadCurrentDividendRoundSummary();
                    break;
                default:
                    break;
            }
        }
    }

    _retrieveTypeAndIdentifierFromChannelName(channelName) {
        let channelScope = '';
        let identifier = '';

        let splitedChannelNames = channelName.split('_');

        /*
         * channel full name이 "채널범위_동적구분인자" 형태로 되어있지 않을 때 아래에 추가합니다.
         */
        if (splitedChannelNames[0] === 'TICKER') {
            channelScope = splitedChannelNames[0];
            identifier = null
        } else {
            [channelScope, identifier] = splitedChannelNames;
        }

        return [channelScope, identifier];
    }

    /* 
     * channel을 listen하고자하는 component에 pubnub을 @inject('pubsub')하고
     * componentDidMount this.pubnub.subscribe(channel);을
     * componentWillUnmount에 this.pubnub.subscribe(channel);을 호출합니다.
     */
    subscribe(channel) {
        this._loadDataByChannel(channel);
        this._addSubscribeCountOfChannel(channel);
        this.pubnub.subscribe({
            channels: [channel],
            withPresence: true
        });
    }

    unsubscribe(channel) {
        this._subtractSubscribeCountOnChannel(channel);
        if (this.subscribeCounts[channel] == 0) {
            this.pubnub.unsubscribe({
                channels: [channel]
            });
        }
    }

    _addSubscribeCountOfChannel(channel) {
        if (!this.subscribeCounts[channel]) {
            this.subscribeCounts[channel] = 1;
        } else {
            this.subscribeCounts[channel] += 1;
        }
    }

    _addListenerToUpdateStoreOnReceiveMessage() {
        this.pubnub.addListener({
            message: this._onReceiveMessage
        });
    }

    _subtractSubscribeCountOnChannel(channel) {
        if (!this.subscribeCounts[channel]) {
            this.subscribeCounts[channel] = 0;
        } else {
            this.subscribeCounts[channel] -= 1;
        }
    }
}

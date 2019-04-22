import { observable, action } from 'mobx';
import { Delibird } from '../utils/delibird';
import userStore from './userStore';
import placedOrderHistoryStore from './placedOrderHistoryStore';
import accountStore from './accountStore';
import orderbookStore from './orderbookStore';
import realtimeTradeHistoryStore from './realtimeTradeHistoryStore';
import tradingPairStore from './tradingPairStore';
import modalStore from './modalStore';
// import snackbarHelper from 'utils/snackbarHelper';
// import numberHelper from 'utils/numberHelper';
import Decimal from '../utils/decimal.js';

const WEBSOCKET_END_POINT = Expo.Constants.manifest.extra.WEBSOCKET_END_POINT;

const CHANNEL_NAMES = {
    // no dependency
    TICKER: 'TICKER', // trading pairs
    SUMMARY: 'SUMMARY',

    // depends on selected trading pair
    ORDERBOOK: 'ORDERBOOK',
    TRADE: 'TRADE',

    // depends on user
    ORDER: 'ORDER',
    ACCOUNT: 'ACCOUNT',
};

class SocketStore {
    @observable errors = undefined;
    @observable LoadValues = {
        isFirstLoad: true,
        isLoading: false,
        nextUrl: null
    }
    constructor() {
        try {
            this.delibird = new Delibird(WEBSOCKET_END_POINT);
            this.delibird.connect();
            this.addListenersForAllChannels();
    
            // delibird test를 위해 global에 등록합니다.
            window.getSubscribedList = this.delibird.subscribedList;   
            window.delibird = this.delibird;   
        } catch (err) {
            try {
                modalStore.openError({
                    title: '소켓 연결 실패',
                    content: '실시간 데이터가 반영되지 않습니다. 새로고침 해주세요.'
                })    
            } catch (err) {

            }
            console.log(err);
            this.delibird = null;
        }
    }

    async loadAndSubscribeOnInit() {
        console.log(`%cLoadAndSubscribeOnInit`, "color: blue; font-size:15px;");
        try {
            const targetChannels = [ CHANNEL_NAMES.TICKER, CHANNEL_NAMES.SUMMARY ]

            for (let targetChannel of targetChannels) {
                await this._loadDataByChannel(targetChannel);
                this.delibird.subscribe(targetChannel);
                console.log(`%cSubscribe: ${targetChannel}`, "color: blue; font-size:15px;");
            }    
        } catch (err) {
            console.log('fail to load and subscribe initial channel.')
        }
    }


    async loadAndSubscribeOnTradingPairChange() {
        console.log(`%cLoadAndSubscribeOnTradingPairChange`, "color: blue; font-size:15px;");
        try {
            const targetChannels = [ CHANNEL_NAMES.ORDERBOOK, CHANNEL_NAMES.TRADE ]
            if (tradingPairStore.selectedTradingPairName) {
                for (let targetChannel of targetChannels) {
                    let specificTargetChannel = targetChannel + '_' + tradingPairStore.selectedTradingPairName;
                    await this._loadDataByChannel(targetChannel);
                    let subscribedList = this.delibird.subscribedList();
                    for (let subscribed of subscribedList) {
                        if (typeof subscribed === 'string' && (-1 < subscribed.indexOf(targetChannel.split('_')[0])) ) {
                            this.delibird.unSubscribe(subscribed);
                        }
                    }
                    // this.delibird.unSubscribe(targetChannel + '.*');
                    console.log(`%cUnsubscribe: All ${targetChannel} ${tradingPairStore.selectedTradingPairName}`, "color: blue; font-size:15px;");
                    this.delibird.subscribe(specificTargetChannel);
                    console.log(`%cSubscribe: ${targetChannel} ${tradingPairStore.selectedTradingPairName}`, "color: blue; font-size:15px;");
                }
            }    
        } catch (err) {
            console.log('fail to load and subscribe channel related to the trading pair.')
        }
    }


    async loadAndSubscribeOnLogin() {
        console.log(`%cLoadAndSubscribeOnLogin`, "color: blue; font-size:15px;");
        try {
            const targetChannels = [ CHANNEL_NAMES.ORDER, CHANNEL_NAMES.ACCOUNT ]
            if (userStore.isLoggedIn) {
                this.authenticateOnUserChange();
                for (let targetChannel of targetChannels) {
                    await this._loadDataByChannel(targetChannel);
                    // this.delibird.unSubscribe(targetChannel);
                    console.log(`%cUnSubscribe: ${targetChannel}`, "color: blue; font-size:15px;");
                    this.delibird.subscribe(targetChannel);
                    console.log(`%cSubscribe: ${targetChannel}`, "color: blue; font-size:15px;");
                }
            }
        } catch (err) {
            console.log('fail to load and subscribe channel related to login.')
        }
    }

    unsubscribeOnLogout() {
        console.log(`%cUnsubscribeOnLogout`, "color: blue; font-size:15px;");
        try {
            const targetChannels = [ CHANNEL_NAMES.ORDER, CHANNEL_NAMES.ACCOUNT ]
            for (let targetChannel of targetChannels) {
                console.log(`%cUnSubscribe: ${targetChannel}`, "color: blue; font-size:15px;");
                this.delibird.unSubscribe(targetChannel);
            }
        } catch (err) {
            console.log('fail to unsubscribe channel related to logout.')
        }
    }

    unsubscribeAll() {
        console.log(`%cUnsubscribeAll`, "color: blue; font-size:15px;");
        try {
            this.delibird.unSubscribeAll();
        } catch (err) {
            console.log('fail to unsubscribe all channel.')
        }
    }

    authenticateOnUserChange() {
        console.log(`%cAuthenticateOnUserChange: `, "color: blue; font-size:15px;");
        try {
            this.delibird.authenticate(userStore.currentUser.personal_pubnub_uuid);
            console.log(`%cAuthenticate: `, "color: blue; font-size:15px;");
            console.log({user: userStore.currentUser})
        } catch (err) {
            console.log('fail to authenticate.')
        }
    }
    
    async _loadDataByChannel(channel) {
        switch (channel) {
            case CHANNEL_NAMES.ORDERBOOK:
                await orderbookStore.loadOrderbook();
                break;
            case CHANNEL_NAMES.TICKER:
                tradingPairStore.loadTradingPairs();
                break;
            case CHANNEL_NAMES.ORDER:
                placedOrderHistoryStore.loadPersonalPlacedOrders();
                break;
            case CHANNEL_NAMES.TRADE:
                realtimeTradeHistoryStore.loadRealtimeTrades();
                break;
            case CHANNEL_NAMES.ACCOUNT:
                await accountStore.loadAccounts();
                break;
            default:
                break;
        }
    }

    _onReceiveMessage = (channel, data) => {
        console.log(data);
        switch (channel) {
            case CHANNEL_NAMES.ORDERBOOK:
                console.log(`%cReceived: ORDERBOOK`, "color: blue; font-size:15px;");
                orderbookStore.setOrderbook(data);
                break;
            case CHANNEL_NAMES.TICKER:
                console.log(`%cReceived: TICKER`, "color: blue; font-size:15px;");
                tradingPairStore.updateTickerInTradingPair(data);
                break;
            case CHANNEL_NAMES.ORDER:
                console.log(`%cReceived: ORDER`, "color: blue; font-size:15px;");
                data.forEach((personalOrder) => {
                    // this._handleOrderByStatus(personalOrder);
                    placedOrderHistoryStore.setPlacedOrder(personalOrder);
                });
                break;
            case CHANNEL_NAMES.TRADE:
                console.log(`%cReceived: TRADE`, "color: blue; font-size:15px;");
                realtimeTradeHistoryStore.setRealTimeTrades([data]);
                this._feedTradeToTradingView(data);
                break;
            case CHANNEL_NAMES.ACCOUNT:
                console.log(`%cReceived: ACCOUNT`, "color: blue; font-size:15px;");
                accountStore.setAccount(data);
                break;
            default:
                break;
        }
    }


    // _handleOrderByStatus = (personalOrder) => {
    //     let { order_status, price, volume_filled, trading_pair_name } = personalOrder;
    //     let quoteSymbol = trading_pair_name.split('-')[1];
    //     // let amount = numberHelper.getFixedPrice(Decimal(price).mul(volume_filled), quoteSymbol);

    //     switch (order_status) {
    //         case 'PENDING':
    //             // snackbarHelper.info(`성공적으로 주문을 등록하였습니다.`);
    //             break;
    //         case 'PLACED':
    //             snackbarHelper.info(`성공적으로 주문을 등록하였습니다.`);
    //             break;
    //         case 'PARTIALLY_FILLED':
    //             snackbarHelper.success(`일부 주문이 체결되었습니다.`);
    //             break;
    //         case 'REJECTED':
    //             snackbarHelper.success(`요청하신 주문이 반려되었습니다.`);
    //             break;
    //         case 'COMPLETED':
    //             snackbarHelper.success(`주문이 체결되었습니다.`);
    //             break;
    //         case 'CANCELLED':
    //             snackbarHelper.success(`주문이 취소되었습니다.`);
    //             break;
    //         default:
    //             break;
    //     }
    // }

    addListenersForAllChannels() {
        try {
            for(let channelName in CHANNEL_NAMES) {
                this._addListenerByChannelName(channelName);
            }    
        } catch (err) {
            console.log({ description: 'fail to addListeners for all channels', err });
        }
    }
    
    _addListenerByChannelName(channelName) {
        console.log('channel.' + channelName)
        let temp = (data) => {
                this._onReceiveMessage(channelName, data)
        }
        if (channelName == CHANNEL_NAMES.ORDERBOOK || channelName == CHANNEL_NAMES.TRADE) {
            this.delibird.on('channel.' + `${channelName}_*`, temp)
        } else {
            this.delibird.on('channel.' + channelName, temp)
        }
    }

    @observable subscribingChannelInfoForTradingView = null;
    @action setSubscribingChannelInfoForTradingView(subscribingChannelInfoForTradingView) {
        this.subscribingChannelInfoForTradingView = subscribingChannelInfoForTradingView;
    }
    
    @action _feedTradeToTradingView(trade) {
        console.log('_feedTradeToTradingView');
        console.log({trade, subscribingChannelInfoForTradingView: this.subscribingChannelInfoForTradingView});
        if (trade && this.subscribingChannelInfoForTradingView) {
            // 가장 최신 Candle 이전 Timeinterval의 Candle이 socket으로 도착한다면, disregard
            const lastTickerCreatedDateTime = new Date(trade.created).getTime();
            const { lastBar } = this.subscribingChannelInfoForTradingView || {};
            if (lastBar && lastTickerCreatedDateTime < lastBar.time) {
                return;
            }

            // 가장 최신 Ticker가 socket으로 잘 도착했다면 이를 바탕으로 Candle(lastBar)를 추가합니다.
            var newLastBar = this._getNewBarWithTrade(trade);
            console.log({lastBar, newLastBar});

            this.subscribingChannelInfoForTradingView.onRealtimeCallback(newLastBar);
            this.subscribingChannelInfoForTradingView.lastBar = newLastBar;
        }
    }

    _getNewBarWithTrade(trade) {
        var { lastBar, resolution: resolution_minute } = this.subscribingChannelInfoForTradingView;
        // resolution은 초단위임 ['1', ... 'D', 'W', 'M']
        let resolution_millisecond = null;
        if (resolution_minute.indexOf('D') != -1) {
            resolution_millisecond = 1000 * 60 * 60 * 24 ;
        } else if (resolution_minute.indexOf('W') != -1) {
            resolution_millisecond = 1000 * 60 * 60 * 24 * 7;
        } else if (resolution_minute.indexOf('M') != -1) {
            resolution_millisecond = 1000 * 60 * 60 * 24 * 7 * 30;
        } else {
            resolution_millisecond = resolution_minute * 60 * 1000;
        }

        // resolution 이하는 버림, 1분이라고 하면 1분 1초부터 1분 59초까지는 1분의 캔들 정보에 들어가게됨
        var roundedTradeCreatedAt =
            Math.floor(new Date(trade.created).getTime() / resolution_millisecond) * resolution_millisecond;

        lastBar = lastBar || {};
        if (roundedTradeCreatedAt == lastBar.time) { // 이전 resolution 적용된 시간과 같다면 같은 캔들에 포함됨
            lastBar = {
                time: roundedTradeCreatedAt,
                open: lastBar.open || Decimal(trade.price).toFixed(),
                high: Decimal(trade.price).greaterThan(lastBar.high || lastBar.close) ? Decimal(trade.price).toFixed() : lastBar.high,
                low: Decimal(trade.price).lessThan(lastBar.low || lastBar.close) ? Decimal(trade.price).toFixed() : lastBar.low,
                close: Decimal(trade.price).toFixed(),
                volume: Decimal(trade.volume).add(lastBar.volume).toFixed()
            };
        } else { // 새로운 lastbar
            lastBar = {
                time: roundedTradeCreatedAt,
                open: Decimal(trade.price).toFixed(),
                high: Decimal(trade.price).toFixed(),
                low: Decimal(trade.price).toFixed(),
                close: Decimal(trade.price).toFixed(),
                volume: Decimal(trade.volume).toFixed()
            };
        }
        return lastBar;
    }
}

export default new SocketStore();
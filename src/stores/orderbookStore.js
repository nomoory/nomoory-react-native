import {
    observable,
    action,
    computed,
    reaction
} from 'mobx';

import api from '../utils/api';
import tradingPairStore from './tradingPairStore';
import Helper from '../utils/Helper';

class OrderbookStore {
    @observable inProgress = false;
    @observable errors = null;

    @observable buyOrdersRegistry = observable.array();
    @observable sellOrdersRegistry = observable.array();
    @observable baseSymbolOfSelectedTradingPair = null;

    constructor() {
        /*
         * 선택한 trading pair가 변경될때마다 그에 맞는 orderbook을 load 합니다.
         */
        const selectedTradingPairNameReaction = reaction(
            () => tradingPairStore.selectedTradingPairName,
            (selectedTradingPairName) => {
                this.loadOrderbookByTradingPairName(selectedTradingPairName);
            }
        );
    }

    @computed get sellOrders() {
        let sellOrders = [];
        this.sellOrdersRegistry.forEach((sellOrder) => {
            sellOrders.unshift(this._reformatOrderForDisplay(sellOrder));
        });
        return sellOrders;
    };
    @computed get buyOrders() {
        let buyOrders = [];
        this.buyOrdersRegistry.forEach((buyOrder) => {
            buyOrders.push(this._reformatOrderForDisplay(buyOrder));
        });
        return buyOrders;
    };

    @action setOrderbook(orderbook) { // set by pubnub message
        const orders = orderbook.message;
        this._replaceOrderRegistries(orders);
    }
    @action loadOrderbookByTradingPairName(tradingPairName) {
        this.inProgress = true;
        this.errors = null;
        if (!tradingPairName) {
            throw new Error(
                'orderbookStore>loadOrderbook>No param tradingPairName'
            );
        }
        
        return api.getOrderbookByTradingPairName(tradingPairName)
        .then(action((response) => {
            const orders = response.data;
            this._replaceOrderRegistries(orders);
        }))
        .catch(action((err) => {
            this.errors = 
                err.response && 
                err.response.body && 
                err.response.body.errors;
        }))
        .then(action(() => {
            this.inProgress = false;
        }));
    }

    _reformatOrderForDisplay = (order) => (
        {
            // TODO fix it for formating
            price: Helper.getFixedPrice(order.price, this.baseSymbolOfSelectedTradingPair),
            volume: Helper.getFixed(order.volume, 3)
        }
    );

    _replaceOrderRegistries = (orders) => {
        this.sellOrdersRegistry.replace(orders.sells);
        this.buyOrdersRegistry.replace(orders.buys);
    }
}

export default new OrderbookStore();
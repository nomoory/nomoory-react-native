import {
    observable,
    action,
    computed,
    reaction
} from 'mobx';

import api from '../utils/api';
import stubData from './stubData';
import tradingPairStore from './tradingPairStore';

class OrderbookStore {
    @observable inProgress = false;
    @observable errors = null;

    @observable buyOrdersRegistry = observable.array();
    @observable sellOrdersRegistry = observable.array();

    constructor() {
        /*
         * 선택한 trading pair가 변경될때마다 그에 맞는 orderbook을 load 합니다.
         */
        const loadOrderbook = reaction(
            () => tradingPairStore.selectedTradingPairName,
            (selectedTradingPairName) => { 
                this.loadOrderbook(selectedTradingPairName);
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
    @action loadOrderbook(tradingPairName) {
        this.inProgress = true;
        this.errors = null;
        if (!tradingPairName) {
            throw new Error(
                'orderbookStore>loadOrderbook>No param tradingPairName'
            );
        }

        // TODO demo data를 이용한 부분입니다. (지워야함))
        if (stubData.stubOrderbook) {
            this._replaceOrderRegistries(stubData.stubOrderbook);
            return;
        }
        
        return api.getOrderbook(tradingPairName)
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

    _reformatOrderForDisplay = (orderFromServer) => (
        {
            price: orderFromServer.price.toFixed(2),
            volume: orderFromServer.volume.toFixed(3)
        }
    );

    _replaceOrderRegistries = (orders) => {
        this.sellOrdersRegistry.replace(orders.sells);
        this.buyOrdersRegistry.replace(orders.buys);
    }
}

export default new OrderbookStore();
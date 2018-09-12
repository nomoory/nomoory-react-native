import { observable, action, computed } from 'mobx';

import commonStore from './commonStore'
import tradingPairStore from './tradingPairStore';
import { getUnitPrice } from '../utils/helper';
import { Decimal } from './../utils/decimal.mjs';

import api from '../utils/api';

const DEFAULT_TRADING_PAIR = 'BTC-KRW';
const DEFAULT_ORDER_TYPE= 'LIMIT';

class OrderStore {
    @observable inProgress = false;
    @observable errors = null;

    @observable tradingPair = DEFAULT_TRADING_PAIR;
    @observable side = 'BUY';
    @observable volume = 0;
    @observable price = 0;
    @observable orderType = DEFAULT_ORDER_TYPE;
    @observable unitPrice = Decimal(0.00000001);

    @computed get amount() { return this.volume * this.price; }
    @computed get payload() {
        return {
            trading_pair: this.tradingPair,
            side: this.side,
            volume: this.volume,
            price: this.price,
            order_type: this.orderType,
            unit_price: this.unitPrice,
        };
    }

    constructor() {
        const reactionSelectedTradingPair = reaction(
            () => tradingPairStore.selectedTradingPair,
            (tradingPair) => {
                this.tradingPair = tradingPair.name,
                this.price = tradingPair.close_price,
                this.unitPrice = getUnitPrice(tradingPair.close_price, tradingPair.name)
            }
        );
    }

    @action setTradingPair(tradingPair) { this.tradingPair = tradingPair; }
    @action setSide(side) { this.side = side; }
    @action setVolume(volume) { this.volume = volume; }
    @action setPrice(price) { this.payload.price = Decimal(price || 0); }

    @action registerOrder() {
        this.inProgress = true;

        return api.registerOrder(this.payload)
        .catch(action((err) => {
            this.errors = err.response && err.response.body && err.response.body.errors;
            throw err;
        }))
        .then(action(() => {
            this.inProgress = false;
        }));
    }
}

export default new OrderStore();

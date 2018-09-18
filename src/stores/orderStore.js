import { observable, action, computed, reaction } from 'mobx';

import modalStore from './modalStore';
import tradingPairStore from './tradingPairStore';
import { getUnitPrice } from '../utils/helper';
import { Decimal } from '../utils/decimal';

import api from '../utils/api';

const DEFAULT_TRADING_PAIR = 'BTC-KRW';
const DEFAULT_ORDER_TYPE = 'LIMIT';
const FEE = '0.05%';

class OrderStore {
    @observable inProgress = false;
    @observable errors = null;
    
    @observable order = {
        tradingPairName: DEFAULT_TRADING_PAIR,
        side: 'BUY',
        volume: 100,
        price: 1000,
        orderType: DEFAULT_ORDER_TYPE,
        unitPrice: Decimal(0.00000001)
    }
    @computed get amount() { return this.order.volume * this.order.price; }

    constructor() {
        const reactionSelectedTradingPair = reaction(
            () => tradingPairStore.selectedTradingPairName,
            (tradingPairName) => {
                if (!tradingPairName) return;
                let tradingPair = tradingPairStore.getTradingPairByTradingPairName(tradingPairName);
                this.tradingPair = tradingPairName;
                this.price = tradingPair.close_price;
                this.unitPrice = getUnitPrice(tradingPair.close_price, tradingPairName);
            }
        );

        const reactionPrice = reaction(
            () => this.price,
            (price) => {
                if (!price) return;
                this.unitPrice = getUnitPrice(price, this.tradingPairName);
            }        
        );
    }

    @action setTradingPair(tradingPair) { this.order.tradingPair = tradingPair; }
    @action setSide(side) { this.order.side = side; }
    @action setVolume(volume) { this.order.volume = volume; }
    @action setPrice(price) { this.order.price = Decimal(price || 0); }
    @action setOrder({tradingPair, side, volume, price, orderType}){
        this.tradingPair = tradingPair || this.tradingPair;
        this.side = side || this.side;
        this.volume = volume || this.volume;
        this.price = price || this.price;
        this.orderType = orderType || this.orderType;
    }

    @action registerOrder() {
        this.inProgress = true;
        let order = this._transformOrderJsonForServer(this.order);
        modalStore.openModal({
            title: '성공', 
            content: '주문 등록에 성공하셨습니다.',
            confirmButtonName: '확인'
        });
        // return api.registerOrder(order)
        // .then(action((res) => {
        //     // 성공 모달 보여주기
        // }))
        // .catch(action((err) => {
        //     // 실패 모달 보여주기
        //     this.errors = err.response && err.response.body && err.response.body.errors;
        // }))
        // .then(action(() => {
        //     this.inProgress = false;
        // }));
    }

    get fee() {
        return FEE;
    }

    _transformOrderJsonForServer(order) {
        return {
            trading_pair: order.tradingPairName,
            side: order.side,
            volume: order.volume,
            price: order.price,
            order_type: order.orderType,
            unit_price: order.unitPrice,
        };
    }
}

export default new OrderStore();

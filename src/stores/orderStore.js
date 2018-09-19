import { observable, action, computed, reaction } from 'mobx';

import modalStore from './modalStore';
import tradingPairStore from './tradingPairStore';
import Helper from '../utils/Helper';
import api from '../utils/api';

const DEFAULT_TRADING_PAIR = 'BTC-KRW';
const DEFAULT_ORDER_TYPE = 'LIMIT';
const FEE = '0.05';
const DEFAULT_UNIT_PRICE = '0.00000001';

class OrderStore {
    @observable inProgress = false;
    @observable errors = null;
    
    @observable order = {
        tradingPairName: DEFAULT_TRADING_PAIR,
        side: 'BUY',
        volume: '100',
        price: '1000',
        orderType: DEFAULT_ORDER_TYPE,
        unitPrice: DEFAULT_UNIT_PRICE
    };
    @computed get baseSymbol() { return this.order.tradingPairName.split('-')[1]; }
    @computed get quoteSymbol() { return this.order.tradingPairName.split('-')[0]; }
    @computed get amount() { return this.order.volume * this.order.price; }

    constructor() {
        const reactionSelectedTradingPair = reaction(
            () => tradingPairStore.selectedTradingPairName,
            (tradingPairName) => {
                if (!tradingPairName) return;
                let tradingPair = tradingPairStore.getTradingPairByTradingPairName(tradingPairName);
                this.order.tradingPairName = tradingPairName;
                this.order.price = tradingPair.close_price;
                this.order.unitPrice = Helper.getUnitPrice(tradingPair.close_price, tradingPair.base_symbol);
            }
        );

        const reactionPrice = reaction(
            () => this.order.price,
            (price) => {
                if (!price) return;
                this.order.unitPrice = Helper.getUnitPrice(price, this.baseSymbol);
            }        
        );
    }

    @action setTradingPair(tradingPair) { this.order.tradingPair = tradingPair; }
    @action setSide(side) { this.order.side = side; }
    @action setVolume(volume) { this.order.volume = volume; }
    @action setPrice(price) { this.order.price = price || 0; }
    @action setOrder({tradingPairName, side, volume, price, orderType}){
        this.order.tradingPairName = tradingPairName || this.order.tradingPairName;
        this.order.side = side || this.order.side;
        this.order.volume = volume || this.order.volume;
        this.order.price = price || this.order.price;
        this.order.orderType = orderType || this.order.orderType;
    }

    @action registerOrder() {
        this.inProgress = true;
        let order = this._transformOrderJsonForServer(this.order);
        return api.postOrder(order)
        .then(action((res) => {
            modalStore.openModal({
                title: '성공', 
                content: '주문 등록에 성공하셨습니다.',
                confirmButtonName: '확인'
            });
            // 성공 모달 보여주기
        }))
        .catch(action((err) => {
            // 실패 모달 보여주기
            this.errors = err.response && err.response.body && err.response.body.errors;
        }))
        .then(action(() => {
            this.inProgress = false;
        }));   
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

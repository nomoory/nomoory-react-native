import { action, observable, computed } from 'mobx';
import Model from './Model';
import tradingPairStore from '../tradingPairStore';
import Decimal from '../../utils/decimal';
import number from '../../utils/number';

/*
 * buys
 * sells
 */
const ORDER_LENGTH_OF_EACH_SIDE = 15;

class OrderbookModel extends Model {
    @observable
    isLoading = false;

    @computed
    get ordersLength() {
        return this.buys.length + this.sells.length;
    }

    @computed
    get sellOrders() {
        const tempSellOrders = [];
        let count = 0;
        this.sells.forEach((sellOrder, index) => {
            if (index < ORDER_LENGTH_OF_EACH_SIDE) {
                tempSellOrders.unshift(this._reformatOrderForDisplay(sellOrder, 'SELL'));
                count = index + 1;
            }
        });
        while (count++ < 15)  {
            tempSellOrders.unshift(this._reformatOrderForDisplay(null, 'SELL'));
        }
        return tempSellOrders;
    };

    @computed
    get buyOrders() {
        const tempBuyOrders = [];
        let count = 0;
        this.buys.forEach((buyOrder, index) => {
            if (index < ORDER_LENGTH_OF_EACH_SIDE) {
                tempBuyOrders.push(this._reformatOrderForDisplay(buyOrder, 'BUY'));
                count = index + 1;
            }
        });

        while (count++ < 15)  {
            tempBuyOrders.push(this._reformatOrderForDisplay(null, 'BUY'));
        }

        return tempBuyOrders;
    };

    _reformatOrderForDisplay = (order, side) => {
        if (!order) return { key: null, side };

        return {
            price: tradingPairStore.selectedTradingPair ? 
                number.getFixedPrice(order.price, tradingPairStore.selectedTradingPair.base_symbol) :
                Decimal(order.price).toFixed(),
            volume: number.getFixed(order.volume, 3),
            key: order.price,
            side,
        };
    };

    @computed
    get maxOrderVolume() {
        let maxOrderVolume = 0;
        this.sellOrders.forEach(sellOrder => {
            if (!sellOrder) return;
            let volume = parseFloat(sellOrder.volume);
            if (volume > maxOrderVolume) maxOrderVolume = volume;
        });
        this.buyOrders.forEach(buyOrder => {
            if (!buyOrder) return;
            let volume = parseFloat(buyOrder.volume);
            if (volume > maxOrderVolume) maxOrderVolume = volume;
        });

        return maxOrderVolume;
    }

    @action
    clear() {
        this.buyOrders = [];
        this.sellOrders = [];
    }

    @action.bound
    setOrderbooks(buyAndSell) {
        this.sells = buyAndSell.sells;
        this.buys = buyAndSell.buys;
    }

}

export default OrderbookModel;

import { observable, action, computed } from 'mobx';
import agent from '../utils/agent';
import Decimal from '../utils/decimal';
import number from '../utils/number';
import tradingPairStore from './tradingPairStore';

const ORDER_LENGTH_OF_EACH_SIDE = 15;
class OrderbookStore {
    @observable
    isLoading = false;

    @observable
    errors = null;

    @observable
    buyOrdersRegistry = [];

    @observable
    sellOrdersRegistry = [];

    @observable
    baseSymbolOfSelectedTradingPair = null;

    @computed
    get ordersLength() {
        return this.buyOrdersRegistry.length + this.sellOrdersRegistry.length;
    }

    @computed
    get sellOrders() {
        const tempSellOrders = [];
        let count = 0;
        this.sellOrdersRegistry.forEach((sellOrder, index) => {
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
        this.buyOrdersRegistry.forEach((buyOrder, index) => {
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
    get buyOrdersSum_display() {
        let volume_sum = Decimal(0);
        this.buyOrders.forEach((buyOrder) => {
            if (buyOrder && buyOrder.volume) {
                let volume = Decimal(buyOrder.volume);
                volume_sum = volume_sum.plus(volume);    
            }
        });

        return number.putComma(volume_sum.toFixed(3));
    };

    @computed
    get sellOrdersSum_display() {
        let volume_sum = Decimal(0);
        this.sellOrders.forEach((sellOrder) => {
            if (sellOrder && sellOrder.volume) {
                let volume = Decimal(sellOrder.volume);
                volume_sum = volume_sum.plus(volume);
            }
        });

        return number.putComma(volume_sum.toFixed(3))
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

    @action clearOrderbook() {
        console.log('clearOrderbook')
        this.buyOrdersRegistry = [];
        this.sellOrdersRegistry = [];
    }

    @action setOrderbook(message) {
        this.buyOrdersRegistry = message.buys;
        this.sellOrdersRegistry = message.sells;
    }

    @action loadOrderbook(selectedTradingPairName) {
        this.isLoading = true;
        this.clearOrderbook();
        const tradingPairName = selectedTradingPairName || tradingPairStore.selectedTradingPairName;
        console.log(`load orderbook ${tradingPairName}`)
        return agent.loadOrderbookByTradingPairName(tradingPairName)
        .then(action((response) => {
            this.clearOrderbook();
            this.buyOrdersRegistry = response.data.buys;
            this.sellOrdersRegistry = response.data.sells;
            this.isLoading = false;
        }))
        .catch(action((err) => {
            this.errors = err.response && err.response.body && err.response.body.errors;
            this.isLoading = false;
            throw err;
        }));
    }
}

export default new OrderbookStore();
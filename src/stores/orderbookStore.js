import { observable, action, computed } from 'mobx';
import agent from '../utils/agent';
import tradingPairStore from './tradingPairStore';
import OrderbookModel from './models/OrderbookModel';

class OrderbookStore {
    @observable
    isLoading = false;

    @observable
    orderbooks = observable.map();

    @computed
    get selectedOrderbook() {
        return this.orderbooks.get(tradingPairStore.selectedTradingPairName);
    };


    @action.bound
    updateOrderbookByTradingPairName(tradingPairName, data) {
        const tagetOrderbook = 
        this.orderbooks.get(tradingPairName);
        if (tagetOrderbook) tagetOrderbook.update(data);
    }

    @action
    setOrderbook(message) {
        this.buyOrdersRegistry = message.buys;
        this.sellOrdersRegistry = message.sells;
    }

    @action
    loadOrderbook(selectedTradingPairName) {
        this.isLoading = true;
        const tradingPairName = selectedTradingPairName || tradingPairStore.selectedTradingPairName;
        // console.log(`[Orderbook Store] load orderbook ${tradingPairName}`)

        return agent.loadOrderbookByTradingPairName(tradingPairName)
        .then(action((response) => {
            // console.log(`[Orderbook Store] loaded orderbook ${tradingPairName}`)
            this.orderbooks.set(tradingPairName, new OrderbookModel(response.data));

            this.isLoading = false;
        }))
        .catch(action((err) => {
            this.isLoading = false;
            throw err;
        }));
    }
}

export default new OrderbookStore();
import { observable, action, computed } from 'mobx';
import agent from '../utils/agent';
import tradingPairStore from './tradingPairStore';

class PlacedOrderHistoryStore {
    @observable loadValues = {
        isFirstLoad: true,
        isLoading: false,
        nextUrl: null,
    }

    @observable errors = undefined;

    @observable placedOrdersRegistry = observable.map();

    @computed get placedOrders() {
        let placedOrders = [];
        this.placedOrdersRegistry.forEach((placedOrder) => {
            placedOrders.push(placedOrder);
        });
        placedOrders.sort(function(a,b){
            return new Date(b.created) - new Date(a.created);
        });
        return placedOrders;
    };

    @computed get placedOrdersOfSelectedTradingPair() {
        let selectedTradingPairName = tradingPairStore.selectedTradingPairName;
        let placedOrders = [];
        this.placedOrdersRegistry.forEach((placedOrder) => {
            if (selectedTradingPairName === placedOrder.trading_pair_name) {
                placedOrders.push(placedOrder);    
            }
        });
        placedOrders.sort(function(a,b){
            return new Date(b.created) - new Date(a.created);
        });
        return placedOrders;
    }

    @action setPlacedOrder(placedOrder) {
        if (['PLACED', 'PENDING', 'PARTIALLY_FILLED'].includes(placedOrder.order_status)) {
            this.placedOrdersRegistry.set(placedOrder.uuid, placedOrder);
        } else if (['COMPLETED'].includes(placedOrder.order_status)) {
            if (this.placedOrdersRegistry.get(placedOrder.uuid)){
                this.placedOrdersRegistry.delete(placedOrder.uuid);
            }
        } else if (['CANCELLED'].includes(placedOrder.order_status)) {
            if (this.placedOrdersRegistry.get(placedOrder.uuid)){
                this.placedOrdersRegistry.delete(placedOrder.uuid);
            }
        }
    }

    @action deletePlacedOrder(uuid) {
        this.loadValues.isLoading = true;
        return agent.deletePlacedOrderById(uuid)
        .then(action((response) => {
            // front 상에서 삭제는 socket을 통해 this.setPlacedOrder가 진행합니다.
            this.loadPersonalPlacedOrders(tradingPairStore.selectedTradingPairName);
            this.loadValues.isLoading = false;
        }))
        .catch(action((err) => {
            this.loadValues.isLoading = false;
            // 요청에서 실패하면 서버와 sync를 맞추기위해 다시 데이터를 로드합니다.
            this.loadPersonalPlacedOrders(tradingPairStore.selectedTradingPairName);
            throw err;
        }));
    }

    @action
    loadPersonalOrders(tradingPairName) {
        if (tradingPairName) {
            this.loadPersonalPlacedOrders(tradingPairName);
        }
    }

    @action
    loadAllPersonalPlacedOrders() {
        // 인자를 넘기지 않으면 유저의 모든 PlacedOrder를 로드합니다.
        this.loadPersonalPlacedOrders();
    }

    @action listenScrollEvent = (event) => {
        let { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
        if (
            scrollHeight - (clientHeight + scrollTop) < 100 && 
            this.loadValues.isLoading === false &&
            this.isLoadable.status
        ) {
            this.loadNextPersonalPlacedOrders();
        };
    }

    @action loadPersonalPlacedOrders(tradingPairName) {
        this.loadValues.isLoading = true;
        this.placedOrdersRegistry.clear();
        return agent.loadPersonalPlacedOrders(tradingPairName)
        .then(action((response) => {
            let { results, next, previous } = response.data;
            this.placedOrdersRegistry.clear();
            results.forEach((placedOrder) => {
                this.placedOrdersRegistry.set(placedOrder.uuid, placedOrder);
            });
            this.loadValues = {
                isFirstLoad: false,
                isLoading: false,
                nextUrl: next,
            };
        }))
        .catch(action((err) => {
            this.errors = err.response && err.response.body && err.response.body.errors;
            this.loadValues = {
                isFirstLoad: false,
                isLoading: false,
                nextUrl: null,
            };
            throw err;
        }));
    }

    @action loadNextPersonalPlacedOrders() {
        if (this.loadValues.nextUrl) {
            this.loadValues.isLoading = true;
            return agent.get(this.loadValues.nextUrl)
                .then(action((response) => {
                    let { results, next, previous } = response.data;
                    results.forEach((placedOrder) => {
                        this.placedOrdersRegistry.set(placedOrder.uuid, placedOrder);
                    });

                    this.loadValues = {
                        isFirstLoad: false,
                        isLoading: false,
                        nextUrl: next
                    };
                }))
                .catch(action((err) => {
                    this.errors = err.response && err.response.body && err.response.body.errors;
                    this.loadValues = {
                        isFirstLoad: false,
                        isLoading: false,
                        nextUrl: null,
                    };
                    throw err;
                }));
        }
    }

    @computed get isLoadable() {
        let {
            isFirstLoad,
            nextUrl,
            isLoading,
        } = this.loadValues;
        if (isLoading) { // 로딩 중일 때: 로드 불가
            return {
                status: false,
                message_code: 'on_loading'
            };
        }
        if (!isFirstLoad && !nextUrl) { // 이후 로드할 내역이 더이상 없을 때: 로드 불가
            if (this.placedOrders.length) {
                return {
                    status: false,
                    message_code: 'no_more_load'
                };    
            } else {
                return {
                    status: false,
                    message_code: 'no_data'
                };
            }
        }
        if (isFirstLoad) { // 로드하기 전 상태: 로드 가능
            return {
                status: true,
                message_code: 'before_load'
            };
        } else {
            return { // 이후 로드할 데이터가 있는 상태: 로드 가능
                status: true,
                message_code: 'has_next_load'
            };
        }
    }
}

export default new PlacedOrderHistoryStore();

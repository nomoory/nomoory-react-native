import { observable, action, computed } from 'mobx';
import agent from '../utils/agent';
import tradingPairStore from './tradingPairStore';

class PersonalOrderHistoryStore {
    @observable isLoading = false;
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

    @computed get selectedTradingPairPlacedOrders() {
        let selectedTradingPairName = tradingPairStore.selectedTradingPairName;
        let placedOrders = [];
        this.placedOrdersRegistry.forEach((placedOrder) => {
            if ( selectedTradingPairName === placedOrder.trading_pair_name) {
                placedOrders.push(placedOrder);    
            }
        });
        placedOrders.sort(function(a,b){
            return new Date(b.created) - new Date(a.created);
        });
        return placedOrders;
    }

    @action setPersonalOrder(personalOrder) {
        if (['PLACED', 'PENDING', 'PARTIALLY_FILLED'].includes(personalOrder.order_status)) {
            this.placedOrdersRegistry.set(personalOrder.uuid, personalOrder);
        } else if (['COMPLETED'].includes(personalOrder.order_status)) {
            if (this.placedOrdersRegistry.get(personalOrder.uuid)){
                this.placedOrdersRegistry.delete(personalOrder.uuid);
            }
            this.completedOrdersRegistry.set(personalOrder.uuid, personalOrder);
        } else if (['CANCELLED'].includes(personalOrder.order_status)) {
            if (this.placedOrdersRegistry.get(personalOrder.uuid)){
                this.placedOrdersRegistry.delete(personalOrder.uuid);
            }
        }
    }

    @action deletePlacedOrder(uuid) {
        this.isLoading = true;
        return agent.deletePlacedOrderById(uuid)
        .then(action((response) => {
            // front 상에서 삭제는 pubnub을 통해 this.setPersonalOrder가 진행합니다.
            this.isLoading = false;
        }))
        .catch(action((err) => {
            this.errors = err.response && err.response.body && err.response.body.errors;
            this.isLoading = false;
            // 요청에서 실패하면 서버와 sync를 맞추기위해 다시 데이터를 로드합니다.
            this.load();
            throw err;
        }));
    }

    @observable loadValues = {
        isFirstLoad: true,
        isLoading: false,
        nextUrl: null,
    }

    @action load() {
        this.loadValues.isLoading = true;
        console.log('requested')
        return agent.loadPersonalPlacedOrders(tradingPairStore.selectedTradingPairName)
        .then(action((response) => {
            console.log('success')
            let { results, next, previous } = response.data;
            this.placedOrdersRegistry.clear();
            console.log(results)
            results.map((placedOrder) => {
                this.placedOrdersRegistry.set(placedOrder.uuid, placedOrder);
            });
            console.log('placedOrdersRegistry', this.placedOrdersRegistry);
            this.loadValues = {
                isFirstLoad: false,
                isLoading: false,
                nextUrl: next,
            };
        }))
        .catch(action((err) => {
            console.log(err)

            this.errors = err.response && err.response.body && err.response.body.errors;
            this.loadValues = {
                isFirstLoad: false,
                isLoading: false,
                nextUrl: null,
            };
            throw err;
        }));
    }

    @action loadNext() {
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
        } else {
        }
    }
    
    @action listenScrollEvent = (event) => {
        let { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
        if (
            scrollHeight - (clientHeight + scrollTop) < 100 && 
            this.isLoading === false &&
            this.isLoadable.status
        ) {
            this.loadNextPersonalPlacedOrders();
        };
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
            if (this.placedOrdersRegistry.length == 0) {
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

export default new PersonalOrderHistoryStore();
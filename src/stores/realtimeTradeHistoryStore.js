import { observable, action, computed } from 'mobx';
import tradingPairStore from './tradingPairStore';
import agent from '../utils/agent';

class RealtimeTradeHistoryStore {
    @observable errors = undefined;
    @observable LoadValues = {
        isFirstLoad: true,
        isLoading: false,
        nextUrl: null
    }
    @observable realtimeTradeRegistry = [];

    @computed get realtimeTrades() { 
        return this.realtimeTradeRegistry; // .sort((prev, next) => (new Date(next.created) - new Date(prev.created)));
    };

    @computed get lastRealtimeTrade() {
        return this.realtimeTradeRegistry[0] || {};
    };

    @action clearRegistry() {
        this.realtimeTradeRegistry = [];
    }
    @action clearLoadValues() {
        this.LoadValues = {
            isFirstLoad: true,
            isLoading: false,
            nextUrl: null
        };
    }
    @action clear() {
        this.clearRegistry();
        this.clearLoadValues();
    }
    @action setRealTimeTrades(trades) {
        if (trades.length > 20){
            this.realtimeTradeRegistry = trades.slice(0, 20);
        } else {
            if (20 <= this.realtimeTradeRegistry.length) {
                // multiple pop
                this.realtimeTradeRegistry = this.realtimeTradeRegistry.slice(0, 20 - trades.length);
            }
            this.realtimeTradeRegistry.unshift(...trades);
        }
    }

    @action listenScrollEvent = (event) => {
        // let { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
        // if (
        //     scrollHeight - (clientHeight + scrollTop) < 100 && 
        //     this.LoadValues.isLoading === false
        // ) {
        //     this.loadNextRealtimeTrades();
        // }
    }

    @action load() {
        this.LoadValues.isLoading = true;
        return agent.loadRealtimeTrades(tradingPairStore.selectedTradingPairName)
        .then(action((response) => {
            let { results, next, previous } = response.data;
            this.realtimeTradeRegistry = results;
            this.LoadValues = {
                isFirstLoad: false,
                isLoading: false,
                nextUrl: next,
            };
        }))
        .catch(action((err) => {
            this.errors = err.response && err.response.body && err.response.body.errors;
            this.LoadValues = {
                isFirstLoad: false,
                isLoading: false,
                nextUrl: null,
            };
            throw err;
        }));
    }

    @action loadNextRealtimeTrades() {
        if (this.LoadValues.nextUrl) {
            this.LoadValues.isLoading = true;
            return agent.get(this.LoadValues.nextUrl)
            .then(action((response) => {
                let { results, next, previous } = response.data;
                this.realtimeTradeRegistry.replace([...this.realtimeTradeRegistry, ...results]);
                this.LoadValues = {
                    isFirstLoad: false,
                    isLoading: false,
                    nextUrl: next,
                };
            }))
            .catch(action((err) => {
                this.errors = err.response && err.response.body && err.response.body.errors;
                this.LoadValues = {
                    isFirstLoad: false,
                    isLoading: false,
                    nextUrl: null,
                };
                throw err;
            }));
        } else {
        }
    }

    @computed get isLoadable() {
        let {
            isFirstLoad,
            nextUrl,
            isLoading,
        } = this.LoadValues;
        if (isLoading) { // 로딩 중일 때: 로드 불가
            return {
                status: false,
                message_code: 'on_loading'
            };
        }
        if (!isFirstLoad && !nextUrl) { // 이후 로드할 내역이 더이상 없을 때: 로드 불가
            if (this.realtimeTradeRegistry.length) {
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

export default new RealtimeTradeHistoryStore();
import {
    observable,
    action,
    computed,
} from 'mobx';
import agent from '../utils/agent';

class DailyTradeHistoryStore {
    @observable
    loadValues = {
        isFirstLoad: true,
        isLoading: false,
        nextUrl: null,
    }

    @observable
    dailyTradeRegistry = [];

    @computed
    get dailyTrades() {
        const dailyTrades = [];
        this.dailyTradeRegistry.forEach((dailyTrade) => {
            dailyTrades.push(dailyTrade);
        });
        return dailyTrades
            .sort((prev, next) => (new Date(next.candle_start_date_time) - new Date(prev.candle_start_date_time)));
    }

    @computed
    get isLoadable() {
        const {
            isFirstLoad,
            nextUrl,
            isLoading,
        } = this.loadValues;
        if (isLoading) { // 로딩 중일 때: 로드 불가
            return {
                status: false,
                message_code: 'on_loading',
            };
        }
        if (!isFirstLoad && !nextUrl) { // 이후 로드할 내역이 더이상 없을 때: 로드 불가
            if (this.dailyTrades.length) {
                return {
                    status: false,
                    message_code: 'no_more_load',
                };
            }
            return {
                status: false,
                message_code: 'no_data',
            };
        }
        if (isFirstLoad) { // 로드하기 전 상태: 로드 가능
            return {
                status: true,
                message_code: 'before_load',
            };
        }
        return { // 이후 로드할 데이터가 있는 상태: 로드 가능
            status: true,
            message_code: 'has_next_load',
        };
    }

    @action
    clearRegistry() {
        this.dailyTradeRegistry.clear();
    }

    @action
    clearLoadValues() {
        this.loadValues = {
            isFirstLoad: true,
            isLoading: false,
            nextUrl: null,
        };
    }

    @action
    clear() {
        this.clearRegistry();
        this.clearLoadValues();
    }

    @action
    listenScrollEvent = (event) => {
        const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
        if (
            scrollHeight - (clientHeight + scrollTop) < 100
            && this.loadValues.isLoading === false
        ) {
            this.loadNextDailyTrades();
        }
    }

    @action
    loadDailyTrades(selectedTradingPairName) {
        this.loadValues.isLoading = true;
        return agent.loadDailyTrades(selectedTradingPairName)
            .then(action((response) => {
                const { results, next } = response.data;
                this.dailyTradeRegistry.replace(results);
                this.loadValues = {
                    isFirstLoad: false,
                    isLoading: false,
                    nextUrl: next,
                };
            }))
            .catch(action((err) => {
                this.loadValues = {
                    isFirstLoad: true,
                    isLoading: false,
                    nextUrl: null,
                };
                throw err;
            }));
    }

    @action
    loadNextDailyTrades() {
        if (this.loadValues.nextUrl) {
            this.loadValues.isLoading = true;
            return agent.get(this.loadValues.nextUrl)
                .then(action((response) => {
                    const { results, next, previous } = response.data;
                    this.dailyTradeRegistry.replace([...this.dailyTradeRegistry, ...results]);
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
        this.loadValues = {
            isFirstLoad: false,
            isLoading: false,
            nextUrl: null,
        };
    }
}

export default new DailyTradeHistoryStore();

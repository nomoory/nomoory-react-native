import tradingPairStore from './tradingPairStore';
import { observable, action, computed } from 'mobx';

import agent from '../utils/agent';
import TRANSLATIONS from '../TRANSLATIONS';


class TransactionHistoryStore {
    @observable isLoading = false;
    @observable errors = undefined;
    @observable options = [
        { value: 'ALL_TRANSACTIONS', label: TRANSLATIONS['ALL_TRANSACTIONS'] },
        { value: 'BUY', label: TRANSLATIONS['BUY'] },
        { value: 'SELL', label: TRANSLATIONS['SELL'] },
        { value: 'WITHDRAW', label: TRANSLATIONS['WITHDRAW'] },
        { value: 'DEPOSIT', label: TRANSLATIONS['DEPOSIT'] },
        { value: 'MINING', label: TRANSLATIONS['MINING'] },
        // { value: 'INVITATION_MINING', label: TRANSLATIONS['INVITATION_MINING'] },
        { value: 'DIVIDEND', label: TRANSLATIONS['DIVIDEND'] },
        { value: 'TAKEAWAY', label: TRANSLATIONS['TAKEAWAY'] },
        { value: 'GIVEAWAY', label: TRANSLATIONS['GIVEAWAY'] },
        // { value: 'TRADE', label: TRANSLATIONS['TRADE'] },
    ];

    @observable loadMoreValues = {
        isLoading: false,
        selectedOption: this.options[0].value,
        nextUrl: null,
        isFirstLoad: true
    }

    @action changeSelectedOption(selectedOption) {
        this.loadMoreValues.selectedOption = selectedOption;
        if (selectedOption === 'TRADE') { this.loadTradeHistory()}
        this.load(selectedOption);
    }

    @observable registry = observable.array();
    @observable tradeHistoryRegistry = observable.array();

    @computed get transactionHistory() {
        let transactionHistory = [];
        this.registry.forEach((transaction) => {
            transactionHistory.push(transaction);
        });
        return transactionHistory;
    }

    @computed get tradeHistory() {
        let tradeHistories = [];
        this.tradeHistoryRegistry.forEach((trade) => {
            tradeHistories.push(trade);
        });
        return tradeHistories;
    }


    @action clearRegistry() {
        this.registry.clear();
    }
    @action clearTradeHistoryRegistry() {
        this.tradeHistoryRegistry.clear();
    }

    @action clearLoadMoreValues() {
        this.loadMoreValues = {
            isLoading: false,
            selectedOption: this.options[0].value,
            nextUrl: null,
            isFirstLoad: true
        };
    }
    @action clear() {
        this.clearRegistry();
        this.clearLoadMoreValues();
    }

    @computed get isLoadable() {
        let {
            isFirstLoad,
            nextUrl,
            isLoading,
        } = this.loadMoreValues;
        if (isLoading) { // 로딩 중일 때: 로드 불가
            return {
                status: false,
                message_code: 'on_loading'
            };
        }
        if (!isFirstLoad && !nextUrl) { // 이후 로드할 내역이 더이상 없을 때: 로드 불가
            if (this.registry.length == 0) {
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

    @action listenScrollEvent = (event) => {
        let { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
        if (
            scrollHeight - (clientHeight + scrollTop) < 100 && 
            this.loadMoreValues.isLoading === false) {
            this.loadNext();
        }
    }

    @action load() {
        this.loadMoreValues.isLoading = true;
        let selectedOption = this.loadMoreValues.selectedOption;
        
        return agent.loadTransactionHistory(selectedOption)
        .then(action((response) => {
            let { results, next, previous } = response.data;
            this.registry.replace(results);
            this.loadMoreValues = { ...this.loadMoreValues,
                isFirstLoad: false,
                nextUrl: next,
                isLoading: false
            };
        }))
        .catch(action((err) => {
            this.errors = err.response && err.response.body && err.response.body.errors;
            this.loadMoreValues.isLoading = false;
            throw err;
        }));
    }

    @action loadNext() {
        if(this.loadMoreValues.nextUrl) {
            this.loadMoreValues.isLoading = true;
            return agent.get(this.loadMoreValues.nextUrl)
            .then(action((response) => {
                let { results, next, previous } = response.data;
                this.registry.replace([...this.registry, ...results]);
                this.loadMoreValues = { ...this.loadMoreValues,
                    isFirstLoad: false,
                    nextUrl: next,
                    isLoading: false
                };
            }))
            .catch(action((err) => {
                this.errors = err.response && err.response.body && err.response.body.errors;
                this.loadMoreValues.isLoading = false;
                throw err;
            }));
        } else {
        }
    }

    @action loadTradeHistory() {
        this.loadMoreValues.isLoading = true;
        let selectedOption = 'TRADE';
        let tradingPairName = tradingPairStore.selectedTradingPairName;
        
        return agent.loadTransactionHistory(selectedOption, tradingPairName)
        .then(action((response) => {
            let { results, next, previous } = response.data;
            this.tradeHistoryRegistry.replace(results);
            this.loadMoreValues = { ...this.loadMoreValues,
                isFirstLoad: false,
                nextUrl: next,
                isLoading: false
            };
        }))
        .catch(action((err) => {
            this.errors = err.response && err.response.body && err.response.body.errors;
            this.loadMoreValues.isLoading = false;
            throw err;
        }));
    }

    @action loadNextTradeHistory() {
        if(this.loadMoreValues.nextUrl) {
            this.loadMoreValues.isLoading = true;
            return agent.get(this.loadMoreValues.nextUrl)
            .then(action((response) => {
                let { results, next, previous } = response.data;
                this.tradeHistoryRegistry.replace([...this.registry, ...results]);
                this.loadMoreValues = { ...this.loadMoreValues,
                    isFirstLoad: false,
                    nextUrl: next,
                    isLoading: false
                };
            }))
            .catch(action((err) => {
                this.errors = err.response && err.response.body && err.response.body.errors;
                this.loadMoreValues.isLoading = false;
                throw err;
            }));
        } else {
        }
    }
}

export default new TransactionHistoryStore();

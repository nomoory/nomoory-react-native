import tradingPairStore from './tradingPairStore';
import { observable, action, computed } from 'mobx';

import agent from '../agent';
import i18next from 'i18next';


class TransactionHistoryStore {
    @observable isLoading = false;
    @observable errors = undefined;
    @observable options = [
        { value: 'ALL_TRANSACTIONS', label: i18next.t('ALL_TRANSACTIONS') },
        { value: 'BUY', label: i18next.t('BUY') },
        { value: 'SELL', label: i18next.t('SELL') },
        { value: 'WITHDRAW', label: i18next.t('WITHDRAW') },
        { value: 'DEPOSIT', label: i18next.t('DEPOSIT') },
        { value: 'MINING', label: i18next.t('MINING') },
        // { value: 'INVITATION_MINING', label: i18next.t('INVITATION_MINING') },
        { value: 'DIVIDEND', label: i18next.t('DIVIDEND') },
        { value: 'TAKEAWAY', label: i18next.t('TAKEAWAY') },
        { value: 'GIVEAWAY', label: i18next.t('GIVEAWAY') },
    ];
    @observable loadMoreValues = {
        isLoading: false,
        selectedOption: this.options[0].value,
        nextUrl: null,
        isFirstLoad: true
    }

    @action changeSelectedOption(selectedOption) {
        this.loadMoreValues.selectedOption = selectedOption;
    }

    @observable transactionHistoryRegistry = observable.array();

    @computed get transactionHistory() {
        let transactionHistory = [];
        this.transactionHistoryRegistry.forEach((transaction) => {
            transactionHistory.push({
                uuid: transaction.uuid,
                transaction_created: transaction.transaction_created,
                quote_symbol: transaction.quote_symbol,
                base_symbol: transaction.base_symbol,
                transaction_type: transaction.transaction_type,
                volume: transaction.volume,
                price: transaction.price,
                amount: transaction.amount,
                fee: transaction.fee,
                adjusted_amount: transaction.adjusted_amount                
            });
        });
        return transactionHistory;
    }

    @action clearTransactionHistory() {
        this.transactionHistoryRegistry.clear();
        this.bankWithdrawHistoryLoadValues = {
            isFirstLoad: true,
            nextUrl: null,
            isLoading: false
        };
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
            if (this.transactionHistoryRegistry.length == 0) {
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
            this.loadNextTransactionHistory();
        }
    }

    @action loadTransactionHistory() {
        this.loadMoreValues.isLoading = true;
        this.errors = null;
        let trading_pair_name = null;
        if (this.loadMoreValues.selectedOption === 'TRADE') trading_pair_name = tradingPairStore.selectedTradingPairName;
        
        return agent.loadTransactionHistory(this.loadMoreValues.selectedOption, trading_pair_name)
        .then(action((response) => {
            let { results, next, previous } = response.data;
            this.transactionHistoryRegistry.replace(results);
            this.loadMoreValues = {
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
    @action loadNextTransactionHistory() {
        if(this.loadMoreValues.nextUrl) {
            this.loadMoreValues.isLoading = true;
            return agent.get(this.loadMoreValues.nextUrl)
            .then(action((response) => {
                let { results, next, previous } = response.data;
                this.transactionHistoryRegistry.replace([...this.transactionHistoryRegistry, ...results]);
                this.loadMoreValues = {
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

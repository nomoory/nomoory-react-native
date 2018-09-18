import { observable, action, computed } from 'mobx';
import Hangul from 'hangul-js';
import api from '../utils/api';
import tradingPairStore from './tradingPairStore';
import stubData from './stubData';

class AccountStore {
    @observable inProgress = false;
    @observable errors = null;

    /*
     * 보유 Assets (balance를 포함함)
     */
    @observable isLoadedOnce = false;
    @observable accountsRegistry = observable.map();

    @observable totalAccountsCount = 0;
    @observable searchKeyword = '';

    @computed get accounts() {
        let accounts = [];
        const searcher = new Hangul.Searcher(this.searchKeyword);
        this.accountsRegistry.forEach((account) => {
            if(this.hasSearchKeywordInAccount(searcher, account)) {
                const tradingPairName = account.asset_symbol + '-KRW';
                let tradingPair = tradingPairStore.getTradingPairByTradingPairName(tradingPairName);
                console.log(tradingPairStore);
                console.log(tradingPair);
                accounts.push({
                    uuid: account.uuid,
                    balance: account.balance,
                    asset_symbol: account.asset_symbol,
                    asset_english_name: account.asset_english_name,
                    asset_korean_name: account.asset_korean_name,
                    pending_order: account.pending_order,
                    pending_withdrawl: account.pending_withdrawl,
                    avg_fiat_buy_price: account.avg_fiat_buy_price,
                    is_avg_fiat_buy_price_modified: account.is_avg_fiat_buy_price_modified,
                    asset_close_price: (tradingPair && tradingPair.close_price) || 1000
                })
            }
        });
        return accounts;
    };

    constructor() {
        if (__DEV__) {
            stubData.stubAccounts.forEach((account) => {
                this.accountsRegistry.set(account.asset_symbol, account);
            });
            this.totalAccountsCount = stubData.stubAccounts.length;
        }
    }

    getAccountByAssetSymbol(assetSymbol) {
        const account = this.accountsRegistry.get(assetSymbol) || null;
        return account;
    }

    @computed get evaluatedTotalAssetsValueInKRW() {
        let valueInKRW = 0;
        this.accountsRegistry.forEach((account) => {
            valueInKRW += parseFloat(account.balance) * parseFloat(account.avg_fiat_buy_price);
        });
        
        return valueInKRW.toLocaleString();
    }

    /*
     * 입/출금
     */
    @observable currency = 'KRW';
    @observable amount = 0;
    @computed get depositPayload() { return {'base_symbol': this.currency, 'amount': this.amount}; };
    @computed get withdrawPayload() { return {'base_symbol': this.currency, 'amount': this.amount}; };

    @action setCurrency(currency) {
        this.currency = currency === undefined ? 'KRW' : currency;
    }

    @action setAmount(amount) {
        this.amount = amount;
    }

    @action deposit() {
        let account = this.getAccountByAssetSymbol(this.currency);
        return api.deposit(account.uuid, this.depositPayload)
        .then(action((response) => {
            this.accountsRegistry.set(this.currency, response.data);
        }))
        .catch(action((err) => {
            this.errors = err.response && err.response.body && err.response.body.errors;
        }))
    }

    @action withdraw() {
        let account = this.getAccountByAssetSymbol(this.currency);
        return api.withdraw(account.uuid, this.withdrawPayload)
        .then(action((response) => {
            this.accountsRegistry.set(this.currency, response.data);
        }))
        .catch(action((err) => {
            this.errors = err.response && err.response.body && err.response.body.errors;
        }))
    }

    @action setAccounts(accounts) {
        this.accountsRegistry.set(accounts.message.asset_symbol, accounts.message);
    }

    hasSearchKeywordInAccount(searcher, account) {
        return (this.assetSymbolContainsSearchKeyword(searcher, account)
        || this.assetKoreanNameContainsSearchKeyword(searcher, account)
        || this.assetEnglishNameContainsSearchKeyword(searcher, account))
        ? true
        : false;
    }

    assetSymbolContainsSearchKeyword(searcher, account) {
        return searcher.search(account.asset_symbol.toLowerCase()) >= 0 ? true : false;
    }

    assetKoreanNameContainsSearchKeyword(searcher, account) {
        return searcher.search(account.asset_korean_name) >= 0 ? true : false;
    }

    assetEnglishNameContainsSearchKeyword(searcher, account) {
        return searcher.search(account.asset_english_name.toLowerCase()) >= 0 ? true : false;
    }

    @action loadAccounts() {
        this.inProgress = true;
        this.errors = null;

        return api.loadAccounts()
        .then(action((response) => {
            let accounts = response.data;
            this.accountsRegistry.clear();
            accounts.forEach((account) => {
                this.accountsRegistry.set(account.asset_symbol, account);
            });
            this.totalAccountsCount = accounts.length;
        }))
        .catch(action((err) => {
            this.errors = err.response && err.response.body && err.response.body.errors;
        }))
        .then(action(() => {
            this.inProgress = false;
            this.isLoadedOnce = true;
        }));
    }

    @action updateSearchKeyword(keyword) {
        this.searchKeyword = keyword.toLowerCase();
    }
}

export default new AccountStore();

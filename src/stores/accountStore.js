import { observable, action, computed } from 'mobx';
import Hangul from 'hangul-js';
import api from '../utils/api';
import tradingPairStore from './tradingPairStore';
import userStore from './userStore';
import { Decimal } from '../utils/decimal';
import number from '../utils/number';

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
            if(this._hasSearchKeywordInAccount(searcher, account)) {
                const tradingPairName = account.asset_symbol + '-KRW';
                let tradingPair = tradingPairStore.getTradingPairByTradingPairName(tradingPairName);
                accounts.push({
                    uuid: account.uuid,
                    balance: number.removeTrailingZeros(account.balance),
                    asset_symbol: account.asset_symbol,
                    asset_english_name: account.asset_english_name,
                    asset_korean_name: account.asset_korean_name,
                    pending_order: number.removeTrailingZeros(account.pending_order),
                    pending_withdrawal: number.removeTrailingZeros(account.pending_withdrawal),
                    avg_fiat_buy_price: number.removeTrailingZeros(account.avg_fiat_buy_price),
                    is_avg_fiat_buy_price_modified: account.is_avg_fiat_buy_price_modified,
                    asset_close_price: number.removeTrailingZeros(tradingPair ? tradingPair.close_price : '0')
                })
            }
        });
        return accounts;
    };

    @computed get totalAssetsEvaluation() {
        let totalEvaluatedValueInKRW = Decimal(0); // 자산 평가액(KRW)
        let holdingKRW = Decimal(0) // 보유 KRW
        let totalBuyingPrice = Decimal(0); // 총 매수 금액
        let evaluatedPriceOfAccountsWithoutKRW = Decimal(0); // 평가 금액
        let evaluatedRevenue = 0;
        let evaluatedRevenueRatio = Decimal(0);
        this.accounts.forEach((account) => {
            if (account.asset_symbol === 'KRW') {
                holdingKRW = Decimal(account.balance);
            } else {
                let buyingPrice = Decimal(account.balance) * Decimal(account.avg_fiat_buy_price);
                totalBuyingPrice = totalBuyingPrice.add(buyingPrice);
                let evaluatedPrice = Decimal(account.balance) * Decimal(account.asset_close_price);
                evaluatedPriceOfAccountsWithoutKRW = evaluatedPriceOfAccountsWithoutKRW.add(evaluatedPrice);
            }
        });
        evaluatedRevenue = evaluatedPriceOfAccountsWithoutKRW.minus(totalBuyingPrice);
        if (totalBuyingPrice !== 0) evaluatedRevenueRatio = evaluatedRevenue / totalBuyingPrice;
        totalEvaluatedValueInKRW = evaluatedPriceOfAccountsWithoutKRW.add(holdingKRW);
        return {
            totalEvaluatedValueInKRW: number.removeTrailingZeros(totalEvaluatedValueInKRW.toString()),
            holdingKRW: number.removeTrailingZeros(holdingKRW.toString()),
            totalBuyingPrice: number.removeTrailingZeros(totalBuyingPrice.toString()),
            evaluatedPriceOfAccountsWithoutKRW: number.removeTrailingZeros(evaluatedPriceOfAccountsWithoutKRW.toString()),
            evaluatedRevenue: number.removeTrailingZeros(evaluatedRevenue.toString()),
            evaluatedRevenueRatio: number.removeTrailingZeros(evaluatedRevenueRatio.toString())
        };
    }

    getAccountByAssetSymbol(assetSymbol) {
        const account = this.accountsRegistry.get(assetSymbol) || null;
        return account;
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

    _hasSearchKeywordInAccount(searcher, account) {
        return (this._assetSymbolContainsSearchKeyword(searcher, account)
        || this._assetKoreanNameContainsSearchKeyword(searcher, account)
        || this._assetEnglishNameContainsSearchKeyword(searcher, account))
        ? true
        : false;
    }

    _assetSymbolContainsSearchKeyword(searcher, account) {
        return searcher.search(account.asset_symbol.toLowerCase()) >= 0 ? true : false;
    }

    _assetKoreanNameContainsSearchKeyword(searcher, account) {
        return searcher.search(account.asset_korean_name) >= 0 ? true : false;
    }

    _assetEnglishNameContainsSearchKeyword(searcher, account) {
        return searcher.search(account.asset_english_name.toLowerCase()) >= 0 ? true : false;
    }

    @action loadAccounts() {
        this.inProgress = true;
        this.errors = null;
        const userUuid = userStore.user && userStore.user.user_uuid;

        return api.getAccountsByUser(userUuid)
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

import { observable, action, computed } from 'mobx';
import Hangul from 'hangul-js';
import agent from '../utils/agent';
import tradingPairStore from './tradingPairStore';
import whitelistedWithdrawalWalletAddressStore from './whitelistedWithdrawalWalletAddressStore';
import Decimal from '../utils/decimal';
import number from '../utils/number';
import AccountModel from './models/AccountModel';

export const QUOTE_SYMBOL = 'KRW';

class AccountStore {
    @observable isLoading = false;

    /*
     * 보유 Assets (balance를 포함함)
     */
    @observable isLoadedOnce = false;
    @observable accountsRegistry = observable.map();

    @observable totalAccountsCount = 0;
    @observable searchKeyword = '';
    @observable selectedAccountSymbol = '';
    @computed
    get selectedAccount() {
        return this.getAccountByAssetSymbol(this.selectedAccountSymbol);
    }


    @action
    setSelectedAccountSymbol(symbol) {
        if (!symbol) {
            this.selectedAccountSymbol = '';
        } else {
            this.selectedAccountSymbol = symbol;
            whitelistedWithdrawalWalletAddressStore.setAssetSymbol(symbol);
        }
    }

    @action
    clearCurrency() {
        this.selectedAccountSymbol = '';
    }

    @action
    updateSearchKeyword(keyword) {
        this.searchKeyword = keyword.toLowerCase();
    }

    @computed
    get accounts() {
        let accounts = [];
        const searcher = new Hangul.Searcher(this.searchKeyword);
        this.accountsRegistry.forEach((account) => {
            if (this._hasSearchKeywordInAccount(searcher, account)) {
                account = this.getAccountByAssetSymbol(account.asset_symbol);
                accounts.push(account);
            }
        });
        accounts = this._sort(accounts);
        accounts = this._putKrwUsdtBtcInFront(accounts);
        return accounts;
    };

    @computed
    get allAccounts() {
        let accounts = [];
        this.accountsRegistry.forEach((account) => {
            account = this.getAccountByAssetSymbol(account.asset_symbol);
            accounts.push(account);
        });
        return accounts;
    };

    _sort = (accounts) => {
        let sortedAccounts = null;
        try {
            sortedAccounts = accounts.sort((prev, next) => {
                if (!next.value_present) return -1;
                if (!prev.value_present) return 1;
                return Decimal(next.value_present).minus(prev.value_present).toFixed();
            });
        } catch (err) {
            return accounts;
        }

        return sortedAccounts;
    }

    _putKrwUsdtBtcInFront = (accounts) => {
        const rearrangedAccounts = [];
        let KRWAccount = null;
        let USDTAccount = null;
        let BTCAccount = null;

        accounts.forEach((account) => {
            KRWAccount = KRWAccount || (account.asset_symbol === 'KRW' ? account : null);
            USDTAccount = USDTAccount || (account.asset_symbol === 'USDT' ? account : null);
            BTCAccount = BTCAccount || (account.asset_symbol === 'BTC' ? account : null);

            if (
                !['KRW', 'USDT', 'BTC'].includes(account.asset_symbol)
            ) {
                rearrangedAccounts.push(account);
            }
        });
        if (BTCAccount) rearrangedAccounts.unshift(BTCAccount);
        if (USDTAccount) rearrangedAccounts.unshift(USDTAccount);
        if (KRWAccount) rearrangedAccounts.unshift(KRWAccount);

        return rearrangedAccounts;
    }

    @computed
    get portfolio() {
        let portfolio = [];
        let totalBought = Decimal(0);
        let totalEvaluation = Decimal(0);
        let totalChange = Decimal(0);
        let totalChangeRate = Decimal(0);
        this.accountsRegistry.forEach((account) => {
            const trading_pair_name = account.asset_symbol + '-' + QUOTE_SYMBOL;
            let trading_pair = tradingPairStore.getTradingPairByName(trading_pair_name) || {};
            if (
                account.asset_symbol !== QUOTE_SYMBOL //원화가 아니고
                && account.balance
                && Decimal(account.balance).greaterThan(0) // balance가 존재할 때
                && Decimal(account.value_present).greaterThan(10)
            ) {
                totalBought = totalBought.plus(account.value_bought);
                totalEvaluation = totalEvaluation.plus(account.value_present);

                portfolio.push(account);
            }
        });
        totalChange = totalEvaluation.minus(totalBought);
        totalChangeRate = totalBought.equals(0) ? null : totalChange.dividedBy(totalBought) ;

        return {
            portfolio: portfolio,
            summary: {
                totalBought: totalBought.toPrecision(),
                totalEvaluation: totalEvaluation.toPrecision(),
                totalChange: totalChange.toPrecision(),
                totalChangeRate: totalChangeRate ? totalChangeRate.toPrecision() : null
            }
        }
    };

    @computed
    get totalAssetsEvaluation() {
        try {
            let total_evaluated_price_in_quote = Decimal(0); // 자산 평가액(base_symbol)
            let holding_quote_decimal = Decimal(0) // 보유 base_symbol
            let total_token_buying_price = Decimal(0); // 총 매수 금액
            let total_tokens_evaluated_price_in_quote = Decimal(0); // 평가 금액
            let evaluated_revenue = Decimal(0);
            let evaluated_revenue_ratio = Decimal(0);
        
            this.allAccounts.forEach((account) => {
                let {
                    balance,
                    avg_fiat_buy_price,
                    close_price,
                    asset_symbol
                } = account || {};
                if (balance) {
                    if (asset_symbol !== QUOTE_SYMBOL) {
                        let holdingToken_decimal = Decimal(balance);
                        let buyingPriceOfToken = holdingToken_decimal
                            .mul(avg_fiat_buy_price);
                        total_token_buying_price = total_token_buying_price
                            .add(buyingPriceOfToken);
        
                        let evaluatedPriceOfToken = holdingToken_decimal
                            .mul(close_price);
                        total_tokens_evaluated_price_in_quote = total_tokens_evaluated_price_in_quote
                            .add(evaluatedPriceOfToken);
                    } else {
                        holding_quote_decimal = holding_quote_decimal.add(balance);
                    }
                }
            });

            evaluated_revenue = total_tokens_evaluated_price_in_quote.minus(total_token_buying_price);
            total_evaluated_price_in_quote = total_tokens_evaluated_price_in_quote.add(holding_quote_decimal);

            if (!total_token_buying_price.equals(0)) {
                evaluated_revenue_ratio = evaluated_revenue.div(total_token_buying_price);
            }
            let result = {
                total_evaluated_price_in_quote: total_evaluated_price_in_quote.toFixed(), // 총 평가액: 모든 토큰의 close_price 환산 평가 액 + 보유 base_symbol
                holding_quote: holding_quote_decimal.toFixed(), // 보유 base_symbol
                total_token_buying_price: total_token_buying_price.toFixed(), // 구매금액: 모든 토큰을 구매할 때 쓴 금액
                total_tokens_evaluated_price_in_quote: total_tokens_evaluated_price_in_quote.toFixed(), // 모든 토큰의 close_price 환산 평가 액
                evaluated_revenue: evaluated_revenue.toFixed(), // 총 평가액 - 구매금액 = 수익
                evaluated_revenue_ratio: evaluated_revenue_ratio.toFixed() // 수익률 = 수익 / 구매 금액
            };
            return result;
        } catch (err) {
            let result = {
                total_evaluated_price_in_quote: null,
                holding_quote: null,
                total_token_buying_price: null,
                total_tokens_evaluated_price_in_quote: null,
                evaluated_revenue: null,
                evaluated_revenue_ratio: null,
            };
            return result;
        }
    }

    getAccountByAssetSymbol(assetSymbol) {
        return this.accountsRegistry.get(assetSymbol);;
    }

    @action
    setAccount(account) {
        this.accountsRegistry.get(account.asset_symbol).update(account);
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

    @action
    loadAccounts() {
        this.isLoading = true;

        this.accountsRegistry.clear();
        return agent.loadAccounts()
            .then(action((response) => {
                this.accountsRegistry.clear();
                let accounts = response.data;
                accounts.forEach((account) => {
                    this.accountsRegistry.set(account.asset_symbol, new AccountModel(account));
                    this.totalAccountsCount = accounts.length;
                });
                this.isLoading = false;
                this.isLoadedOnce = true;
            }))
            .catch(action((err) => {
                this.isLoading = false;
                this.isLoadedOnce = true;
                throw err;
            }));
    }

    @action
    createAndGetWarmWalletAddress(targetTokenSymbol) {
        this.isLoading = true;

        let account = this.getAccountByAssetSymbol(targetTokenSymbol);
        return agent.createAndGetWarmWalletAddress(account.uuid)
            .then(action((response) => {
                this.accountsRegistry.set(targetTokenSymbol, { ...account, wallet_address: { address: response.data.address } });
                this.isLoading = false;
            }))
            .catch(action((err) => {
                this.isLoading = false;
                throw err;
            }));
    }

}

export default new AccountStore();

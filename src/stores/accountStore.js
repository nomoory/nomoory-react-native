import { observable, action, computed } from 'mobx';
import Hangul from 'hangul-js';
import agent from '../utils/agent';
import userStore from './userStore';
import tradingPairStore from './tradingPairStore';
import Decimal from '../utils/decimal';
import number from '../utils/number';

const QUOTE_SYMBOL = 'KRW';

class AccountStore {
    @observable isLoading = false;
    @observable errors = null;

    /*
     * 보유 Assets (balance를 포함함)
     */
    @observable isLoadedOnce = false;
    @observable accountsRegistry = observable.map();

    @observable totalAccountsCount = 0;
    @observable searchKeyword = '';
    @observable selectedAccountSymbol = '';

    @action setSelectedAccountSymbol(symbol) {
        if (!symbol) {
            this.selectedAccountSymbol = '';
        } else {
            this.selectedAccountSymbol = symbol;
            whitelistedWithdrawalWalletAddressStore.setAssetSymbol(symbol);
        }
    }

    @action clearCurrency() {
        this.selectedAccountSymbol = '';
    }

    @action updateSearchKeyword(keyword) {
        this.searchKeyword = keyword.toLowerCase();
    }

    @computed get accounts() {
        let accounts = [];
        const searcher = new Hangul.Searcher(this.searchKeyword);
        this.accountsRegistry.forEach((account) => {
            if (this._hasSearchKeywordInAccount(searcher, account)) {
                account = this.getAccountByAssetSymbol(account.asset_symbol);
                accounts.push(account);
            }
        });
        accounts = this._sort(accounts);
        accounts = this._putKRWInFront(accounts);
        return accounts;
    };

    _sort(accounts) {
        accounts = accounts.sort((prev, next) => {
            try {
                return Decimal(prev.evaluated_in_base_currency).lessThan(next.evaluated_in_base_currency);
            } catch (err) {
                return true;
            }
        });
        return accounts;
    }
    _putKRWInFront(accounts) {
        let indexOfKRW = accounts.findIndex(account => {
            return account.asset_symbol === 'KRW';
        });
        if (indexOfKRW) {
            let splicedAccounts = accounts.splice(indexOfKRW, 1);
            if (splicedAccounts[0]){
                accounts.unshift(splicedAccounts[0]);
            }
        }
        return accounts;
    }

    @computed get portfolio() {
        let portfolio = [];
        let totalBought = Decimal(0);
        let totalEvaluation = Decimal(0);
        let totalChange = Decimal(0);
        let totalChangeRate = Decimal(0);
        this.accountsRegistry.forEach((account) => {
            const trading_pair_name = account.asset_symbol + '-' + QUOTE_SYMBOL;
            let trading_pair = tradingPairStore.getTradingPairByTradingPairName(trading_pair_name) || {};
            if (
                account.asset_symbol !== QUOTE_SYMBOL //원화가 아니고
                && account.balance 
                && Decimal(account.balance).greaterThan(0) // balance가 존재할 때
                && trading_pair.close_price 
                && Decimal.mul(account.balance, trading_pair.close_price).greaterThan(10)
            ) {
                let value_bought = Decimal(account.avg_fiat_buy_price || 0).times(account.balance);
                let value_present = trading_pair.close_price ?  Decimal(trading_pair.close_price).times(account.balance) : '';
                let value_change = value_present ? value_present.minus(value_bought) : '';
                let value_change_rate = value_change ? value_bought.equals(0) ? null : value_change.dividedBy(value_bought) : '';

                totalBought = totalBought.plus(value_bought);
                if (value_present)
                    totalEvaluation = totalEvaluation.plus(value_present);

                portfolio.push( {...account, ...{
                    pending_order_amount: account.pending_order_amount || account.pending_order,
                    // 해당 asset(ex. 비트코인, 이오스 등)의 close_price를 저장하여 후에 evaluation 시 사용합니다.
                    asset_close_price: trading_pair.close_price && '',
                    value_bought: value_bought ? value_bought.toPrecision() : '',
                    value_present: value_present ? value_present.toPrecision() : '',
                    value_change: value_change ? value_change.toPrecision() : '',
                    value_change_rate: value_change_rate ? value_change_rate.toPrecision() : ''
                }});
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

    @computed get totalAssetsEvaluation() {
        let total_evaluated_price_in_quote = Decimal(0); // 자산 평가액(base_symbol)
        let holding_quote_decimal = Decimal(0) // 보유 base_symbol
        let total_token_buying_price = Decimal(0); // 총 매수 금액
        let total_tokens_evaluated_price_in_quote = Decimal(0); // 평가 금액
        let evaluated_revenue = Decimal(0);
        let evaluated_revenue_ratio = Decimal(0);
    
        this.accounts.forEach((account) => {
            try {
                let { balance } = account || {};
                if (balance) {
                    if (account.asset_symbol !== QUOTE_SYMBOL) {
                        let holdingToken_decimal = Decimal(balance);
                        let buyingPriceOfToken = holdingToken_decimal.mul(account.avg_fiat_buy_price);
                        total_token_buying_price = total_token_buying_price.add(buyingPriceOfToken);
        
                        let evaluatedPriceOfToken = holdingToken_decimal.mul(account.close_price);
                        total_tokens_evaluated_price_in_quote = total_tokens_evaluated_price_in_quote.add(evaluatedPriceOfToken);
                    } else {
                        holding_quote_decimal = holding_quote_decimal.add(balance);
                    }
                }
            } catch (err) {
                console.log('err on get totalAssetsEvaluation of account: ', account)
            }

        });

        evaluated_revenue = total_tokens_evaluated_price_in_quote.minus(total_token_buying_price);
        total_evaluated_price_in_quote = total_tokens_evaluated_price_in_quote.add(holding_quote_decimal);

        if (!total_token_buying_price.equals(0)) evaluated_revenue_ratio = total_tokens_evaluated_price_in_quote.div(total_token_buying_price);
        let result = {
            total_evaluated_price_in_quote: total_evaluated_price_in_quote.toFixed(), // 총 평가액: 모든 토큰의 close_price 환산 평가 액 + 보유 base_symbol
            holding_quote: holding_quote_decimal.toFixed(), // 보유 base_symbol
            total_token_buying_price: total_token_buying_price.toFixed(), // 구매금액: 모든 토큰을 구매할 때 쓴 금액
            total_tokens_evaluated_price_in_quote: total_tokens_evaluated_price_in_quote.toFixed(), // 모든 토큰의 close_price 환산 평가 액
            evaluated_revenue: evaluated_revenue.toFixed(), // 총 평가 액 - 구매금액 = 수익
            evaluated_revenue_ratio: evaluated_revenue_ratio.toFixed() // 수익률 = 수익 / 구매 금액
        };
        return result;
    }

    getAccountByAssetSymbol(assetSymbol) {
        let account = this.accountsRegistry.get(assetSymbol);
        if (!account) return null;
        let balance = (account && account.balance) || '0';

        let close_price = '1'; // 원화일 경우 close_price는 1원
        let evaluated_in_base_currency = '';
        if ( assetSymbol !== QUOTE_SYMBOL ) {
            let tradingPairName = assetSymbol + '-' + QUOTE_SYMBOL;
            let tradingPair = tradingPairStore.getTradingPairByTradingPairName(tradingPairName);
            close_price = tradingPair ? (tradingPair.close_price || '0') : '0';
            evaluated_in_base_currency = Decimal(close_price).mul(balance).toFixed();    
        } else {
            evaluated_in_base_currency = balance;
        }

        account = {
            ...account,
            // 해당 asset(ex. 비트코인, 이오스 등)의 close_price를 저장하여 후에 evaluation 시 사용합니다.
            close_price: close_price,
            evaluated_in_base_currency: evaluated_in_base_currency, // 평가금액
        };
        return account;
    }

    @action setAccount(account) {
        // pubnub 에서 넘어오는 정보에 누락이 있을 수 있기때문에 spread를 사용
        this.accountsRegistry.set(account.asset_symbol, {...this.accountsRegistry.get(account.asset_symbol), ...account});
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
        this.isLoading = true;
        this.errors = null;
        return agent.loadAccounts()
            .then(action((response) => {
                this.accountsRegistry.clear();
                let accounts = response.data;
                accounts.forEach((account) => {
                    this.accountsRegistry.set(account.asset_symbol, account);
                    this.totalAccountsCount = accounts.length;
                });
                this.isLoading = false;
                this.isLoadedOnce = true;
            }))
            .catch(action((err) => {
                this.errors = err.response && err.response.body && err.response.body.errors;
                this.isLoading = false;
                this.isLoadedOnce = true;
                throw err;
            }));
    }

    @action createAndGetWarmWalletAddress(targetTokenSymbol) {
        this.isLoading = true;
        this.errors = undefined;

        let account = this.getAccountByAssetSymbol(targetTokenSymbol);
        return agent.createAndGetWarmWalletAddress(account.uuid)
            .then(action((response) => {
                this.accountsRegistry.set(targetTokenSymbol, { ...account, wallet_address: { address: response.data.address } });
                this.isLoading = false;
            }))
            .catch(action((err) => {
                this.errors = err.response && err.response.body && err.response.body.errors;
                this.isLoading = false;
                throw err;
            }));
    }

}

export default new AccountStore();

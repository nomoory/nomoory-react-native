import {
    observable,
    action,
    computed
} from 'mobx';
// import orderStore from './orderStore';
import Hangul from 'hangul-js';
import api from '../utils/api';

class TradingPairStore {
    @observable inProgress = false;
    @observable errors = null;
    @observable searchKeyword = '';
    @observable filters = {
        'interest': false,
    };
    @observable sorts = {
        //'propertyName': 'asc', // asc|desc|null
    };
    @observable clickedTradingPairTab = 'KRW';

    @observable tradingPairsRegistry = observable.map([
        { name: 'test' },
        { name: 'test2' }
    ]);

    clear() {
        this.tradingPairsRegistry.clear();
    }

    getTradingPair(name) {
        return this.tradingPairsRegistry.get(name);
    }

    @computed 
    get tradingPairs() {
        let tradingPairs = [...this.tradingPairsRegistry];
        tradingPairs = this._filter(tradingPairs);
        tradingPairs = this._search(tradingPairs);
        tradingPairs = this._sort(tradingPairs);
        return tradingPairs;
    }

    @action 
    loadTradingPairs() {
        this.inProgress = true;
        this.errors = undefined;
        api.getTradingPairs()
            .then(action((response) => {
                let tradingPairs = response.data;
                this.tradingPairsRegistry.clear();
                tradingPairs.forEach((tradingPair) => {
                    this.tradingPairsRegistry.set(tradingPair.name, tradingPair);
                });
                // trading_pair들이 존재해야, price를 받아올수 있기때문에 여기다 배치.
                // orderStore.setPriceForOrder();
            }))
            .catch(action((err) => {
                this.errors = err.response && err.response.body && err.response.body.errors;
                throw err;
            }))
            .then(action(() => {
                this.inProgress = false;
            }));
    }

    @action 
    updateSearchKeyword(keyword = '') {
        this.searchKeyword = keyword;
    }

    @action 
    updateTickerInTradingPair(ticker) {
        const tickerData = ticker.message
        if (this.tradingPairsRegistry.has(tickerData.trading_pair_name)) {
            const tradingPair = this.tradingPairsRegistry.get(tickerData.trading_pair_name)
            Object.assign(tradingPair, tickerData);
        };
    }

    _filter = (tradingPairs) => {
        if(this.filters.interest) { 
            tradingPairs = tradingPairs.filter((tradingPair) => this._userHasInterestIn(tradingPair));
        }
        return tradingPairs;
    }
    _userHasInterestIn(tradingPair) {
        // TODO user의 관심리스트에 tradingPair가 있는지 여부 확인하여 return
        return false;
    }
    _search = (tradingPairs) => {
        return tradingPairs.filter((tradingPair) => {
            const searcher = new Hangul.Searcher(this.searchKeyword.toLowerCase());
            return this._hasSearchKeywordInTradingPair(searcher, tradingPair); 
        });
    }
    _sort = (tradingPairs) => {
        for(propertyName in this.sorts) {
            const direction = this.sorts[propertyName];
            if(direction) {
                tradingPairs = tradingPairs.sort((prev, next) =>
                    direction === 'asc' ? 
                    prev[propertyName] - next[propertyName] : 
                    next[propertyName] - prev[propertyName]
                );
            }
        }
        return tradingPairs;
    }

    _hasSearchKeywordInTradingPair(searcher, tradingPair) {
        return (
            this._quoteSymbolContainsSearchKeyword(searcher, tradingPair) || 
            this._quoteKoreanNameContainsSearchKeyword(searcher, tradingPair) || 
            this._quoteEnglishNameContainsSearchKeyword(searcher, tradingPair)
        ) ? true : false;
    }

    _quoteSymbolContainsSearchKeyword(searcher, tradingPair) {
        return searcher.search(tradingPair.quote_symbol && tradingPair.quote_symbol.toLowerCase()) >= 0 ? true : false;
    }

    _quoteKoreanNameContainsSearchKeyword(searcher, tradingPair) {
        return searcher.search(tradingPair.quote_korean_name) >= 0 ? true : false;
    }

    _quoteEnglishNameContainsSearchKeyword(searcher, tradingPair) {
        return searcher.search(tradingPair.quote_english_name && tradingPair.quote_english_name.toLowerCase()) >= 0 ? true : false;
    }

}

const tradingPairStore = new TradingPairStore();

export default tradingPairStore;

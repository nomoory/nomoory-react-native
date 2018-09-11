import {
    observable,
    action,
    computed,
    reaction
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
        open_price: 'desc'
    };
    @observable selectedTradingPairTab = 'KRW';

    @observable tradingPairsRegistry = observable.map();

    constructor() {
        const reactionTab = reaction(
            () => this.searchKeyword,
            (searchKeyword) => {
                console.log(searchKeyword+'f');
            }
        );
        let stubTradingPairs = [
            {
                "uuid": "9b208459-390e-4334-84c4-3c00cabf3b59",
                "name": "ETH-KRW",
                "base_symbol": "KRW",
                "base_english_name": "Korean Won",
                "base_korean_name": "원화",
                "quote_symbol": "ETH",
                "quote_english_name": "Ethereum",
                "quote_korean_name": "이더리움",
                "fee_rate": "0.00100000000000000000",
                "open_price": 3000,
                "high_price": null,
                "low_price": null,
                "close_price": 2000,
                "change": "",
                "change_price": null,
                "change_rate": null,
                "signed_change_price": null,
                "signed_change_rate": null,
                "trade_volume": null,
                "acc_trade_value_24h": null,
                "acc_trade_volume_24h": null
            },
            {
                "uuid": "703b8d42-21be-409e-ae15-35c1858bb909",
                "name": "BTC-KRW",
                "base_symbol": "KRW",
                "base_english_name": "Korean Won",
                "base_korean_name": "원화",
                "quote_symbol": "BTC",
                "quote_english_name": "Bitcoin",
                "quote_korean_name": "비트코인",
                "fee_rate": "0.00100000000000000000",
                "open_price": 2000,
                "high_price": 3000,
                "low_price": 2000,
                "close_price": 3000,
                "change": "RISE", // EVEN|RISE|FALL
                "change_price": 1000,
                "change_rate": 0.43,
                "signed_change_price": 1000,
                "signed_change_rate": 0.43,
                "trade_volume": 350, //최근
                "acc_trade_value_24h": 35000,
                "acc_trade_volume_24h": 35000
            },
            {
                "uuid": "703b8d42-21be-409e-ae15-35c1858bb904",
                "name": "EOS-BTC",
                "base_symbol": "BTC",
                "base_english_name": "Bitcoin",
                "base_korean_name": "비트코인",
                "quote_symbol": "EOS",
                "quote_english_name": "Eos",
                "quote_korean_name": "이오스",
                "fee_rate": "0.00100000000000000000",
                "open_price": 2000,
                "high_price": 3000,
                "low_price": 2000,
                "close_price": 3000,
                "change": "RISE", // EVEN|RISE|FALL
                "change_price": 1000,
                "change_rate": 0.43,
                "signed_change_price": 1000,
                "signed_change_rate": 0.43,
                "trade_volume": 350, //최근
                "acc_trade_value_24h": 35000,
                "acc_trade_volume_24h": 35000
            }
        ];

        stubTradingPairs.forEach((tradingPair) => {
            this.tradingPairsRegistry.set(tradingPair.name, tradingPair);
        });
    }
    clear() {
        this.tradingPairsRegistry.clear();
    }

    getTradingPair(name) {
        return this.tradingPairsRegistry.get(name);
    }

    @computed 
    get tradingPairs() {
        let tradingPairs = [];
        this.tradingPairsRegistry.forEach((tradingPair, key) => {
            tradingPairs.push(tradingPair);
        })
        tradingPairs = this._tab(tradingPairs);
        tradingPairs = this._filter(tradingPairs);
        tradingPairs = this._search(this.searchKeyword, tradingPairs);
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
    setSearchKeyword(keyword = '') {
        this.searchKeyword = keyword;
    }
    @action 
    setTab(keyword = '') {
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
    @action setSelectedTradingPairTab(baseSymbol) {
        this.selectedTradingPairTab = baseSymbol;
    }


    _tab = (tradingPairs) => {
        tradingPairs = tradingPairs.filter((tradingPair) => 
            tradingPair.base_symbol === this.selectedTradingPairTab
        );
        return tradingPairs;
    }
    _filter = (tradingPairs) => {
        if(this.filters.interest) { 
            tradingPairs = tradingPairs.filter((tradingPair) => this._userHasInterestIn(tradingPair));
        }
        return tradingPairs;
    }
    _userHasInterestIn(tradingPair) {
        // TODO user의 관심리스트에 tradingPair가 있는지 여부 확인하여 return
        return true;
    }
    _search = (searchKeyword, tradingPairs) => {
        if (!searchKeyword) {
            return tradingPairs;
        }
        const searcher = new Hangul.Searcher(searchKeyword.toLowerCase());
        return tradingPairs.filter((tradingPair) => {
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

    _hasClickedBaseSymbolInTradingPair(baseSymbol) {
        // 현재 유저가 누른 TradingPairTab(base_symbol)의 Base Symbol에 해당하는 TradingPair인지를 확인한다.
        return this.selectedTradingPairTab === baseSymbol ? true : false;
    }

}

const tradingPairStore = new TradingPairStore();

export default tradingPairStore;

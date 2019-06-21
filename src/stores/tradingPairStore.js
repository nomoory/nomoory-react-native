import { observable, action, computed, reaction } from 'mobx';
import orderbookStore from './orderbookStore';
import orderStore from './orderStore';
import Hangul from 'hangul-js';
import agent from '../utils/agent';
import {Decimal} from '../utils/number';

class TradingPairStore {
    constructor() {
        /*
         * 선택한 trading pair가 변경될때마다 그에 맞는 orderbook을 load 합니다.
         */
        const selectedTradingPairNameReaction = reaction(
            () => this.selectedTradingPairName,
            async (selectedTradingPairName) => {
                orderbookStore.clearOrderbook();
                await orderbookStore.loadOrderbook(selectedTradingPairName);
                orderStore.setTradingPair(selectedTradingPairName);
            }
        );
    }
    
    @observable
    isLoading = false;

    @observable
    selectedTradingPairName = null; // 거래소 스크린상에서 선택된 trading pair

    @observable
    searchKeyword = '';

    @observable
    filters = {
        'interest': false,
    };

    @observable
    languageForTokenName = 'ko';

    @observable
    sorts = [ // direction: asc|desc|null
        { name: 'close_price', direction: null }, // 현재가
        { name: 'signed_change_rate', direction: null }, // 부호가 있는 변화율 (24시간 대비)
        { name: 'acc_trade_value_24h', direction: null }, // 24시간 누적 거래대금
    ];

    @observable
    selectedTradingPairTab = 'KRW';

    @observable
    tradingPairsRegistry = observable.map();

    @computed 
    get selectedTradingPair() {
        return this.getTradingPairByTradingPairName(this.selectedTradingPairName);
    }

    @computed 
    get displayNameOfLanguageForTokenName() {
        if(this.languageForTokenName === 'ko') return '한글명';
        if(this.languageForTokenName === 'en') return '영문명';
        return '한글명';
    }
    
    @action clear() {
        this.tradingPairsRegistry.clear();
    }

    getTradingPairByTradingPairName(tradingPairName) {
        return this.tradingPairsRegistry.get(tradingPairName) || null;
    }

    @computed get tradingPairs() {
        let tradingPairArray = [];
        this.tradingPairsRegistry.forEach((tradingPair, key) => {
            tradingPairArray.push(tradingPair);
        });
        // tradingPairs = this._tab(tradingPairs);
        // tradingPairs = this._filter(tradingPairs);
        tradingPairArray = this._search(this.searchKeyword, tradingPairArray);
        tradingPairArray = this._defaultSort(tradingPairArray);
        tradingPairArray = this._sort(tradingPairArray);
        return tradingPairArray;
    }

    @action loadTradingPairs() {
        this.isLoading = true;
        this.errors = undefined;
        console.log('load trading pair');
        agent.loadTradingPairs()
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
                this.errors = 
                    err.response && 
                    err.response.body && 
                    err.response.body.errors;
            }))
            .then(action(() => {
                this.isLoading = false;
            }));
    }
    @action setSelectedTradingPairName(tradingPairName) {
        this.selectedTradingPairName = tradingPairName;
    }
    
    @action setSearchKeyword(keyword = '') {
        this.searchKeyword = keyword;
    }

    @action updateTickerInTradingPair(ticker) {
        const tickerData = ticker || {};
        if (this.tradingPairsRegistry.has(tickerData.trading_pair_name)) {
            const tradingPair = 
                this.tradingPairsRegistry.get(tickerData.trading_pair_name);
            Object.assign(tradingPair, tickerData);
        };
    }
    @action setSelectedTradingPairTab(baseSymbol) {
        this.selectedTradingPairTab = baseSymbol;
    }
    @action toggleLanguageForTokenName() {
        this.languageForTokenName = 
            this.languageForTokenName === 'ko' ? 'en' : 'ko';
    }
    @action toggleSortDirectionOf(target) {
        this.sorts = this.sorts.map((sort) => {
            let newSort = { name: sort.name };
            if(sort.name !== target) {
                newSort.direction = null;
            } else {
                if(!sort.direction){
                    newSort.direction = 'asc';
                } else if (sort.direction === 'asc') {
                    newSort.direction = 'desc';
                } else if (sort.direction === 'desc') {
                    newSort.direction = null;
                } else {
                    newSort.direction = null;
                }
            }
            return newSort;
        });
    }    

    _tab = (tradingPairs) => {
        tradingPairs = tradingPairs.filter((tradingPair) => 
            tradingPair.base_symbol === this.selectedTradingPairTab
        );
        return tradingPairs;
    }
    _filter = (tradingPairs) => {
        if(this.filters.interest) { 
            tradingPairs = tradingPairs.filter((tradingPair) => 
                this._userHasInterestIn(tradingPair)
            );
        }
        return tradingPairs;
    }
    _userHasInterestIn(tradingPair) {
        // TODO user의 관심리스트에 tradingPair가 있는지 여부 확인하여 return
        return true;
    }
    _search = (searchKeyword, tradingPairs) => {
        if (!searchKeyword) { return tradingPairs; }
        const searcher = new Hangul.Searcher(searchKeyword.toLowerCase());
        return tradingPairs.filter((tradingPair) => {
            return this._hasSearchKeywordInTradingPair(searcher, tradingPair); 
        });
    }

    _sort = (tradingPairs) => {
        for(let sort of this.sorts) {
            if(sort.direction) {
                tradingPairs = tradingPairs.sort((prev, next) =>
                    sort.direction === 'asc' ?
                    prev[sort.name] - next[sort.name] : 
                    next[sort.name] - prev[sort.name]
                );
            }
        }
        return tradingPairs;
    }

    _defaultSort = (tradingPairs) => {
        const sortedTtradingPairs = tradingPairs.sort((prev, next) => {
            const prevValue = prev.acc_trade_value_24h;
            const nextValue = next.acc_trade_value_24h;
            if (prevValue === '') return 1;
            if (nextValue === '') return -1;
            const prevValue_decimal = Decimal(prevValue || 0);
            const nextValue_decimal = Decimal(nextValue || 0);

            if (prevValue_decimal.greaterThan(nextValue_decimal)) {
                return -1;
            }
            if (nextValue_decimal.greaterThan(prevValue_decimal)) {
                return 1;
            }
            return 0;
        });

        return sortedTtradingPairs;
    }

    _hasSearchKeywordInTradingPair(searcher, tradingPair) {
        return (
            this._quoteSymbolContainsSearchKeyword(searcher, tradingPair) || 
            this._quoteKoreanNameContainsSearchKeyword(searcher, tradingPair) || 
            this._quoteEnglishNameContainsSearchKeyword(searcher, tradingPair)
        ) ? true : false;
    }

    _quoteSymbolContainsSearchKeyword(searcher, tradingPair) {
        return searcher.search(tradingPair.base_symbol && tradingPair.base_symbol.toLowerCase()) >= 0 ? true : false;
    }

    _quoteKoreanNameContainsSearchKeyword(searcher, tradingPair) {
        return searcher.search(tradingPair.base_korean_name) >= 0 ? true : false;
    }

    _quoteEnglishNameContainsSearchKeyword(searcher, tradingPair) {
        return searcher.search(tradingPair.base_english_name && tradingPair.base_english_name.toLowerCase()) >= 0 ? true : false;
    }

    _hasClickedBaseSymbolInTradingPair(baseSymbol) {
        // 현재 유저가 누른 TradingPairTab(base_symbol)의 Base Symbol에 해당하는 TradingPair인지를 확인한다.
        return this.selectedTradingPairTab === baseSymbol ? true : false;
    }
}

const tradingPairStore = new TradingPairStore();

export default tradingPairStore;

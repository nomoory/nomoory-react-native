import {
    observable,
    action,
    reaction,
    computed,
} from 'mobx';
import { AsyncStorage } from 'react-native';
import userStore from './userStore';

class CommonStore {
    constructor() {
        reaction(
            () => this.isToastifyOff,
            (isToastifyOff) => {
                if (isToastifyOff) {
                    window.localStorage.setItem('isToastifyOff', isToastifyOff);
                } else {
                    window.localStorage.removeItem('isToastifyOff');
                }
            },
        );
    }

    // Favorite trading pair
    @observable
    localFavoriteTradingPairNames = AsyncStorage.getItem('favorite_trading_pairs')
        ? AsyncStorage.getItem('favorite_trading_pairs').split(',') || []
        : [];

    @action
    toggleFavoriteTradingPair(targetTradingPairName) {
        if (false /* userStore.isLoggedIn */) {
            // synchronous request and change user info in user store
        } else {
            if (this.localFavoriteTradingPairNames.includes(targetTradingPairName)) {
                this.localFavoriteTradingPairNames = this.localFavoriteTradingPairNames.filter(tradingPairName => targetTradingPairName !== tradingPairName);
            } else {
                this.localFavoriteTradingPairNames = [...this.localFavoriteTradingPairNames, targetTradingPairName];
            }
            AsyncStorage.setItem('favorite_trading_pairs', this.localFavoriteTradingPairNames);
        }
    }

    @computed
    get userFavoriteTradingPairNames() {
        if (userStore.isLoggedIn) {
            /* user 정보로부터 favorite list를 가져와
             * 1) localStorage를 변경
             * 2) 해당 정보를 어레이로 리턴합니다.
             */
        }
        return null;
    }

    @computed
    get favoriteTradingPairNames() {
        return this.userFavoriteTradingPairs || this.localFavoriteTradingPairNames;
    }
}

export default new CommonStore();

import { computed } from 'mobx';
import {
    putComma,
    getRateAsPercentage,
    getNumberAndPowerOfTenFromNumber,
    getFixedValueWithComma,
} from '../../utils/number';
import Model from './Model';
import commonStore from '../commonStore';
import TRANSLATION from '../../TRANSLATIONS';

class TradingPairModel extends Model {
    @computed
    get closePriceDisplay() {
        return this.open_price && this.close_price ? putComma(this.close_price) : '-';
    }

    @computed
    get highPriceDisplay() {
        return putComma(this.high_price) || '-';
    }

    @computed
    get lowPriceDisplay() {
        return putComma(this.low_price) || '-';
    }

    @computed
    get signedChangeRateDisplay() {
        return this.signed_change_rate ? putComma(getRateAsPercentage(this.signed_change_rate, 2)) : '-';
    }

    @computed
    get signedChangePriceDisplay() {
        return this.signed_change_price ? putComma(this.signed_change_price) : '-';
    }

    @computed
    get tradingPairNameDisplay() {
        return this.name && this.name.split('-').join('/');
    }

    @computed
    get accTradeVolume24hDisplay() {
        try {
            const { number, type } = getNumberAndPowerOfTenFromNumber(this.acc_trade_volume_24h) || {};
            return `${getFixedValueWithComma(number)} ${TRANSLATION[type]}` || '-';
        } catch (err) {
            return '-';
        }
    }

    @computed
    get accTradeValue24hDisplay() {
        try {
            const { number, type } = getNumberAndPowerOfTenFromNumber(this.acc_trade_value_24h) || {};
            return `${getFixedValueWithComma(number)} ${TRANSLATION[type]}` || '-';
        } catch (err) {
            return '-';
        }
    }

    @computed
    get translatedAssetNameDisplay() {
        const {
            base_korean_name,
            base_english_name,
        } = this;
        if (i18next.language === 'ko') {
            return base_korean_name;
        }
        return base_english_name;
    }

    @computed
    get isFavorite() {
        return commonStore.favoriteTradingPairNames.includes(this.name);
    }
}

export default TradingPairModel;

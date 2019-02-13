import React from 'react';
import { observable, action, computed, reaction } from 'mobx';

import tradingPairStore from './tradingPairStore';
import accountStore from './accountStore';
import modalStore from './modalStore';
import orderFeeStore from './orderFeeStore';
import Decimal from '../utils/decimal';
import agent from '../utils/agent';
import number from '../utils/number';

class OrderStore {
    @observable isLoading = false;
    @observable errors = undefined;

    @observable values = {
        trading_pair: 'BTC-KRW',
        side: 'BUY',
        volume: '0',
        price: '0',
        order_type: 'LIMIT',
    };
    @action clear() {
        this.values = {...this.values,
            ...{
                side: 'BUY',
                volume: '0',
                price: '0',
                order_type: 'LIMIT',
            }
        };
    }
    @computed get unit_price() { return number.getUnitPrice(this.values.price, this.quoteSymbol) }
    @computed get isBuy() { return this.values.side === 'BUY'; }
    @computed get isSell() { return this.values.side === 'SELL'; }
    @computed get amount() {
        try {
            let { price, volume } = this.values || {};
            return Decimal(price).mul(volume).toFixed();    
        } catch(e) {
            return '';
        }
    }
    @computed get baseSymbol() {
        let tradingPairName = this.values.trading_pair || tradingPairStore.selectedTradingPairName;
        return tradingPairName ? tradingPairName.split('-')[0] : '';
    }

    @computed get quoteSymbol() {
        let tradingPairName = this.values.trading_pair || tradingPairStore.selectedTradingPairName;
        return tradingPairName ? tradingPairName.split('-')[1] : '';
    } 

    @computed get minimumOrderAmount() {
        let tradingPair = tradingPairStore.selectedTradingPair || { minimum_order_amount: 1000 };
        return tradingPair.minimum_order_amount;
    }

    @computed get maxFeeRate() { 
        let orderFee = orderFeeStore.orderFee || {};
        let feeRate = number.maximum(orderFee.taker_fee_rate || '0' , orderFee.maker_fee_rate || '0');
        return feeRate;
    }

    @computed get maxFee() {
        try {
            if (this.isBuy) { return Decimal(Decimal(this.maxFeeRate || 0).mul(this.values.volume || 0).toFixed(8, Decimal.ROUND_UP )).toFixed(); }
            if (this.isSell) { return Decimal(this.maxFeeRate || 0).mul(this.amount || 0).toFixed(2, Decimal.ROUND_UP); }
        } catch (e) {
            return '';
        }
    }

    @computed get totalPrice() {
        return Decimal(this.amount || 0).add(this.maxFee || 0).toFixed();
    }

    @computed get totalGain() {
        try {
            if (this.isBuy) { return Decimal(this.values.volume).minus(this.maxFee).toFixed(); }
            if (this.isSell) { return Decimal(this.amount || 0).minus(this.maxFee || 0).toFixed(); }
        } catch (e) {
            return '';
        }
    }

    @computed get isValidOrder() {
        let quoteAccount = accountStore.getAccountByAssetSymbol(this.quoteSymbol);
        let baseAccount = accountStore.getAccountByAssetSymbol(this.baseSymbol);
        let liquid_decimal = Decimal(quoteAccount ? quoteAccount.liquid || 0 : 0 );
        let liquid_base_decimal = Decimal(baseAccount ? baseAccount.liquid || 0 : 0 );
        if (this.values.side === 'BUY') {
            if (Decimal(this.values.volume || 0).lessThanOrEqualTo(0)) {
                return {
                    message_code: `your_buy_order_volume_below_zero`,
                    state: false 
                }
            }
            if (Decimal(this.values.price || 0).lessThanOrEqualTo(0)) {
                return {
                    message_code: `your_buy_order_price_below_zero`, 
                    state: false 
                }
            }
            if (!Decimal(this.values.price || 0).mod(this.unit_price || 0).equals(0)) {
                return {
                    message_code: `buy_price_should_be_divisible_by_unit_price`,
                    state: false
                }
            }
            if (liquid_decimal.lessThan(this.amount)) {
                return {
                    message_code: `your_budget_is_less_than_total_price_including_fee`,
                    state: false
                }
            }
            if (Decimal(this.amount || 0).lessThan(this.minimumOrderAmount || 0)) {
                return {
                    message_code: `your_total_price_is_less_than_minimum_order_amount`,
                    state: false
                }
            }
        }

        if (this.values.side === 'SELL') {
            if (Decimal(this.values.volume || 0).lessThanOrEqualTo(0)) {
                return {
                    message_code: `your_sell_order_volume_below_zero`,
                    state: false 
                }
            }
            if (Decimal(this.values.price || 0).lessThanOrEqualTo(0)) {
                return {
                    message_code: `your_sell_order_price_below_zero`, 
                    state: false 
                }
            }
            if (liquid_base_decimal.lessThan(this.values.volume || 0)) {
                return {
                    message_code: `your_sell_order_volume_greater_than_you_have`,
                    state: false
                }
            }

            if (!Decimal(this.values.price || 0).mod(this.unit_price || 0).equals(0)) {
                return {
                    message_code: `sell_price_should_be_divisible_by_unit_price`,
                    state: false
                }
            }
            if (Decimal(this.totalPrice || 0).lessThan(this.minimumOrderAmount || 0)) {
                return {
                    message_code: `your_total_price_is_less_than_minimum_order_amount`,
                    state: false
                }                
            }
        }

        return {
            message_code: this.values.side,
            state: true
        };
    }
    @action setTradingPair(tradingPair) { this.values.trading_pair = tradingPair; }
    @action setSide(side) { this.values.side = side; }
    @action setVolumeByRate(rate) {
        try {
            let { side, price } = this.values;
            let maximumOrderableVolume = '0';
            if (side === 'BUY') {
                let symbol = this.quoteSymbol;
                let account  = accountStore.getAccountByAssetSymbol(symbol) || {};
                let liquid = account.liquid || '0';
    
                maximumOrderableVolume = price && Decimal(price).equals(0) ?  this.values.volume : Decimal(liquid).mul(rate).div(price).toFixed(8, Decimal.ROUND_DOWN);
            } else {
                let symbol = this.baseSymbol;
                let account  = accountStore.getAccountByAssetSymbol(symbol) || {};
                let liquid = account.liquid;
                maximumOrderableVolume = Decimal(liquid).mul(rate).toFixed(8, Decimal.ROUND_DOWN);
            }
            this.values.volume = Decimal(maximumOrderableVolume).toFixed();       
        } catch (err) {
            this.values.volume = this.values.volume
        }
    }

    increasePriceByButton = action(() => {
        try {
            let { price } = this.values;
            let unit_price = this.unit_price;
            let price_decimal = Decimal(price);
            let rest_decimal = price_decimal.modulo(unit_price);
            let temp_price, temp_unit_price;
            // 호가 단위 맞추기. ex) 1301 에서 minus 버튼 누르면, 1300으로. 1301에서 plus버튼 누르면 1305로.
            if (rest_decimal.equals(0)) {
                // 경계에서 호가단위가 바뀌는 것 처리. 1000 -> 995 가 아니라 999여야함
                temp_price = price_decimal.plus(unit_price);
                temp_unit_price = number.getUnitPrice(temp_price, this.quoteSymbol);
                // 경계에서 호가단위가 바뀌는 것 처리. 999 -> 1004 가 아니라 1000이여야함.
                if ((temp_price.modulo(temp_unit_price)).equals(0)) {
                    price_decimal = temp_price;
                } else {
                    price_decimal = price_decimal.plus(temp_unit_price);
                }
            } else {
                price_decimal = price_decimal.plus(unit_price).minus(rest_decimal);
            }
            this.setPrice(price_decimal.toFixed());
        } catch (e) { 
            return;
        }
    });

    decreasePriceByButton = action(() => {
        try {
            let { price } = this.values;
            let unit_price = this.unit_price;
            let price_decimal = Decimal(price);
            let rest_decimal = price_decimal.modulo(unit_price);
            let temp_price, temp_unit_price;
            // 호가 단위 맞추기. ex) 1301 에서 minus 버튼 누르면, 1300으로. 1301에서 plus버튼 누르면 1305로.
            if (rest_decimal.equals(0)) {
                // 경계에서 호가단위가 바뀌는 것 처리. 1000 -> 995 가 아니라 999여야함
                temp_price = price_decimal.minus(unit_price);
                temp_unit_price = number.getUnitPrice(temp_price, this.quoteSymbol);
                price_decimal = price_decimal.minus(temp_unit_price);
            } else {
                price_decimal = price_decimal.minus(rest_decimal);
            }
            this.setPrice(price_decimal.toFixed());
        } catch (e) { return; }
    });

    @action submitOrder() {
        if (this.isValidOrder.state === false) {
            modalStore.openPreset(
                '거래불가',
                this.isValidOrder.message_code,
                '확인'
            );
        } else {
            modalStore.openCustom(
                `주문 확인`,
                this._getOrderModalContent(),
                this._getOrderModalButtons()
            );
        }
    }

    @action setVolumeFromInput(volume) {
        if (!volume) this.values.volume = volume;
        try {
            Decimal(volume).toFixed();
            this.values.volume = volume;
        } catch (e) {
            this.values.volume = this.values.volume;
        }
    }

    @action setPriceFromInput(price) {
        if (this._isValidPrice(price)) {
            this.setPrice(price);
        }
    }
    @action correctPriceForSubmit() {
        this.values.price = number.getFixedPrice(this.values.price, this.quoteSymbol);
    }
    @action correctVolumeForSubmit() {
        this.values.volume = number.getFixedVolume(this.values.volume, this.baseSymbol);
    }
    @action setPrice(price) {
        this.values.price = price;
    }
    @action setVolume(volume) {
        this.values.volume = volume;
    }

    @action changeOrderSide(side) {
        this.values.side = side;
    }

    @action registerOrder() {
        this.isLoading = true;
        return agent.registerOrder({...this.values, unit_price: this.unit_price})
            .then(action((response) => {
                this.isLoading = false;
            }))
            .catch(action((err) => {
                this.errors = err.response && err.response.body && err.response.body.errors;
                this.isLoading = false;
                throw err;
            }));
    }

    _isValidPrice(value) {
        for (let [index, char] of Array.prototype.entries.apply(value)) {
            const allow = '0123456789'.split('');
            if (!(char in allow)) { // 숫자가 아니면 수용하지 않는다.
                if (char === '.') { // . 는 수용, 두개 이상은 안됨
                    if (index === 0) return false;
                    let dotCount = 0;
                    for (let char of value) {
                        if (char === '.') {
                            if (dotCount === 1) return false;
                            dotCount += 1;
                        }
                    }
                } else {
                    return false;
                }
            }
        }
        return true;
    }


    @observable orderFormSelectedTabType = 'BUY';
    @action setOrderFormSelectedTabType(type) {
        this.orderFormSelectedTabType = type;
    }

}

export default new OrderStore();

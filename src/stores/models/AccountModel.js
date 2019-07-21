import React from 'react';
import { observable, action, computed } from 'mobx';
import { Decimal } from '../../utils/number';
import Model from './Model';
import { QUOTE_SYMBOL } from '../accountStore';
import tradingPairStore from '../tradingPairStore';
import agent from '../../utils/agent';
import modalStore from '../modalStore';

class AccountModel extends Model {
    @observable
    withdrawValues = {
        address: null,
        amount: '',
        otpCode: '',
    }


    @computed
    get close_price() {
        try {
            if (this.asset_symbol !== 'KRW') {
                let exchangeTradingPair = this.getTradingPairByQuoteSymbol('KRW')
                if (exchangeTradingPair.close_price) {
                    return exchangeTradingPair.close_price;
                }

                for (let i = 0; i < tradingPairStore.quotes.length; i++) {
                    let quote = tradingPairStore.quotes[i];
                    if (quote !== 'KRW') {
                        exchangeTradingPair = this.getTradingPairByQuoteSymbol(quote);
                        const tradingPair = tradingPairStore.getTradingPairByName(`${quote}-${'KRW'}`);
                        if (exchangeTradingPair.close_price
                            && tradingPair.close_price
                        ) {    
                            return Decimal(tradingPair.close_price).mul(exchangeTradingPair.close_price).toFixed();
                            
                        }
                    }
                }
            }
            return null
        } catch (err) {
            return null;
        }
    }


    @computed
    get evaluated_in_base_currency() {
        try {
            if (this.asset_symbol !== QUOTE_SYMBOL) {
                return Decimal(this.close_price)
                    .mul(this.balance || '0')
                    .toFixed();
            }
            return null;
        } catch (err) {
            return null;
        }
    }

    @computed
    get value_bought() {
        try {
            if (this.asset_symbol !== QUOTE_SYMBOL) {
                return Decimal(this.avg_fiat_buy_price || 1)    .times(this.balance).toFixed();
            }
            return null;
        } catch (err) {
            return null;
        }
    }

    @computed
    get value_present() {
        try {
            if (this.asset_symbol !== QUOTE_SYMBOL) {
                return Decimal(this.close_price)
                    .times(this.balance).toFixed();
            }
            return null;
        } catch (err) {
            return null;
        }
    }

    @computed
    get value_change() {
        try {
            if (this.asset_symbol !== QUOTE_SYMBOL) {
                return Decimal(this.value_present)
                    .minus(this.value_bought)
                    .toFixed();
            }
            return null;
        } catch (err) {
            return null;
        }
    }

    @computed
    get value_change_rate() {
        try {
            if (Decimal(this.value_bought).equals(0)) {
                return null;
            }
            return Decimal(this.value_change)
                .dividedBy(this.value_bought)
                .toFixed();
        } catch (err) {
            return null;
        }
    }

    getTradingPairByQuoteSymbol(quoteSymbol = QUOTE_SYMBOL) {
        const tradingPairName = `${this.asset_symbol}-${quoteSymbol}`;
        const tradingPair = tradingPairStore.getTradingPairByName(tradingPairName, true) || null;
        return tradingPair;
    }

    // withdraw
    @observable withdrawValues = {
        address: null,
        amount: '',
        otpCode: '',
    }

    @action
    clearWithdrawValues() {
        this.withdrawValues = {
            address: null,
            amount: '',
            otpCode: '',
        };
    }

    @action
    setWithdrawAmount(amount) {
        if (!amount) this.withdrawValues.amount = '';
        try {
            // amount가 decimal로 변환 가능한 형태인지 체크
            Decimal(amount).toFixed();
            this.withdrawValues.amount = amount;
        } catch (e) {
            this.withdrawValues.amount = this.withdrawValues.amount;
        }
    }

    @action
    setMaxWithdrawAmout() {
        this.setWithdrawAmount(this.maxWithdrawAmout);
    }

    @action
    correctWithdrawAmount(amount) {
        let resultAmount = amount;
        if (!amount) this.setMaxWithdrawAmout('');

        try {
            const { asset_decimal_count } = this;
            if (this.maxWithdrawAmout
                && Decimal(amount).greaterThan(this.maxWithdrawAmout)
            ) {
                resultAmount = this.maxWithdrawAmout;
            }

            if (asset_decimal_count) {
                this.setWithdrawAmount(Decimal(Decimal(resultAmount).toFixed(+asset_decimal_count)).toFixed());
            } else {
                this.setWithdrawAmount(Decimal(resultAmount).toFixed());
            }
        } catch (err) {
            this.setMaxWithdrawAmout('');
        }
    }

    @action
    setWithdrawAddress(address) {
        this.withdrawValues.address = address;
    }

    @action
    setWithdrawOtpCode(otpCode) {
        this.withdrawValues.otpCode = otpCode;
    }

    @action
    createWithdrawReservationByAccount() {
        this.isLoading = true;
        const accountUuid = this.uuid;
        return agent.createWithdrawReservationByAccount(accountUuid, {
            address: this.withdrawValues.address,
            amount: this.withdrawValues.amount,
            otp_code: this.withdrawValues.otpCode,
        }).then(action(() => {
            modalStore.openPreset({
                title: '출금 요청 성공',
                content: (
                    <div>
                        <div>출금 요청이 정상처리 되었습니다.</div>
                        <div>입출금내역에서 처리상태를 확인하세요.</div>
                    </div>
                ),
                buttons: [{ name: '확인' }],
            });
            this.isLoading = false;
        })).catch(action((err) => {
            this.isLoading = false;
            throw err;
        }));
    }

    @computed
    get maxWithdrawAmout() {
        const {
            liquid,
            asset_withdrawal_fee,
            asset_decimal_count,
        } = this || {};
        const liquid_decimal = Decimal(liquid || 0);
        let withdrawable_decimal = liquid_decimal.minus(asset_withdrawal_fee || 0);

        if (withdrawable_decimal.lessThanOrEqualTo(0)) {
            return '0';
        }

        if (liquid_decimal.greaterThan(this.daily_remaining_overdraft_limit_in_base || 0)) {
            if (this.daily_remaining_overdraft_limit_in_base && this.daily_remaining_overdraft_limit_in_base !== '0') {
                withdrawable_decimal = Decimal(this.daily_remaining_overdraft_limit_in_base).minus(asset_withdrawal_fee || 0);
            } else {
                withdrawable_decimal = Decimal(0);
            }
        }

        if (asset_decimal_count) {
            withdrawable_decimal = Decimal(Decimal(withdrawable_decimal.toFixed(+asset_decimal_count)));
        }

        return withdrawable_decimal.toFixed();
    }

    @computed
    get totalWithdrawAmount() {
        let totalAmount = null;
        const { amount } = this.withdrawValues;
        const { asset_withdrawal_fee } = this || {};
        totalAmount = amount
            ? Decimal(amount).add(asset_withdrawal_fee || 0).toFixed()
            : Decimal(asset_withdrawal_fee || 0).toFixed();
        return totalAmount;
    }

    @computed
    get daily_overdraft_limit_in_base() {
        try {
            if (Decimal(this.close_price).equals(0)) return null;
            return Decimal(Decimal(this.daily_overdraft_limit).div(this.close_price).toFixed(8, Decimal.ROUND_DOWN)).toFixed();
        } catch (err) {
            return '';
        }
    }

    @computed
    get daily_remaining_overdraft_limit_in_base() {
        try {
            if (Decimal(this.close_price).equals(0)) return null;
            return Decimal(Decimal(this.daily_remaining_overdraft_limit).div(this.close_price).toFixed(8, Decimal.ROUND_DOWN)).toFixed();
        } catch (err) {
            return '';
        }
    }

    @computed
    get daily_withdrawable_balance_in_base() {
        try {
            if (Decimal(this.close_price).equals(0)) return null;
            return Decimal(Decimal(this.daily_withdrawable_balance).div(this.close_price).toFixed(8, Decimal.ROUND_DOWN)).toFixed();
        } catch (err) {
            return '';
        }
    }

    @computed get isWithdrawValid() {
        const {
            amount,
            address,
        } = this.withdrawValues;
        const {
            asset_min_withdrawal_amount, // 어카운트가 생성될 때 입력됨. 각 토큰 단위
            liquid,
        } = this || {};

        if (!address) {
            return {
                message_code: 'fill_in_wallet_address',
                state: false,
            };
        }
        if (!amount) {
            return {
                message_code: 'fill_in_withdraw_amount',
                state: false,
            };
        }
        if (Decimal(this.totalWithdrawAmount || 0).greaterThan(liquid || 0)) {
            return {
                message_code: 'withdraw_amount_greater_than_liquid',
                state: false,
            };
        }
        if (Decimal(this.totalWithdrawAmount || 0).greaterThan(this.daily_remaining_overdraft_limit_in_base || 0)) {
            return {
                message_code: 'withdraw_amount_greater_than_daily_withdrawable_balance_in_base',
                state: false,
            };
        }
        if (Decimal(amount || 0).lessThan(asset_min_withdrawal_amount || 0)) {
            return {
                message_code: 'withdraw_amount_less_than_asset_min_withdrawal_amount',
                state: false,
            };
        }
        return {
            message_code: 'request_withdraw',
            state: true,
        };
    }
}

export default AccountModel;

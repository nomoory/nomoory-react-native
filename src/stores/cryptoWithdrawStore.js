import { observable, action, computed } from 'mobx';
import accountStore from './accountStore';

// account가 선택되어야 이에 따른 출금이 가능하므로 accountStore에 종속적입니다.
// 암호화폐 출금에 사용되는 store입니다.

class CryptoWithdrawStore {
    @observable isLoading = false;
    @observable withdrawValues = {
        address: null,
        amount: '',
        otpCode: '',
    }
    @action clearWithdrawValuse() {
        this.withdrawValues = {
            address: null,
            amount: '',
            otpCode: '',
        }
    }
    @computed get totalWithdrawAmount() {
        let totalAmount = null;
        let amount = this.withdrawValues.amount;
        let account = accountStore.selectedAccount;
        let {
            asset_withdrawal_fee,
        } = account || {};
        totalAmount = amount ? Decimal(amount).add(asset_withdrawal_fee || 0).toFixed() : Decimal(asset_withdrawal_fee || 0).toFixed();
        return totalAmount;
    }

    @computed get isWithdrawAmountValid() {
        let amount = this.withdrawValues.amount;
        let account = accountStore.selectedAccount;
        let {
            daily_overdraft_limit,
            daily_withdrawable_balance,
            asset_min_withdrawal_amount,
            liquid,
            asset_withdrawal_fee,
        } = account || {};

        if (!amount) {
            return {
                message_code: 'fill_in_withdraw_amount',
                state: false,
            }
        }
        if (Decimal(this.totalWithdrawAmount).greaterThan(liquid)) {
            return {
                message_code: 'withdraw_amount_greater_than_liquid',
                state: false,
            }
        }
        if (Decimal(this.totalWithdrawAmount).greaterThan(daily_withdrawable_balance)) {
            return {
                message_code: 'withdraw_amount_greater_than_daily_withdrawable_balance',
                state: false,
            }
        }
        if (Decimal(amount).lessThan(asset_min_withdrawal_amount)) {
            return {
                message_code: 'withdraw_amount_less_than_asset_min_withdrawal_amount',
                state: false,
            }
        }

        return {
            message_code: 'valid_withdraw_amount',
            state: true,
        }
    }
    
    @action setMaxWithdrawAmout = () => {
        let {
            liquid,
            asset_withdrawal_fee
        } = accountStore.selectedAccount || {};
        let liquid_decimal = Decimal(liquid || 0);
        let withdrawable_decimal = liquid_decimal.minus(asset_withdrawal_fee || 0);

        if (liquid_decimal.greaterThan(this.daily_remaining_overdraft_limit_in_base || 0)) {
            if (this.daily_remaining_overdraft_limit_in_base && this.daily_remaining_overdraft_limit_in_base !== '0') {
                withdrawable_decimal = Decimal(this.daily_remaining_overdraft_limit_in_base).minus(asset_withdrawal_fee || 0);
            } else {
                withdrawable_decimal = Decimal(0);
            }
        }

        if (withdrawable_decimal.lessThanOrEqualTo(0)) {
            this.setWithdrawAmount('0');
            return;
        }
        this.setWithdrawAmount(withdrawable_decimal.toFixed());
    }

    @computed get daily_overdraft_limit_in_base() {
        try {
            let { close_price, daily_overdraft_limit } = accountStore.selectedAccount || {};
            if (Decimal(close_price).equals(0)) return null;
            return Decimal(Decimal(daily_overdraft_limit).div(close_price).toFixed(8, Decimal.ROUND_DOWN)).toFixed();
        } catch (err) {
            return '';
        }
    }

    @computed get daily_remaining_overdraft_limit_in_base() {
        try {
            let { close_price, daily_remaining_overdraft_limit } = accountStore.selectedAccount || {};
            if (Decimal(close_price).equals(0)) return null;
            return Decimal(Decimal(daily_remaining_overdraft_limit).div(close_price).toFixed(8, Decimal.ROUND_DOWN)).toFixed();
        } catch (err) {
            return '';
        }
    }

    @computed get daily_withdrawable_balance_in_base() {
        try {
            let { close_price, daily_withdrawable_balance } = accountStore.selectedAccount || {};
            if (Decimal(close_price).equals(0)) return null;
            return Decimal(Decimal(daily_withdrawable_balance).div(close_price).toFixed(8, Decimal.ROUND_DOWN)).toFixed();
        } catch (err) {
            return '';
        }
    }

    @action setWithdrawAddress(address) {
        this.withdrawValues.address = address;
    }

    @action setWithdrawAmount(amount) {
        if (!amount) this.withdrawValues.amount = '';
        try {
            this.withdrawValues.amount = Decimal(amount).toFixed();
        } catch (e) {
            this.withdrawValues.amount = this.withdrawValues.amount;
        }
    }

    @action setWithdrawOtpCode(otpCode) {
        this.withdrawValues.otpCode = otpCode;
    }

    @computed get isWithdrawValid() {
        let { amount, address } = this.withdrawValues;
        let { selectedAccount } = accountStore.selectedAccount;
        let {
            asset_min_withdrawal_amount, // 어카운트가 생성될 때 입력됨. 각 토큰 단위
            liquid,
        } = selectedAccount || {};

        if (!address) {
            return {
                message_code: 'fill_in_wallet_address',
                state: false,
            }
        }
        if (!amount) {
            return {
                message_code: 'fill_in_withdraw_amount',
                state: false,
            }
        }
        if (Decimal(this.totalWithdrawAmount || 0).greaterThan(liquid || 0)) {
            return {
                message_code: 'withdraw_amount_greater_than_liquid',
                state: false,
            }
        }
        if (Decimal(this.totalWithdrawAmount || 0).greaterThan(this.daily_remaining_overdraft_limit_in_base || 0)) {
            return {
                message_code: 'withdraw_amount_greater_than_daily_withdrawable_balance_in_base',
                state: false,
            }
        }
        if (Decimal(amount || 0).lessThan(asset_min_withdrawal_amount || 0)) {
            return {
                message_code: 'withdraw_amount_less_than_asset_min_withdrawal_amount',
                state: false,
            }
        }
        return {
            message_code: 'request_withdraw',
            state: true,
        }
    }

    // @action openOtpVerificationForWithdrawReservation() {
    //     modalStore.openCustom(
    //         <div className='otp-verification-header'>
    //             <img className="header-icon" width="32px" src={`${process.env.RAZZLE_ASSET_ORIGIN}/images/verificationPopup/otp_verification_icon.png`} />
    //             <div>OTP 인증</div>
    //         </div>,
    //         () =>
    //             <div className='otp-verification-body second-step' key='otp-verification-body'>
    //                 <div className='notice'>OTP 앱에 생성된 6자리 코드를 입력하십시오.</div>
    //                 <div className='otp-six-digit-code-container'>
    //                     <input className="otp-code-input" type="text" placeholder="OTP 코드 6자리를 입력해주세요."
    //                         onChange={(e) => { this.setWithdrawOtpCode(e.target.value) }} />
    //                 </div>
    //                 <button className={`otp-submit-button coblic-button coblic-blue-button 
    //                 ${this.withdrawValues.otpCode.length !== 6 && 'coblic-disabled-button'}`}
    //                     onClick={() => {
    //                         modalStore.closeModal();
    //                         this.createWithdrawReservationByAccount()
    //                     }
    //                     }>인증</button>
    //                 <hr className='divide-bar' />
    //             </div>,
    //         <div className='otp-verification-footer'>
    //             <div className="otp-footer-item-container">
    //                 <div>OTP 인증 불가 및 복구코드 분실시 <a href="#">help@coblic.com</a>로 문의해주세요</div>
    //             </div>
    //         </div>
    //     );
    // }

    @action createWithdrawReservationByAccount() {
        this.isLoading = true;
        let { uuid } = accountStore.selectedAccount || {};
        return agent.createWithdrawReservationByAccount(uuid, {
            address: this.withdrawValues.address,
            amount: this.withdrawValues.amount,
            otp_code: this.withdrawValues.otpCode,
        })
            .then(action((response) => {
                // modalStore.openPreset(
                //     '출금 요청 성공',
                //     <div>
                //         <div>출금 요청이 정상처리 되었습니다.</div>
                //         <div>입출금내역에서 처리상태를 확인하세요.</div>
                //     </div>,
                //     i18next.t('button/confirm')
                // )
                this.isLoading = false;
            }))
            .catch(action((err) => {
                this.errors = err.response && err.response.body && err.response.body.errors;
                this.isLoading = false;
                throw err;
            }));
    }
}

const cryptoWithdrawStore = new CryptoWithdrawStore();

export default cryptoWithdrawStore;
import axios from 'axios';
import qs from 'qs';
import errorHelper from '../utils/errorHelper';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import authStore from '../stores/authStore';
import { computed } from 'mobx';

let API_ENDPOINT = null;
let API_VERSION = null;

if (__DEV__) {
    API_ENDPOINT = Expo.Constants.manifest.extra.REACT_APP_DEV_API_ENDPOINT;
    API_VERSION = Expo.Constants.manifest.extra.REACT_APP_DEV_API_VERSION;
} else {
    API_ENDPOINT = Expo.Constants.manifest.extra.REACT_APP_API_ENDPOINT;
    API_VERSION = Expo.Constants.manifest.extra.REACT_APP_API_VERSION;
}

const API_ROOT = `${API_ENDPOINT}/api/${API_VERSION}`;

class Agent {
    constructor(baseURL = null) {
        this.axios = axios.create({
            baseURL,        
            paramsSerializer: params => qs.stringify(params, {arrayFormat: 'repeat'})
        });
        this.API_ROOT = baseURL;
        if (Platform.OS) {
            this.axios.defaults.headers.common['User-Agent'] =
                (
                    Platform.OS === "ios" ? 
                    "CoblicAppiOS/1.0.0" : 
                    "CoblicAppAndroid/1.0.0"
                ) + ( 
                    this.axios.defaults.headers.common['User-Agent'] ? 
                    ' ' + this.axios.defaults.headers.common['User-Agent'] : 
                    '' 
                );
        }
    }

    @computed
    get userUuid() {
        return authStore.userUuid;
    }

    /** 
     * 추후 자동으로 basic end points를 생성하는 로직이 필요하다고 여겨질 때 참고
     * https://codeburst.io/how-to-call-api-in-a-smart-way-2ca572c6fe86
     */
    /* APIs */

    // User and Auth
    signup(signupInfo) {
        return axios.post(`${API_ROOT}/users/signup/`, signupInfo).catch(this._handleError);
    }

    login(loginInfo) {
        return axios.post(`${API_ROOT}/users/login/`, loginInfo).catch(this._handleError);
    }

    logout() {
        return this.delete(`users/logout/`);
    }

    validatePassword(password) {
        return axios.post(`${API_ROOT}/users/validate_password/`, { password });
    }

    // Password Reset
    requestPasswordResetEmail(emailInfo) {
        return axios.post(`${API_ROOT}/users/send_password_reset_email/`, emailInfo).catch(this._handleError);
    }

    resetPassword(resetInfo, userUuid) {
        return axios.post(`${API_ROOT}/users/reset_password/?user_uuid=${userUuid}`, resetInfo).catch(this._handleError);
    }

    loadUser(userUuid) {
        return this.get(`users/${userUuid}/`);
    }

    async getOtpQrcodeUrl() {
        let userUuid = this.userUuid;
        return this.get(`/users/${userUuid}/otp_qrcode/`);
    }

    async verifyOTP(otpInfo) {        
        let userUuid = this.userUuid;

        return axios.post(`${API_ROOT}/verify/otp/?user_uuid=${userUuid}`, otpInfo).catch(this._handleError);
    }

    verifyOTPLogin(otpLoginInfo) {
        return axios.post(`${API_ROOT}/verify/otp_login/`, otpLoginInfo).catch(this._handleError);
    }

    // Order
    registerOrder(orderInfo) {
        return this.post(`orders/`, orderInfo);
    }

    // Orderbook
    loadOrderbookByTradingPairName(trading_pair) {
        return this.get(`trading_pairs/orderbook/?trading_pair_name=${trading_pair}`);
    }

    // Trade
    loadTradingPairs() {
        return this.get(`trading_pairs/`);
    }

    //TradeHistory
    loadRealtimeTrades(trading_pair) {
        return this.get(`trades/?trading_pair_name=${trading_pair}`);
    }

    loadDailyTrades(trading_pair) {
        return this.get(`day_candles/?trading_pair=${trading_pair}`);
    }

    //TransactionHistory
    async loadTransactionHistory(transaction_type, trading_pair_name) {
        let userUuid = this.userUuid;
        let url = `users/${userUuid}/transaction_histories/?transaction_type=${transaction_type}`;
        if (trading_pair_name) url += `&trading_pair_name=${trading_pair_name}`;
        return this.get(url);
    }

    // Accounts
    async loadAccounts() {
        let userUuid = this.userUuid;
        return this.get(`users/${userUuid}/accounts/`);
    }

    // Personal Trades
    async loadPersonalTrades(selectedTradingPairName) {
        let userUuid = this.userUuid;
        return this.get(`users/${userUuid}/trades/?trading_pair_name=${selectedTradingPairName}`);
    }

    async loadPersonalPlacedOrders(tradingPairName) {
        let userUuid = this.userUuid;
        if (!tradingPairName) {
            return this.get(`users/${userUuid}/orders/?order_status=PLACED&order_status=PENDING&order_status=PARTIALLY_FILLED`);
        }

        return this.get(`users/${userUuid}/orders/?trading_pair_name=${tradingPairName}&order_status=PLACED&order_status=PENDING&order_status=PARTIALLY_FILLED`);

        // let params = {
        //     order_status: [
        //         'PLACED', 'PENDING', 'PARTIALLY_FILLED',
        //     ],
        // };
        // if (tradingPairName) params.trading_pair_name = tradingPairName;
        // return this.get(`users/${commonStore.user_uuid}/orders/`, params);
    }

    createAndGetWarmWalletAddress(account_uuid) {
        return this.post(`accounts/${account_uuid}/warm_wallet/`);
    }

    loadDepositAndWithdraw(account_uuid, transaction_type) {
        return this.get(`accounts/${account_uuid}/wallet_transfers/${(transaction_type ? `?transfer_type=${transaction_type}` : '')}`);
    }

    // Email Verification
    async requestActivateEmailAgain() {
        let userUuid = this.userUuid;
        return this.post(`/users/${userUuid}/resend_activate_email/`, null);
    }

    verifyEmail(activation_info, user_uuid) {
        return axios.post(`${API_ROOT}/verify/email/?user_uuid=${user_uuid}`, activation_info).catch(this._handleError);
    }

    // Whitelisted Withdrawal Wallet Address
    registerWithdrawalWalletAddress(addressInfo) {
        return this.post(`withdrawal_wallets/`, addressInfo);
    }

    deleteWithdrawalWalletAddress(walletUuid) {
        return this.delete(`withdrawal_wallets/${walletUuid}/`);
    }

    loadWithdrawalWalletAddresses(asset_symbol) {
        return this.get(`withdrawal_wallets/?asset_symbol=${asset_symbol}`);
    }

    // Bank account 
    async loadBankAccount() {
        let userUuid = this.userUuid;
        return this.get(`/users/${userUuid}/bank_accounts/latest/`);
    }
    async registerBankAccount(accountInfo) {
        let userUuid = this.userUuid;
        return this.post(`/users/${userUuid}/bank_accounts/`, accountInfo);
    }
    async deleteBankAccount(bankAccountUuid) {
        let userUuid = this.userUuid;
        return this.delete(`/users/${userUuid}/bank_accounts/${bankAccountUuid}/`);
    }

    loadBankDepositHistory(account_uuid) {
        return this.get(`/accounts/${account_uuid}/krw_deposits/`);
    }
    cancelDepositByAccountUuidAndDepositUuid(accountUuid, depositUuid) {
        return this.delete(`/accounts/${accountUuid}/krw_deposits/${depositUuid}/`);
    }

    loadBankWithdrawHistory(account_uuid) {
        return this.get(`/accounts/${account_uuid}/krw_withdrawals/`);
    }

    createKrwDepositReservation(accountId, depositInfo = { amount: 0 }) {
        return this.post(`/accounts/${accountId}/krw_deposits/`, depositInfo);
    }

    createKrwWithdrawReservation(accountId, withdrawInfo = { amount: 0 }) {
        return this.post(`/accounts/${accountId}/krw_withdrawals/`, withdrawInfo);
    }

    // Account
    createWithdrawReservationByAccount(accountUuid, reservationInfo) {
        return this.post(`accounts/${accountUuid}/wallet_transfers/withdrawals/`, reservationInfo);
    }

    // Coblic token status
    loadCoblicTokenStatus() {
        return axios.get(`${API_ROOT}/coblic_token_status/latest/`).catch(this._handleError);
    }
    // verification kyc
    async uploadIdPhotoImage(data) {
        let userUuid = this.userUuid;
        return this.postFile(`/users/${userUuid}/upload_id_photo/`, data);
    }

    async uploadKycPhotoImage(data) {
        let userUuid = this.userUuid;
        return this.postFile(`/users/${userUuid}/upload_kyc_photo/`, data);
    }

    async updatePersonalIdentificationAgreement(agreements) {
        let userUuid = this.userUuid;
        return this.post(`/users/${userUuid}/identification_agreement/`, agreements);
    }

    // Register referral code
    async registerReferralCode(referralCodeInfo) {
        let userUuid = this.userUuid;
        return this.post(`/users/${userUuid}/referrals/`, referralCodeInfo);
    }
    async updatePersonalAgreement(agreements) {
        let userUuid = this.userUuid;
        return this.post(`/users/${userUuid}/phone_agreement/`, agreements);
    }
    // load my rank
    async loadMyRank() {
        let userUuid = this.userUuid;
        return this.get(`/users/${userUuid}/rank/me/`);
    }

    // order fees
    loadOrderFee() {
        return this.get(`/fee/latest/`);
    }

    // announcement
    loadAnnouncementList() {
        return this.get(`/announcements/`);
    }
    loadAnnouncementById(announcementId) {
        return this.get(`/announcements/${announcementId}/`);
    }

    // lockup & unlock
    loadLockupPolicies() {
        return this.get(`/policies/latest/`);
    }
    loadLatestLockup() {
        return this.get(`/lockup/latest/`);
    }
    loadLockups() {
        return this.get(`/lockup/`);
    }
    lockup(lockupInfo) {
        return this.post(`/lockup/`, lockupInfo);
    }
    unlock() {
        return this.delete(`/lockup/latest/`);
    }
    loadLockupPolicy() {
        return this.get(`/policies/`);
    }
    loadCurrentDividendRoundSummary() {
        return this.get(`/summary/`);
    }

    // dividend
    loadDividendRoundHistory() {
        return this.get(`/dividends/`);
    }

    // Personal Order History
    deletePlacedOrderById(orderId) {
        return this.delete(`/orders/${orderId}/`);
    }

    // event dashboard 
    loadEvnentDashboard() {
        return this.get(`/event_dashboard/`);
    }

    updateUserPushToken({token, user}) {
        const payload = {};
        if (token) payload.token = token;
        if (user) payload.user = user;
        return this.post(`/users/push-token`, payload);
    }

    /* Base REST API method */
    get(url, params = {}) {
        // console.log('request get | ', url);
        const config = this.requestConfig;
        return this.axios
            .get(url, { params, ...config })
            .catch(this._handleError);
    }
    async put(url, body) {
        // console.log('request put | ', url);
        return this.axios
            .put(url, body, this.requestConfig)
            .catch(this._handleError);
    }
    async patch(url, body) {
        // console.log('request patch | ', url);

        return this.axios
            .patch(url, body, this.requestConfig)
            .catch(this._handleError);
    }
    async post(url, body) {
        // console.log('request post | ', url);

        return this.axios
            .post(url, body, this.requestConfig)
            .catch(this._handleError);
    }
    async delete(url) {
        // console.log('request delete | ', url);

        return this.axios
            .delete(url, this.requestConfig)
            .catch(this._handleError);
    }

    async postFile(url, file) {
        return this.axios
            .post(url, file, await this._getRequestConfigForFilePost())
            .catch(this._handleError);

    }

    @computed
    get requestConfig() {
        let requestConfig = null;
        let accessToken = authStore.accessToken;
        if (accessToken) {
            requestConfig = { 
                headers: { 
                    'Authorization': `Bearer ${accessToken}`,
                }
            };
        }

        return requestConfig;
    }
    async _getRequestConfigForFilePost() {
        let requestConfig = null;
        let accessToken = await SecureStore.getItemAsync('access_token');
        if (accessToken) {
            requestConfig = {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            };
        } else {
            let userAgentString =
                Platform.OS === "ios" ? 
                "CoblicAppiOS/1.0.0" : 
                "CoblicAppAndroid/1.0.0" ;

            requestConfig = {
                headers: {
                    'User-Agent': userAgentString,
                    'user-agent': userAgentString,
                }
            }
        }
        return requestConfig;
    }
    _handleError(error) {

        if (!error.response) {
            // 서버 꺼져있을때 에러 핸들링
            throw error;
        }
        errorHelper.handleErrorCode(error.response);
        throw error;
    }

    getPayFormValue = async () => {
        let userUuid = this.userUuid;
        return `${API_ROOT}/verify/mcash/?user_uuid=${userUuid}`;
    }
    getAPIRoot = () => {
        return API_ROOT;
    }
}

let agent = new Agent(API_ROOT);

export default agent;
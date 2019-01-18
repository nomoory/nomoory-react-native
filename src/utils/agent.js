import axios from 'axios';
import authStore from '../stores/authStore';
import userStore from '../stores/userStore';
import tradingPairStore from '../stores/tradingPairStore';
import errorHelper from '../utils/errorHelper';
import { SecureStore } from 'expo';


const REACT_APP_API_ENDPOINT = Expo.Constants.manifest.extra.REACT_APP_API_ENDPOINT;
const REACT_APP_API_VERSION = Expo.Constants.manifest.extra.REACT_APP_API_VERSION;
const REACT_APP_DEV_API_ENDPOINT = Expo.Constants.manifest.extra.REACT_APP_DEV_API_ENDPOINT;
const REACT_APP_DEV_API_VERSION = Expo.Constants.manifest.extra.REACT_APP_DEV_API_VERSION;
const API_ROOT = `${REACT_APP_API_ENDPOINT}/api/${REACT_APP_API_VERSION}`;
const DEV_API_ROOT = `${REACT_APP_DEV_API_ENDPOINT}/api/${REACT_APP_DEV_API_VERSION}`;

class Agent {
    constructor(baseURL = null) {
        
        this.axios = axios.create({ baseURL });
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

    async getUserUuid() {
        let userUuid = await SecureStore.getItemAsync('user_uuid');
        return userUuid;
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
        let userUuid = await this.getUserUuid();
        return this.get(`/users/${userUuid}/otp_qrcode/`);
    }

    async verifyOTP(otpInfo) {        
        let userUuid = await this.getUserUuid();

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
        let userUuid = await this.getUserUuid();
        let url = `users/${userUuid}/transaction_histories/?transaction_type=${transaction_type}`;
        if (trading_pair_name) url += `&trading_pair_name=${trading_pair_name}`;
        return this.get(url);
    }

    // Accounts
    async loadAccounts() {
        let userUuid = await this.getUserUuid();
        console.log('userId on load accounts', userUuid);
        return this.get(`users/${userUuid}/accounts/`);
    }

    // Personal Trades
    async loadPersonalTrades() {
        let userUuid = await this.getUserUuid();
        return this.get(`users/${userUuid}/trades/?trading_pair_name=${tradingPairStore.selectedTradingPairName}`);
    }

    async loadPersonalPlacedOrders() {
        let userUuid = await this.getUserUuid();
        return this.get(`users/${userUuid}/orders/?trading_pair_name=${tradingPairStore.selectedTradingPairName}&order_status=PLACED&order_status=PENDING&order_status=PARTIALLY_FILLED`);
    }

    createAndGetWarmWalletAddress(account_uuid) {
        return this.post(`accounts/${account_uuid}/warm_wallet/`);
    }

    loadDepositAndWithdraw(account_uuid, transaction_type) {
        return this.get(`accounts/${account_uuid}/wallet_transfers/${(transaction_type ? `?transfer_type=${transaction_type}` : '')}`);
    }

    // Email Verification
    async requestActivateEmailAgain() {
        let userUuid = await this.getUserUuid();
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
        let userUuid = await this.getUserUuid();
        return this.get(`/users/${userUuid}/bank_accounts/latest/`);
    }
    async registerBankAccount(accountInfo) {
        let userUuid = await this.getUserUuid();
        return this.post(`/users/${userUuid}/bank_accounts/`, accountInfo);
    }
    async deleteBankAccount(bankAccountUuid) {
        let userUuid = await this.getUserUuid();
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
        let userUuid = await this.getUserUuid();
        return this.postFile(`/users/${userUuid}/upload_id_photo/`, data);
    }

    async uploadKycPhotoImage(data) {
        let userUuid = await this.getUserUuid();
        return this.postFile(`/users/${userUuid}/upload_kyc_photo/`, data);
    }

    async updatePersonalIdentificationAgreement(agreements) {
        let userUuid = await this.getUserUuid();
        return this.post(`/users/${userUuid}/identification_agreement/`, agreements);
    }

    // Register referral code
    async registerReferralCode(referralCodeInfo) {
        let userUuid = await this.getUserUuid();
        return this.post(`/users/${userUuid}/referrals/`, referralCodeInfo);
    }
    async updatePersonalAgreement(agreements) {
        let userUuid = await this.getUserUuid();
        return this.post(`/users/${userUuid}/phone_agreement/`, agreements);
    }
    // load my rank
    async loadMyRank() {
        let userUuid = await this.getUserUuid();
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

    /* Base REST API method */
    async get(url) {
        console.log('request get | ', url);
        return this.axios
            .get(url, await this._getRequestConfig())
            .catch(this._handleError);
    }
    async put(url, body) {
        console.log('request put | ', url);
        return this.axios
            .put(url, body, await this._getRequestConfig())
            .catch(this._handleError);
    }
    async patch(url, body) {
        console.log('request patch | ', url);

        return this.axios
            .patch(url, body, await this._getRequestConfig())
            .catch(this._handleError);
    }
    async post(url, body) {
        console.log('request post | ', url);

        return this.axios
            .post(url, body, await this._getRequestConfig())
            .catch(this._handleError);
    }
    async delete(url) {
        console.log('request delete | ', url);

        return this.axios
            .delete(url, await this._getRequestConfig())
            .catch(this._handleError);
    }

    async postFile(url, file) {
        return this.axios
            .post(url, file, await this._getRequestConfigForFilePost())
            .catch(this._handleError);

    }
    async _getRequestConfig() {
        let requestConfig = null;
        let accessToken = await SecureStore.getItemAsync('access_token');
        if (accessToken) {
            requestConfig = { 
                headers: { 
                    'Authorization': `Bearer ${accessToken}`,
                }
            };
        }
        console.log('accessToken on request (config): ', requestConfig);

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
        console.log('handle error : ', error.response);
        // errorStore.setErrorInfo(error.response.data);
        // 로그아웃을 해야할 에러일때 처리.
        // if (error && error.response && error.response.status === 401) {
        //   authStore.logout();
        // }
        throw error;
    }

    getPayFormValue = async () => {
        let userUuid = await this.getUserUuid();
        return `${API_ROOT}/verify/mcash/?user_uuid=${userUuid}`;
    }
    getAPIRoot = () => {
        return API_ROOT;
    }
}

let agent;
console.log('is dev? :', __DEV__);
if (__DEV__) {
    agent = new Agent(DEV_API_ROOT);
} else {
    agent = new Agent(API_ROOT);
    console.log('is API_ROOT :', DEV_API_ROOT);
}
export default agent;
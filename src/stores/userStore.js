import { observable, action, computed, reaction } from 'mobx';
import agent from '../utils/agent';
import accountStore from './accountStore';
import authStore from './authStore';
// import Sentry from '../utils/Sentry';

class UserStore {
    @observable isLoading;

    // Verification 부분
    @computed get isTokenTradable() {
        try {
            let {
                is_email_verified,
                is_otp_registered,
            } = this.currentUser.verification;
            return is_email_verified && is_otp_registered;
        } catch (e) {
            return false;
        }
    }
    @computed get isKrwTradable() {
        try {
            let {
                is_phone_verified,
                is_bank_account_verified,
            } = this.currentUser.verification;
            return is_phone_verified && is_bank_account_verified;
        } catch (e) {
            return false;
        }
    }
    @computed get isWithdrawalLimitUpgraded() {
        try {
            let {
                id_photo_verification_status, // ('NONE', 'PENDING', 'DENIED', 'VERIFIED')
                kyc_verification_status // ('NONE', 'PENDING', 'DENIED', 'VERIFIED')
            } = this.currentUser.verification;
            return id_photo_verification_status === 'VERIFIED' && kyc_verification_status === 'VERIFIED';
        } catch (e) {
            return false;
        }
    }

    @computed get needEmailVerification() {
        try {
            let { is_email_verified } = this.currentUser.verification;
            return !is_email_verified;
        } catch (e) {
            return false;
        }
    }

    @action async loadUser(userUuid) {
        this.isLoading = true;
        if (userUuid) {
            return agent.loadUser(userUuid)
                .then(action((response) => {
                    let user = response.data;
                    this.saveUser(user);
                    this.isLoading = false;
                }))
                .catch(action((err) => {
                    this.errors = err.response && err.response.body && err.response.body.errors;
                    authStore.destroyAccessToken();
                    this.isLoading = false;
                    throw err;
                }));
        }
    
    }

    // currentUser
    @observable currentUser = null;
    @computed get isLoggedIn() { return !!this.currentUser; }
    @action saveUser(newUser) {
        accountStore.loadAccounts();
        this.currentUser = newUser;
        // TODO react native 용으로 Sentry 적용 후 재 적용합니다.
        // Sentry.setUser(newUser);
    }
    @action clear() {
        this.currentUser = null;
        // TODO react native 용으로 Sentry 적용 후 재 적용합니다.
        // Sentry.setUser(newUser);
    }

    @action forgetUser() { this.currentUser = null; }

    // verification
    @action setEmailVerified() {
        this.currentUser.verification.is_email_verified = true;
    }
    @action setOtpVerified() {
        this.currentUser.verification.is_otp_verified = true;
    }
    @action setBankAccountVerified() {
        this.currentUser.verification.is_bank_account_verified = true;
    }
    @action setIdPhotoVerificationStatus(status) {
        this.currentUser.verification.id_photo_verification_status = status;
    }
    @action setKycVerificationStatus(status) {
        this.currentUser.verification.kyc_verification_status = status;
    }

    // profile referral code
    @action setRefererReferralCode(referer_referral_code) {
        this.currentUser.profile.referer_referral_code = referer_referral_code;
    }
    
}

export default new UserStore();
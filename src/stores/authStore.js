import { observable, action, reaction } from 'mobx';
import userStore from './userStore';
import agent from '../utils/agent';
import { AsyncStorage } from "react-native"
import { SecureStore } from 'expo';

/* 정책
 * 로그인시 > temporary_otp_token 및 email 발급 > otpVerificationValues에 저장
 * otpVerificationValues를 와  받아옵니다
 * OTP 인증 화면에서 벗어나면 로그인 정보, temp를 날리고 needOtpVerificationToLogin을 false로 만듭니다.
 * 
 */ 
class AuthStore {
    constructor() {
        /*
         * 다음의 코드를 통해 access_token을 얻어오는 경우를 제외하고는
         * store의 access_token을 set함으로 AsyncStorage가 갱신됩니다.
         */
        // const tokenReaction = reaction(
        //     () => this.access_token,
        //     accessToken => {
        //         if (accessToken) {
        //             AsyncStorage.setItem('access_token', accessToken);
        //         } else {
        //             AsyncStorage.removeItem('access_token');
        //         }
        //     }
        // );
    }

    /* Login */
    @observable isLoading = false;
    @observable errors = null;

    @observable loginValues = {
        email: 'junhyek+app@coblic.com',
        password: 'sdfsdf!!'
    }

    @action setEmailForLogin(email) { this.loginValues.email = email; }
    @action setPasswordForLogin(password) { this.loginValues.password = password; }
    @action clearLoginValues() {
        this.loginValues = {
            email: '',
            password: ''
        };
    }
    @action clearPassword() {
        this.loginValues.password = '';
    }
    clearUser() {
        userStore.clear();
    }

    @action login() {
        this.isLoading = true;
        this.errors = null;

        return agent.login(this.loginValues)
        .then(action((res) => {
            let user = res.data;
            if (user.need_otp_verify === 'true') {
                this.otpVerificationValues = {
                    needOtpVerificationToLogin: true,
                    temporaryOtpToken: user.temporary_otp_token,
                    temporaryEmail: user.email,
                    otp_code: ''            
                };
            } else {
                this.setAccessToken(user.access_token);
                this.setUserUuid(user.uuid);
                delete user.access_token;                
                userStore.saveUser(user);
            }
            this.clearPassword();
            this.isLoading = false;
            return user;
        }))
        .catch(action((err) => {
            this.errors = err.response && err.response.body && err.response.body.errors;
            this.isLoading = false;
            throw err;
        }));
    }

    /* OTP Verification For Login */
    @observable access_token = null;
    @observable user_uuid = null; // login, otp인증시 token과 함게 저장하고 사용/ 새로운 유저 로그인시 변경

    @action hasAccessToken() { return this.access_token ? true : false; }
    @action async setAccessToken(accessToken) { await SecureStore.setItemAsync('access_token', accessToken) }
    @action setUserUuid(userUuid) { this.user_uuid = userUuid; }
    @action destroyAccessToken() { this.setAccessToken(null); }

    @observable otpVerificationValues = {
        needOtpVerificationToLogin: false,
        temporaryOtpToken: '',
        temporaryEmail: '',
        otp_code: ''
    }

    @action setOtpCode(code) {
        this.otpVerificationValues.otp_code = code;
    }
    @action clearVerifyOtpValue() {
        this.otpVerificationValues = {
            needOtpVerificationToLogin: false,
            temporaryOtpToken: '',
            temporaryEmail: '',
            otp_code: ''
        };
    }    

    @action verifyOTPLogin() {
        this.isLoading = true;
        this.errors = undefined;

        let otp_login_info = {
            verification_type: 'otp', 
            temporary_otp_token: this.otpVerificationValues.temporaryOtpToken,
            email: this.otpVerificationValues.temporaryEmail,
            verification_code: this.otpVerificationValues.otp_code
        };

        return agent.verifyOTPLogin(otp_login_info)
        .then(action((res) => {
            let user = res.data;
            this.setAccessToken(user.access_token);
            this.setUserUuid(user.uuid);
            userStore.saveUser(user);
            this.clearVerifyOtpValue();
            this.isLoading = false;
        }))
        .catch(action((err) => {
            this.errors = err.response && err.response.body && err.response.body.errors;
            this.isLoading = false;
            throw err;
        }));
    }

    /* Signup */
    @observable signupValues = {
        email: '',
        password: '',
        passwordConfirmation: '',
        agreesToContracts: false,
        agreesToInstruction: false,
        agreesToMarketing: false,
    }

    @action setEmailForSignup(email) { this.signupValues.email = email; }
    @action setPasswordForSignup(password) { this.signupValues.password = password; }
    @action setPasswordConfirmationForSignup(passwordConfirmation) { this.signupValues.password_confirmation = passwordConfirmation; }
    @action setPasswordConfirmationForSignup(passwordConfirmation) { this.signupValues.password_confirmation = passwordConfirmation; }
    @action setPasswordConfirmationForSignup(passwordConfirmation) { this.signupValues.password_confirmation = passwordConfirmation; }

    @action clearSignupValues() {
        this.signupValues = {
            email: '',
            password: '',
            password_confirmation: '',
            agreesToContracts: false,
            agreesToInstruction: false,
            agreesToMarketing: false,
        };
    }
    @action toggleCheckboxStatus(name) {
        this.signupValues[name] = !this.signupValues[name];
    }

    @action signup() {
        this.isLoading = true;
        this.errors = null;

        return agent.signup(this.signupValues)
        .then(action((response) => {
            let user = response.data;
            this.setAccessToken(user.access_token);
            delete user.access_token;
            userStore.saveUser(user);
            this.clearSignupValues();
            this.isLoading = false;
        }))
        .catch(action((err) => {
            this.errors = err.response && err.response.body && err.response.body.errors;
            throw err;
        }));
    }

    /* Logout */
    @action logout() {
        this.errors = null;
        this.clearUser();
        this.clearPassword();
        this.destroyAccessToken();
        this.clearSignupValues();

        return agent.logout()
        .then((res) => {
        })
        .catch(action((err) => {
            this.errors = err.response && err.response.body && err.response.body.errors;
            // client 단에서 로그인 정보를 없애면 로그아웃과 동일하므로 에러를 따로 띄우지 않음
            // throw err;
        }));
    }
}

const authStore = new AuthStore();

export default authStore;
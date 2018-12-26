import { observable, action, reaction } from 'mobx';
import userStore from './userStore';
import agent from '../utils/agent';
import { AsyncStorage } from "react-native"

class AuthStore {
    @observable isLoading = false;
    @observable errors = null;

    constructor() {
        // needOtpVerificationToLogin이 true가 된지 2분 뒤에 temporaryLoaginValues를 reset함
        reaction(
            () => this.temporaryLoginValues.needOtpVerificationToLogin,
            needOtpVerificationToLogin => {
                if (needOtpVerificationToLogin) {
                    //시간 카운트 다운 시작
                    this.otpLoginTimeLimitValues.end = 
                        moment()
                        .add(parseInt(this.otpLoginTimeLimitValues.minutes), 'm')
                        .add(parseInt(this.otpLoginTimeLimitValues.seconds), 's')
                        .tz('Asia/Seoul');

                    this.otpLoginTimeLimitValues.interval = setInterval(() => {
                        this.setTimeLeft();
                    }, 1000)
                } else {
                    this.clearOtpTimeInterval();
                    this.otpLoginTimeLimitValues = {
                        end: null,
                        interval: null,
                        minutes: '02',
                        seconds: '00',
                    };
                }
            }
        )
        /*
         * 다음의 코드를 통해 access_token을 얻어오는 경우를 제외하고는
         * store의 accessToken을 set함으로 AsyncStorage가 갱신됩니다.
         */

        const tokenReaction = reaction(
            () => this.accessToken,
            token => {
                if (token) {
                    AsyncStorage.setItem('access_token', token);
                } else {
                    AsyncStorage.removeItem('access_token');
                }
            }
        );
    }
    @observable temporaryLoginValues = {
        needOtpVerificationToLogin: false,
        temporaryOtpToken: '',
        temporaryEmail: '',
    }
    
    @observable email = '';
    @observable password = '';
    @observable passwordConfirmation = '';

    @observable accessToken = null;
    @observable userUuid = null; // reset password 시 필요

    @action setEmail(email) {
        this.email = email;
    }

    @action setPassword(password) {
        this.password = password;
    }

    @action setPasswordConfirmation(password) {
        this.passwordConfirmation = password;
    }

    @action clearEmailAndPassword() {
        this.email = '';
        this.password = '';
        this.passwordConfirmation = '';
    }

    @action register() {
        this.isLoading = true;
        this.errors = null;

        agent.signup({
            id: this.id,
            password: this.password,
            passwordConfirmation: this.passwordConfirmation
        })
        .then(this._storeTokenAndUserAndClearEmailAndPassword)
        .catch(this._handleAuthError)
        .then(this.doneProgress);
    }

    @action login() {
        this.isLoading = true;
        this.errors = null;

        agent.login(this.values)
        .then(this._storeTokenAndUserAndClearEmailAndPassword)
        .catch(this._handleAuthError)
        .then(this.doneProgress);
    }
    @action logout() {
        this.errors = null;
        this.accessToken = null;
        
        agent.logout()
        .catch(this._handleAuthError);
    }
    @action _storeTokenAndUserAndClearEmailAndPassword(response) {
        let user = response.data;
        this.accessToken = user.access_token;
        delete user.access_token;
        userStore.saveUser(user);
        this.clearEmailAndPassword();
    }
    @action hasAccessToken() {
        return this.accessToken ? true : false;
    }
    @action setToken(token) {
        this.token = token;
    }
    @action destroyToken() {
        this.setToken(null);
    }
    @action _handleAuthError(err) {
        this.errors = err.response && err.response.body && err.response.body.errors;
        throw err;
    }
    @action doneProgress() {
        this.isLoading = false;
    }
}

const authStore = new AuthStore();

export default authStore;
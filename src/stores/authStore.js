import { observable, action, reaction } from 'mobx';
import userStore from './userStore';
import api from '../utils/api';
import { AsyncStorage } from "react-native"

class AuthStore {
    @observable inProgress = false;
    @observable errors = null;
    
    @observable email = '';
    @observable password = '';
    @observable passwordConfirmation = '';
    @observable accessToken = null;

    constructor() {
        /*
         * 다음의 코드를 통해 access_token을 얻어오는 경우를 제외하고는
         * store의 accessToken을 set함으로 AsyncStorage가 갱신됩니다.
         */

        const tokenReaction = reaction(
            () => this.token,
            token => {
                if (token) {
                    AsyncStorage.setItem('access_token', token);
                } else {
                    AsyncStorage.removeItem('access_token');
                }
            }
        );
    }

    @action setEmail(email) {
        this.email = email;
    }

    @action setPassword(password) {
        this.password = password;
    }

    @action setPasswordConfirmation(password) {
        this.passwordConfirmation = password;
    }

    @action clearIdAndPassword() {
        this.email = '';
        this.password = '';
        this.passwordConfirmation = '';
    }

    @action register() {
        this.inProgress = true;
        this.errors = null;

        api.signup({
            id: this.id,
            password: this.password,
            passwordConfirmation: this.passwordConfirmation
        })
        .then(this._storeTokenAndUserAndClearIdAndPassword)
        .catch(this._handleAuthError)
        .then(this.doneProgress);
    }

    @action login() {
        this.inProgress = true;
        this.errors = null;

        api.login(this.values)
        .then(this._storeTokenAndUserAndClearIdAndPassword)
        .catch(this._handleAuthError)
        .then(this.doneProgress);
    }
    @action logout() {
        this.errors = null;
        this.accessToken = null;
        
        api.logout()
        .catch(this._handleAuthError);
    }
    @action _storeTokenAndUserAndClearIdAndPassword(response) {
        let user = response.data;
        this.accessToken = user.access_token;
        delete user.access_token;
        userStore.saveUser(user);
        this.clearIdAndPassword();
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
        this.inProgress = false;
    }
}

const authStore = new AuthStore();

export default authStore;
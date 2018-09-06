import { observable, action } from 'mobx';
import commonStore from './commonStore';
import userStore from './userStore';
import api from '../utils/api';

class AuthStore {
    @observable inProgress = false;
    @observable errors = undefined;

    @observable value = {
        email: '',
        password: '',
        passwordConfirmation: ''
    };

    @action setEmail(email) {
        this.value.email = email;
    }

    @action setPassword(password) {
        this.value.password = password;
    }

    @action setPasswordConfirmation(password) {
        this.value.passwordConfirmation = password;
    }

    @action reset() {
        this.values = {
            email: '',
            password: '',
            passwordConfirmation: ''
        };
    }

    @action register() {
        this.inProgress = true;
        this.errors = undefined;

        api.signup({
            id: this.values.id,
            password: this.values.password,
            passwordConfirmation: this.values.passwordConfirmation
        })
        .then(action((response) => {
            let user = response.data;
            commonStore.setCommon(user.access_token, user.uuid);
            userStore.saveUser(user);
            this.reset();
        }))
        .catch(action((err) => {
            this.errors = err.response && err.response.body && err.response.body.errors;
            throw err;
        }))
        .then(action(() => {
            this.inProgress = false;
        }));
    }

    @action login() {
        this.inProgress = true;
        this.errors = undefined;

        api.login(this.values)
        .then(action((response) => {
            let user = response.data;
            commonStore.setCommon(user.access_token, user.uuid);
            userStore.saveUser(user);
            this.reset();
        }))
        .catch(action((err) => {
            this.errors = err.response && err.response.body && err.response.body.errors;
            throw err;
        }))
        .then(action(() => {
            this.inProgress = false;
        }));
    }

    @action logout() {
        this.inProgress = true;
        this.errors = undefined;
        
        api.logout()
        .then(action((response) => {
            commonStore.setCommon(undefined, undefined);
            userStore.forgetUser();
        }))
        .catch(action((err) => {
            this.errors = err.response && err.response.body && err.response.body.errors;
            throw err;
        }))
        .then(action(() => {
            this.inProgress = false;
        }));
    }
}

const authStore = new AuthStore();

export default authStore;
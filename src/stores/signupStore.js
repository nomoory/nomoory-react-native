import { observable, action, computed } from 'mobx';
import { validateEmail } from '../utils/commonHelper';
import authStore from './authStore';
import userStore from './userStore';
import agent from '../utils/agent';

class SignupStore {
    @observable
    isLoading = false;

    @observable
    values = {
        email: '',
        password: '',
        passwordConfirmation: '',
        recaptchaToken: '123',

        agreesToContracts: true,
        agreesToInstruction: true,
        agreesToMarketing: true,
    };

    @computed
    get isEmailValid() {
        return {
            message_code: 'email_not_valid',
            state: validateEmail(this.values.email),
        };
    }

    @computed
    get isSignUpDataValid() {
        if (!this.values.email) {
            return {
                message_code: 'fill_in_email',
                state: false,
            };
        }
        if (!this.isEmailValid.state) {
            return this.isEmailValid;
        }

        if (!this.isPasswordValid.state) {
            return this.isPasswordValid;
        }

        if (this.values.agreesToContracts === false
            || this.values.agreesToInstruction === false) {
            return {
                message_code: 'check_all_essential_agrees',
                state: false,
            };
        }

        if (
            process.env.RAZZLE_NO_RECAPTCHA !== 'ON'
            && !this.values.recaptchaToken
        ) {
            return {
                message_code: 'verify_human',
                state: false,
            };
        }

        return {
            message_code: 'request_signup',
            state: true,
        };
    }

    @computed
    get isPasswordValid() {
        if (!this.values.password) {
            return {
                message_code: 'fill_in_password',
                state: false,
            };
        }

        if (!(this.values.password.length >= 8)) {
            return {
                message_code: 'shorter_than_eight',
                state: false,
            };
        }

        if (!this.values.passwordConfirmation) {
            return {
                message_code: 'fill_in_password_confirmation',
                state: false,
            };
        }

        if (this.values.password !== this.values.passwordConfirmation) {
            return {
                message_code: 'different_password_confirmation',
                state: false,
            };
        }
        return {
            message_code: 'valid_password',
            state: true,
        };
    }

    @action
    setEmail(email) {
        this.values.email = email;
    }

    @action
    setPassword(password) {
        this.values.password = password;
    }

    @action
    setPasswordConfirmation(password) {
        this.values.passwordConfirmation = password;
    }

    @action
    toggleCheckboxStatus(name) {
        this.values[name] = !this.values[name];
    }

    @action
    setRecaptchaToken(recaptchaToken) {
        this.values.recaptchaToken = recaptchaToken;
    }

    @action
    clear() {
        this.values = {
            ...this.values,
            ...{
                email: '',
                password: '',
                passwordConfirmation: '',
                recaptchaToken: '123',
                agreesToContracts: true,
                agreesToInstruction: true,
                agreesToMarketing: true,
            },
        };
    }

    @action
    signup() {
        this.isLoading = true;

        return agent.signup({
            email: this.values.email,
            password: this.values.password,
            password_confirmation: this.values.passwordConfirmation,
            recaptcha_token: this.values.recaptchaToken,
        })
            .then(action((response) => {
                const user = response.data;
                authStore.setAccessToken(user.access_token);
                authStore.setUserUuid(user.uuid);
                userStore.saveUser(user);
                this.isLoading = false;
            }))
            .catch(action((err) => {
                this.values.recaptchaToken = '123';
                this.isLoading = false;
                throw err;
            }));
    }

    @action
    verifyEmail(activation_info, user_uuid) {
        this.isLoading = true;

        return agent.verifyEmail(activation_info, user_uuid)
            .then(action(() => {
                if (authStore.accessToken) {
                    userStore.setEmailVerified();
                }
                this.isLoading = false;
            }))
            .catch(action((err) => {
                this.isLoading = false;
                throw err;
            }));
    }

    @action
    reactivateEmail() {
        this.isLoading = true;

        return agent.requestActivateEmailAgain()
            .then(action(() => {
                this.isLoading = false;
            })).catch(action((err) => {
                this.isLoading = false;
                throw err;
            }));
    }
}

export default new SignupStore();

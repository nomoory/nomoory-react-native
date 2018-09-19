import { observable, action } from 'mobx';
import api from '../utils/api';

class UserStore {
    @observable inProgress;
    @observable errors;
    @observable user = {};

    @action getUser() {
        this.inProgress = true;
        return api.getUser(user.user_uuid)
        .then(action((response) => {
            let user = response.data;
            this.setUser(user);
        }))
        .catch(action((err) => {
            this.errors = err.response && err.response.body && err.response.body.errors;
        }))
        .then(action(() => {
            this.inProgress = false;
        }));
    }

    @action setUser(user) {
        this.user = user;
    }

    @action forgetUser() {
        this.setUser(null);
    }
}

const userStore = new UserStore();

export default userStore;
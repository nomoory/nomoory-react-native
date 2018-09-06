import { observable, action } from 'mobx';
import commonStore from './commonStore';
import api from '../utils/api';

class UserStore {
    @observable inProgress;
    @observable errors;
    @observable user;

    @action getUser() {
        this.inProgress = true;
        return api.getUser(commonStore.user_uuid)        
        .then(action((response) => {
            let user = response.data;
            this.saveUser(user);
        }))
        .catch(action((err) => {
            this.errors = err.response && err.response.body && err.response.body.errors;
            commonStore.destroyToken();
            commonStore.destroyUserUuid();
            throw err;
        }))
        .then(action(() => {
            this.inProgress = false;
        }));
    }

    @action saveUser(newUser) {
        this.user = newUser;
    }

    @action forgetUser() {
        this.user = undefined;
    }

    @action isLoggedIn() {
        if(this.user){
            return true;
        }else{
            return false;
        }
    }
}


const userStore = new UserStore();

export default userStore;
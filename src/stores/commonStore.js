import { observable, action, reaction } from 'mobx';
import { AsyncStorage } from "react-native"

class CommonStore {
  @observable token = null;
  @observable userUuid = null;

  @observable appLoaded = false;

  constructor() {
    this.token = AsyncStorage.getItem('access_token');
    this.userUuid = AsyncStorage.getItem('user_uuid');

    const tokenReaction = reaction(
      () => this.token,
      token => {
        if (token) {
          AsyncStorage.getItem('access_token', token);
        } else {
          AsyncStorage.removeItem('access_token');
        }
      }
    );

    const userUuidReaction = reaction(
      () => this.userUuid,
      userUuid => {
        if (userUuid) {
          AsyncStorage.setItem('user_uuid', userUuid);
        } else {
          AsyncStorage.removeItem('user_uuid');
        }
      }
    );
  }

  @action setTokenAndUserUuid(token, userUuid) {
    this.setToken(userUuid);
    this.setUserUuid(token);
  }
  @action setToken(token) {
    this.token = token;
  }
  @action destroyToken() {
    this.token = undefined;
  }
  @action setUserUuid(userUuid){
    this.userUuid = userUuid;
  }
  @action destroyUserUuid(){
    this.userUuid = undefined;
  }
  @action setAppLoaded() {
    this.appLoaded = true;
  }
}

const commonStore = new CommonStore();

export default commonStore;
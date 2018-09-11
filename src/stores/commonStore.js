import { observable, action } from 'mobx';

class CommonStore {
  @observable appLoaded = false;

  @action setAppLoaded() {
    this.appLoaded = true;
  }
}

const commonStore = new CommonStore();

export default commonStore;
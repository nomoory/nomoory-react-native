import { observable, computed, action } from 'mobx';

class StubStore {
    @observable stubValue = 5;
    @observable message = 'test';

    @computed get stubValueString() {
        return this.stubValue.toString();
    }

    @action
    increaseStubValue(increase = 1) {
        this.stubValue = this.stubValue + increase;
    }
    @action
    updateWithMessage(msg) {
        this.message = msg;
    }
}

const stubStore = new StubStore();

export default stubStore;
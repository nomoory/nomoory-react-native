import { observable, computed, action } from 'mobx';

class StubStore {
    @observable stubValue = 5;

    @computed get stubValueString() {
        return this.stubValue.toString();
    }

    @action
    increaseStubValue = () => {
        this.stubValue++;
    }
}

const stubStore = new StubStore();

export default stubStore;
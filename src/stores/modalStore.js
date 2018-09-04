import { observable, computed, action } from 'mobx';

class ModalStore {
    @observable isModalVisible = false;
    @observable title = 'title';
    @observable content = 'content';
    @observable cancelButtonName = 'cancel';

    @action
    openModal(title = null, content = null, cancelButtonName = 'cancel') {
        this.isModalVisible = true;
        this.title = title;
        this.content = content;
        this.cancelButtonName = cancelButtonName;
    }
    @action
    closeModal() {
        this.isModalVisible = false;
        this.title = null;
        this.content = null;
        this.cancelButtonName = 'cancel';
    }
}

const modalStore = new ModalStore();

export default modalStore;
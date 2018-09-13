import { observable, computed, action } from 'mobx';

class ModalStore {
    @observable isModalVisible = false;
    @observable title = 'title';
    @observable content = 'content';
    @observable confirmButtonName = '확인';
    @observable afterClose = () => {};

    @action
    openModal({title, content, confirmButtonName, afterClose}) {
        this.isModalVisible = true;
        this.title = title || '';
        this.content = content || '';
        this.afterClose = afterClose || (() => {});
        
        this.confirmButtonName = confirmButtonName || '확인';

    }
    @action
    closeModal() {
        this.isModalVisible = false;
        this.title = '';
        this.content = '';
        this.afterClose = (() => {});
        this.confirmButtonName = '확인';
    }
}

const modalStore = new ModalStore();

export default modalStore;
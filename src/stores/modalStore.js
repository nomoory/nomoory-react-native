import { observable, computed, action } from 'mobx';

class ModalStore {
    initial = {
        buttons: [{
            style: {},
            title: '확인',
            onPress: () => { this.closeModal() }
        }]
    }

    @observable type = 'preset'; // error | custom | preset
    @observable isVisible = false;
    @observable title = 'title';
    @observable content = 'content';
    @observable buttons = this.initial.buttons;
    @observable onClose = () => {};

    @action
    openModal = action(({type, title, content, buttons, onClose}) => {
        this.closeModal();
        this.clear();
        this.type = type || 'error';
        this.title = title || '';
        this.content = content || '';
        this.buttons = buttons || this.initial.buttons;
        this.onClose = onClose || (() => {});        
        this.isVisible = true;
    });

    @action
    closeModal() {
        this.isVisible = false;
    }

    @action
    clear() {
        this.title = '';
        this.content = '';
        this.onClose = () => {};
        this.buttons = this.initial.buttons;
    }
}

const modalStore = new ModalStore();

export default modalStore;
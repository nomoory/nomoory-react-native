import { observable, computed, action } from 'mobx';

class ModalStore {
    DEFAULTS = {
        config: {
            animationIn: 'slideInRight',
            animationOut: 'slideOutRight',
        },
        buttons: [{
            style: {},
            title: '확인',
            onPress: () => { this.closeModal() }
        }],
        onClose: () => {},
        customModal: {
            isVisible: false,
            modal: null,
            onClose: () => {},
            config: {
                animationIn: 'slideInRight',
                animationOut: 'slideOutRight',
            },
        }
    };

    @observable
    type = 'preset'; // error | preset
    
    @observable
    isVisible = false;
    
    @observable
    title = '';
    
    @observable
    content = '';

    @observable
    customModal = this.DEFAULTS.customModal;
    
    @observable
    buttons = this.DEFAULTS.buttons;
    
    @observable
    onClose = this.DEFAULTS.onClose;

    @observable
    config = this.DEFAULTS.config;

    @observable
    styles = {};

    @action.bound
    openModal({type, title, content, buttons, onClose}) {
        this.closeModal();
        this.clear();
        this.type = type || 'error';
        this.title = title || '';
        this.content = content || '';
        this.buttons = buttons || this.DEFAULTS.buttons;
        this.onClose = onClose || (this.DEFAULTS.onClose);
        this.isVisible = true;
    };

    @action.bound
    closeModal() {
        this.isVisible = false;
    }

    @action.bound
    openCustomModal({
        modal = '',
        onClose = this.DEFAULTS.customModal.onClose,
        config = this.DEFAULTS.customModal.config
    }) {
        this.customModal.modal = modal;
        this.customModal.onClose = onClose;
        this.customModal.config = {...this.customModal.config, ...config};
        this.customModal.isVisible = true;
    }

    @action.bound
    closeCustomModal() {
        this.customModal.isVisible = false;
    }

    @action.bound
    clear() {
        this.title = '';
        this.content = '';
        this.onClose = this.DEFAULTS.onClose;
        this.buttons = this.DEFAULTS.buttons;
        this.config = this.DEFAULTS.config;
    }
}

const modalStore = new ModalStore();

export default modalStore;
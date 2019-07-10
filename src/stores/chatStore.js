import {
    observable,
    action,
    computed,
} from 'mobx';
import { sendMessage, loadMessages } from './agents/chatAgent';

class ChatStore {
    @observable
    isLoading = false;

    @observable
    messages = [];

    @computed
    get formedMessage() {
        return this.messages.map((message, index) => {
            
            return {
                index: this.messages.length - index,
                _id: message.uuid,
                text: message.content,
                createdAt: message.created,
                user: {
                    _id: message.nickname,
                    name: message.nickname,
                },
            };
        }); 
    }

    @action
    appendMessage(messages = []) {
        this.messages = [...messages, ...this.messages];
    }

    @action
    sendMessage({text}) {
        this.isLoading = true;
        console.log('[Chat Store] send message');
        return sendMessage({content: text})
            .then(action((response) => {
                console.log('[Chat Store] sended message');
                this.isLoading = false;
            })).catch(action((error) => {
                this.isLoading = false;
                console.log('[Chat Store] error sendMessage');
                console.log(error);
                throw error;
            }));
    }

    @action.bound
    loadMessages() {
        this.isLoading = true;
        console.log('[Chat Store] load messages');

        return loadMessages()
            .then(action((response) => {
                const message = response.data;
                console.log('[Chat Store] loaded messages');
                this.appendMessage(message);
                this.isLoading = false;
            })).catch(action((error) => {
                console.log('[Chat Store] error on load messages');
                console.log(error);
                this.isLoading = false;
                throw error;
            }));
    }
}

export default new ChatStore();

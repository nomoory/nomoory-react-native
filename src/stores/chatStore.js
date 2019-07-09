import {
    observable,
    action,
    computed,
} from 'mobx';
import chatAgent from './agents/chatAgent';
import { GiftedChat } from 'react-native-gifted-chat';

class ChatStore {
    @observable
    isLoading = false;

    @observable
    messages = [
        // {
        //     index: 1,
        //     uuid: 1,
        //     text: 'Hello Coinbit!',
        //     created_at: new Date(),
        //     user: {
        //         uuid: 'asdsad',
        //         email: 'tests',
        //         name: 'React Native',
        //         // avatar: 'https://placeimg.com/140/140/any',
        //     },
        // },
    ];

    @computed
    get formedMessage() {
        // return this.messages.map((message, index) => ({
        //     ...message,
        //     index: this.messages.length - index,
        // }));

        return this.messages.map((message, index) => ({
            index: this.messages.length - index,
            _id: message.uuid,
            text: message.content,
            createdAt: message.created,
            user: {
                _id: message.nickname,
                name: message.nickname,
            },
        }));
    }

    @action
    appendMessage(messages = []) {
        this.messages = GiftedChat.append(this.messages, messages);
    }

    @action
    sendMessage(message) {
        this.isLoading = true;
        console.log('send message');
        return chatAgent.sendMessage({content: message})
            .then(action((response) => {
                console.log('sended message');
                this.isLoading = false;
            })).catch(action((error) => {
                this.isLoading = false;
                throw error;
            }));
    }

    @action
    loadMessages() {
        this.isLoading = true;
        console.log('load messages');

        return chatAgent.loadMessages()
            .then(action((response) => {
                const message = response.data;
                console.log('loaded messages');
                console.log({ message });
                this.appendMessage(message);
                this.isLoading = false;
            })).catch(action((error) => {
                this.isLoading = false;
                throw error;
            }));
    }
}

export default new ChatStore();

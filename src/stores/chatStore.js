import {
    observable,
    action,
    computed,
} from 'mobx';
import chatAgent from './agents/chatAgent';
import { GiftedChat } from 'react-native-gifted-chat';

class ChatStore {
    @observable
    messages = [
        {
            index: 1,
            uuid: 1,
            text: 'Hello Coinbit!',
            created_at: new Date(),
            user: {
                uuid: 'asdsad',
                email: 'tests',
                name: 'React Native',
                // avatar: 'https://placeimg.com/140/140/any',
            },
        },
    ];

    @computed
    get formedMessage() {
        return this.messages.map((message, index) => ({
            ...message,
            index: this.messages.length - index,
        }));

        return this.messages.map((message, index) => ({
            index: this.messages.length - index,
            _id: message.uuid,
            text: message.text,
            createdAt: new Date(message.created_at),
            user: {
                _id: message.user.uuid,
                name: message.user.email.slice(0,2) + message.user.uuid.slice(0,3),
            }
        }));
    }

    @action
    appendMessage(messages = []) {
        this.messages = GiftedChat.append(this.messages, messages);
    }

    @action
    sendMessage(message) {
        // temp
        this.messages = GiftedChat.append(this.messages, [ message ]);

        // return chatAgent.sendMessage(message);
    }

    @action
    loadMessages() {
        return chatAgent.loadMessages();
    }

    @action
    loadNextMessages() {
        
    }

}

export default new ChatStore();

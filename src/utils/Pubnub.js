import PubNubReact from 'pubnub-react';

export default class Pubnub {
    constructor(container, stores) {
        this.pubnub = new PubNubReact({
            subscribeKey: Expo.Constants.manifest.extra.DEV_PUBNUB_SUBSCRIBE_KEY
        });
        this.stores = stores;
        this._addListenerToUpdateStoreOnReceiveMessage();
        this.pubnub.init(container);
        this.subscribeCounts = {}; // channelName: count
    }

    /* 
     * 이곳에 등록되는 channel이 message를 받았을 때 수행되길 원하는 
     * store의 action을 호출하면 됩니다.
     */
    _onReceiveMessage = (msg) => {
        let [ type, identifier ] = this._retrieveTypeAndIdentifierFromMessage(msg);
        // store에 업데이트 시 method에 identification을 넘깁니다.
        // store에서 UUID와 authStore를 비교하여 업데이트 할지 여부를 결정합니다.
        switch(type) {
            case 'Channel-2b7qcypeg':
                this.stores.stubStore.updateWithMessage(msg.message.text);
                this.stores.stubStore.increaseStubValue(msg.message.value);
                break;
            case 'TICKER':
                this.stores.tradingPairStore.updateTickerInTradingPair(msg.message)
            default:
                break;
        }
    }

    /* 
     * channel을 listen하고자하는 component에 pubnub을 @inject('pubnub')하고
     * componentWillMount에 this.pubnub.subscribe(channel);을
     * componentWillUnmount에 this.pubnub.subscribe(channel);을 호출합니다.
     */
    subscribe(channel) {
        this._addSubscribeCountOnChannel(channel);
        this.pubnub.subscribe({
            channels: [ channel ],
            withPresence: true
        });
    }

    unsubscribe(channel) {
        this._subtractSubscribeCountOnChannel(channel);
        if (this.subscribeCounts[channel] == 0) {
            this.pubnub.unsubscribe({
                channels: [ channel ]
            });
        }
    }

    _addSubscribeCountOnChannel(channel) {
        if (!this.subscribeCounts[channel]) {
            this.subscribeCounts[channel] = 0;
        } else {
            this.subscribeCounts[channel] += 1;
        }
    }

    _addListenerToUpdateStoreOnReceiveMessage() {
        this.pubnub.addListener({
            message: this._onReceiveMessage
        });
    }

    _subtractSubscribeCountOnChannel(channel) {
        if (!this.subscribeCounts[channel]) {
            this.subscribeCounts[channel] = 0;
        } else {
            this.subscribeCounts[channel] -= 1;
        }
    }

    _retrieveTypeAndIdentifierFromMessage(message) {
        return [ 
            message.channel,
            null
        ];
    }
}
import * as proto from "./com.js"
import {EventEmitter2} from "eventemitter2";

//Extend Decimal Type
proto.Decimal.prototype.toString = function () {
    return `${this.m}.${`${this.l}`.padStart(8, '0')}`
};

class Delibird extends EventEmitter2 {
    constructor(endpoint, uuid = null, autoReconnect = true, pingDuration = 5000) {
        super({wildcard: true,delimiter: '_'});
        this.cmds = [];
        this.endpoint = endpoint;
        this.autoReconnect = autoReconnect;
        this.ws = null;
        this.pingDuration = pingDuration;
        this.uuid = uuid;
        this.state = {
            subscribes: [],
        };
        this.textDecoder = new TextDecoder("utf-8");
        if (!Delibird.isNodejs()) {
            if (!window.WebSocket) {
                throw new Error('this browser is not supported websocket');
            }
        }
        if (!endpoint) {
            throw new Error('endpoint is required argument');
        } else {
            if (endpoint.indexOf("ws://") === -1 && endpoint.indexOf("wss://") === -1) {
                throw new Error('endpoint is not valid');
            }
        }
        if (this.uuid) {
            this.authenticate(this.uuid);
        }
    }

    static Channels = {
        Private: {
            ACCOUNT: "ACCOUNT",
            ORDER: "ORDER",
        },
        Public: {
            TICKER: [],
            TRADE: [],
            ORDER_BOOK: []
        }
    };

    static isNodejs() {
        return typeof "process" !== "undefined" && process && process.versions && process.versions.node;
    }

    static isString(str) {
        return typeof str == 'string' || str instanceof String
    }

    /**
     *
     * @param data
     */
    send = data => {
        if (this.ws.readyState === 1) {
            this.ws.send(data);
            return true
        } else {
            return false
        }
    };
    /**
     *
     * @returns {boolean}
     */
    isConnected = () => this.ws.readyState === 1;

    /**
     *
     */
    close = () => {
        if (!this.ws) {
            throw new Error('websocket client is null did you call "connect()" before?');
        }
        if ((this.ws.readyState === 0 || this.ws.readyState === 1)) {
            this.ws.close();
            this.ws = null;
        } else {
            this.ws = null;
        }
        if (this.pingPong) {
            clearInterval(this.pingPong);
            this.pingPong = null;
        }
    };

    subscribeAllPublicChannels = () => {
        this.subscribe(["TICKER:BTC-KRW", "TICKER:BCH-KRW"])
    };

    subscribeAllPrivateChannels = () => {
        this.subscribe(["ACCOUNT", "TICKER:BCH-KRW"])
    };

    unSubscribeAll = () => {
        this.unSubscribe(this.state.subscribes);
    };

    authenticate = (uuid) => {
        if (!this.ws || !this.isConnected()) {
            let func = this.authenticate;
            this.cmds.push({f: func, arg: uuid});
            return
        }
        if (uuid) {
            if (Delibird.isString(uuid)) {
                this.uuid = uuid;
                let data = new proto.WsRequest({
                    op: proto.WsRequest.Operation.AUTH,
                    args: [uuid]
                });
                this.send(proto.WsRequest.encode(data).finish());
            } else {
                throw new Error(`${typeof uuid} is not supported type`);
            }
        }
    };

    subscribedList = () => {
        return this.state.subscribes
    };
    /**
     *
     * @param data
     */
    isSubscribed = data => {
        return this.state.subscribes.includes(data)
    };
    /**
     * subscribe
     * @param channels
     */
    subscribe = channels => {
        if (!this.ws || !this.isConnected()) {
            let func = this.subscribe;
            this.cmds.push({f: func, arg: channels});
            return
        }
        if (channels) {
            let args = [];
            if (typeof channels == 'string' || channels instanceof String) {
                args = [channels];
            } else {
                if (Array.isArray(channels)) {
                    args.push(...channels);
                } else {
                    throw new Error(`${typeof channels} is not supported type`);
                }
            }
            args.map(x => {
                if (typeof x != 'string' && !(x instanceof String)) {
                    throw new Error(`${x} is not valid argument of subscribe`);
                }
            });
            if (args.length <= 0) {
                throw new Error(`channels length can not be less then 1`);
            }

            let data = new proto.WsRequest({
                op: proto.WsRequest.Operation.SUBSCRIBE,
                args: args
            });
            this.send(proto.WsRequest.encode(data).finish());
        } else {
            throw new Error('channels is required argument');
        }
    };

    /**
     * subscribe
     * @param channels
     */
    unSubscribe = channels => {
        if (!this.ws || !this.isConnected()) {
            let func = this.unSubscribe;
            this.cmds.push({f: func, arg: channels});
            return
        }
        if (channels) {
            let args = [];
            if (typeof channels == 'string' || channels instanceof String) {
                args = [channels];
            } else {
                if (Array.isArray(channels)) {
                    args.push(...channels);
                } else {
                    throw new Error(`${typeof channels} is not supported type`);
                }
            }
            args.map(x => {
                if (typeof x != 'string' && !(x instanceof String)) {
                    throw new Error(`${x} is not valid argument of subscribe`);
                }
            });
            if (args.length <= 0) {
                throw new Error(`channels length can not be less then 1`);
            }

            let data = new proto.WsRequest({
                op: proto.WsRequest.Operation.UNSUBSCRIBE,
                args: args
            });
            this.send(proto.WsRequest.encode(data).finish());
        } else {
            throw new Error('channels is required argument');
        }
    };
    /**
     *
     */
    connect = () => {
        if (!this.ws || !this.isConnected()) {
            this.ws = new WebSocket(this.endpoint);
            this.ws.binaryType = "arraybuffer";
            this.ws.onopen = this._onOpen;
            this.ws.onerror = this._onError;
            this.ws.onclose = this._onClose;
            this.ws.onmessage = this._onMessage;
            this.pingPong = setInterval(this._pingHandler, this.pingDuration)
        } else {
            //TODO
        }
    };
    /** =====  private methods  ===== **/
    _binaryDecode = data => {
        let res = proto.WsResponse.decode(new Uint8Array(data));
        let split = res.channel.split("_");
        if (split.length > 1) {
            res.channel = {
                "main": split[0],
                "sub": split[1],
            };
        } else {
            res.channel = {
                "main": split[0],
                "sub": null,
            };
        }
        switch (split[0]) {
            case "TRADE":
                res.data = proto.WsTrade.decode(res.data);
                break;
            case "TICKER":
                res.data = proto.WsTicker.decode(res.data);
                break;
            case "ACCOUNT":
                res.data = proto.WsAccount.decode(res.data);
                break;
            case "ORDER":
                res.data = proto.WsOrderResponse.decode(res.data);
                break;
            case "SUMMARY":
                //TODO
                break;
            case "ORDERBOOK":
                res.data = JSON.parse(this.textDecoder.decode(res.data));
            case proto.Channel.UNKNOWN_CHANNEL:
                break;
            default:
                break;
        }
        return res
    };

    _subscribe_list_remove(channel) {
        let index = this.state.subscribes.indexOf(channel);
        if (index > -1) {
            this.state.subscribes.splice(index, 1);
        }
    }

    _subscribe_list_add(channel) {
        let index = this.state.subscribes.indexOf(channel);
        if (index === -1) {
            this.state.subscribes.push(channel)
        }
    }

    /** ------  data handlers  ----- **/
    _pingHandler = () => {
        // console.log(this.lastPing, this.lastPong, this.lastPing - this.lastPong, this.pingDuration);
        if (this.lastPing - this.lastPong > this.pingDuration) {
            if (this.autoReconnect) {
                // console.log("try auto reconnect...");
                this.close();
                this.connect();
                return
            } else {
                //TODO..
            }
        }
        if (this.send('ping')) {
            this.lastPing = Date.now();
        } else {
            if (this.autoReconnect) {
                // console.log("try auto reconnect...");
                this.close();
                this.connect();
                return
            } else {
                //TODO..
            }
        }
    };


    _tradeMsgHandler = (data) => {
        // console.log('recv trade', `channel.${data.channel.main}_${data.channel.sub}`, data);
        this.emit(`channel.${data.channel.main}_${data.channel.sub}`, data)
    };

    _tickerMsgHandler = (data) => {
        // console.log('recv ticker', `channel.${data.channel.main}`, data);
        this.emit(`channel.${data.channel.main}`, data)
    };

    _accountMsgHandler = (data) => {
        // console.log('recv account', data);
        this.emit(`channel.${data.channel.main}`, data)
    };

    _orderbookMsgHandler = (data) => {
        // console.log('recv orderBook', `channel.${data.channel.main}_${data.channel.sub}`, data);
        this.emit(`channel.${data.channel.main}_${data.channel.sub}`, data)
    };

    _orderMsgHandler = (data) => {
        // console.log('recv order', `channel.${data.channel.main}`, data);
        this.emit(`channel.${data.channel.main}`, data)
    };

    _handlers = (() => {
        const valuesById = {};
        let obj = Object.create(valuesById);
        obj["TRADE"] = this._tradeMsgHandler;
        obj["TICKER"] = this._tickerMsgHandler;
        obj["ACCOUNT"] = this._accountMsgHandler;
        obj["ORDERBOOK"] = this._orderbookMsgHandler;
        obj["ORDER"] = this._orderMsgHandler;
        obj["SUMMARY"] = (e) => null;
        obj["UNKNOWN_CHANNEL"] = (e) => null;
        return obj;
    })();

    _onCommend = data => {
        if (data.ok) {
            const op = data.op;
            // console.log(data, op);

            switch (op) {
                case "SUBSCRIBE":
                    // console.log("this._subscribe_list_add(data.arg);", op);
                    this._subscribe_list_add(data.arg);
                    break;
                case "UNSUBSCRIBE":
                    this._subscribe_list_remove(data.arg);
                    break;
            }
        } else {
            // throw new Error(data.result);
        }
    };

    /** -----  websocket events ----- **/
    _onOpen = (evt) => {
        this.lastPing = Date.now();
        this.lastPong = Date.now();
        if (this.cmds.length > 0) {
            let obj = {};
            while (true) {
                obj = this.cmds.pop();
                if (obj) {
                    obj.f(obj.arg)
                } else {
                    break;
                }
            }
            // console.log("onOpen", evt);
            this.emit('connected', evt);
        }
    };

    _onClose = evt => {
        // console.log(evt);
        // code 1000 : Normal closure;
        // the connection successfully completed whatever purpose for which it was created.
        this.emit('closed', evt);
    };

    _onError = evt => {
        // console.log(evt);
        // this.emit('error', evt);
    };

    _onMessage = event => {
        // console.log('recv |', Date.now(), typeof event.data, event);
        if (event.data instanceof ArrayBuffer) {
            let data = this._binaryDecode(event.data);
            // console.log(data.channel, data, proto.Channel[data.channel.main]);
            if (this._handlers[data.channel.main]) this._handlers[data.channel.main](data);
        } else {
            if (event.data === 'pong') {
                this.lastPong = Date.now();
                return
            }
            let data = JSON.parse(event.data);
            // console.log("RECV",data)
            if (data.hasOwnProperty("ok")) {
                this._onCommend(data)
            } else {
                // console.log("emit","channel." + data.channel)
                this.emit("channel." + data.channel, data.data)
            }

        }
    };
}

export {Delibird, proto};
/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

/**
 * Channel enum.
 * @exports Channel
 * @enum {string}
 * @property {number} UNKNOWN_CHANNEL=0 UNKNOWN_CHANNEL value
 * @property {number} TICKER=1 TICKER value
 * @property {number} TRADE=2 TRADE value
 * @property {number} ACCOUNT=3 ACCOUNT value
 * @property {number} ORDER_BOOK=4 ORDER_BOOK value
 * @property {number} ORDER=5 ORDER value
 * @property {number} SUMMARY=6 SUMMARY value
 * @property {number} UNIVERSAL_STRING=10 UNIVERSAL_STRING value
 */
export const Channel = $root.Channel = (function() {
    const valuesById = {}, values = Object.create(valuesById);
    values[valuesById[0] = "UNKNOWN_CHANNEL"] = 0;
    values[valuesById[1] = "TICKER"] = 1;
    values[valuesById[2] = "TRADE"] = 2;
    values[valuesById[3] = "ACCOUNT"] = 3;
    values[valuesById[4] = "ORDER_BOOK"] = 4;
    values[valuesById[5] = "ORDER"] = 5;
    values[valuesById[6] = "SUMMARY"] = 6;
    values[valuesById[10] = "UNIVERSAL_STRING"] = 10;
    return values;
})();

export const WsRequest = $root.WsRequest = (() => {

    /**
     * Properties of a WsRequest.
     * @exports IWsRequest
     * @interface IWsRequest
     * @property {WsRequest.Operation|null} [op] WsRequest op
     * @property {Array.<string>|null} [args] WsRequest args
     */

    /**
     * Constructs a new WsRequest.
     * @exports WsRequest
     * @classdesc Represents a WsRequest.
     * @implements IWsRequest
     * @constructor
     * @param {IWsRequest=} [properties] Properties to set
     */
    function WsRequest(properties) {
        this.args = [];
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * WsRequest op.
     * @member {WsRequest.Operation} op
     * @memberof WsRequest
     * @instance
     */
    WsRequest.prototype.op = 0;

    /**
     * WsRequest args.
     * @member {Array.<string>} args
     * @memberof WsRequest
     * @instance
     */
    WsRequest.prototype.args = $util.emptyArray;

    /**
     * Creates a new WsRequest instance using the specified properties.
     * @function create
     * @memberof WsRequest
     * @static
     * @param {IWsRequest=} [properties] Properties to set
     * @returns {WsRequest} WsRequest instance
     */
    WsRequest.create = function create(properties) {
        return new WsRequest(properties);
    };

    /**
     * Encodes the specified WsRequest message. Does not implicitly {@link WsRequest.verify|verify} messages.
     * @function encode
     * @memberof WsRequest
     * @static
     * @param {IWsRequest} message WsRequest message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    WsRequest.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.op != null && message.hasOwnProperty("op"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.op);
        if (message.args != null && message.args.length)
            for (let i = 0; i < message.args.length; ++i)
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.args[i]);
        return writer;
    };

    /**
     * Encodes the specified WsRequest message, length delimited. Does not implicitly {@link WsRequest.verify|verify} messages.
     * @function encodeDelimited
     * @memberof WsRequest
     * @static
     * @param {IWsRequest} message WsRequest message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    WsRequest.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a WsRequest message from the specified reader or buffer.
     * @function decode
     * @memberof WsRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {WsRequest} WsRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    WsRequest.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.WsRequest();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.op = reader.int32();
                break;
            case 2:
                if (!(message.args && message.args.length))
                    message.args = [];
                message.args.push(reader.string());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a WsRequest message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof WsRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {WsRequest} WsRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    WsRequest.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a WsRequest message.
     * @function verify
     * @memberof WsRequest
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    WsRequest.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.op != null && message.hasOwnProperty("op"))
            switch (message.op) {
            default:
                return "op: enum value expected";
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
                break;
            }
        if (message.args != null && message.hasOwnProperty("args")) {
            if (!Array.isArray(message.args))
                return "args: array expected";
            for (let i = 0; i < message.args.length; ++i)
                if (!$util.isString(message.args[i]))
                    return "args: string[] expected";
        }
        return null;
    };

    /**
     * Creates a WsRequest message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof WsRequest
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {WsRequest} WsRequest
     */
    WsRequest.fromObject = function fromObject(object) {
        if (object instanceof $root.WsRequest)
            return object;
        let message = new $root.WsRequest();
        switch (object.op) {
        case "NONE":
        case 0:
            message.op = 0;
            break;
        case "SUBSCRIBE":
        case 1:
            message.op = 1;
            break;
        case "UNSUBSCRIBE":
        case 2:
            message.op = 2;
            break;
        case "RESTORE":
        case 3:
            message.op = 3;
            break;
        case "AUTH":
        case 4:
            message.op = 4;
            break;
        }
        if (object.args) {
            if (!Array.isArray(object.args))
                throw TypeError(".WsRequest.args: array expected");
            message.args = [];
            for (let i = 0; i < object.args.length; ++i)
                message.args[i] = String(object.args[i]);
        }
        return message;
    };

    /**
     * Creates a plain object from a WsRequest message. Also converts values to other types if specified.
     * @function toObject
     * @memberof WsRequest
     * @static
     * @param {WsRequest} message WsRequest
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    WsRequest.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.arrays || options.defaults)
            object.args = [];
        if (options.defaults)
            object.op = options.enums === String ? "NONE" : 0;
        if (message.op != null && message.hasOwnProperty("op"))
            object.op = options.enums === String ? $root.WsRequest.Operation[message.op] : message.op;
        if (message.args && message.args.length) {
            object.args = [];
            for (let j = 0; j < message.args.length; ++j)
                object.args[j] = message.args[j];
        }
        return object;
    };

    /**
     * Converts this WsRequest to JSON.
     * @function toJSON
     * @memberof WsRequest
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    WsRequest.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Operation enum.
     * @name WsRequest.Operation
     * @enum {string}
     * @property {number} NONE=0 NONE value
     * @property {number} SUBSCRIBE=1 SUBSCRIBE value
     * @property {number} UNSUBSCRIBE=2 UNSUBSCRIBE value
     * @property {number} RESTORE=3 RESTORE value
     * @property {number} AUTH=4 AUTH value
     */
    WsRequest.Operation = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "NONE"] = 0;
        values[valuesById[1] = "SUBSCRIBE"] = 1;
        values[valuesById[2] = "UNSUBSCRIBE"] = 2;
        values[valuesById[3] = "RESTORE"] = 3;
        values[valuesById[4] = "AUTH"] = 4;
        return values;
    })();

    return WsRequest;
})();

export const WsResponse = $root.WsResponse = (() => {

    /**
     * Properties of a WsResponse.
     * @exports IWsResponse
     * @interface IWsResponse
     * @property {string|null} [channel] WsResponse channel
     * @property {Uint8Array|null} [data] WsResponse data
     */

    /**
     * Constructs a new WsResponse.
     * @exports WsResponse
     * @classdesc Represents a WsResponse.
     * @implements IWsResponse
     * @constructor
     * @param {IWsResponse=} [properties] Properties to set
     */
    function WsResponse(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * WsResponse channel.
     * @member {string} channel
     * @memberof WsResponse
     * @instance
     */
    WsResponse.prototype.channel = "";

    /**
     * WsResponse data.
     * @member {Uint8Array} data
     * @memberof WsResponse
     * @instance
     */
    WsResponse.prototype.data = $util.newBuffer([]);

    /**
     * Creates a new WsResponse instance using the specified properties.
     * @function create
     * @memberof WsResponse
     * @static
     * @param {IWsResponse=} [properties] Properties to set
     * @returns {WsResponse} WsResponse instance
     */
    WsResponse.create = function create(properties) {
        return new WsResponse(properties);
    };

    /**
     * Encodes the specified WsResponse message. Does not implicitly {@link WsResponse.verify|verify} messages.
     * @function encode
     * @memberof WsResponse
     * @static
     * @param {IWsResponse} message WsResponse message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    WsResponse.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.channel != null && message.hasOwnProperty("channel"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.channel);
        if (message.data != null && message.hasOwnProperty("data"))
            writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.data);
        return writer;
    };

    /**
     * Encodes the specified WsResponse message, length delimited. Does not implicitly {@link WsResponse.verify|verify} messages.
     * @function encodeDelimited
     * @memberof WsResponse
     * @static
     * @param {IWsResponse} message WsResponse message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    WsResponse.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a WsResponse message from the specified reader or buffer.
     * @function decode
     * @memberof WsResponse
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {WsResponse} WsResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    WsResponse.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.WsResponse();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.channel = reader.string();
                break;
            case 3:
                message.data = reader.bytes();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a WsResponse message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof WsResponse
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {WsResponse} WsResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    WsResponse.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a WsResponse message.
     * @function verify
     * @memberof WsResponse
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    WsResponse.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.channel != null && message.hasOwnProperty("channel"))
            if (!$util.isString(message.channel))
                return "channel: string expected";
        if (message.data != null && message.hasOwnProperty("data"))
            if (!(message.data && typeof message.data.length === "number" || $util.isString(message.data)))
                return "data: buffer expected";
        return null;
    };

    /**
     * Creates a WsResponse message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof WsResponse
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {WsResponse} WsResponse
     */
    WsResponse.fromObject = function fromObject(object) {
        if (object instanceof $root.WsResponse)
            return object;
        let message = new $root.WsResponse();
        if (object.channel != null)
            message.channel = String(object.channel);
        if (object.data != null)
            if (typeof object.data === "string")
                $util.base64.decode(object.data, message.data = $util.newBuffer($util.base64.length(object.data)), 0);
            else if (object.data.length)
                message.data = object.data;
        return message;
    };

    /**
     * Creates a plain object from a WsResponse message. Also converts values to other types if specified.
     * @function toObject
     * @memberof WsResponse
     * @static
     * @param {WsResponse} message WsResponse
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    WsResponse.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.channel = "";
            if (options.bytes === String)
                object.data = "";
            else {
                object.data = [];
                if (options.bytes !== Array)
                    object.data = $util.newBuffer(object.data);
            }
        }
        if (message.channel != null && message.hasOwnProperty("channel"))
            object.channel = message.channel;
        if (message.data != null && message.hasOwnProperty("data"))
            object.data = options.bytes === String ? $util.base64.encode(message.data, 0, message.data.length) : options.bytes === Array ? Array.prototype.slice.call(message.data) : message.data;
        return object;
    };

    /**
     * Converts this WsResponse to JSON.
     * @function toJSON
     * @memberof WsResponse
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    WsResponse.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return WsResponse;
})();

export const WsAccount = $root.WsAccount = (() => {

    /**
     * Properties of a WsAccount.
     * @exports IWsAccount
     * @interface IWsAccount
     * @property {string|null} [asset_symbol] WsAccount asset_symbol
     * @property {string|null} [asset_english_name] WsAccount asset_english_name
     * @property {string|null} [asset_korean_name] WsAccount asset_korean_name
     * @property {IDecimal|null} [balance] WsAccount balance
     * @property {IDecimal|null} [pending_order] WsAccount pending_order
     * @property {IDecimal|null} [pending_withdrawal] WsAccount pending_withdrawal
     * @property {IDecimal|null} [avg_fiat_buy_price] WsAccount avg_fiat_buy_price
     * @property {boolean|null} [is_avg_fiat_buy_price_modified] WsAccount is_avg_fiat_buy_price_modified
     * @property {IDecimal|null} [liquid] WsAccount liquid
     * @property {string|null} [uuid] WsAccount uuid
     */

    /**
     * Constructs a new WsAccount.
     * @exports WsAccount
     * @classdesc Represents a WsAccount.
     * @implements IWsAccount
     * @constructor
     * @param {IWsAccount=} [properties] Properties to set
     */
    function WsAccount(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * WsAccount asset_symbol.
     * @member {string} asset_symbol
     * @memberof WsAccount
     * @instance
     */
    WsAccount.prototype.asset_symbol = "";

    /**
     * WsAccount asset_english_name.
     * @member {string} asset_english_name
     * @memberof WsAccount
     * @instance
     */
    WsAccount.prototype.asset_english_name = "";

    /**
     * WsAccount asset_korean_name.
     * @member {string} asset_korean_name
     * @memberof WsAccount
     * @instance
     */
    WsAccount.prototype.asset_korean_name = "";

    /**
     * WsAccount balance.
     * @member {IDecimal|null|undefined} balance
     * @memberof WsAccount
     * @instance
     */
    WsAccount.prototype.balance = null;

    /**
     * WsAccount pending_order.
     * @member {IDecimal|null|undefined} pending_order
     * @memberof WsAccount
     * @instance
     */
    WsAccount.prototype.pending_order = null;

    /**
     * WsAccount pending_withdrawal.
     * @member {IDecimal|null|undefined} pending_withdrawal
     * @memberof WsAccount
     * @instance
     */
    WsAccount.prototype.pending_withdrawal = null;

    /**
     * WsAccount avg_fiat_buy_price.
     * @member {IDecimal|null|undefined} avg_fiat_buy_price
     * @memberof WsAccount
     * @instance
     */
    WsAccount.prototype.avg_fiat_buy_price = null;

    /**
     * WsAccount is_avg_fiat_buy_price_modified.
     * @member {boolean} is_avg_fiat_buy_price_modified
     * @memberof WsAccount
     * @instance
     */
    WsAccount.prototype.is_avg_fiat_buy_price_modified = false;

    /**
     * WsAccount liquid.
     * @member {IDecimal|null|undefined} liquid
     * @memberof WsAccount
     * @instance
     */
    WsAccount.prototype.liquid = null;

    /**
     * WsAccount uuid.
     * @member {string} uuid
     * @memberof WsAccount
     * @instance
     */
    WsAccount.prototype.uuid = "";

    /**
     * Creates a new WsAccount instance using the specified properties.
     * @function create
     * @memberof WsAccount
     * @static
     * @param {IWsAccount=} [properties] Properties to set
     * @returns {WsAccount} WsAccount instance
     */
    WsAccount.create = function create(properties) {
        return new WsAccount(properties);
    };

    /**
     * Encodes the specified WsAccount message. Does not implicitly {@link WsAccount.verify|verify} messages.
     * @function encode
     * @memberof WsAccount
     * @static
     * @param {IWsAccount} message WsAccount message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    WsAccount.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.asset_symbol != null && message.hasOwnProperty("asset_symbol"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.asset_symbol);
        if (message.asset_english_name != null && message.hasOwnProperty("asset_english_name"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.asset_english_name);
        if (message.asset_korean_name != null && message.hasOwnProperty("asset_korean_name"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.asset_korean_name);
        if (message.balance != null && message.hasOwnProperty("balance"))
            $root.Decimal.encode(message.balance, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
        if (message.pending_order != null && message.hasOwnProperty("pending_order"))
            $root.Decimal.encode(message.pending_order, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
        if (message.pending_withdrawal != null && message.hasOwnProperty("pending_withdrawal"))
            $root.Decimal.encode(message.pending_withdrawal, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
        if (message.avg_fiat_buy_price != null && message.hasOwnProperty("avg_fiat_buy_price"))
            $root.Decimal.encode(message.avg_fiat_buy_price, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
        if (message.is_avg_fiat_buy_price_modified != null && message.hasOwnProperty("is_avg_fiat_buy_price_modified"))
            writer.uint32(/* id 8, wireType 0 =*/64).bool(message.is_avg_fiat_buy_price_modified);
        if (message.liquid != null && message.hasOwnProperty("liquid"))
            $root.Decimal.encode(message.liquid, writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
        if (message.uuid != null && message.hasOwnProperty("uuid"))
            writer.uint32(/* id 10, wireType 2 =*/82).string(message.uuid);
        return writer;
    };

    /**
     * Encodes the specified WsAccount message, length delimited. Does not implicitly {@link WsAccount.verify|verify} messages.
     * @function encodeDelimited
     * @memberof WsAccount
     * @static
     * @param {IWsAccount} message WsAccount message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    WsAccount.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a WsAccount message from the specified reader or buffer.
     * @function decode
     * @memberof WsAccount
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {WsAccount} WsAccount
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    WsAccount.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.WsAccount();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.asset_symbol = reader.string();
                break;
            case 2:
                message.asset_english_name = reader.string();
                break;
            case 3:
                message.asset_korean_name = reader.string();
                break;
            case 4:
                message.balance = $root.Decimal.decode(reader, reader.uint32());
                break;
            case 5:
                message.pending_order = $root.Decimal.decode(reader, reader.uint32());
                break;
            case 6:
                message.pending_withdrawal = $root.Decimal.decode(reader, reader.uint32());
                break;
            case 7:
                message.avg_fiat_buy_price = $root.Decimal.decode(reader, reader.uint32());
                break;
            case 8:
                message.is_avg_fiat_buy_price_modified = reader.bool();
                break;
            case 9:
                message.liquid = $root.Decimal.decode(reader, reader.uint32());
                break;
            case 10:
                message.uuid = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a WsAccount message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof WsAccount
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {WsAccount} WsAccount
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    WsAccount.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a WsAccount message.
     * @function verify
     * @memberof WsAccount
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    WsAccount.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.asset_symbol != null && message.hasOwnProperty("asset_symbol"))
            if (!$util.isString(message.asset_symbol))
                return "asset_symbol: string expected";
        if (message.asset_english_name != null && message.hasOwnProperty("asset_english_name"))
            if (!$util.isString(message.asset_english_name))
                return "asset_english_name: string expected";
        if (message.asset_korean_name != null && message.hasOwnProperty("asset_korean_name"))
            if (!$util.isString(message.asset_korean_name))
                return "asset_korean_name: string expected";
        if (message.balance != null && message.hasOwnProperty("balance")) {
            let error = $root.Decimal.verify(message.balance);
            if (error)
                return "balance." + error;
        }
        if (message.pending_order != null && message.hasOwnProperty("pending_order")) {
            let error = $root.Decimal.verify(message.pending_order);
            if (error)
                return "pending_order." + error;
        }
        if (message.pending_withdrawal != null && message.hasOwnProperty("pending_withdrawal")) {
            let error = $root.Decimal.verify(message.pending_withdrawal);
            if (error)
                return "pending_withdrawal." + error;
        }
        if (message.avg_fiat_buy_price != null && message.hasOwnProperty("avg_fiat_buy_price")) {
            let error = $root.Decimal.verify(message.avg_fiat_buy_price);
            if (error)
                return "avg_fiat_buy_price." + error;
        }
        if (message.is_avg_fiat_buy_price_modified != null && message.hasOwnProperty("is_avg_fiat_buy_price_modified"))
            if (typeof message.is_avg_fiat_buy_price_modified !== "boolean")
                return "is_avg_fiat_buy_price_modified: boolean expected";
        if (message.liquid != null && message.hasOwnProperty("liquid")) {
            let error = $root.Decimal.verify(message.liquid);
            if (error)
                return "liquid." + error;
        }
        if (message.uuid != null && message.hasOwnProperty("uuid"))
            if (!$util.isString(message.uuid))
                return "uuid: string expected";
        return null;
    };

    /**
     * Creates a WsAccount message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof WsAccount
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {WsAccount} WsAccount
     */
    WsAccount.fromObject = function fromObject(object) {
        if (object instanceof $root.WsAccount)
            return object;
        let message = new $root.WsAccount();
        if (object.asset_symbol != null)
            message.asset_symbol = String(object.asset_symbol);
        if (object.asset_english_name != null)
            message.asset_english_name = String(object.asset_english_name);
        if (object.asset_korean_name != null)
            message.asset_korean_name = String(object.asset_korean_name);
        if (object.balance != null) {
            if (typeof object.balance !== "object")
                throw TypeError(".WsAccount.balance: object expected");
            message.balance = $root.Decimal.fromObject(object.balance);
        }
        if (object.pending_order != null) {
            if (typeof object.pending_order !== "object")
                throw TypeError(".WsAccount.pending_order: object expected");
            message.pending_order = $root.Decimal.fromObject(object.pending_order);
        }
        if (object.pending_withdrawal != null) {
            if (typeof object.pending_withdrawal !== "object")
                throw TypeError(".WsAccount.pending_withdrawal: object expected");
            message.pending_withdrawal = $root.Decimal.fromObject(object.pending_withdrawal);
        }
        if (object.avg_fiat_buy_price != null) {
            if (typeof object.avg_fiat_buy_price !== "object")
                throw TypeError(".WsAccount.avg_fiat_buy_price: object expected");
            message.avg_fiat_buy_price = $root.Decimal.fromObject(object.avg_fiat_buy_price);
        }
        if (object.is_avg_fiat_buy_price_modified != null)
            message.is_avg_fiat_buy_price_modified = Boolean(object.is_avg_fiat_buy_price_modified);
        if (object.liquid != null) {
            if (typeof object.liquid !== "object")
                throw TypeError(".WsAccount.liquid: object expected");
            message.liquid = $root.Decimal.fromObject(object.liquid);
        }
        if (object.uuid != null)
            message.uuid = String(object.uuid);
        return message;
    };

    /**
     * Creates a plain object from a WsAccount message. Also converts values to other types if specified.
     * @function toObject
     * @memberof WsAccount
     * @static
     * @param {WsAccount} message WsAccount
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    WsAccount.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.asset_symbol = "";
            object.asset_english_name = "";
            object.asset_korean_name = "";
            object.balance = null;
            object.pending_order = null;
            object.pending_withdrawal = null;
            object.avg_fiat_buy_price = null;
            object.is_avg_fiat_buy_price_modified = false;
            object.liquid = null;
            object.uuid = "";
        }
        if (message.asset_symbol != null && message.hasOwnProperty("asset_symbol"))
            object.asset_symbol = message.asset_symbol;
        if (message.asset_english_name != null && message.hasOwnProperty("asset_english_name"))
            object.asset_english_name = message.asset_english_name;
        if (message.asset_korean_name != null && message.hasOwnProperty("asset_korean_name"))
            object.asset_korean_name = message.asset_korean_name;
        if (message.balance != null && message.hasOwnProperty("balance"))
            object.balance = $root.Decimal.toObject(message.balance, options);
        if (message.pending_order != null && message.hasOwnProperty("pending_order"))
            object.pending_order = $root.Decimal.toObject(message.pending_order, options);
        if (message.pending_withdrawal != null && message.hasOwnProperty("pending_withdrawal"))
            object.pending_withdrawal = $root.Decimal.toObject(message.pending_withdrawal, options);
        if (message.avg_fiat_buy_price != null && message.hasOwnProperty("avg_fiat_buy_price"))
            object.avg_fiat_buy_price = $root.Decimal.toObject(message.avg_fiat_buy_price, options);
        if (message.is_avg_fiat_buy_price_modified != null && message.hasOwnProperty("is_avg_fiat_buy_price_modified"))
            object.is_avg_fiat_buy_price_modified = message.is_avg_fiat_buy_price_modified;
        if (message.liquid != null && message.hasOwnProperty("liquid"))
            object.liquid = $root.Decimal.toObject(message.liquid, options);
        if (message.uuid != null && message.hasOwnProperty("uuid"))
            object.uuid = message.uuid;
        return object;
    };

    /**
     * Converts this WsAccount to JSON.
     * @function toJSON
     * @memberof WsAccount
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    WsAccount.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return WsAccount;
})();

export const WsTicker = $root.WsTicker = (() => {

    /**
     * Properties of a WsTicker.
     * @exports IWsTicker
     * @interface IWsTicker
     * @property {string|null} [trading_pair_name] WsTicker trading_pair_name
     * @property {number|Long|null} [trade_date_time] WsTicker trade_date_time
     * @property {IDecimal|null} [open_price] WsTicker open_price
     * @property {IDecimal|null} [high_price] WsTicker high_price
     * @property {IDecimal|null} [low_price] WsTicker low_price
     * @property {IDecimal|null} [close_price] WsTicker close_price
     * @property {WsTicker.Change|null} [change] WsTicker change
     * @property {IDecimal|null} [change_price] WsTicker change_price
     * @property {IDecimal|null} [change_rate] WsTicker change_rate
     * @property {IDecimal|null} [trade_volume] WsTicker trade_volume
     * @property {IDecimal|null} [acc_trade_value_24h] WsTicker acc_trade_value_24h
     * @property {IDecimal|null} [acc_trade_volume_24h] WsTicker acc_trade_volume_24h
     * @property {number|Long|null} [created] WsTicker created
     */

    /**
     * Constructs a new WsTicker.
     * @exports WsTicker
     * @classdesc Represents a WsTicker.
     * @implements IWsTicker
     * @constructor
     * @param {IWsTicker=} [properties] Properties to set
     */
    function WsTicker(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * WsTicker trading_pair_name.
     * @member {string} trading_pair_name
     * @memberof WsTicker
     * @instance
     */
    WsTicker.prototype.trading_pair_name = "";

    /**
     * WsTicker trade_date_time.
     * @member {number|Long} trade_date_time
     * @memberof WsTicker
     * @instance
     */
    WsTicker.prototype.trade_date_time = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * WsTicker open_price.
     * @member {IDecimal|null|undefined} open_price
     * @memberof WsTicker
     * @instance
     */
    WsTicker.prototype.open_price = null;

    /**
     * WsTicker high_price.
     * @member {IDecimal|null|undefined} high_price
     * @memberof WsTicker
     * @instance
     */
    WsTicker.prototype.high_price = null;

    /**
     * WsTicker low_price.
     * @member {IDecimal|null|undefined} low_price
     * @memberof WsTicker
     * @instance
     */
    WsTicker.prototype.low_price = null;

    /**
     * WsTicker close_price.
     * @member {IDecimal|null|undefined} close_price
     * @memberof WsTicker
     * @instance
     */
    WsTicker.prototype.close_price = null;

    /**
     * WsTicker change.
     * @member {WsTicker.Change} change
     * @memberof WsTicker
     * @instance
     */
    WsTicker.prototype.change = 0;

    /**
     * WsTicker change_price.
     * @member {IDecimal|null|undefined} change_price
     * @memberof WsTicker
     * @instance
     */
    WsTicker.prototype.change_price = null;

    /**
     * WsTicker change_rate.
     * @member {IDecimal|null|undefined} change_rate
     * @memberof WsTicker
     * @instance
     */
    WsTicker.prototype.change_rate = null;

    /**
     * WsTicker trade_volume.
     * @member {IDecimal|null|undefined} trade_volume
     * @memberof WsTicker
     * @instance
     */
    WsTicker.prototype.trade_volume = null;

    /**
     * WsTicker acc_trade_value_24h.
     * @member {IDecimal|null|undefined} acc_trade_value_24h
     * @memberof WsTicker
     * @instance
     */
    WsTicker.prototype.acc_trade_value_24h = null;

    /**
     * WsTicker acc_trade_volume_24h.
     * @member {IDecimal|null|undefined} acc_trade_volume_24h
     * @memberof WsTicker
     * @instance
     */
    WsTicker.prototype.acc_trade_volume_24h = null;

    /**
     * WsTicker created.
     * @member {number|Long} created
     * @memberof WsTicker
     * @instance
     */
    WsTicker.prototype.created = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * Creates a new WsTicker instance using the specified properties.
     * @function create
     * @memberof WsTicker
     * @static
     * @param {IWsTicker=} [properties] Properties to set
     * @returns {WsTicker} WsTicker instance
     */
    WsTicker.create = function create(properties) {
        return new WsTicker(properties);
    };

    /**
     * Encodes the specified WsTicker message. Does not implicitly {@link WsTicker.verify|verify} messages.
     * @function encode
     * @memberof WsTicker
     * @static
     * @param {IWsTicker} message WsTicker message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    WsTicker.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.trading_pair_name != null && message.hasOwnProperty("trading_pair_name"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.trading_pair_name);
        if (message.trade_date_time != null && message.hasOwnProperty("trade_date_time"))
            writer.uint32(/* id 2, wireType 0 =*/16).int64(message.trade_date_time);
        if (message.open_price != null && message.hasOwnProperty("open_price"))
            $root.Decimal.encode(message.open_price, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        if (message.high_price != null && message.hasOwnProperty("high_price"))
            $root.Decimal.encode(message.high_price, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
        if (message.low_price != null && message.hasOwnProperty("low_price"))
            $root.Decimal.encode(message.low_price, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
        if (message.close_price != null && message.hasOwnProperty("close_price"))
            $root.Decimal.encode(message.close_price, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
        if (message.change != null && message.hasOwnProperty("change"))
            writer.uint32(/* id 7, wireType 0 =*/56).int32(message.change);
        if (message.change_price != null && message.hasOwnProperty("change_price"))
            $root.Decimal.encode(message.change_price, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
        if (message.change_rate != null && message.hasOwnProperty("change_rate"))
            $root.Decimal.encode(message.change_rate, writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
        if (message.trade_volume != null && message.hasOwnProperty("trade_volume"))
            $root.Decimal.encode(message.trade_volume, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
        if (message.acc_trade_value_24h != null && message.hasOwnProperty("acc_trade_value_24h"))
            $root.Decimal.encode(message.acc_trade_value_24h, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
        if (message.acc_trade_volume_24h != null && message.hasOwnProperty("acc_trade_volume_24h"))
            $root.Decimal.encode(message.acc_trade_volume_24h, writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
        if (message.created != null && message.hasOwnProperty("created"))
            writer.uint32(/* id 13, wireType 0 =*/104).int64(message.created);
        return writer;
    };

    /**
     * Encodes the specified WsTicker message, length delimited. Does not implicitly {@link WsTicker.verify|verify} messages.
     * @function encodeDelimited
     * @memberof WsTicker
     * @static
     * @param {IWsTicker} message WsTicker message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    WsTicker.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a WsTicker message from the specified reader or buffer.
     * @function decode
     * @memberof WsTicker
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {WsTicker} WsTicker
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    WsTicker.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.WsTicker();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.trading_pair_name = reader.string();
                break;
            case 2:
                message.trade_date_time = reader.int64();
                break;
            case 3:
                message.open_price = $root.Decimal.decode(reader, reader.uint32());
                break;
            case 4:
                message.high_price = $root.Decimal.decode(reader, reader.uint32());
                break;
            case 5:
                message.low_price = $root.Decimal.decode(reader, reader.uint32());
                break;
            case 6:
                message.close_price = $root.Decimal.decode(reader, reader.uint32());
                break;
            case 7:
                message.change = reader.int32();
                break;
            case 8:
                message.change_price = $root.Decimal.decode(reader, reader.uint32());
                break;
            case 9:
                message.change_rate = $root.Decimal.decode(reader, reader.uint32());
                break;
            case 10:
                message.trade_volume = $root.Decimal.decode(reader, reader.uint32());
                break;
            case 11:
                message.acc_trade_value_24h = $root.Decimal.decode(reader, reader.uint32());
                break;
            case 12:
                message.acc_trade_volume_24h = $root.Decimal.decode(reader, reader.uint32());
                break;
            case 13:
                message.created = reader.int64();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a WsTicker message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof WsTicker
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {WsTicker} WsTicker
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    WsTicker.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a WsTicker message.
     * @function verify
     * @memberof WsTicker
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    WsTicker.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.trading_pair_name != null && message.hasOwnProperty("trading_pair_name"))
            if (!$util.isString(message.trading_pair_name))
                return "trading_pair_name: string expected";
        if (message.trade_date_time != null && message.hasOwnProperty("trade_date_time"))
            if (!$util.isInteger(message.trade_date_time) && !(message.trade_date_time && $util.isInteger(message.trade_date_time.low) && $util.isInteger(message.trade_date_time.high)))
                return "trade_date_time: integer|Long expected";
        if (message.open_price != null && message.hasOwnProperty("open_price")) {
            let error = $root.Decimal.verify(message.open_price);
            if (error)
                return "open_price." + error;
        }
        if (message.high_price != null && message.hasOwnProperty("high_price")) {
            let error = $root.Decimal.verify(message.high_price);
            if (error)
                return "high_price." + error;
        }
        if (message.low_price != null && message.hasOwnProperty("low_price")) {
            let error = $root.Decimal.verify(message.low_price);
            if (error)
                return "low_price." + error;
        }
        if (message.close_price != null && message.hasOwnProperty("close_price")) {
            let error = $root.Decimal.verify(message.close_price);
            if (error)
                return "close_price." + error;
        }
        if (message.change != null && message.hasOwnProperty("change"))
            switch (message.change) {
            default:
                return "change: enum value expected";
            case 0:
            case 1:
            case 2:
            case 3:
                break;
            }
        if (message.change_price != null && message.hasOwnProperty("change_price")) {
            let error = $root.Decimal.verify(message.change_price);
            if (error)
                return "change_price." + error;
        }
        if (message.change_rate != null && message.hasOwnProperty("change_rate")) {
            let error = $root.Decimal.verify(message.change_rate);
            if (error)
                return "change_rate." + error;
        }
        if (message.trade_volume != null && message.hasOwnProperty("trade_volume")) {
            let error = $root.Decimal.verify(message.trade_volume);
            if (error)
                return "trade_volume." + error;
        }
        if (message.acc_trade_value_24h != null && message.hasOwnProperty("acc_trade_value_24h")) {
            let error = $root.Decimal.verify(message.acc_trade_value_24h);
            if (error)
                return "acc_trade_value_24h." + error;
        }
        if (message.acc_trade_volume_24h != null && message.hasOwnProperty("acc_trade_volume_24h")) {
            let error = $root.Decimal.verify(message.acc_trade_volume_24h);
            if (error)
                return "acc_trade_volume_24h." + error;
        }
        if (message.created != null && message.hasOwnProperty("created"))
            if (!$util.isInteger(message.created) && !(message.created && $util.isInteger(message.created.low) && $util.isInteger(message.created.high)))
                return "created: integer|Long expected";
        return null;
    };

    /**
     * Creates a WsTicker message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof WsTicker
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {WsTicker} WsTicker
     */
    WsTicker.fromObject = function fromObject(object) {
        if (object instanceof $root.WsTicker)
            return object;
        let message = new $root.WsTicker();
        if (object.trading_pair_name != null)
            message.trading_pair_name = String(object.trading_pair_name);
        if (object.trade_date_time != null)
            if ($util.Long)
                (message.trade_date_time = $util.Long.fromValue(object.trade_date_time)).unsigned = false;
            else if (typeof object.trade_date_time === "string")
                message.trade_date_time = parseInt(object.trade_date_time, 10);
            else if (typeof object.trade_date_time === "number")
                message.trade_date_time = object.trade_date_time;
            else if (typeof object.trade_date_time === "object")
                message.trade_date_time = new $util.LongBits(object.trade_date_time.low >>> 0, object.trade_date_time.high >>> 0).toNumber();
        if (object.open_price != null) {
            if (typeof object.open_price !== "object")
                throw TypeError(".WsTicker.open_price: object expected");
            message.open_price = $root.Decimal.fromObject(object.open_price);
        }
        if (object.high_price != null) {
            if (typeof object.high_price !== "object")
                throw TypeError(".WsTicker.high_price: object expected");
            message.high_price = $root.Decimal.fromObject(object.high_price);
        }
        if (object.low_price != null) {
            if (typeof object.low_price !== "object")
                throw TypeError(".WsTicker.low_price: object expected");
            message.low_price = $root.Decimal.fromObject(object.low_price);
        }
        if (object.close_price != null) {
            if (typeof object.close_price !== "object")
                throw TypeError(".WsTicker.close_price: object expected");
            message.close_price = $root.Decimal.fromObject(object.close_price);
        }
        switch (object.change) {
        case "UNKNOWN":
        case 0:
            message.change = 0;
            break;
        case "EVEN":
        case 1:
            message.change = 1;
            break;
        case "RISE":
        case 2:
            message.change = 2;
            break;
        case "FALL":
        case 3:
            message.change = 3;
            break;
        }
        if (object.change_price != null) {
            if (typeof object.change_price !== "object")
                throw TypeError(".WsTicker.change_price: object expected");
            message.change_price = $root.Decimal.fromObject(object.change_price);
        }
        if (object.change_rate != null) {
            if (typeof object.change_rate !== "object")
                throw TypeError(".WsTicker.change_rate: object expected");
            message.change_rate = $root.Decimal.fromObject(object.change_rate);
        }
        if (object.trade_volume != null) {
            if (typeof object.trade_volume !== "object")
                throw TypeError(".WsTicker.trade_volume: object expected");
            message.trade_volume = $root.Decimal.fromObject(object.trade_volume);
        }
        if (object.acc_trade_value_24h != null) {
            if (typeof object.acc_trade_value_24h !== "object")
                throw TypeError(".WsTicker.acc_trade_value_24h: object expected");
            message.acc_trade_value_24h = $root.Decimal.fromObject(object.acc_trade_value_24h);
        }
        if (object.acc_trade_volume_24h != null) {
            if (typeof object.acc_trade_volume_24h !== "object")
                throw TypeError(".WsTicker.acc_trade_volume_24h: object expected");
            message.acc_trade_volume_24h = $root.Decimal.fromObject(object.acc_trade_volume_24h);
        }
        if (object.created != null)
            if ($util.Long)
                (message.created = $util.Long.fromValue(object.created)).unsigned = false;
            else if (typeof object.created === "string")
                message.created = parseInt(object.created, 10);
            else if (typeof object.created === "number")
                message.created = object.created;
            else if (typeof object.created === "object")
                message.created = new $util.LongBits(object.created.low >>> 0, object.created.high >>> 0).toNumber();
        return message;
    };

    /**
     * Creates a plain object from a WsTicker message. Also converts values to other types if specified.
     * @function toObject
     * @memberof WsTicker
     * @static
     * @param {WsTicker} message WsTicker
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    WsTicker.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.trading_pair_name = "";
            if ($util.Long) {
                let long = new $util.Long(0, 0, false);
                object.trade_date_time = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.trade_date_time = options.longs === String ? "0" : 0;
            object.open_price = null;
            object.high_price = null;
            object.low_price = null;
            object.close_price = null;
            object.change = options.enums === String ? "UNKNOWN" : 0;
            object.change_price = null;
            object.change_rate = null;
            object.trade_volume = null;
            object.acc_trade_value_24h = null;
            object.acc_trade_volume_24h = null;
            if ($util.Long) {
                let long = new $util.Long(0, 0, false);
                object.created = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.created = options.longs === String ? "0" : 0;
        }
        if (message.trading_pair_name != null && message.hasOwnProperty("trading_pair_name"))
            object.trading_pair_name = message.trading_pair_name;
        if (message.trade_date_time != null && message.hasOwnProperty("trade_date_time"))
            if (typeof message.trade_date_time === "number")
                object.trade_date_time = options.longs === String ? String(message.trade_date_time) : message.trade_date_time;
            else
                object.trade_date_time = options.longs === String ? $util.Long.prototype.toString.call(message.trade_date_time) : options.longs === Number ? new $util.LongBits(message.trade_date_time.low >>> 0, message.trade_date_time.high >>> 0).toNumber() : message.trade_date_time;
        if (message.open_price != null && message.hasOwnProperty("open_price"))
            object.open_price = $root.Decimal.toObject(message.open_price, options);
        if (message.high_price != null && message.hasOwnProperty("high_price"))
            object.high_price = $root.Decimal.toObject(message.high_price, options);
        if (message.low_price != null && message.hasOwnProperty("low_price"))
            object.low_price = $root.Decimal.toObject(message.low_price, options);
        if (message.close_price != null && message.hasOwnProperty("close_price"))
            object.close_price = $root.Decimal.toObject(message.close_price, options);
        if (message.change != null && message.hasOwnProperty("change"))
            object.change = options.enums === String ? $root.WsTicker.Change[message.change] : message.change;
        if (message.change_price != null && message.hasOwnProperty("change_price"))
            object.change_price = $root.Decimal.toObject(message.change_price, options);
        if (message.change_rate != null && message.hasOwnProperty("change_rate"))
            object.change_rate = $root.Decimal.toObject(message.change_rate, options);
        if (message.trade_volume != null && message.hasOwnProperty("trade_volume"))
            object.trade_volume = $root.Decimal.toObject(message.trade_volume, options);
        if (message.acc_trade_value_24h != null && message.hasOwnProperty("acc_trade_value_24h"))
            object.acc_trade_value_24h = $root.Decimal.toObject(message.acc_trade_value_24h, options);
        if (message.acc_trade_volume_24h != null && message.hasOwnProperty("acc_trade_volume_24h"))
            object.acc_trade_volume_24h = $root.Decimal.toObject(message.acc_trade_volume_24h, options);
        if (message.created != null && message.hasOwnProperty("created"))
            if (typeof message.created === "number")
                object.created = options.longs === String ? String(message.created) : message.created;
            else
                object.created = options.longs === String ? $util.Long.prototype.toString.call(message.created) : options.longs === Number ? new $util.LongBits(message.created.low >>> 0, message.created.high >>> 0).toNumber() : message.created;
        return object;
    };

    /**
     * Converts this WsTicker to JSON.
     * @function toJSON
     * @memberof WsTicker
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    WsTicker.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Change enum.
     * @name WsTicker.Change
     * @enum {string}
     * @property {number} UNKNOWN=0 UNKNOWN value
     * @property {number} EVEN=1 EVEN value
     * @property {number} RISE=2 RISE value
     * @property {number} FALL=3 FALL value
     */
    WsTicker.Change = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "UNKNOWN"] = 0;
        values[valuesById[1] = "EVEN"] = 1;
        values[valuesById[2] = "RISE"] = 2;
        values[valuesById[3] = "FALL"] = 3;
        return values;
    })();

    return WsTicker;
})();

export const WsTrade = $root.WsTrade = (() => {

    /**
     * Properties of a WsTrade.
     * @exports IWsTrade
     * @interface IWsTrade
     * @property {string|null} [uuid] WsTrade uuid
     * @property {IDecimal|null} [volume] WsTrade volume
     * @property {IDecimal|null} [price] WsTrade price
     * @property {Side|null} [side] WsTrade side
     * @property {string|null} [trading_pair] WsTrade trading_pair
     * @property {number|Long|null} [created] WsTrade created
     */

    /**
     * Constructs a new WsTrade.
     * @exports WsTrade
     * @classdesc Represents a WsTrade.
     * @implements IWsTrade
     * @constructor
     * @param {IWsTrade=} [properties] Properties to set
     */
    function WsTrade(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * WsTrade uuid.
     * @member {string} uuid
     * @memberof WsTrade
     * @instance
     */
    WsTrade.prototype.uuid = "";

    /**
     * WsTrade volume.
     * @member {IDecimal|null|undefined} volume
     * @memberof WsTrade
     * @instance
     */
    WsTrade.prototype.volume = null;

    /**
     * WsTrade price.
     * @member {IDecimal|null|undefined} price
     * @memberof WsTrade
     * @instance
     */
    WsTrade.prototype.price = null;

    /**
     * WsTrade side.
     * @member {Side} side
     * @memberof WsTrade
     * @instance
     */
    WsTrade.prototype.side = 0;

    /**
     * WsTrade trading_pair.
     * @member {string} trading_pair
     * @memberof WsTrade
     * @instance
     */
    WsTrade.prototype.trading_pair = "";

    /**
     * WsTrade created.
     * @member {number|Long} created
     * @memberof WsTrade
     * @instance
     */
    WsTrade.prototype.created = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * Creates a new WsTrade instance using the specified properties.
     * @function create
     * @memberof WsTrade
     * @static
     * @param {IWsTrade=} [properties] Properties to set
     * @returns {WsTrade} WsTrade instance
     */
    WsTrade.create = function create(properties) {
        return new WsTrade(properties);
    };

    /**
     * Encodes the specified WsTrade message. Does not implicitly {@link WsTrade.verify|verify} messages.
     * @function encode
     * @memberof WsTrade
     * @static
     * @param {IWsTrade} message WsTrade message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    WsTrade.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.uuid != null && message.hasOwnProperty("uuid"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.uuid);
        if (message.volume != null && message.hasOwnProperty("volume"))
            $root.Decimal.encode(message.volume, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        if (message.price != null && message.hasOwnProperty("price"))
            $root.Decimal.encode(message.price, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
        if (message.side != null && message.hasOwnProperty("side"))
            writer.uint32(/* id 7, wireType 0 =*/56).int32(message.side);
        if (message.trading_pair != null && message.hasOwnProperty("trading_pair"))
            writer.uint32(/* id 8, wireType 2 =*/66).string(message.trading_pair);
        if (message.created != null && message.hasOwnProperty("created"))
            writer.uint32(/* id 9, wireType 0 =*/72).int64(message.created);
        return writer;
    };

    /**
     * Encodes the specified WsTrade message, length delimited. Does not implicitly {@link WsTrade.verify|verify} messages.
     * @function encodeDelimited
     * @memberof WsTrade
     * @static
     * @param {IWsTrade} message WsTrade message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    WsTrade.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a WsTrade message from the specified reader or buffer.
     * @function decode
     * @memberof WsTrade
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {WsTrade} WsTrade
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    WsTrade.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.WsTrade();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.uuid = reader.string();
                break;
            case 2:
                message.volume = $root.Decimal.decode(reader, reader.uint32());
                break;
            case 4:
                message.price = $root.Decimal.decode(reader, reader.uint32());
                break;
            case 7:
                message.side = reader.int32();
                break;
            case 8:
                message.trading_pair = reader.string();
                break;
            case 9:
                message.created = reader.int64();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a WsTrade message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof WsTrade
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {WsTrade} WsTrade
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    WsTrade.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a WsTrade message.
     * @function verify
     * @memberof WsTrade
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    WsTrade.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.uuid != null && message.hasOwnProperty("uuid"))
            if (!$util.isString(message.uuid))
                return "uuid: string expected";
        if (message.volume != null && message.hasOwnProperty("volume")) {
            let error = $root.Decimal.verify(message.volume);
            if (error)
                return "volume." + error;
        }
        if (message.price != null && message.hasOwnProperty("price")) {
            let error = $root.Decimal.verify(message.price);
            if (error)
                return "price." + error;
        }
        if (message.side != null && message.hasOwnProperty("side"))
            switch (message.side) {
            default:
                return "side: enum value expected";
            case 0:
            case 1:
                break;
            }
        if (message.trading_pair != null && message.hasOwnProperty("trading_pair"))
            if (!$util.isString(message.trading_pair))
                return "trading_pair: string expected";
        if (message.created != null && message.hasOwnProperty("created"))
            if (!$util.isInteger(message.created) && !(message.created && $util.isInteger(message.created.low) && $util.isInteger(message.created.high)))
                return "created: integer|Long expected";
        return null;
    };

    /**
     * Creates a WsTrade message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof WsTrade
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {WsTrade} WsTrade
     */
    WsTrade.fromObject = function fromObject(object) {
        if (object instanceof $root.WsTrade)
            return object;
        let message = new $root.WsTrade();
        if (object.uuid != null)
            message.uuid = String(object.uuid);
        if (object.volume != null) {
            if (typeof object.volume !== "object")
                throw TypeError(".WsTrade.volume: object expected");
            message.volume = $root.Decimal.fromObject(object.volume);
        }
        if (object.price != null) {
            if (typeof object.price !== "object")
                throw TypeError(".WsTrade.price: object expected");
            message.price = $root.Decimal.fromObject(object.price);
        }
        switch (object.side) {
        case "SELL":
        case 0:
            message.side = 0;
            break;
        case "BUY":
        case 1:
            message.side = 1;
            break;
        }
        if (object.trading_pair != null)
            message.trading_pair = String(object.trading_pair);
        if (object.created != null)
            if ($util.Long)
                (message.created = $util.Long.fromValue(object.created)).unsigned = false;
            else if (typeof object.created === "string")
                message.created = parseInt(object.created, 10);
            else if (typeof object.created === "number")
                message.created = object.created;
            else if (typeof object.created === "object")
                message.created = new $util.LongBits(object.created.low >>> 0, object.created.high >>> 0).toNumber();
        return message;
    };

    /**
     * Creates a plain object from a WsTrade message. Also converts values to other types if specified.
     * @function toObject
     * @memberof WsTrade
     * @static
     * @param {WsTrade} message WsTrade
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    WsTrade.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.uuid = "";
            object.volume = null;
            object.price = null;
            object.side = options.enums === String ? "SELL" : 0;
            object.trading_pair = "";
            if ($util.Long) {
                let long = new $util.Long(0, 0, false);
                object.created = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.created = options.longs === String ? "0" : 0;
        }
        if (message.uuid != null && message.hasOwnProperty("uuid"))
            object.uuid = message.uuid;
        if (message.volume != null && message.hasOwnProperty("volume"))
            object.volume = $root.Decimal.toObject(message.volume, options);
        if (message.price != null && message.hasOwnProperty("price"))
            object.price = $root.Decimal.toObject(message.price, options);
        if (message.side != null && message.hasOwnProperty("side"))
            object.side = options.enums === String ? $root.Side[message.side] : message.side;
        if (message.trading_pair != null && message.hasOwnProperty("trading_pair"))
            object.trading_pair = message.trading_pair;
        if (message.created != null && message.hasOwnProperty("created"))
            if (typeof message.created === "number")
                object.created = options.longs === String ? String(message.created) : message.created;
            else
                object.created = options.longs === String ? $util.Long.prototype.toString.call(message.created) : options.longs === Number ? new $util.LongBits(message.created.low >>> 0, message.created.high >>> 0).toNumber() : message.created;
        return object;
    };

    /**
     * Converts this WsTrade to JSON.
     * @function toJSON
     * @memberof WsTrade
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    WsTrade.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return WsTrade;
})();

export const WsOrderPage = $root.WsOrderPage = (() => {

    /**
     * Properties of a WsOrderPage.
     * @exports IWsOrderPage
     * @interface IWsOrderPage
     * @property {IDecimal|null} [price] WsOrderPage price
     * @property {IDecimal|null} [qty] WsOrderPage qty
     */

    /**
     * Constructs a new WsOrderPage.
     * @exports WsOrderPage
     * @classdesc Represents a WsOrderPage.
     * @implements IWsOrderPage
     * @constructor
     * @param {IWsOrderPage=} [properties] Properties to set
     */
    function WsOrderPage(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * WsOrderPage price.
     * @member {IDecimal|null|undefined} price
     * @memberof WsOrderPage
     * @instance
     */
    WsOrderPage.prototype.price = null;

    /**
     * WsOrderPage qty.
     * @member {IDecimal|null|undefined} qty
     * @memberof WsOrderPage
     * @instance
     */
    WsOrderPage.prototype.qty = null;

    /**
     * Creates a new WsOrderPage instance using the specified properties.
     * @function create
     * @memberof WsOrderPage
     * @static
     * @param {IWsOrderPage=} [properties] Properties to set
     * @returns {WsOrderPage} WsOrderPage instance
     */
    WsOrderPage.create = function create(properties) {
        return new WsOrderPage(properties);
    };

    /**
     * Encodes the specified WsOrderPage message. Does not implicitly {@link WsOrderPage.verify|verify} messages.
     * @function encode
     * @memberof WsOrderPage
     * @static
     * @param {IWsOrderPage} message WsOrderPage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    WsOrderPage.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.price != null && message.hasOwnProperty("price"))
            $root.Decimal.encode(message.price, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.qty != null && message.hasOwnProperty("qty"))
            $root.Decimal.encode(message.qty, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified WsOrderPage message, length delimited. Does not implicitly {@link WsOrderPage.verify|verify} messages.
     * @function encodeDelimited
     * @memberof WsOrderPage
     * @static
     * @param {IWsOrderPage} message WsOrderPage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    WsOrderPage.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a WsOrderPage message from the specified reader or buffer.
     * @function decode
     * @memberof WsOrderPage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {WsOrderPage} WsOrderPage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    WsOrderPage.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.WsOrderPage();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.price = $root.Decimal.decode(reader, reader.uint32());
                break;
            case 2:
                message.qty = $root.Decimal.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a WsOrderPage message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof WsOrderPage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {WsOrderPage} WsOrderPage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    WsOrderPage.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a WsOrderPage message.
     * @function verify
     * @memberof WsOrderPage
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    WsOrderPage.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.price != null && message.hasOwnProperty("price")) {
            let error = $root.Decimal.verify(message.price);
            if (error)
                return "price." + error;
        }
        if (message.qty != null && message.hasOwnProperty("qty")) {
            let error = $root.Decimal.verify(message.qty);
            if (error)
                return "qty." + error;
        }
        return null;
    };

    /**
     * Creates a WsOrderPage message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof WsOrderPage
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {WsOrderPage} WsOrderPage
     */
    WsOrderPage.fromObject = function fromObject(object) {
        if (object instanceof $root.WsOrderPage)
            return object;
        let message = new $root.WsOrderPage();
        if (object.price != null) {
            if (typeof object.price !== "object")
                throw TypeError(".WsOrderPage.price: object expected");
            message.price = $root.Decimal.fromObject(object.price);
        }
        if (object.qty != null) {
            if (typeof object.qty !== "object")
                throw TypeError(".WsOrderPage.qty: object expected");
            message.qty = $root.Decimal.fromObject(object.qty);
        }
        return message;
    };

    /**
     * Creates a plain object from a WsOrderPage message. Also converts values to other types if specified.
     * @function toObject
     * @memberof WsOrderPage
     * @static
     * @param {WsOrderPage} message WsOrderPage
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    WsOrderPage.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.price = null;
            object.qty = null;
        }
        if (message.price != null && message.hasOwnProperty("price"))
            object.price = $root.Decimal.toObject(message.price, options);
        if (message.qty != null && message.hasOwnProperty("qty"))
            object.qty = $root.Decimal.toObject(message.qty, options);
        return object;
    };

    /**
     * Converts this WsOrderPage to JSON.
     * @function toJSON
     * @memberof WsOrderPage
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    WsOrderPage.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return WsOrderPage;
})();

export const WsOrderBook = $root.WsOrderBook = (() => {

    /**
     * Properties of a WsOrderBook.
     * @exports IWsOrderBook
     * @interface IWsOrderBook
     * @property {Array.<IWsOrderPage>|null} [bid] WsOrderBook bid
     * @property {Array.<IWsOrderPage>|null} [ask] WsOrderBook ask
     */

    /**
     * Constructs a new WsOrderBook.
     * @exports WsOrderBook
     * @classdesc Represents a WsOrderBook.
     * @implements IWsOrderBook
     * @constructor
     * @param {IWsOrderBook=} [properties] Properties to set
     */
    function WsOrderBook(properties) {
        this.bid = [];
        this.ask = [];
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * WsOrderBook bid.
     * @member {Array.<IWsOrderPage>} bid
     * @memberof WsOrderBook
     * @instance
     */
    WsOrderBook.prototype.bid = $util.emptyArray;

    /**
     * WsOrderBook ask.
     * @member {Array.<IWsOrderPage>} ask
     * @memberof WsOrderBook
     * @instance
     */
    WsOrderBook.prototype.ask = $util.emptyArray;

    /**
     * Creates a new WsOrderBook instance using the specified properties.
     * @function create
     * @memberof WsOrderBook
     * @static
     * @param {IWsOrderBook=} [properties] Properties to set
     * @returns {WsOrderBook} WsOrderBook instance
     */
    WsOrderBook.create = function create(properties) {
        return new WsOrderBook(properties);
    };

    /**
     * Encodes the specified WsOrderBook message. Does not implicitly {@link WsOrderBook.verify|verify} messages.
     * @function encode
     * @memberof WsOrderBook
     * @static
     * @param {IWsOrderBook} message WsOrderBook message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    WsOrderBook.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.bid != null && message.bid.length)
            for (let i = 0; i < message.bid.length; ++i)
                $root.WsOrderPage.encode(message.bid[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.ask != null && message.ask.length)
            for (let i = 0; i < message.ask.length; ++i)
                $root.WsOrderPage.encode(message.ask[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified WsOrderBook message, length delimited. Does not implicitly {@link WsOrderBook.verify|verify} messages.
     * @function encodeDelimited
     * @memberof WsOrderBook
     * @static
     * @param {IWsOrderBook} message WsOrderBook message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    WsOrderBook.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a WsOrderBook message from the specified reader or buffer.
     * @function decode
     * @memberof WsOrderBook
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {WsOrderBook} WsOrderBook
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    WsOrderBook.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.WsOrderBook();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.bid && message.bid.length))
                    message.bid = [];
                message.bid.push($root.WsOrderPage.decode(reader, reader.uint32()));
                break;
            case 2:
                if (!(message.ask && message.ask.length))
                    message.ask = [];
                message.ask.push($root.WsOrderPage.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a WsOrderBook message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof WsOrderBook
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {WsOrderBook} WsOrderBook
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    WsOrderBook.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a WsOrderBook message.
     * @function verify
     * @memberof WsOrderBook
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    WsOrderBook.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.bid != null && message.hasOwnProperty("bid")) {
            if (!Array.isArray(message.bid))
                return "bid: array expected";
            for (let i = 0; i < message.bid.length; ++i) {
                let error = $root.WsOrderPage.verify(message.bid[i]);
                if (error)
                    return "bid." + error;
            }
        }
        if (message.ask != null && message.hasOwnProperty("ask")) {
            if (!Array.isArray(message.ask))
                return "ask: array expected";
            for (let i = 0; i < message.ask.length; ++i) {
                let error = $root.WsOrderPage.verify(message.ask[i]);
                if (error)
                    return "ask." + error;
            }
        }
        return null;
    };

    /**
     * Creates a WsOrderBook message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof WsOrderBook
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {WsOrderBook} WsOrderBook
     */
    WsOrderBook.fromObject = function fromObject(object) {
        if (object instanceof $root.WsOrderBook)
            return object;
        let message = new $root.WsOrderBook();
        if (object.bid) {
            if (!Array.isArray(object.bid))
                throw TypeError(".WsOrderBook.bid: array expected");
            message.bid = [];
            for (let i = 0; i < object.bid.length; ++i) {
                if (typeof object.bid[i] !== "object")
                    throw TypeError(".WsOrderBook.bid: object expected");
                message.bid[i] = $root.WsOrderPage.fromObject(object.bid[i]);
            }
        }
        if (object.ask) {
            if (!Array.isArray(object.ask))
                throw TypeError(".WsOrderBook.ask: array expected");
            message.ask = [];
            for (let i = 0; i < object.ask.length; ++i) {
                if (typeof object.ask[i] !== "object")
                    throw TypeError(".WsOrderBook.ask: object expected");
                message.ask[i] = $root.WsOrderPage.fromObject(object.ask[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a WsOrderBook message. Also converts values to other types if specified.
     * @function toObject
     * @memberof WsOrderBook
     * @static
     * @param {WsOrderBook} message WsOrderBook
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    WsOrderBook.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.arrays || options.defaults) {
            object.bid = [];
            object.ask = [];
        }
        if (message.bid && message.bid.length) {
            object.bid = [];
            for (let j = 0; j < message.bid.length; ++j)
                object.bid[j] = $root.WsOrderPage.toObject(message.bid[j], options);
        }
        if (message.ask && message.ask.length) {
            object.ask = [];
            for (let j = 0; j < message.ask.length; ++j)
                object.ask[j] = $root.WsOrderPage.toObject(message.ask[j], options);
        }
        return object;
    };

    /**
     * Converts this WsOrderBook to JSON.
     * @function toJSON
     * @memberof WsOrderBook
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    WsOrderBook.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return WsOrderBook;
})();

export const WsOrderResponse = $root.WsOrderResponse = (() => {

    /**
     * Properties of a WsOrderResponse.
     * @exports IWsOrderResponse
     * @interface IWsOrderResponse
     * @property {string|null} [uuid] WsOrderResponse uuid
     * @property {string|null} [trading_pair] WsOrderResponse trading_pair
     * @property {Side|null} [side] WsOrderResponse side
     * @property {IDecimal|null} [volume] WsOrderResponse volume
     * @property {IDecimal|null} [price] WsOrderResponse price
     * @property {IDecimal|null} [volume_filled] WsOrderResponse volume_filled
     * @property {IDecimal|null} [volume_remaining] WsOrderResponse volume_remaining
     * @property {WsOrderResponse.State|null} [order_status] WsOrderResponse order_status
     * @property {WsOrderResponse.Type|null} [order_type] WsOrderResponse order_type
     * @property {number|Long|null} [created] WsOrderResponse created
     */

    /**
     * Constructs a new WsOrderResponse.
     * @exports WsOrderResponse
     * @classdesc Represents a WsOrderResponse.
     * @implements IWsOrderResponse
     * @constructor
     * @param {IWsOrderResponse=} [properties] Properties to set
     */
    function WsOrderResponse(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * WsOrderResponse uuid.
     * @member {string} uuid
     * @memberof WsOrderResponse
     * @instance
     */
    WsOrderResponse.prototype.uuid = "";

    /**
     * WsOrderResponse trading_pair.
     * @member {string} trading_pair
     * @memberof WsOrderResponse
     * @instance
     */
    WsOrderResponse.prototype.trading_pair = "";

    /**
     * WsOrderResponse side.
     * @member {Side} side
     * @memberof WsOrderResponse
     * @instance
     */
    WsOrderResponse.prototype.side = 0;

    /**
     * WsOrderResponse volume.
     * @member {IDecimal|null|undefined} volume
     * @memberof WsOrderResponse
     * @instance
     */
    WsOrderResponse.prototype.volume = null;

    /**
     * WsOrderResponse price.
     * @member {IDecimal|null|undefined} price
     * @memberof WsOrderResponse
     * @instance
     */
    WsOrderResponse.prototype.price = null;

    /**
     * WsOrderResponse volume_filled.
     * @member {IDecimal|null|undefined} volume_filled
     * @memberof WsOrderResponse
     * @instance
     */
    WsOrderResponse.prototype.volume_filled = null;

    /**
     * WsOrderResponse volume_remaining.
     * @member {IDecimal|null|undefined} volume_remaining
     * @memberof WsOrderResponse
     * @instance
     */
    WsOrderResponse.prototype.volume_remaining = null;

    /**
     * WsOrderResponse order_status.
     * @member {WsOrderResponse.State} order_status
     * @memberof WsOrderResponse
     * @instance
     */
    WsOrderResponse.prototype.order_status = 0;

    /**
     * WsOrderResponse order_type.
     * @member {WsOrderResponse.Type} order_type
     * @memberof WsOrderResponse
     * @instance
     */
    WsOrderResponse.prototype.order_type = 0;

    /**
     * WsOrderResponse created.
     * @member {number|Long} created
     * @memberof WsOrderResponse
     * @instance
     */
    WsOrderResponse.prototype.created = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * Creates a new WsOrderResponse instance using the specified properties.
     * @function create
     * @memberof WsOrderResponse
     * @static
     * @param {IWsOrderResponse=} [properties] Properties to set
     * @returns {WsOrderResponse} WsOrderResponse instance
     */
    WsOrderResponse.create = function create(properties) {
        return new WsOrderResponse(properties);
    };

    /**
     * Encodes the specified WsOrderResponse message. Does not implicitly {@link WsOrderResponse.verify|verify} messages.
     * @function encode
     * @memberof WsOrderResponse
     * @static
     * @param {IWsOrderResponse} message WsOrderResponse message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    WsOrderResponse.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.uuid != null && message.hasOwnProperty("uuid"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.uuid);
        if (message.trading_pair != null && message.hasOwnProperty("trading_pair"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.trading_pair);
        if (message.side != null && message.hasOwnProperty("side"))
            writer.uint32(/* id 4, wireType 0 =*/32).int32(message.side);
        if (message.volume != null && message.hasOwnProperty("volume"))
            $root.Decimal.encode(message.volume, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
        if (message.price != null && message.hasOwnProperty("price"))
            $root.Decimal.encode(message.price, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
        if (message.volume_filled != null && message.hasOwnProperty("volume_filled"))
            $root.Decimal.encode(message.volume_filled, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
        if (message.volume_remaining != null && message.hasOwnProperty("volume_remaining"))
            $root.Decimal.encode(message.volume_remaining, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
        if (message.order_status != null && message.hasOwnProperty("order_status"))
            writer.uint32(/* id 9, wireType 0 =*/72).int32(message.order_status);
        if (message.order_type != null && message.hasOwnProperty("order_type"))
            writer.uint32(/* id 10, wireType 0 =*/80).int32(message.order_type);
        if (message.created != null && message.hasOwnProperty("created"))
            writer.uint32(/* id 11, wireType 0 =*/88).int64(message.created);
        return writer;
    };

    /**
     * Encodes the specified WsOrderResponse message, length delimited. Does not implicitly {@link WsOrderResponse.verify|verify} messages.
     * @function encodeDelimited
     * @memberof WsOrderResponse
     * @static
     * @param {IWsOrderResponse} message WsOrderResponse message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    WsOrderResponse.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a WsOrderResponse message from the specified reader or buffer.
     * @function decode
     * @memberof WsOrderResponse
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {WsOrderResponse} WsOrderResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    WsOrderResponse.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.WsOrderResponse();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 2:
                message.uuid = reader.string();
                break;
            case 3:
                message.trading_pair = reader.string();
                break;
            case 4:
                message.side = reader.int32();
                break;
            case 5:
                message.volume = $root.Decimal.decode(reader, reader.uint32());
                break;
            case 6:
                message.price = $root.Decimal.decode(reader, reader.uint32());
                break;
            case 7:
                message.volume_filled = $root.Decimal.decode(reader, reader.uint32());
                break;
            case 8:
                message.volume_remaining = $root.Decimal.decode(reader, reader.uint32());
                break;
            case 9:
                message.order_status = reader.int32();
                break;
            case 10:
                message.order_type = reader.int32();
                break;
            case 11:
                message.created = reader.int64();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a WsOrderResponse message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof WsOrderResponse
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {WsOrderResponse} WsOrderResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    WsOrderResponse.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a WsOrderResponse message.
     * @function verify
     * @memberof WsOrderResponse
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    WsOrderResponse.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.uuid != null && message.hasOwnProperty("uuid"))
            if (!$util.isString(message.uuid))
                return "uuid: string expected";
        if (message.trading_pair != null && message.hasOwnProperty("trading_pair"))
            if (!$util.isString(message.trading_pair))
                return "trading_pair: string expected";
        if (message.side != null && message.hasOwnProperty("side"))
            switch (message.side) {
            default:
                return "side: enum value expected";
            case 0:
            case 1:
                break;
            }
        if (message.volume != null && message.hasOwnProperty("volume")) {
            let error = $root.Decimal.verify(message.volume);
            if (error)
                return "volume." + error;
        }
        if (message.price != null && message.hasOwnProperty("price")) {
            let error = $root.Decimal.verify(message.price);
            if (error)
                return "price." + error;
        }
        if (message.volume_filled != null && message.hasOwnProperty("volume_filled")) {
            let error = $root.Decimal.verify(message.volume_filled);
            if (error)
                return "volume_filled." + error;
        }
        if (message.volume_remaining != null && message.hasOwnProperty("volume_remaining")) {
            let error = $root.Decimal.verify(message.volume_remaining);
            if (error)
                return "volume_remaining." + error;
        }
        if (message.order_status != null && message.hasOwnProperty("order_status"))
            switch (message.order_status) {
            default:
                return "order_status: enum value expected";
            case 0:
            case 6:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                break;
            }
        if (message.order_type != null && message.hasOwnProperty("order_type"))
            switch (message.order_type) {
            default:
                return "order_type: enum value expected";
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
                break;
            }
        if (message.created != null && message.hasOwnProperty("created"))
            if (!$util.isInteger(message.created) && !(message.created && $util.isInteger(message.created.low) && $util.isInteger(message.created.high)))
                return "created: integer|Long expected";
        return null;
    };

    /**
     * Creates a WsOrderResponse message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof WsOrderResponse
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {WsOrderResponse} WsOrderResponse
     */
    WsOrderResponse.fromObject = function fromObject(object) {
        if (object instanceof $root.WsOrderResponse)
            return object;
        let message = new $root.WsOrderResponse();
        if (object.uuid != null)
            message.uuid = String(object.uuid);
        if (object.trading_pair != null)
            message.trading_pair = String(object.trading_pair);
        switch (object.side) {
        case "SELL":
        case 0:
            message.side = 0;
            break;
        case "BUY":
        case 1:
            message.side = 1;
            break;
        }
        if (object.volume != null) {
            if (typeof object.volume !== "object")
                throw TypeError(".WsOrderResponse.volume: object expected");
            message.volume = $root.Decimal.fromObject(object.volume);
        }
        if (object.price != null) {
            if (typeof object.price !== "object")
                throw TypeError(".WsOrderResponse.price: object expected");
            message.price = $root.Decimal.fromObject(object.price);
        }
        if (object.volume_filled != null) {
            if (typeof object.volume_filled !== "object")
                throw TypeError(".WsOrderResponse.volume_filled: object expected");
            message.volume_filled = $root.Decimal.fromObject(object.volume_filled);
        }
        if (object.volume_remaining != null) {
            if (typeof object.volume_remaining !== "object")
                throw TypeError(".WsOrderResponse.volume_remaining: object expected");
            message.volume_remaining = $root.Decimal.fromObject(object.volume_remaining);
        }
        switch (object.order_status) {
        case "UNKNOWN_STATE":
        case 0:
            message.order_status = 0;
            break;
        case "PENDING":
        case 6:
            message.order_status = 6;
            break;
        case "PLACED":
        case 1:
            message.order_status = 1;
            break;
        case "PARTIALLY_FILLED":
        case 2:
            message.order_status = 2;
            break;
        case "COMPLETED":
        case 3:
            message.order_status = 3;
            break;
        case "CANCELLED":
        case 4:
            message.order_status = 4;
            break;
        case "REJECTED":
        case 5:
            message.order_status = 5;
            break;
        }
        switch (object.order_type) {
        case "UNKNOWN_TYPE":
        case 0:
            message.order_type = 0;
            break;
        case "LIMIT":
        case 1:
            message.order_type = 1;
            break;
        case "MARKET":
        case 2:
            message.order_type = 2;
            break;
        case "STOP":
        case 3:
            message.order_type = 3;
            break;
        case "STOP_LIMIT":
        case 4:
            message.order_type = 4;
            break;
        case "MARKET_WITH_LEFT_OVER_AS_LIMIT":
        case 5:
            message.order_type = 5;
            break;
        case "MARKET_IF_TOUCHED":
        case 6:
            message.order_type = 6;
            break;
        }
        if (object.created != null)
            if ($util.Long)
                (message.created = $util.Long.fromValue(object.created)).unsigned = false;
            else if (typeof object.created === "string")
                message.created = parseInt(object.created, 10);
            else if (typeof object.created === "number")
                message.created = object.created;
            else if (typeof object.created === "object")
                message.created = new $util.LongBits(object.created.low >>> 0, object.created.high >>> 0).toNumber();
        return message;
    };

    /**
     * Creates a plain object from a WsOrderResponse message. Also converts values to other types if specified.
     * @function toObject
     * @memberof WsOrderResponse
     * @static
     * @param {WsOrderResponse} message WsOrderResponse
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    WsOrderResponse.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.uuid = "";
            object.trading_pair = "";
            object.side = options.enums === String ? "SELL" : 0;
            object.volume = null;
            object.price = null;
            object.volume_filled = null;
            object.volume_remaining = null;
            object.order_status = options.enums === String ? "UNKNOWN_STATE" : 0;
            object.order_type = options.enums === String ? "UNKNOWN_TYPE" : 0;
            if ($util.Long) {
                let long = new $util.Long(0, 0, false);
                object.created = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.created = options.longs === String ? "0" : 0;
        }
        if (message.uuid != null && message.hasOwnProperty("uuid"))
            object.uuid = message.uuid;
        if (message.trading_pair != null && message.hasOwnProperty("trading_pair"))
            object.trading_pair = message.trading_pair;
        if (message.side != null && message.hasOwnProperty("side"))
            object.side = options.enums === String ? $root.Side[message.side] : message.side;
        if (message.volume != null && message.hasOwnProperty("volume"))
            object.volume = $root.Decimal.toObject(message.volume, options);
        if (message.price != null && message.hasOwnProperty("price"))
            object.price = $root.Decimal.toObject(message.price, options);
        if (message.volume_filled != null && message.hasOwnProperty("volume_filled"))
            object.volume_filled = $root.Decimal.toObject(message.volume_filled, options);
        if (message.volume_remaining != null && message.hasOwnProperty("volume_remaining"))
            object.volume_remaining = $root.Decimal.toObject(message.volume_remaining, options);
        if (message.order_status != null && message.hasOwnProperty("order_status"))
            object.order_status = options.enums === String ? $root.WsOrderResponse.State[message.order_status] : message.order_status;
        if (message.order_type != null && message.hasOwnProperty("order_type"))
            object.order_type = options.enums === String ? $root.WsOrderResponse.Type[message.order_type] : message.order_type;
        if (message.created != null && message.hasOwnProperty("created"))
            if (typeof message.created === "number")
                object.created = options.longs === String ? String(message.created) : message.created;
            else
                object.created = options.longs === String ? $util.Long.prototype.toString.call(message.created) : options.longs === Number ? new $util.LongBits(message.created.low >>> 0, message.created.high >>> 0).toNumber() : message.created;
        return object;
    };

    /**
     * Converts this WsOrderResponse to JSON.
     * @function toJSON
     * @memberof WsOrderResponse
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    WsOrderResponse.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * State enum.
     * @name WsOrderResponse.State
     * @enum {string}
     * @property {number} UNKNOWN_STATE=0 UNKNOWN_STATE value
     * @property {number} PENDING=6 PENDING value
     * @property {number} PLACED=1 PLACED value
     * @property {number} PARTIALLY_FILLED=2 PARTIALLY_FILLED value
     * @property {number} COMPLETED=3 COMPLETED value
     * @property {number} CANCELLED=4 CANCELLED value
     * @property {number} REJECTED=5 REJECTED value
     */
    WsOrderResponse.State = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "UNKNOWN_STATE"] = 0;
        values[valuesById[6] = "PENDING"] = 6;
        values[valuesById[1] = "PLACED"] = 1;
        values[valuesById[2] = "PARTIALLY_FILLED"] = 2;
        values[valuesById[3] = "COMPLETED"] = 3;
        values[valuesById[4] = "CANCELLED"] = 4;
        values[valuesById[5] = "REJECTED"] = 5;
        return values;
    })();

    /**
     * Type enum.
     * @name WsOrderResponse.Type
     * @enum {string}
     * @property {number} UNKNOWN_TYPE=0 UNKNOWN_TYPE value
     * @property {number} LIMIT=1 LIMIT value
     * @property {number} MARKET=2 MARKET value
     * @property {number} STOP=3 STOP value
     * @property {number} STOP_LIMIT=4 STOP_LIMIT value
     * @property {number} MARKET_WITH_LEFT_OVER_AS_LIMIT=5 MARKET_WITH_LEFT_OVER_AS_LIMIT value
     * @property {number} MARKET_IF_TOUCHED=6 MARKET_IF_TOUCHED value
     */
    WsOrderResponse.Type = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "UNKNOWN_TYPE"] = 0;
        values[valuesById[1] = "LIMIT"] = 1;
        values[valuesById[2] = "MARKET"] = 2;
        values[valuesById[3] = "STOP"] = 3;
        values[valuesById[4] = "STOP_LIMIT"] = 4;
        values[valuesById[5] = "MARKET_WITH_LEFT_OVER_AS_LIMIT"] = 5;
        values[valuesById[6] = "MARKET_IF_TOUCHED"] = 6;
        return values;
    })();

    return WsOrderResponse;
})();

/**
 * Side enum.
 * @exports Side
 * @enum {string}
 * @property {number} SELL=0 SELL value
 * @property {number} BUY=1 BUY value
 */
$root.Side = (function() {
    const valuesById = {}, values = Object.create(valuesById);
    values[valuesById[0] = "SELL"] = 0;
    values[valuesById[1] = "BUY"] = 1;
    return values;
})();

/**
 * Delta enum.
 * @exports Delta
 * @enum {string}
 * @property {number} UPDATE=0 UPDATE value
 * @property {number} DELETE=1 DELETE value
 * @property {number} CREATE=2 CREATE value
 * @property {number} NONE=3 NONE value
 */
$root.Delta = (function() {
    const valuesById = {}, values = Object.create(valuesById);
    values[valuesById[0] = "UPDATE"] = 0;
    values[valuesById[1] = "DELETE"] = 1;
    values[valuesById[2] = "CREATE"] = 2;
    values[valuesById[3] = "NONE"] = 3;
    return values;
})();

export const Decimal = $root.Decimal = (() => {

    /**
     * Properties of a Decimal.
     * @exports IDecimal
     * @interface IDecimal
     * @property {number|Long|null} [m] Decimal m
     * @property {number|Long|null} [l] Decimal l
     */

    /**
     * Constructs a new Decimal.
     * @exports Decimal
     * @classdesc Represents a Decimal.
     * @implements IDecimal
     * @constructor
     * @param {IDecimal=} [properties] Properties to set
     */
    function Decimal(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Decimal m.
     * @member {number|Long} m
     * @memberof Decimal
     * @instance
     */
    Decimal.prototype.m = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * Decimal l.
     * @member {number|Long} l
     * @memberof Decimal
     * @instance
     */
    Decimal.prototype.l = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * Creates a new Decimal instance using the specified properties.
     * @function create
     * @memberof Decimal
     * @static
     * @param {IDecimal=} [properties] Properties to set
     * @returns {Decimal} Decimal instance
     */
    Decimal.create = function create(properties) {
        return new Decimal(properties);
    };

    /**
     * Encodes the specified Decimal message. Does not implicitly {@link Decimal.verify|verify} messages.
     * @function encode
     * @memberof Decimal
     * @static
     * @param {IDecimal} message Decimal message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Decimal.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.m != null && message.hasOwnProperty("m"))
            writer.uint32(/* id 1, wireType 0 =*/8).sint64(message.m);
        if (message.l != null && message.hasOwnProperty("l"))
            writer.uint32(/* id 2, wireType 0 =*/16).int64(message.l);
        return writer;
    };

    /**
     * Encodes the specified Decimal message, length delimited. Does not implicitly {@link Decimal.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Decimal
     * @static
     * @param {IDecimal} message Decimal message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Decimal.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Decimal message from the specified reader or buffer.
     * @function decode
     * @memberof Decimal
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Decimal} Decimal
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Decimal.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Decimal();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.m = reader.sint64();
                break;
            case 2:
                message.l = reader.int64();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Decimal message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Decimal
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Decimal} Decimal
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Decimal.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Decimal message.
     * @function verify
     * @memberof Decimal
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Decimal.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.m != null && message.hasOwnProperty("m"))
            if (!$util.isInteger(message.m) && !(message.m && $util.isInteger(message.m.low) && $util.isInteger(message.m.high)))
                return "m: integer|Long expected";
        if (message.l != null && message.hasOwnProperty("l"))
            if (!$util.isInteger(message.l) && !(message.l && $util.isInteger(message.l.low) && $util.isInteger(message.l.high)))
                return "l: integer|Long expected";
        return null;
    };

    /**
     * Creates a Decimal message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Decimal
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Decimal} Decimal
     */
    Decimal.fromObject = function fromObject(object) {
        if (object instanceof $root.Decimal)
            return object;
        let message = new $root.Decimal();
        if (object.m != null)
            if ($util.Long)
                (message.m = $util.Long.fromValue(object.m)).unsigned = false;
            else if (typeof object.m === "string")
                message.m = parseInt(object.m, 10);
            else if (typeof object.m === "number")
                message.m = object.m;
            else if (typeof object.m === "object")
                message.m = new $util.LongBits(object.m.low >>> 0, object.m.high >>> 0).toNumber();
        if (object.l != null)
            if ($util.Long)
                (message.l = $util.Long.fromValue(object.l)).unsigned = false;
            else if (typeof object.l === "string")
                message.l = parseInt(object.l, 10);
            else if (typeof object.l === "number")
                message.l = object.l;
            else if (typeof object.l === "object")
                message.l = new $util.LongBits(object.l.low >>> 0, object.l.high >>> 0).toNumber();
        return message;
    };

    /**
     * Creates a plain object from a Decimal message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Decimal
     * @static
     * @param {Decimal} message Decimal
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Decimal.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            if ($util.Long) {
                let long = new $util.Long(0, 0, false);
                object.m = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.m = options.longs === String ? "0" : 0;
            if ($util.Long) {
                let long = new $util.Long(0, 0, false);
                object.l = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.l = options.longs === String ? "0" : 0;
        }
        if (message.m != null && message.hasOwnProperty("m"))
            if (typeof message.m === "number")
                object.m = options.longs === String ? String(message.m) : message.m;
            else
                object.m = options.longs === String ? $util.Long.prototype.toString.call(message.m) : options.longs === Number ? new $util.LongBits(message.m.low >>> 0, message.m.high >>> 0).toNumber() : message.m;
        if (message.l != null && message.hasOwnProperty("l"))
            if (typeof message.l === "number")
                object.l = options.longs === String ? String(message.l) : message.l;
            else
                object.l = options.longs === String ? $util.Long.prototype.toString.call(message.l) : options.longs === Number ? new $util.LongBits(message.l.low >>> 0, message.l.high >>> 0).toNumber() : message.l;
        return object;
    };

    /**
     * Converts this Decimal to JSON.
     * @function toJSON
     * @memberof Decimal
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Decimal.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Decimal;
})();

export { $root as default };

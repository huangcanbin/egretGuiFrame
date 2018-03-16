/**
 * Created by yang on 16/11/17.
 */
class WebSocketClass {
    public constructor() {
        this.handlers[protobuf.TYPE_HEARTBEAT] = this.heartbeat;
        this.handlers[protobuf.TYPE_DATA] = this.onData;
        this.handlers[protobuf.TYPE_KICK] = this.onKick;
    }

    public get connected() {
        return this.socket && this.socket.connected;
    }

    private _callbacks;
    private reqId = 0;
    public on(event, fn) {
        this._callbacks = this._callbacks || {};
        (this._callbacks[event] = this._callbacks[event] || [])
            .push(fn);
        return this;
    }

    public once(event, fn) {
        var self = this;
        this._callbacks = this._callbacks || {};

        function on() {
            self.off(event, on);
            fn.apply(this, arguments);
        }

        fn._off = on;
        this.on(event, on);
        return this;
    }

    public off(event, fn) {
        this._callbacks = this._callbacks || {};

        // all
        if (!event) {
            this._callbacks = {};
            return this;
        }

        // specific event
        var callbacks = this._callbacks[event];
        if (!callbacks) return this;

        // remove all handlers
        if (1 == arguments.length) {
            delete this._callbacks[event];
            return this;
        }

        // remove specific handler
        var i = callbacks.indexOf(fn._off || fn);
        if (~i) callbacks.splice(i, 1);
        return this;
    }

    public emit(event) {
        this._callbacks = this._callbacks || {};
        var args = [].slice.call(arguments, 1)
            , callbacks = this._callbacks[event];

        if (callbacks) {
            callbacks = callbacks.slice(0);
            for (var i = 0, len = callbacks.length; i < len; ++i) {
                callbacks[i].apply(this, args);
            }
        }

        return this;
    }

    public listeners(event) {
        this._callbacks = this._callbacks || {};
        return this._callbacks[event] || [];
    }

    public hasListeners(event) {
        return !!this.listeners(event).length;
    }

    private socket;
    private initCallback;
    private protoVersion = 0;
    public init (params, cb) {
        this.initCallback = cb;
        var host = params.host;
        var port = params.port;

        var url = 'ws://' + host;
        if (port) {
            url += ':' + port;
        }

        this.initWebSocket(url, cb);
    }

    private initWebSocket(url, cb) {
        var onopen = function (event) {
            this.emit('connect', event);

            if (this.initCallback) {
                this.initCallback(this.socket);
                this.initCallback = null;
            }

        };
        var onmessage = function (event) {
            this.emit('onMessage', event);
            var byte = new egret.ByteArray();
            this.socket.readBytes(byte);
            this.processPackage(protobuf.decode(byte.buffer));
            // new package arrived, update the heartbeat timeout
            if (this.heartbeatTimeout) {
                this.thisnextHeartbeatTimeout = Date.now() + this.heartbeatTimeout;
            }
        };
        var onerror = function (event) {
            this.emit('io-error', event);
        };
        var onclose = function (event) {
            this.emit('close', event);
        };

        this.socket = new egret.WebSocket();
        this.socket.type = egret.WebSocket.TYPE_BINARY;
        this.socket.addEventListener(egret.Event.CONNECT, onopen, this);
        this.socket.addEventListener(egret.Event.CLOSE, onclose, this);
        this.socket.addEventListener(egret.IOErrorEvent.IO_ERROR, onerror, this);
        this.socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, onmessage, this);
        this.socket.connectByUrl(url);
    }

    close():void {
        this.socket.socket.close();
    }

    private handlers = {};
    private heartbeatInterval;
    private heartbeatTimeoutId;
    private heartbeatId;
    private heartbeatTimeout;
    private heartbeatTimeoutCb;
    private processPackage (msg) {
        //this.handlers[msg.type](msg.body);
        this.handlers[msg.type].call(this,msg.body);
    }

    private heartbeat (data) {
        if (!this.heartbeatInterval) {
            // no heartbeat
            return;
        }

        var obj = protobuf.encode(protobuf.TYPE_HEARTBEAT,null);
        if (this.heartbeatTimeoutId) {
            meru.clearTimeout(this.heartbeatTimeoutId);
            this.heartbeatTimeoutId = null;
        }

        if (this.heartbeatId) {
            // already in a heartbeat interval
            return;
        }
        this.heartbeatId = meru.setTimeout(function () {
            this.heartbeatId = null;
            this.send(obj);

            this.nextHeartbeatTimeout = Date.now() + this.heartbeatTimeout;
            this.heartbeatTimeoutId = meru.setTimeout(this.heartbeatTimeoutCb, this, this.heartbeatTimeout);
        }, this, this.heartbeatInterval);
    }

    private onData (data) {
        var msg = data;
        if (msg) {
            this.processMessage(this,msg);
        }
    }

    private onKick(data) {
        this.emit('onKick');
    }

    private processMessage(pomelo,msg) {
        pomelo.emit(msg.r, msg.d);
    }

    private sendMessage (reqId, route, msg) {
        msg = this.encode(reqId, route, msg);
        var packet = protobuf.encode(protobuf.TYPE_DATA, msg);
        this.send(packet);
    }

    private send (packet) {
        if (this.socket && packet) {
            this.socket.writeBytes(packet);
        }
    }

    private encode (reqId, route, msg) {
        var type = reqId ? Message.TYPE_REQUEST : Message.TYPE_NOTIFY;

        msg.route = route;

        //compress message by protobuf
        msg = protobuf.strencode(JSON.stringify(msg));

        var compressRoute = 0;

        return Message.encode(reqId, type, compressRoute, route, msg);
    }

    public request (route, msg, cb) {
        if (arguments.length === 2 && typeof msg === 'function') {
            cb = msg;
            msg = {};
        } else {
            msg = msg || {};
        }
        route = route || msg.route;
        if (!route) {
            return;
        }

        this.reqId++;
        this.sendMessage(this.reqId, route, msg);
    }

    public disconnect() {
        if (this.socket) {
            if (this.socket.disconnect) this.socket.disconnect();
            if (this.socket.close) this.socket.close();
            this.socket = null;
        }

        if (this.heartbeatId) {
            meru.clearTimeout(this.heartbeatId);
            this.heartbeatId = null;
        }
        if (this.heartbeatTimeoutId) {
            meru.clearTimeout(this.heartbeatTimeoutId);
            this.heartbeatTimeoutId = null;
        }
    }

    public dispose() {
        this.off(null,null);
        this.disconnect();
    }

    public static decode(data) {
        var msg = Message.decode(data);
        msg.body = WebSocketClass.deCompose(msg);
        msg.type = msg.body["type"];
        return msg;
    }

    private static deCompose (msg) {
        var str = protobuf.strdecode(msg.body);
        return JSON.parse(str);
    }
}

class protobuf {
    public static TYPE_HANDSHAKE = 1;
    public static TYPE_HANDSHAKE_ACK = 2;
    public static TYPE_HEARTBEAT = 3;
    public static TYPE_DATA = 4;
    public static TYPE_KICK = 5;

    public static strencode (str) {
        var byteArray = new Uint8Array(str.length * 3);
        var offset = 0;
        for (var i = 0; i < str.length; i++) {
            var charCode = str.charCodeAt(i);
            var codes = null;
            if (charCode <= 0x7f) {
                codes = [charCode];
            } else if (charCode <= 0x7ff) {
                codes = [0xc0 | (charCode >> 6), 0x80 | (charCode & 0x3f)];
            } else {
                codes = [0xe0 | (charCode >> 12), 0x80 | ((charCode & 0xfc0) >> 6), 0x80 | (charCode & 0x3f)];
            }
            for (var j = 0; j < codes.length; j++) {
                byteArray[offset] = codes[j];
                ++offset;
            }
        }
        var _buffer = new Uint8Array(offset);
        protobuf.copyArray(_buffer, 0, byteArray, 0, offset);
        return _buffer;
    }

    public static strdecode(buffer) {
        var bytes = new Uint8Array(buffer);
        var array = [];
        var offset = 0;
        var charCode = 0;
        var end = bytes.length;
        while (offset < end) {
            if (bytes[offset] < 128) {
                charCode = bytes[offset];
                offset += 1;
            } else if (bytes[offset] < 224) {
                charCode = ((bytes[offset] & 0x3f) << 6) + (bytes[offset + 1] & 0x3f);
                offset += 2;
            } else {
                charCode = ((bytes[offset] & 0x0f) << 12) + ((bytes[offset + 1] & 0x3f) << 6) + (bytes[offset + 2] & 0x3f);
                offset += 3;
            }
            array.push(charCode);
        }
        return String.fromCharCode.apply(null, array);
    }

    public static encode(type, body) {
        var length = body ? body.length : 0;
        var buffer = new Uint8Array(4 + length);
        var index = 0;
        buffer[index++] = type & 0xff;
        buffer[index++] = (length >> 16) & 0xff;
        buffer[index++] = (length >> 8) & 0xff;
        buffer[index++] = length & 0xff;
        if (body) {
            protobuf.copyArray(buffer, index, body, 0, length);
        }
        return buffer;
    }

    public static decode(buffer) {
        var bytes = new Uint8Array(buffer);
        var type = bytes[0];
        var index = 1;
        var length = ((bytes[index++]) << 16 | (bytes[index++]) << 8 | bytes[index++]) >>> 0;
        var body = length ? new Uint8Array(length) : null;
        protobuf.copyArray(body, 0, bytes, 4, length);

        return WebSocketClass.decode(body);
    }

    public static copyArray(dest, doffset, src, soffset, length) {
        if ('function' === typeof src.copy) {
            // Buffer
            src.copy(dest, doffset, soffset, soffset + length);
        } else {
            // Uint8Array
            for (var index = 0; index < length; index++) {
                dest[doffset++] = src[soffset++];
            }
        }
    }
}

class Message {
    public static TYPE_REQUEST = 0;
    public static TYPE_NOTIFY = 1;
    public static TYPE_RESPONSE = 2;
    public static TYPE_PUSH = 3;
    public static encode (id, type, compressRoute, route, msg) {
        // caculate message max length
        var idBytes = Message.msgHasId(type) ? Message.caculateMsgIdBytes(id) : 0;
        var msgLen = idBytes;

        if (msg) {
            msgLen += msg.length;
        }

        var buffer = new Uint8Array(msgLen);

        var offset = 0;

        // add body
        if (msg) {
            offset = Message.encodeMsgBody(msg, buffer, offset);
        }

        return buffer;
    }

    public static decode(buffer) {
        var bytes = new Uint8Array(buffer);
        var bytesLen = bytes.length || bytes.byteLength;
        var offset = 0;
        var id = 0;
        var route = null;

        // parse body
        var bodyLen = bytesLen - offset;
        var body = new Uint8Array(bodyLen);

        protobuf.copyArray(body, 0, bytes, offset, bodyLen);

        return {'body': body, 'type':1};
    }

    public static msgHasId (type) {
        return type === Message.TYPE_REQUEST || type === Message.TYPE_RESPONSE;
    }

    public static caculateMsgIdBytes = function (id) {
        var len = 0;
        do {
            len += 1;
            id >>= 7;
        } while (id > 0);
        return len;
    }

    public static encodeMsgBody = function (msg, buffer, offset) {
        protobuf.copyArray(buffer, offset, msg, 0, msg.length);
        return offset + msg.length;
    }
}
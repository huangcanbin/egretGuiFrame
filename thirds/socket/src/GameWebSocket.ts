/**
 * Created by yang on 16/11/17.
 */
module andes {
    export module socket {
        export interface ISocketCallback {
            analysis(data:any):void;
            onClose?():void;
            onConnect?():void;
            onAdd?(data:any):void;
            onError?(errData:any,t?):void;
            onEnterError?(errData:any):void;
            onHeartBeat?(data:any):void;
        }

        export interface ISetting {
            Callback:any;
            getCallback():ISocketCallback;
        }

        export class Setting implements ISetting {
            private _setting:ISetting;

            get Callback():string {
                return this._setting.Callback;
            }

            init(setting:ISetting):void {
                this._setting = setting;
            }

            getCallback():ISocketCallback {
                var type = <any>meru.getDefinitionType(this.Callback, null);
                if (type != null) {
                    var instance:ISocketCallback = <ISocketCallback>meru.singleton(type);
                    return instance;
                }
                return null;
            }

            static init(setting:ISetting):void {
                meru.singleton(Setting).init(setting);
            }
        }

        export function getSetting():ISetting {
            return meru.singleton(Setting);
        }

        export class GameWebSocket {
            public enable:boolean = true;
            public needReconnect:boolean = false;

            public websocket:WebSocketClass;
            public isConnecting:boolean = false;

            public name:string;

            private _tickId:number;
            private _heart:number = 0;

            tick():void {
                if (this.needReconnect) {
                    this._heart = 0;
                    return;
                }
                if (this.connected) {
                    this._heart++;
                    if (this._heart % 30 == 0) {
                        this.request('g.ht');
                    }
                }
            }

            private runTick():void {
                if (!this._tickId) {
                    this._tickId = meru.setInterval(this.tick, this, 1000);
                }
            }

            private _conf:any;
            public init(conf = this._conf) {
                this._conf = conf;
                if (egret.MainContext.runtimeType == egret.MainContext.RUNTIME_HTML5) {
                    if (window["WebSocket"]) {
                        this.enable = true;
                    }
                    else {
                        this.enable = false;
                        return;
                    }
                }

                this.websocket = new WebSocketClass();

                this.websocket.on("io-error", function (data) {
                    var callback = getSetting().getCallback();
                    if (callback && callback.onError) {
                        callback.onError(data,"io-error");
                    }
                    console.log("io-error");
                });

                var that = this;

                this.websocket.on("close", function () {
                    console.log("close");
                    that.close();
                });

                this.websocket.on('connect', function() {
                    var callback = getSetting().getCallback();
                    if (callback && callback.onConnect) {
                        callback.onConnect();
                    }
                });

                this.websocket.on('err', function(data) {
                    var callback = getSetting().getCallback();
                    if (callback && callback.onError) {
                        callback.onError(data,"err");
                    }
                });

                this.isConnecting = true;

                this.websocket.init(conf, this.initCallback.bind(this));

                if (!this._tickId) {
                    this.runTick();
                }
            }

            private initCallback():void {
                var that = this;
                this.websocket.on("onAdd", function (data) {
                    that.isConnecting = false;
                    var callback = getSetting().getCallback();
                    if (callback && callback.onAdd) {
                        callback.onAdd(data);

                    }
                });

                this.websocket.on("onHbt", function (data) {
                    var callback = getSetting().getCallback();
                    if(callback && callback.onHeartBeat) {
                        callback.onHeartBeat(data);
                    }
                    //tm 当前时间戳
                    //gn 上次心跳间隔时间
                });

                this.websocket.on('mp', function(data) {
                    var callback = getSetting().getCallback();
                    if (callback) {
                        callback.analysis(data);
                    }
                });
                this.websocket.on("7", function (data) {
                    //进入错误消息
                    var callback = getSetting().getCallback();
                    if (callback && callback.onEnterError) {
                        callback.onEnterError(data);
                    }
                });

                this.enter();
            }

            close():void {
                var callback = getSetting().getCallback();
                if (callback && callback.onClose) {
                    callback.onClose();
                }
                this.disconnect();
                this.setDisconnect();
            }

            private enter() {
                var route = "g.enter";
                var msg = {
                    "hash": meru.Proxy.hashKey
                };

                this.websocket.request(route, msg, null);
            }

            public get connected() {
                return this.websocket && this.websocket.connected;
            }

            public reconnect() {
                this.needReconnect = false;
                this.init();
            }

            private setDisconnect() {
                this.websocket.off(null, null);

                this.needReconnect = true;
            }

            public disconnect() {
                this.websocket.disconnect();
            }

            public request(route, msg = null, cb = null) {
                if (this.websocket.connected) {
                    this.websocket.request(route, msg, cb);
                }
            }

            private static socketList:any[] = [];

            private static _initialized:boolean = false;
            private static initialize():void {
                if (!this._initialized) {
                    this._initialized = true;
                    meru.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                        if (egret.Capabilities.runtimeType == egret.RuntimeType.WEB) {
                            if (!navigator.onLine) {
                                meru.tooltip('网络已断开，请稍后重试。');
                                return;
                            }
                        }
                        for (var i = 0; i < GameWebSocket.socketList.length; i ++) {
                            var socket = GameWebSocket.get(GameWebSocket.socketList[i]);
                            if (socket.needReconnect) {
                                socket.reconnect();
                            }
                        }
                    }, this);
                    if (egret.Capabilities.runtimeType == egret.RuntimeType.WEB) {
                        window.addEventListener('offline', function () {
                            for (var i = 0; i < GameWebSocket.socketList.length; i ++) {
                                var socket = GameWebSocket.get(GameWebSocket.socketList[i]);
                                socket.close();
                            }
                        });
                    }
                }
            }

            static get(type:any = null):GameWebSocket {
                type = type || 'normal';
                if (this.socketList.indexOf(type) == -1) {
                    this.initialize();
                    this.socketList.push(type);
                }
                var r = meru.typeSingleton(type, GameWebSocket);
                r.name = type;
                return r;
            }

            static run(conf:any, type:any = null):void {
                var socket = this.get(type);
                socket.init(conf);
            }
        }
    }
}

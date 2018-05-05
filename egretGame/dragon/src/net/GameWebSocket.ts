module dragon
{
    export interface ISocketCallback
    {
        onAnalysis?(data: any): void;       //接收数据
        onClose?(): void;                   //关闭连接
        onConnect?(): void;                 //断线重连
        onEnter?(data: any): void;          //连接成功
        onError?(errData: any, t?): void;   //错误处理
        onEnterError?(errData: any): void;
        onHeartBeat?(data: any): void;
    }

    export class GameWebSocket
    {
        private _pomelo: Pomelo;
        private _config: any;
        private _socketCallback: ISocketCallback;
        private _tickId: number;
        private _heart: number = 0;
        public name: string;                   //socket名
        public needReconnect: boolean = false; //是否需要重连
        public isConnecting: boolean = false;  //正在连接
        public enable: boolean = true;
        private static socketList: any[] = [];
        private static _initialized: boolean = false;

        public tick(): void
        {
            if (this.needReconnect)
            {
                this._heart = 0;
                return;
            }
            if (this.connected)
            {
                this._heart++;
                if (this._heart % 30 == 0)
                {
                    this.request('');
                }
            }
        }

        /**
         * socket是否连接
         * @readonly
         * @memberof GameWebSocket
         */
        public get connected()
        {
            return this._pomelo && this._pomelo['socket'];
        }

        private runTick(): void
        {
            if (!this._tickId)
            {
                this._tickId = dragon.setInterval(this.tick, this, 1000);
            }
        }

        /**
         * 设置socket管理类
         * @param {*} callback 
         * @memberof GameWebSocket
         */
        public initSocketCallback(callback: any): void
        {
            if (!this._socketCallback)
            {
                let inst: ISocketCallback = <ISocketCallback>dragon.singleton(callback)
                this._socketCallback = inst;
            }
        }

        /**
         * 初始化socket的IP和端口，连接服务器
         * @param {*} [config=this._config] 
         * @memberof GameWebSocket
         */
        private init(config: any = this._config): void
        {
            var that = this;
            this._config = config;
            // if (egret.MainContext.runtimeType == egret.MainContext.RUNTIME_HTML5)
            // {
            //     if (window["WebSocket"])
            //     {
            //         this.enable = true;
            //     }
            //     else
            //     {
            //         this.enable = false;
            //         return;
            //     }
            // }
            this._pomelo = new Pomelo();
            //错误处理
            this._pomelo.on('io-error', function (data)
            {
                if (that._socketCallback && that._socketCallback.onError)
                {
                    that._socketCallback.onError(data, 'io-error');
                }
                console.log('io-error');
            });
            //连接关闭
            this._pomelo.on('close', function (data)
            {
                that.close();
                console.log('close');
            });
            // 接收服务端推送的消息
            this._pomelo.on('onChat', function (data: any): void
            {
                if (that._socketCallback && that._socketCallback.onError)
                {
                    this.receiveServerData(data, (info) =>
                    {
                        that._socketCallback.onAnalysis(info);
                    })
                }
                console.log('onChat:' + data);
            });
            this._pomelo.init(config, this.initCallback.bind(this));
            // if (!this._tickId)
            // {
            //     this.runTick();
            // }
        }

        private initCallback(data): void
        {
            var that = this;
            //连接完成
            if (that._socketCallback && that._socketCallback.onEnter)
            {
                that._socketCallback.onEnter(data);
            }
        }

        /**
         * 重连
         * @memberof GameWebSocket
         */
        public reconnect()
        {
            this.needReconnect = false;
            this.init();
            if (this._socketCallback && this._socketCallback.onConnect)
            {
                this._socketCallback.onConnect();
            }
        }

        /**
         * 关闭
         * @memberof GameWebSocket
         */
        private close(): void
        {
            if (this._socketCallback && this._socketCallback.onClose)
            {
                this._socketCallback.onClose();
            }
        }

        private setDisconnect(): void
        {
            this.needReconnect = true;
        }

        private receiveServerData(data: any, callback: Function = null, context: Object = null): void
        {
            let code: number = data.code
            let msg: string = data.msg;
            if (code)
            {
                if (code == ScoketCode.RESPONSE_SUCCESS)
                {
                    if (callback && context)
                    {
                        callback.call(context, data);
                    }
                    dragon.getServerData(data);
                } else if (code == ScoketCode.REQUEST_ERROR)
                {
                    postNotice(SocketAction.REQUEST_ERROR, data);
                    console.warn('code:' + code + "；msg:" + msg);
                } else if (code == ScoketCode.NOT_AUTHOR_TOKEN)
                {
                    postNotice(SocketAction.NOT_AUTHOR_TOKEN, data);
                    console.warn('code:' + code + "；msg:" + msg);
                } else if (code == ScoketCode.NOT_REQUEST_API)
                {
                    postNotice(SocketAction.NOT_REQUEST_API, data);
                    console.warn('code:' + code + "；msg:" + msg);
                } else if (code == ScoketCode.REQUEST_TIMEOUT)
                {
                    postNotice(SocketAction.REQUEST_TIMEOUT, data);
                    console.warn('code:' + code + "；msg:" + msg);
                } else if (code == ScoketCode.SERVER_UNKNOWN_ERROR)
                {
                    postNotice(SocketAction.SERVER_UNKNOWN_ERROR, data);
                    console.warn('code:' + code + "；msg:" + msg);
                }
            }
        }

        /**
         * 断开连接
         * @param {boolean} [remove=false] 是否从列表中移除socket
         * @memberof GameWebSocket
         */
        public disconnect(remove: boolean = false)
        {
            if (remove)
            {
                this.removeSocket();
            }
            this._pomelo.disconnect();
        }

        private removeSocket(): void
        {
            for (let i: number = 0; i < GameWebSocket.socketList.length; i++)
            {
                let name: string = GameWebSocket.socketList[i];
                if (name == this.name)
                {
                    dragon.removeTypeSingleton(name, GameWebSocket)
                    GameWebSocket.socketList.splice(i, 0);
                }
            }
        }

        /**
         * 首次初始化（断线）
         * @private
         * @static
         * @memberof GameSocket
         */
        private static initialize(): void
        {
            if (!this._initialized)
            {
                this._initialized = true;
                dragon.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, () =>
                {
                    if (egret.Capabilities.runtimeType == egret.RuntimeType.WEB)
                    {
                        if (!navigator.onLine)
                        {
                            console.log('网络已断开，请重新连接');
                            return;
                        }
                    }
                    for (let i: number = 0; i < GameWebSocket.socketList.length; i++)
                    {
                        let socket = GameWebSocket.get(GameWebSocket.socketList[i]);
                        if (socket.needReconnect)
                        {
                            socket.reconnect();
                        }
                    }
                }, this);
            }
        }

        /**
         * 发送数据
         * @param {string} route 
         * @param {any} [msg=null] 
         * @param {any} [callback=null] 
         * @param {any} [context=null] 
         * @memberof GameWebSocket
         */
        public request(route: string, msg = null, callback = null, context = null)
        {
            if (this.connected)
            {
                this._pomelo.request(route, msg, (response) =>
                {
                    this.receiveServerData(response);
                    if (callback && context)
                    {
                        callback.call(context, response);
                    }
                });
            }
        }

        /**
         * 向服务器发送不需要反馈的通知
         * @param {string} route 
         * @param {*} msg 
         * @memberof GameWebSocket
         */
        public notice(route: string, msg: any): void
        {
            if (this.connected)
            {
                this._pomelo.notify(route, msg);
            }
        }

        /**
         * 获取socket
         * @static
         * @param {*} [type=null] 
         * @returns {GameWebSocket} 
         * @memberof GameWebSocket
         */
        public static get(type: any = null): GameWebSocket
        {
            type = type || 'COMMON';
            if (this.socketList.indexOf(type) == -1)
            {
                this.initialize();
                this.socketList.push(type);
            }
            let ret = dragon.typeSingleton(type, GameWebSocket);
            ret.name = type;
            return ret;
        }

        /**
         * 启动socket
         * @static
         * @param {*} config 
         * @param {*} socketCallbak 
         * @param {*} [type=null] 
         * @memberof GameWebSocket
         */
        public static run(config: any, socketCallbak: any, type: any = null): void
        {
            let socket = this.get(type);
            socket.initSocketCallback(socketCallbak);
            socket.init(config);
        }
    }

    /**
     * 向服务器发送通知，不接收反馈
     * @export
     * @param {string} route 
     * @param {*} msg 
     * @param {string} [type=null] 
     */
    export function sendRequestNotice(route: string, msg: any, type: string = null): void
    {
        dragon.GameWebSocket.get(type).notice(route, msg);
    }

    /**
     * 向服务器发送数据，接收结果
     * @export
     * @param {string} route 
     * @param {any} [msg=null] 
     * @param {any} [callback=null] 
     * @param {any} [context=null] 
     * @param {string} [type=null] 
     */
    export function request(route: string, msg = null, callback = null, context = null, type: string = null): void
    {
        dragon.GameWebSocket.get(type).request(route, msg, callback, context)
    }
}
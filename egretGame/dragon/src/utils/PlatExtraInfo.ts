/**
 * @author Andrew_Huang
 */
module dragon
{
    /**
     * 游戏常用的平台、运行环境参数
     * @export
     * @class ExtraInfo
     */
    export class PlatExtraInfo
    {
        private _spid: any;         //游戏渠道Id
        private _platform: string;  //当前游戏平台
        private _version: string;   //当前游戏版本
        private _bench: string;     //当前运行环境:<code>local</code>、<code>beta</code>、<code>release</code>
        private _oplayerId: string; //用户Id
        private _channel: string;   //渠道（如爱微游、微博等）
        private _runtime: boolean;  //是否为runtime运行环境（运行类型的类型（WBE;NATIVE））

        public constructor()
        {
            this._spid = egret.getOption('egret.runtime.spid');
            this._version = egret.getOption('fv');
            this._platform = egret.getOption('pf') || 'ND';
            this._bench = egret.getOption('gv') || 'local';
            this._oplayerId = egret.getOption("oplayerId");
            this._channel = egret.getOption("channelTag");
            this._runtime = egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE;
        }

        public get spid(): any
        {
            return this._spid;
        }

        public get platform(): string
        {
            return this._platform;
        }

        public get version(): string
        {
            return this._version;
        }

        public get bench(): string
        {
            return this._bench;
        }

        public get oplayerId(): string
        {
            return this._oplayerId;
        }

        public get channel(): string
        {
            return this._channel;
        }

        public get runtime(): boolean
        {
            return this._runtime;
        }

    }

    /**
     * 游戏常用的平台、运行环境参数
     */
    export var extra: PlatExtraInfo;
    var __extra: PlatExtraInfo = null;
    dragon.def(dragon, 'extra', () =>
    {
        if (!__extra)
        {
            __extra = new PlatExtraInfo();
        }
        return __extra;
    });
}
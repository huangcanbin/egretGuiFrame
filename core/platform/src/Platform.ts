/**
 * @author Andrew_Huang
 */
module andrew
{
    /**
     * 平台基类
     * @export
     * @class Platform
     * @implements {dragon.IPlatform}
     */
    export class Platform implements dragon.IPlatform
    {
        public contact: any = {}; //客服联系方式
        public supportInfo: any = {};//平台提供的信息
        public HasSubscribe: boolean = false; //是否关注过

        public constructor()
        {

        }

        /**
         * 平台名
         * @readonly
         * @type {string}
         * @memberof Platform
         */
        public get name(): string
        {
            return ""
        }

        /**
         * 登录前，获取登陆中需要的登陆数据（如：token等）
         * @memberof Platform
         */
        public doLogin(): void { }

        /**
         * 登陆
         * @param {*} args 
         * @memberof Platform
         */
        public login(args: any): void { }

        /**
         * 登出
         * @param {Function} [callback=null] 
         * @param {Object} [context=null] 
         * @memberof Platform
         */
        public logout(callback: Function = null, context: Object = null): void
        {
            if (callback)
            {
                callback.call(context, { result: 0 });
            }
        }

        /**
         * 支付
         * @param {*} data 
         * @param {Function} [callback=null] 
         * @param {Object} [context=null] 
         * @memberof Platform
         */
        public payment(data: any, callback: Function = null, context: Object = null): void { }

        /**
         * 分享
         * @param {*} data 
         * @param {Function} [callback=null] 
         * @param {Object} [context=null] 
         * @memberof Platform
         */
        public share(data: any, callback: Function = null, context: Object = null): void { }

        /**
         * 打开论坛
         * @param {Function} [callback=null] 
         * @param {Object} [context=null] 
         * @memberof Platform
         */
        public openBBS(callback: Function = null, context: Object = null): void { }

        /**
         * 是否支持（如腾讯平台登陆等等）
         * @param {dragon.PlatformFunType} type 
         * @param {Function} [callback=null] 
         * @param {Object} [context=null] 
         * @memberof Platform
         */
        public isSupport(type: dragon.PlatformFunType, callback: Function = null, context: Object = null): void { }

        public userIsSupport(data: any, callback: Function = null, context: Object = null): void { }

        /**
         * 发送（快捷连接）到桌面
         * @param {Function} [callback=null] 
         * @param {Object} [context=null] 
         * @memberof Platform
         */
        public sendToDesktop(callback: Function = null, context: Object = null): void { }

        /**
         * 关注
         * @param {Function} [callback=null] 
         * @param {Object} [context=null] 
         * @memberof Platform
         */
        public doAttention(callback: Function = null, context: Object = null): void { }

        /**
         * 设置分享数据
         * @param {*} info 
         * @param {Function} [callback=null] 
         * @param {Object} [context=null] 
         * @memberof Platform
         */
        public setShareInfo(info: any, callback: Function = null, context: Object = null): void { }
    }
}
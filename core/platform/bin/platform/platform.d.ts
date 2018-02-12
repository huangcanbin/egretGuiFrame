/**
 * @author Andrew_Huang
 */
declare module andrew {
    /**
     * 平台基类
     * @export
     * @class Platform
     * @implements {dragon.IPlatform}
     */
    class Platform implements dragon.IPlatform {
        contact: any;
        supportInfo: any;
        HasSubscribe: boolean;
        constructor();
        /**
         * 平台名
         * @readonly
         * @type {string}
         * @memberof Platform
         */
        readonly name: string;
        /**
         * 登录前，获取登陆中需要的登陆数据（如：token等）
         * @memberof Platform
         */
        doLogin(): void;
        /**
         * 登陆
         * @param {*} args
         * @memberof Platform
         */
        login(args: any): void;
        /**
         * 登出
         * @param {Function} [callback=null]
         * @param {Object} [context=null]
         * @memberof Platform
         */
        logout(callback?: Function, context?: Object): void;
        /**
         * 支付
         * @param {*} data
         * @param {Function} [callback=null]
         * @param {Object} [context=null]
         * @memberof Platform
         */
        payment(data: any, callback?: Function, context?: Object): void;
        /**
         * 分享
         * @param {*} data
         * @param {Function} [callback=null]
         * @param {Object} [context=null]
         * @memberof Platform
         */
        share(data: any, callback?: Function, context?: Object): void;
        /**
         * 打开论坛
         * @param {Function} [callback=null]
         * @param {Object} [context=null]
         * @memberof Platform
         */
        openBBS(callback?: Function, context?: Object): void;
        /**
         * 是否支持（如腾讯平台登陆等等）
         * @param {dragon.PlatformFunType} type
         * @param {Function} [callback=null]
         * @param {Object} [context=null]
         * @memberof Platform
         */
        isSupport(type: dragon.PlatformFunType, callback?: Function, context?: Object): void;
        userIsSupport(data: any, callback?: Function, context?: Object): void;
        /**
         * 发送（快捷连接）到桌面
         * @param {Function} [callback=null]
         * @param {Object} [context=null]
         * @memberof Platform
         */
        sendToDesktop(callback?: Function, context?: Object): void;
        /**
         * 关注
         * @param {Function} [callback=null]
         * @param {Object} [context=null]
         * @memberof Platform
         */
        doAttention(callback?: Function, context?: Object): void;
        /**
         * 设置分享数据
         * @param {*} info
         * @param {Function} [callback=null]
         * @param {Object} [context=null]
         * @memberof Platform
         */
        setShareInfo(info: any, callback?: Function, context?: Object): void;
    }
}

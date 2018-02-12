/**
 * @author Andrew_Huang
 */
var andrew;
(function (andrew) {
    /**
     * 平台基类
     * @export
     * @class Platform
     * @implements {dragon.IPlatform}
     */
    var Platform = /** @class */ (function () {
        function Platform() {
            this.contact = {}; //客服联系方式
            this.supportInfo = {}; //平台提供的信息
            this.HasSubscribe = false; //是否关注过
        }
        Object.defineProperty(Platform.prototype, "name", {
            /**
             * 平台名
             * @readonly
             * @type {string}
             * @memberof Platform
             */
            get: function () {
                return "";
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 登录前，获取登陆中需要的登陆数据（如：token等）
         * @memberof Platform
         */
        Platform.prototype.doLogin = function () { };
        /**
         * 登陆
         * @param {*} args
         * @memberof Platform
         */
        Platform.prototype.login = function (args) { };
        /**
         * 登出
         * @param {Function} [callback=null]
         * @param {Object} [context=null]
         * @memberof Platform
         */
        Platform.prototype.logout = function (callback, context) {
            if (callback === void 0) { callback = null; }
            if (context === void 0) { context = null; }
            if (callback) {
                callback.call(context, { result: 0 });
            }
        };
        /**
         * 支付
         * @param {*} data
         * @param {Function} [callback=null]
         * @param {Object} [context=null]
         * @memberof Platform
         */
        Platform.prototype.payment = function (data, callback, context) {
            if (callback === void 0) { callback = null; }
            if (context === void 0) { context = null; }
        };
        /**
         * 分享
         * @param {*} data
         * @param {Function} [callback=null]
         * @param {Object} [context=null]
         * @memberof Platform
         */
        Platform.prototype.share = function (data, callback, context) {
            if (callback === void 0) { callback = null; }
            if (context === void 0) { context = null; }
        };
        /**
         * 打开论坛
         * @param {Function} [callback=null]
         * @param {Object} [context=null]
         * @memberof Platform
         */
        Platform.prototype.openBBS = function (callback, context) {
            if (callback === void 0) { callback = null; }
            if (context === void 0) { context = null; }
        };
        /**
         * 是否支持（如腾讯平台登陆等等）
         * @param {dragon.PlatformFunType} type
         * @param {Function} [callback=null]
         * @param {Object} [context=null]
         * @memberof Platform
         */
        Platform.prototype.isSupport = function (type, callback, context) {
            if (callback === void 0) { callback = null; }
            if (context === void 0) { context = null; }
        };
        Platform.prototype.userIsSupport = function (data, callback, context) {
            if (callback === void 0) { callback = null; }
            if (context === void 0) { context = null; }
        };
        /**
         * 发送（快捷连接）到桌面
         * @param {Function} [callback=null]
         * @param {Object} [context=null]
         * @memberof Platform
         */
        Platform.prototype.sendToDesktop = function (callback, context) {
            if (callback === void 0) { callback = null; }
            if (context === void 0) { context = null; }
        };
        /**
         * 关注
         * @param {Function} [callback=null]
         * @param {Object} [context=null]
         * @memberof Platform
         */
        Platform.prototype.doAttention = function (callback, context) {
            if (callback === void 0) { callback = null; }
            if (context === void 0) { context = null; }
        };
        /**
         * 设置分享数据
         * @param {*} info
         * @param {Function} [callback=null]
         * @param {Object} [context=null]
         * @memberof Platform
         */
        Platform.prototype.setShareInfo = function (info, callback, context) {
            if (callback === void 0) { callback = null; }
            if (context === void 0) { context = null; }
        };
        return Platform;
    }());
    andrew.Platform = Platform;
})(andrew || (andrew = {}));

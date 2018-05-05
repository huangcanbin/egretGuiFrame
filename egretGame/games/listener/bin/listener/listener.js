/*
* @Author: Andrew_Huang
* @Date: 2018-04-28 13:44:38
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-04-28 14:27:40
*/
var games;
(function (games) {
    var listener;
    (function (listener) {
        var addNotice = dragon.addNotice;
        var SocketAction = dragon.SocketAction;
        /**
         * 全局监听
         * @author Andrew_Huang
         * @export
         * @class Listener
         */
        var Listener = /** @class */ (function () {
            function Listener() {
                addNotice(SocketAction.REQUEST_ERROR, this.onRequestError, this);
                addNotice(SocketAction.NOT_AUTHOR_TOKEN, this.onNotAuthorToken, this);
                addNotice(SocketAction.NOT_REQUEST_API, this.onRequestAPIError, this);
                addNotice(SocketAction.REQUEST_TIMEOUT, this.onRequestTimeout, this);
                addNotice(SocketAction.SERVER_UNKNOWN_ERROR, this.onServerUnknownError, this);
            }
            /**
             * 请求错误
             * @author Andrew_Huang
             * @private
             * @param {*} data
             * @memberof Listener
             */
            Listener.prototype.onRequestError = function (data) {
                var callback = listener.getSetting().ListenerCallback;
                if (callback && callback.onRequestError) {
                    callback.onRequestError(data);
                }
            };
            /**
             * 未授权身份令牌
             * @author Andrew_Huang
             * @private
             * @param {*} data
             * @memberof Listener
             */
            Listener.prototype.onNotAuthorToken = function (data) {
                var callback = listener.getSetting().ListenerCallback;
                if (callback && callback.onNotAuthorToken) {
                    callback.onNotAuthorToken(data);
                }
            };
            /**
             * 未找到请求接口
             * @author Andrew_Huang
             * @private
             * @param {*} data
             * @memberof Listener
             */
            Listener.prototype.onRequestAPIError = function (data) {
                var callback = listener.getSetting().ListenerCallback;
                if (callback && callback.onRequestAPIError) {
                    callback.onRequestAPIError(data);
                }
            };
            /**
             * 请求超时
             * @author Andrew_Huang
             * @private
             * @param {*} data
             * @memberof Listener
             */
            Listener.prototype.onRequestTimeout = function (data) {
                var callback = listener.getSetting().ListenerCallback;
                if (callback && callback.onRequestTimeout) {
                    callback.onRequestTimeout(data);
                }
            };
            /**
             * 服务器未知错误
             * @author Andrew_Huang
             * @private
             * @param {*} data
             * @memberof Listener
             */
            Listener.prototype.onServerUnknownError = function (data) {
                var callback = listener.getSetting().ListenerCallback;
                if (callback && callback.onServerUnknownError) {
                    callback.onServerUnknownError(data);
                }
            };
            return Listener;
        }());
        listener.Listener = Listener;
    })(listener = games.listener || (games.listener = {}));
})(games || (games = {}));
/*
 * @Author: Andrew_Huang
 * @Date: 2018-04-28 13:44:02
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-04-28 14:11:17
 */
var games;
(function (games) {
    var listener;
    (function (listener) {
        /**
         * 全局监听配置
         * @author Andrew_Huang
         * @export
         * @class Setting
         */
        var Setting = /** @class */ (function () {
            function Setting() {
            }
            Setting.prototype.init = function (setting) {
                this._setting = setting;
                this._listener = new listener.Listener();
            };
            Object.defineProperty(Setting.prototype, "CallbackClass", {
                get: function () {
                    return this._setting.CallbackClass;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Setting.prototype, "ListenerCallback", {
                get: function () {
                    if (!this._callbackListener) {
                        this._callbackListener = dragon.getDefinitionInstance(this.CallbackClass, null);
                    }
                    return this._callbackListener;
                },
                enumerable: true,
                configurable: true
            });
            Setting.init = function (setting) {
                dragon.singleton(Setting).init(setting);
            };
            return Setting;
        }());
        listener.Setting = Setting;
        function getSetting() {
            return dragon.singleton(Setting);
        }
        listener.getSetting = getSetting;
    })(listener = games.listener || (games.listener = {}));
})(games || (games = {}));

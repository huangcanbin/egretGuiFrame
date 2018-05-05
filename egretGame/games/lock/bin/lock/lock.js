/*
 * @Author: Andrew_Huang
 * @Date: 2018-05-03 14:59:22
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-05-03 16:00:09
 */
var games;
(function (games) {
    var lock;
    (function (lock) {
        var Lock = /** @class */ (function () {
            function Lock() {
                this._lockObj = dragon.Config.get(lock.getSetting().LockFile);
            }
            /**
             * 获取文本提示信息
             * @author Andrew_Huang
             * @private
             * @param {Item} item
             * @returns {string}
             * @memberof Lcok
             */
            Lock.prototype.getLvMessage = function (item) {
                if (item.hasOwnProperty('Text')) {
                    return item.Text;
                }
                return dragon.Str.replaceAll(lock.getSetting().LevelDefaultMessage, '{level}', item.Level.toString());
            };
            /**
             * 等级是否满足功能开启条件
             * @author Andrew_Huang
             * @private
             * @param {Item} item
             * @param {boolean} showTip
             * @returns {boolean}
             * @memberof Lcok
             */
            Lock.prototype.lv = function (item, showTip) {
                var userLv = dragon.getWhereValue(lock.getSetting().Level, 0);
                var needLv = item.Level;
                var ret = userLv >= needLv;
                if (!ret) {
                    if (showTip) {
                        dragon.tooltip(this.getLvMessage(item));
                    }
                }
                return ret;
            };
            /**
             * 获取条件状态
             * @author Andrew_Huang
             * @private
             * @param {Item} item
             * @param {boolean} showTip
             * @returns {boolean}
             * @memberof Lcok
             */
            Lock.prototype.condition = function (item, showTip) {
                var status = dragon.pullObject(item.Condition, false);
                if (!status) {
                    if (showTip) {
                        dragon.tooltip(item.Text);
                    }
                }
                return status;
            };
            Lock.prototype.is = function (type, showTip) {
                if (DEBUG && !this._lockObj.hasOwnProperty(type)) {
                    console.warn(lock.getSetting().LockFile + "配置中没有<" + type + ">项");
                }
                if (this._lockObj.hasOwnProperty(type)) {
                    var item = this._lockObj[type];
                    if (item.hasOwnProperty('Level')) {
                        return this.lv(item, showTip);
                    }
                    else if (item.hasOwnProperty('Condition')) {
                        return this.condition(item, showTip);
                    }
                }
                return false;
            };
            return Lock;
        }());
        lock.Lock = Lock;
        /**
         * 指定功能是否开启
         * @author Andrew_Huang
         * @export
         * @param {string} type
         * @param {boolean} [showTip=false]
         * @returns {boolean}
         */
        function is(type, showTip) {
            if (showTip === void 0) { showTip = false; }
            return dragon.singleton(Lock).is(type, showTip);
        }
        lock.is = is;
        /**
         * 指定功能未开启
         * @author Andrew_Huang
         * @export
         * @param {string} type
         * @param {boolean} [showTip=false]
         * @returns {boolean}
         */
        function not(type, showTip) {
            if (showTip === void 0) { showTip = false; }
            return !dragon.singleton(Lock).is(type, showTip);
        }
        lock.not = not;
    })(lock = games.lock || (games.lock = {}));
})(games || (games = {}));
/*
 * @Author: Andrew_Huang
 * @Date: 2018-05-03 14:50:56
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-05-03 14:58:08
 */
var games;
(function (games) {
    var lock;
    (function (lock) {
        var Setting = /** @class */ (function () {
            function Setting() {
            }
            Object.defineProperty(Setting.prototype, "Level", {
                get: function () {
                    return this._setting.Level;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Setting.prototype, "LockFile", {
                get: function () {
                    return this._setting.LockFile;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Setting.prototype, "LevelDefaultMessage", {
                get: function () {
                    return this._setting.LevelDefaultMessage || "用户等级达到{level}级后开启";
                },
                enumerable: true,
                configurable: true
            });
            Setting.prototype.init = function (setting) {
                this._setting = setting;
            };
            Setting.init = function (setting) {
                dragon.singleton(Setting).init(setting);
            };
            return Setting;
        }());
        lock.Setting = Setting;
        function getSetting() {
            return dragon.singleton(Setting);
        }
        lock.getSetting = getSetting;
    })(lock = games.lock || (games.lock = {}));
})(games || (games = {}));

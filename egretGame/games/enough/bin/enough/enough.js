/*
 * @Author: Andrew_Huang
 * @Date: 2018-05-02 11:00:46
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-05-02 12:01:55
 */
var games;
(function (games) {
    var enough;
    (function (enough) {
        var __enoughItemMap = {};
        function getEnoughItem(type) {
            if (!this.__enoughItemMap.hasOwnProperty(type)) {
                var items = enough.getSetting().Items;
                for (var key in items) {
                    if (items[key].Type == type) {
                        __enoughItemMap[type] = items[key];
                        __enoughItemMap[type].Key = key;
                    }
                }
            }
            return __enoughItemMap[type];
        }
        function getConfig(name) {
            return getEnoughItem(name);
        }
        enough.getConfig = getConfig;
        /**
         * 检查指定的道具数量是否足够
         * @author Andrew_Huang
         * @export
         * @param {number} configId                 道具配置Id
         * @param {number} need                     需要的道具数量
         * @param {boolean} [enterSupplement=false] 是否进入自定义的提示类操作
         * @param {string} [className=null]         扩展
         * @returns {boolean}
         */
        function hasItem(configId, need, enterSupplement, className) {
            if (enterSupplement === void 0) { enterSupplement = false; }
            if (className === void 0) { className = null; }
            var has = dragon.Item.getNum(configId);
            if (has >= need) {
                return true;
            }
            else {
                if (enterSupplement) {
                    var item = getEnoughItem('ITEM');
                    if (item) {
                        var supplementClass = enough.getSetting().SupplementClass;
                        var supplementInst = dragon.getDefinitionType(supplementClass, null);
                        if (supplementInst) {
                            var supplement_1 = dragon.singleton(supplementInst);
                            supplement_1.supplement(item.Key, has, need, configId, className);
                        }
                        else {
                            console.warn("Can't Find SupplementClass");
                        }
                    }
                }
            }
        }
        enough.hasItem = hasItem;
        function noItem(configId, need, enterSupplement, className) {
            if (enterSupplement === void 0) { enterSupplement = false; }
            if (className === void 0) { className = null; }
            return !hasItem(configId, need, enterSupplement, className);
        }
        enough.noItem = noItem;
        var supplement = function (item, type, has, need, extra, className) {
            if (item.CanSupplement) {
                var supplementClass = enough.getSetting().SupplementClass;
                var supplementInst = dragon.getDefinitionType(supplementClass, null);
                if (supplementInst) {
                    var supplement_2 = dragon.singleton(supplementInst);
                    supplement_2.supplement(type, has, need, extra, className);
                }
            }
        };
        /**
         * 检查指定的后端数据是否足够（如：金币、VIP等级等）
         * @author Andrew_Huang
         * @export
         * @param {string} type                     数据类型
         * @param {number} need                     需要的数量
         * @param {boolean} [enterSupplement=false] 是否进入自定义的提示类操作
         * @param {string} [className=null]         扩展
         * @returns {boolean}
         */
        function has(type, need, enterSupplement, className) {
            if (enterSupplement === void 0) { enterSupplement = false; }
            if (className === void 0) { className = null; }
            var items = enough.getSetting().Items;
            if (items && items.hasOwnProperty(type)) {
                var item = items[type];
                var has_1 = dragon.getWhereValue(item.Where, 0);
                if (has_1 >= need) {
                    return true;
                }
                else if (enterSupplement) {
                    supplement(item, type, has_1, need, item.Confirm, className);
                }
            }
        }
        enough.has = has;
        function not(type, need, enterSupplement, className) {
            if (enterSupplement === void 0) { enterSupplement = false; }
            if (className === void 0) { className = null; }
            return !has(type, need, enterSupplement, className);
        }
        enough.not = not;
    })(enough = games.enough || (games.enough = {}));
})(games || (games = {}));
/*
 * @Author: Andrew_Huang
 * @Date: 2018-05-02 11:00:36
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-05-02 11:09:00
 */
var games;
(function (games) {
    var enough;
    (function (enough) {
        var Setting = /** @class */ (function () {
            function Setting() {
            }
            Object.defineProperty(Setting.prototype, "Items", {
                get: function () {
                    return this._setting.Items;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Setting.prototype, "SupplementClass", {
                get: function () {
                    return this._setting.SupplementClass;
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
        enough.Setting = Setting;
        function getSetting() {
            return dragon.singleton(Setting);
        }
        enough.getSetting = getSetting;
    })(enough = games.enough || (games.enough = {}));
})(games || (games = {}));

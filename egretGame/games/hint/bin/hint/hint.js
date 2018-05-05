/*
 * 通用提示框
 * @Author: Andrew_Huang
 * @Date: 2018-04-24 20:27:10
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-04-25 14:21:50
 */
var games;
(function (games) {
    var hint;
    (function (hint) {
        var _hintObj = null;
        function getHintObject() {
            if (is.nul(_hintObj)) {
                _hintObj = dragon.Config.get(hint.getSetting().HintFile);
            }
            return _hintObj;
        }
        /**
         * 根据key值获取对应的提示框数据对象
         * @author Andrew_Huang
         * @export
         * @param {(string | ConfirmInfo)} name
         * @returns {*}
         */
        function getMessage(name) {
            if (is.string(name)) {
                return dragon.Obj.getValue(getHintObject(), name);
            }
            return name;
        }
        hint.getMessage = getMessage;
        /**
         * 通用提示框
         * @author Andrew_Huang
         * @export
         * @class Hint
         */
        var Hint = /** @class */ (function () {
            function Hint() {
            }
            Hint.prototype.showConfirm = function (item, param, boxType, args) {
                item = dragon.Obj.deepClone(item);
                item['arg'] = param;
                return dragon.confirm.apply(dragon, [item, boxType].concat(args));
            };
            Hint.prototype.showTooltip = function (item, arg) {
                var str = '';
                var display = undefined;
                if (!is.string(item)) {
                    if (item.hasOwnProperty('display')) {
                        display = dragon.getGuiCreateInstance(item.display);
                    }
                    str = item.text;
                }
                else {
                    str = item;
                }
                dragon.tooltip(dragon.Str.replaceFromObject(str, arg), display);
                var promise = new Promise(function (resolve, reject) {
                    resolve();
                });
                return promise;
            };
            Hint.prototype.has = function (name) {
                return dragon.Obj.hasValue(getHintObject(), name);
            };
            Hint.prototype.show = function (name, param, boxType, args) {
                if (args === void 0) { args = []; }
                var item = getMessage(name);
                if (is.nul(item) || is.undefined(item)) {
                    console.warn("Can't Find Message By " + name + " ,please check resource!");
                    return;
                }
                if (is.string(item) || item.type == 'tooltip') {
                    return this.showTooltip(item, param);
                }
                else {
                    return this.showConfirm(item, param, boxType, args);
                }
            };
            Hint.prototype.text = function (name, arg) {
                var item = getMessage(name);
                var str = undefined;
                if (is.array(item)) {
                    str = item;
                }
                else {
                    str = item['text'];
                }
                return dragon.Str.replaceFromObject(str, arg);
            };
            Hint.promise = {
                then: function () { },
                catch: function () { }
            };
            return Hint;
        }());
        hint.Hint = Hint;
        /**
         * 判断是否存在该key值的提示数据对象
         * @author Andrew_Huang
         * @export
         * @param {string} name
         * @returns {boolean}
         */
        function has(name) {
            return dragon.singleton(Hint).has(name);
        }
        hint.has = has;
        /**
         * 显示指定key值的提示内容
         * @author Andrew_Huang
         * @export
         * @param {(string | ConfirmInfo)} info
         * @param {*} [param=null]
         * @returns
         */
        function show(info, param) {
            if (param === void 0) { param = null; }
            return dragon.singleton(Hint).show(info, param, dragon.BoxType.Box);
        }
        hint.show = show;
        /**
         * 返回指定提示内容的文字
         * @author Andrew_Huang
         * @export
         * @param {string} name
         * @param {*} [param=null]
         * @returns {string}
         */
        function text(name, param) {
            if (param === void 0) { param = null; }
            return dragon.singleton(Hint).text(name, param);
        }
        hint.text = text;
        // export function seq(info: string | ConfirmInfo, param: any = null) {
        //     return dragon.singleton(Hint).show(info, param, dragon.BoxType.SequnceBox);
        // }
        // export function history(info: string | ConfirmInfo, param: any = null) {
        //     return dragon.singleton(Hint).show(info, param, dragon.BoxType.HistoryBox);
        // }
        // export function groupSeq(info: string | ConfirmInfo, group: string, priority: number, param: any = null, ...args) {
        //     return dragon.singleton(Hint).show(info, param, dragon.BoxType.GroupSequnceBox, [group, priority].concat(args));
        // }
    })(hint = games.hint || (games.hint = {}));
})(games || (games = {}));
/*
 * 弹框提示配置
 * @Author: Andrew_Huang
 * @Date: 2018-04-24 20:23:25
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-04-24 20:27:00
 */
var games;
(function (games) {
    var hint;
    (function (hint) {
        var Setting = /** @class */ (function () {
            function Setting() {
            }
            Object.defineProperty(Setting.prototype, "HintFile", {
                get: function () {
                    return this._setting.HintFile;
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
        hint.Setting = Setting;
        function getSetting() {
            return dragon.singleton(Setting);
        }
        hint.getSetting = getSetting;
    })(hint = games.hint || (games.hint = {}));
})(games || (games = {}));

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/*
 * @Author: Andrew_Huang
 * @Date: 2018-04-24 17:30:23
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-04-24 20:05:20
 * ——————————————— GUI通用提示框命名规则 ——————————————
 * 标题命名：title         fairygui.GTextField
 * 文本命名：text          fairygui.GTextField
 * 关闭按钮命名：closeBtn  fairygui.GButton
 * 确定按钮命名：yesBtn    fairygui.GButton
 * 取消按钮命名：noBtn     fairygui.GButton
 */
var games;
(function (games) {
    /**
     * 提示框
     */
    var components;
    (function (components) {
        /**
         * 设置按钮显示和位置控制器
         * @export
         * @enum {number}
         */
        var ConfirmBtnVis;
        (function (ConfirmBtnVis) {
            ConfirmBtnVis[ConfirmBtnVis["both"] = 0] = "both";
            ConfirmBtnVis[ConfirmBtnVis["sure"] = 1] = "sure";
            ConfirmBtnVis[ConfirmBtnVis["cancel"] = 2] = "cancel";
            ConfirmBtnVis[ConfirmBtnVis["close"] = 3] = "close";
            ConfirmBtnVis[ConfirmBtnVis["none"] = 4] = "none";
        })(ConfirmBtnVis = components.ConfirmBtnVis || (components.ConfirmBtnVis = {}));
        /**
         * 提示框
         * @author Andrew_Huang
         * @export
         * @class Confirm
         * @extends {dragon.BaseComponent}
         * @implements {dragon.IConfirm}
         */
        var Confirm = /** @class */ (function (_super) {
            __extends(Confirm, _super);
            function Confirm(info) {
                var _this = _super.call(this) || this;
                _this._info = _this.formatInfo(info);
                _this._data = _this._info;
                _this.setArgs(_this._info);
                _this.display = dragon.getGuiCreateInstance(_this._info.confirView);
                return _this;
            }
            /**
             * 格式化弹框数据
             * @author Andrew_Huang
             * @private
             * @param {(dragon.ConfirmInfo | string)} info
             * @returns {dragon.compoments.ConfirmInfo}
             * @memberof Confirm
             */
            Confirm.prototype.formatInfo = function (info) {
                var ret = info;
                if (is.string(info)) {
                    ret = { text: info };
                }
                if (!ret.hasOwnProperty("close")) {
                    ret.close = games.components.getSetting().ConfirmClose;
                }
                if (!ret.hasOwnProperty('size')) {
                    ret.size = games.components.getSetting().ConfirmSize;
                }
                if (!ret.hasOwnProperty("yes")) {
                    ret.yes = games.components.getSetting().ConfirmYes;
                }
                ret.showYes = is.truthy(ret.yes);
                if (!ret.hasOwnProperty("no")) {
                    ret.no = games.components.getSetting().ConfirmNo;
                }
                ret.showNo = is.truthy(ret.no);
                if (!ret.hasOwnProperty('confirView')) {
                    ret.confirView = games.components.getSetting().ConfirmDisplay;
                }
                if (!ret.hasOwnProperty("subConfirmVioew")) {
                    ret.subConfirmVioew = games.components.getSetting().SubConfirmView;
                }
                if (!ret.hasOwnProperty("title")) {
                    ret.title = games.components.getSetting().ConfirmTitle;
                }
                if (ret.arg) {
                    ret.title = this.formatText(ret.title, ret.arg);
                    ret.text = this.formatText(ret.text, ret.arg);
                }
                return ret;
            };
            /**
             * 格式化文本，替换{0}的value值
             * @author Andrew_Huang
             * @private
             * @param {string} text
             * @param {*} args
             * @returns {string}
             * @memberof Confirm
             */
            Confirm.prototype.formatText = function (text, args) {
                if (is.object(args)) {
                    for (var key in args) {
                        text = dragon.Str.replaceAll(text, "{" + key + "}", args[key]);
                    }
                }
                return text;
            };
            Confirm.prototype.show = function (callback, context) {
                this._callback = callback;
                this._context = context;
                // if (this._confirmView)
                // {
                //     this._confirmView = dragon.getGuiCreateInstance(this._info.subConfirmView);
                // }
            };
            Confirm.prototype.onOpen = function () {
                _super.prototype.onOpen.call(this);
                dragon.display.clickBlankCloseSelf(this);
                this.init();
            };
            Confirm.prototype.onTouchHandler = function (btn) {
                if (this._callback && this._context) {
                    this._callback.call(this._context, btn);
                }
                dragon.display.removeFromParent(this);
            };
            Confirm.prototype.onCloseHandler = function () {
                this.onTouchHandler(dragon.ConfirmButton.close);
            };
            Confirm.prototype.onYesHandler = function () {
                this.onTouchHandler(dragon.ConfirmButton.yes);
            };
            Confirm.prototype.onNoHandler = function () {
                this.onTouchHandler(dragon.ConfirmButton.no);
            };
            Confirm.prototype.init = function () {
                if (this.display) {
                    if (this.display.getChild('closeBtn')) {
                        this._closeBtn = this.display.getChild('closeBtn').asButton;
                        this._closeBtn.visible = this._info.close;
                        if (this._closeBtn.visible) {
                            this._closeBtn.addClickListener(this.onCloseHandler, this);
                        }
                    }
                    if (this.display.getChild('yesBtn')) {
                        this._yesBtn = this.display.getChild('yesBtn').asButton;
                        this._yesBtn.visible = this._info.showYes;
                        if (this._info.showYes) {
                            this._yesBtn.title = this._info.yes;
                            this._yesBtn.addClickListener(this.onYesHandler, this);
                        }
                    }
                    if (this.display.getChild('noBtn')) {
                        this._noBtn = this.display.getChild('noBtn').asButton;
                        this._noBtn.visible = this._info.showNo;
                        if (this._info.showNo) {
                            this._noBtn.title = this._info.no;
                            this._noBtn.addClickListener(this.onNoHandler, this);
                        }
                    }
                    if (this.display.getChild('title')) {
                        this._title = this.display.getChild("title").asTextField;
                        if (this._info.title) {
                            this._title.visible = true;
                            this._title.text = this._info.title;
                        }
                        else {
                            this._title.visible = false;
                        }
                    }
                    if (this.display.getChild("text")) {
                        this._text = this.display.getChild('text').asTextField;
                        if (this._info.text) {
                            this._text.visible = true;
                            this._text.text = this._info.text;
                            this._text.fontSize = this._info.size;
                        }
                        else {
                            this._text.visible = false;
                        }
                    }
                    this.setBtnPosition();
                }
            };
            Confirm.prototype.setBtnPosition = function () {
                if (this.display.getChild("btnPos")) {
                    this._posController = this.display.getController('btnPos');
                    if (this._info.close) {
                        this._posController.setSelectedIndex(ConfirmBtnVis.close);
                    }
                    else if (this._info.showYes && this._info.showNo) {
                        this._posController.setSelectedIndex(ConfirmBtnVis.both);
                    }
                    else if (this._info.showYes && !this._info.showNo) {
                        this._posController.setSelectedIndex(ConfirmBtnVis.sure);
                    }
                    else if (!this._info.showYes && this._info.showNo) {
                        this._posController.setSelectedIndex(ConfirmBtnVis.cancel);
                    }
                    else {
                        this._posController.setSelectedIndex(ConfirmBtnVis.none);
                    }
                }
            };
            Confirm.prototype.onClose = function () {
                _super.prototype.onClose.call(this);
                if (this._closeBtn) {
                    this._closeBtn.removeClickListener(this.onCloseHandler, this);
                }
                if (this._yesBtn) {
                    this._yesBtn.removeClickListener(this.onYesHandler, this);
                }
                if (this._noBtn) {
                    this._noBtn.removeClickListener(this.onNoHandler, this);
                }
            };
            return Confirm;
        }(dragon.BaseComponent));
        components.Confirm = Confirm;
    })(components = games.components || (games.components = {}));
})(games || (games = {}));
/*
 * @Author: Andrew_Huang
 * @Date: 2018-04-23 10:14:41
 * @Last Modified by:   Andrew_Huang
 * @Last Modified time: 2018-04-23 10:14:41
 */
var games;
(function (games) {
    /**
     * @author Andrew_Huang
     * 通用组件
     */
    var components;
    (function (components) {
        /**
         * 通用组件配置解析
         * @author Andrew_Huang
         * @export
         * @class Setting
         * @implements {ISetting}
         */
        var Setting = /** @class */ (function () {
            function Setting() {
            }
            Setting.prototype.init = function (setting) {
                this._setting = setting;
            };
            Object.defineProperty(Setting.prototype, "ConfirmTitle", {
                get: function () {
                    return this._setting.ConfirmTitle || '提 示';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Setting.prototype, "ConfirmYes", {
                get: function () {
                    return this._setting.ConfirmYes || '确定';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Setting.prototype, "ConfirmNo", {
                get: function () {
                    return this._setting.ConfirmNo || '取消';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Setting.prototype, "ConfirmSize", {
                get: function () {
                    return this._setting.ConfirmSize || 20;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Setting.prototype, "ConfirmClose", {
                get: function () {
                    var close = this._setting.ConfirmClose;
                    if (typeof (close) == 'boolean') {
                        return close;
                    }
                    return true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Setting.prototype, "LoadSceneDisplay", {
                get: function () {
                    return this._setting.LoadSceneDisplay || 'LoadSceneDisplay';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Setting.prototype, "ProgressLoadingDisplay", {
                get: function () {
                    return this._setting.ProgressLoadingDisplay;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Setting.prototype, "ProgressLoadingAnimation", {
                get: function () {
                    return this._setting.ProgressLoadingAnimation;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Setting.prototype, "TooltipDelay", {
                /**
                 * 获取配置中的tip播放时间，默认1s
                 * @readonly
                 * @type {number}
                 * @memberof Setting
                 */
                get: function () {
                    return this._setting.TooltipDelay || 1000;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Setting.prototype, "TooltipColor", {
                get: function () {
                    return this._setting.TooltipColor || 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Setting.prototype, "TooltipSize", {
                get: function () {
                    return this._setting.TooltipSize || 20;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Setting.prototype, "TooltipAnimation", {
                /**
                 * 获取配置中的tip动画类（可自定义）
                 * @readonly
                 * @type {string}
                 * @memberof Setting
                 */
                get: function () {
                    return this._setting.TooltipAnimation;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Setting.prototype, "TooltipLayout", {
                /**
                 * 获取配置中tip多条显示的布局类（可自定义）
                 * PS：实现games.components.ITooltipLayout
                 * @readonly
                 * @type {string}
                 * @memberof Setting
                 */
                get: function () {
                    return this._setting.TooltipLayout;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Setting.prototype, "TooltipDisplay", {
                /**
                 * 获取配置中的tipItem的组件类（可自定义）
                 * @readonly
                 * @type {string}
                 * @memberof Setting
                 */
                get: function () {
                    return this._setting.TooltipDisplay;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Setting.prototype, "SimpleLoadingAnimation", {
                get: function () {
                    return this._setting.SimpleLoadingAnimation;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Setting.prototype, "ConfirmDisplay", {
                get: function () {
                    return this._setting.ConfirmDisplay;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Setting.prototype, "SubConfirmView", {
                get: function () {
                    return this._setting.SubConfirmView;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Setting.prototype, "SimpleLoadingDisplay", {
                get: function () {
                    return this._setting.SimpleLoadingDisplay;
                },
                enumerable: true,
                configurable: true
            });
            Setting.init = function (setting) {
                dragon.singleton(Setting).init(setting);
            };
            return Setting;
        }());
        components.Setting = Setting;
        function getSetting() {
            return dragon.singleton(Setting);
        }
        components.getSetting = getSetting;
    })(components = games.components || (games.components = {}));
})(games || (games = {}));
/*
 * @Author: Andrew_Huang
 * @Date: 2018-04-23 10:13:05
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-04-24 19:12:52
 */
var games;
(function (games) {
    /**
     * Tooltip提示
     * @author Andrew_Huang
     */
    var components;
    (function (components) {
        /**
         * tip动画布局(从下往上叠加)
         * @author Andrew_Huang
         * @class TooltipLayout
         * @implements {ITooltipLayout}
         */
        var TooltipLayout = /** @class */ (function () {
            function TooltipLayout() {
            }
            TooltipLayout.prototype.getTotalHeight = function (items, offsetY) {
                if (offsetY === void 0) { offsetY = 0; }
                return items.reduce(function (a, b) {
                    return a + b.display.height;
                }, 0) + items.length + offsetY;
            };
            TooltipLayout.prototype.layout = function (items) {
                if (items.length == 0) {
                    return;
                }
                var offsetY = 5;
                var len = items.length;
                var w = dragon.display.stageW;
                var h = dragon.display.stageH;
                var minY = h / 2;
                var maxY = h * 0.8;
                var y = this.getTotalHeight(items, offsetY);
                if (y < minY) {
                    y = minY;
                }
                else if (y > maxY) {
                    y = maxY;
                }
                var totalH = 0;
                for (var i = len - 1; i >= 0; i--) {
                    var display = items[i].display;
                    //dragon.display.setAnchor(display, 0.5);
                    display.y = y - totalH;
                    totalH += display.height + offsetY;
                    display.x = w / 2;
                }
            };
            return TooltipLayout;
        }());
        /**
         * tip展示动画
         * @author Andrew_Huang
         * @class TooltipAnimation
         * @implements {dragon.IUIAnimation}
         */
        var TooltipAnimation = /** @class */ (function () {
            function TooltipAnimation() {
            }
            Object.defineProperty(TooltipAnimation.prototype, "displayObject", {
                get: function () {
                    return this._display;
                },
                set: function (value) {
                    this._display = value;
                },
                enumerable: true,
                configurable: true
            });
            TooltipAnimation.prototype.show = function (callback) {
                var display = this.displayObject.getAnimationDisplay();
                dragon.Animation.removeAnimationByTarget(display);
                display.visible = true;
                display.scaleX = display.scaleY = 2;
                display.alpha = 1;
                dragon.Animation.to(300, { scaleX: 1, scaleY: 1 }).call(callback).run(display);
            };
            TooltipAnimation.prototype.close = function (callback) {
                var display = this.displayObject.getAnimationDisplay();
                dragon.Animation.removeAnimationByTarget(display);
                dragon.Animation.to(200, { alpha: 0 }).call(callback).run(display);
            };
            return TooltipAnimation;
        }());
        /**
         * tip Item 组件
         * @author Andrew_Huang
         * @class TooltipItem
         * @extends {dragon.BaseComponent}
         */
        var TooltipItem = /** @class */ (function (_super) {
            __extends(TooltipItem, _super);
            function TooltipItem() {
                return _super.call(this) || this;
            }
            /**
             * 使用对象池获取tipItem后设置数据
             * @param {*} info
             * @param {fairygui.GComponent} display
             * @memberof TooltipItem
             */
            TooltipItem.prototype.init = function (info, display) {
                this.animation = dragon.getDefinitionInstance(components.getSetting().TooltipAnimation, TooltipAnimation);
                if (display) {
                    this.display = display;
                }
                else if (components.getSetting().TooltipDisplay) {
                    this.display = dragon.getGuiCreateInstance(components.getSetting().TooltipDisplay);
                }
                this.data = info;
            };
            TooltipItem.prototype.onOpen = function () {
                if (this.display) {
                    this.label = this.display.getChild('label').asRichTextField;
                    if (this.label && this.label instanceof fairygui.GRichTextField) {
                        if (this.data.text.indexOf('<font') > -1) {
                            this.label.text = this.data.text;
                        }
                        else {
                            var str = '<font color=' + this.data.color + ' size=' + this.data.size + '>' + this.data.text + '</font>';
                            this.label.text = str;
                        }
                    }
                }
            };
            return TooltipItem;
        }(dragon.BaseComponent));
        /**
         * tip提示
         * @author Andrew_Huang
         * @export
         * @class Tooltip
         * @extends {dragon.BaseComponent}
         * @implements {dragon.ITooltip}
         */
        var Tooltip = /** @class */ (function (_super) {
            __extends(Tooltip, _super);
            function Tooltip() {
                var _this = _super.call(this) || this;
                _this.display = new fairygui.GComponent();
                _this._items = [];
                dragon.display.setFullDisplay(_this.display);
                _this.display.touchable = false;
                return _this;
            }
            Object.defineProperty(Tooltip.prototype, "layout", {
                get: function () {
                    if (!this._layout) {
                        this._layout = dragon.getDefinitionInstance(components.getSetting().TooltipLayout, TooltipLayout);
                    }
                    return this._layout;
                },
                enumerable: true,
                configurable: true
            });
            Tooltip.prototype.show = function (args, display) {
                var info;
                if (is.string(args)) {
                    var a = args;
                    info = { text: a };
                }
                else {
                    info = args;
                }
                if (!dragon.Obj.hasValue(info, 'color')) {
                    info.color = components.getSetting().TooltipColor;
                }
                if (!dragon.Obj.hasValue(info, 'size')) {
                    info.size = components.getSetting().TooltipSize;
                }
                if (!dragon.Obj.hasValue(info, "delay")) {
                    info.delay = components.getSetting().TooltipDelay;
                }
                //let item: TooltipItem = dragon.getPool(TooltipItem).pop(info, display);
                var item = new TooltipItem();
                item.init(info, display);
                this.createItem(item, info.delay);
            };
            Tooltip.prototype.customView = function (display, data, delay) {
                if (delay === void 0) { delay = components.getSetting().TooltipDelay; }
                //let item: TooltipItem = dragon.getPool(TooltipItem).pop(data, display);
                var item = new TooltipItem();
                item.init(data, display);
                this.createItem(item, delay);
            };
            /**
             * 添加tipItem
             * @private
             * @param {TooltipItem} item
             * @param {number} delay
             * @memberof Tooltip
             */
            Tooltip.prototype.createItem = function (item, delay) {
                var _this = this;
                item.clean = true;
                this.addChild(item);
                this._items.push(item);
                item.animation.show(function () {
                    dragon.Animation.delay(delay).call(function () {
                        item.animation.close(function () {
                            _this.removeItem(item);
                        });
                    }).run(item);
                });
                egret.callLater(function () {
                    _this.layout.layout(_this._items);
                }, this);
            };
            /**
             * tip动画播放结束，移除tipItem
             * @private
             * @param {*} item
             * @memberof Tooltip
             */
            Tooltip.prototype.removeItem = function (item) {
                var idx = this._items.indexOf(item);
                if (idx >= 0) {
                    this._items.splice(idx, 1);
                    dragon.getPool(TooltipItem).push(item);
                    dragon.display.removeFromParent(item);
                }
            };
            return Tooltip;
        }(dragon.BaseComponent));
        components.Tooltip = Tooltip;
    })(components = games.components || (games.components = {}));
})(games || (games = {}));

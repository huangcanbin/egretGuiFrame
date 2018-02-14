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
/**
 * @author Andrew_Huang
 */
var dragon;
(function (dragon) {
    /**
     * 动画基类
     * @export
     * @class BaseAnimation
     * @implements {dragon.IAnimation}
     */
    var BaseAnimation = /** @class */ (function () {
        function BaseAnimation() {
            this._isRunning = false; //动画是否正在播放
            this._timeLine = new TimelineMax({
                onComplete: this.onComplete.bind(this)
            });
        }
        Object.defineProperty(BaseAnimation.prototype, "target", {
            get: function () {
                return this._target;
            },
            set: function (value) {
                this._target = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseAnimation.prototype, "isRunning", {
            get: function () {
                return this._isRunning;
            },
            enumerable: true,
            configurable: true
        });
        BaseAnimation.prototype.onComplete = function () {
            BaseAnimation.removeAnimation(this.target, this);
        };
        /**
         * 设置动画目标，并返回动画实例
         * @param {*} obj
         * @returns {dragon.IAnimation}
         * @memberof BaseAnimation
         */
        BaseAnimation.prototype.setTarget = function (obj) {
            this.target = obj;
            return this;
        };
        /**
         * 设置动画：移动到目标点
         * @param {number} duration 时间
         * @param {*} prop          动画参数
         * @param {*} [ease]        动画展示方式
         * @returns {dragon.IAnimation}
         * @memberof BaseAnimation
         */
        BaseAnimation.prototype.to = function (duration, props, ease) {
            this.mergeEase(props, ease);
            this._aniInfoArr.push({ duration: duration / 1000, props: props });
            return this;
        };
        /**
         * 设置动画展示方式
         * @private
         * @param {*} props
         * @param {*} [ease]
         * @memberof BaseAnimation
         */
        BaseAnimation.prototype.mergeEase = function (props, ease) {
            props['ease'] = ease ? ease : Linear.easeNone;
        };
        /**
         * 设置坐标点为参数点
         * @private
         * @param {*} props
         * @param {string} [type='by']
         * @returns {*}
         * @memberof BaseAnimation
         */
        BaseAnimation.prototype.toProps = function (props, type) {
            if (type === void 0) { type = 'by'; }
            var obj = {};
            for (var key in props) {
                var num = props[key];
                if (type == 'by' || key == 'x' || key == 'y') {
                    obj[key] = num > 0 ? '+=' + num : '-=' + Math.abs(num);
                }
                else {
                    obj[key] = '' + num;
                }
            }
            return obj;
        };
        /**
         * 初始化参数坐标点为0
         * @private
         * @param {*} props
         * @param {string} [type='by']
         * @returns {*}
         * @memberof BaseAnimation
         */
        BaseAnimation.prototype.fromProps = function (props, type) {
            if (type === void 0) { type = 'by'; }
            var obj = {};
            for (var key in props) {
                obj[key] = '+=0';
            }
            return obj;
        };
        /**
         * 设置动画信息：设置参数
         * @param {*} props
         * @returns {dragon.IAnimation}
         * @memberof BaseAnimation
         */
        BaseAnimation.prototype.setProps = function (props) {
            this._aniInfoArr.push({ duration: 0, props: props, type: dragon.AniPropsType.SET });
            return this;
        };
        /**
         * 设置动画信息：移除
         * @returns {dragon.IAnimation}
         * @memberof BaseAnimation
         */
        BaseAnimation.prototype.remove = function () {
            this._aniInfoArr.push({ duration: 0, props: [], type: dragon.AniPropsType.REMOVE });
            return this;
        };
        /**
         * 缩放动画
         * @param {number} duration
         * @param {number} scale
         * @param {number} [delay]  延迟时间或者动画播放方式
         * @param {*} [ease]
         * @returns {dragon.IAnimation}
         * @memberof BaseAnimation
         */
        BaseAnimation.prototype.zoom = function (duration, scale, delay, ease) {
            if (is.fun(delay)) {
                ease = delay;
                delay = 0;
            }
            else if (is.falsy(delay)) {
                delay = 0;
            }
            var delayNum = (duration - delay) / 2;
            this.by(delayNum, { scaleX: scale, scaleY: scale }, ease);
            if (delay > 0) {
                this.delay(delay);
            }
            this.by(delayNum, { scaleX: -scale, scaleY: -scale }, ease);
            return this;
        };
        /**
         * 动画播放方式：by
         * @param {number} duration
         * @param {*} props
         * @param {*} [ease]
         * @returns {dragon.IAnimation}
         * @memberof BaseAnimation
         */
        BaseAnimation.prototype.by = function (duration, props, ease) {
            this.mergeEase(props, ease);
            this._aniInfoArr.push({ duration: duration / 1000, props: props, type: dragon.AniPropsType.BY });
            return this;
        };
        /**
         * 动画播放类型：延迟 delay
         * @param {number} time
         * @returns {dragon.IAnimation}
         * @memberof BaseAnimation
         */
        BaseAnimation.prototype.delay = function (duration) {
            this._aniInfoArr.push({ duration: duration / 1000, props: {}, type: dragon.AniPropsType.DELAY });
            return this;
        };
        /**
         * 动画回调
         * @param {Function} callback
         * @param {Object} [context]
         * @param {any} args
         * @returns {dragon.IAnimation}
         * @memberof BaseAnimation
         */
        BaseAnimation.prototype.call = function (callback, context) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            this._aniInfoArr.push({ duration: 0, props: { callback: callback, context: context }, type: dragon.AniPropsType.CALL });
            return this;
        };
        /**
         * 闪烁动画
         * @param {number} duration 动画时间
         * @param {number} blinks   闪烁的次数
         * @param {*} [ease]
         * @returns {dragon.IAnimation}
         * @memberof BaseAnimation
         */
        BaseAnimation.prototype.blink = function (duration, blinks, ease) {
            var delayStep = duration / blinks;
            var vis = true;
            for (var i = 0; i < blinks; i++) {
                this.delay(delayStep);
                this.setProps({ visible: vis });
                vis = !vis;
            }
            return this;
        };
        /**
         * 淡入淡出动画
         * @param {number} duration
         * @param {*} [ease]
         * @returns {dragon.IAnimation}
         * @memberof BaseAnimation
         */
        BaseAnimation.prototype.fadeInOut = function (duration, ease) {
            this.to(duration / 2, { alpha: 0 }, ease);
            this.to(duration / 2, { alpha: 1 }, ease);
            return this;
        };
        /**
         * 播放动画
         * @param {*} [target=this._target]
         * @param {boolean} [isLoop]
         * @returns {dragon.IAnimation}
         * @memberof BaseAnimation
         */
        BaseAnimation.prototype.run = function (target, isLoop) {
            var _this = this;
            if (target === void 0) { target = this._target; }
            BaseAnimation.addAnimation(target, this);
            if (isLoop) {
                this._timeLine.repeat(-1);
            }
            for (var i = 0; i < this._aniInfoArr.length; i++) {
                var info = this._aniInfoArr[i];
                var type = info.type;
                switch (type) {
                    case dragon.AniPropsType.DELAY://延迟动画
                        this._timeLine.to(target, info.duration, {});
                        break;
                    case dragon.AniPropsType.SET://参数设置
                        this._timeLine.set(target, info.props);
                        break;
                    case dragon.AniPropsType.BY://运动
                        this._timeLine.fromTo(target, info.duration, this.fromProps(info.props), this.toProps(info.props));
                        break;
                    case dragon.AniPropsType.REMOVE://移除
                        this._timeLine.call(function () {
                            if (target && target.parent) {
                                target.parent.remove(target);
                            }
                        });
                        break;
                    case dragon.AniPropsType.CALL://回调
                        var callback = info.props['callback'];
                        var context = info.props['context'];
                        if (callback) {
                            this._timeLine.call(callback.call(context));
                        }
                        break;
                    default:
                        this._timeLine.to(target, info.duration, info.props);
                        break;
                }
            }
            if (!isLoop) {
                this._timeLine.call(function () {
                    BaseAnimation.removeAnimation(target, _this);
                });
            }
            this._isRunning = true;
            return this;
        };
        BaseAnimation.prototype.shake = function (duration, offsetX, offestY, ease) {
            return null;
        };
        BaseAnimation.prototype.score = function (duration, beginScore, endScore, ease) {
            return null;
        };
        /**
         * 停止动画（进度设置为1表示完成）
         * @memberof BaseAnimation
         */
        BaseAnimation.prototype.stop = function () {
            this._timeLine.totalProgress(1);
            BaseAnimation.removeAnimation(this.target, this);
        };
        BaseAnimation.prototype.pause = function () {
            this._timeLine.pause();
        };
        BaseAnimation.prototype.resume = function () {
            this._timeLine.resume();
        };
        BaseAnimation.prototype.destroy = function () {
            this._timeLine.kill();
            this._timeLine = null;
            this._target = null;
        };
        /**
         * 给目标添加动画
         * @static
         * @param {*} target
         * @param {dragon.IAnimation} animation
         * @memberof BaseAnimation
         */
        BaseAnimation.addAnimation = function (target, animation) {
            if (!target.$__aniId_) {
                target.$__aniId_ = this._aniId++;
            }
            if (!this._aniMap.hasOwnProperty(target.$__aniId_)) {
                this._aniMap[target.$__aniId_] = [];
            }
            this._aniMap[target.$__aniId_].push(animation);
        };
        /**
         * 移除动画目标
         * @static
         * @param {*} target
         * @param {dragon.IAnimation} animation
         * @memberof BaseAnimation
         */
        BaseAnimation.removeAnimation = function (target, animation) {
            if (!target && target.$__aniId_) {
                var arr = this._aniMap[target.$__aniId_];
                if (arr && arr.length > 0) {
                    var idx = arr.indexOf(animation);
                    if (idx > -1) {
                        animation.destroy();
                        arr.splice(idx, 1);
                    }
                    if (!arr.length) {
                        delete this._aniMap[target.$__aniId_];
                    }
                }
            }
        };
        /**
         * 停止目标动画
         * @static
         * @param {*} target
         * @param {boolean} [remove=true] 是否移除动画
         * @memberof BaseAnimation
         */
        BaseAnimation.stopAnimationByTarget = function (target, remove) {
            if (remove === void 0) { remove = true; }
            if (target && target.$__aniId_) {
                var arr = this._aniMap[target.$__aniId_];
                if (arr && arr.length) {
                    if (remove) {
                        while (arr.length) {
                            arr.shift().stop();
                        }
                        delete this._aniMap[target.$__aniId_];
                    }
                    else {
                        this.pauseAnimationByTarget(target);
                    }
                }
            }
        };
        /**
         * 暂停目标动画
         * @static
         * @param {*} target
         * @memberof BaseAnimation
         */
        BaseAnimation.pauseAnimationByTarget = function (target) {
            if (target && target.$__aniId_) {
                var arr = this._aniMap[target.$__aniId_];
                if (arr && arr.length) {
                    for (var i = 0; i < arr.length; i++) {
                        var item = arr[i];
                        item.pause();
                    }
                }
            }
        };
        /**
         * 重启目标动画
         * @static
         * @param {*} target
         * @memberof BaseAnimation
         */
        BaseAnimation.resumeAnimationByTarget = function (target) {
            if (target && target.$__aniId_) {
                var arr = this._aniMap[target.$__aniId_];
                if (arr && arr.length) {
                    for (var i = 0; i < arr.length; i++) {
                        var item = arr[i];
                        item.resume();
                    }
                }
            }
        };
        /**
         * 移除目标动画
         * @static
         * @param {*} target
         * @memberof BaseAnimation
         */
        BaseAnimation.removeAnimationByTarget = function (target) {
            if (target && target.$__aniId_) {
                var arr = this._aniMap[target.$__aniId_];
                if (arr && arr.length) {
                    while (arr.length) {
                        arr.shift().destroy();
                    }
                    delete this._aniMap[target.$__aniId_];
                }
            }
        };
        BaseAnimation.by = function (duration, props, ease) {
            return new BaseAnimation().by(duration, props, ease);
        };
        BaseAnimation.to = function (duration, props, ease) {
            return new BaseAnimation().to(duration, props, ease);
        };
        BaseAnimation.call = function (callback, context) {
            return new BaseAnimation().call(callback, context);
        };
        BaseAnimation._aniMap = []; //存储动画目标与动画对象
        BaseAnimation._aniId = 1; //动画Id
        return BaseAnimation;
    }());
    dragon.BaseAnimation = BaseAnimation;
})(dragon || (dragon = {}));
/**
 * @author Andrew_Huang
 */
var dragon;
(function (dragon) {
    /**
     * 弹框动画基类（可以继承该类自行实现自定义动画）
     * @export
     * @class BoxAnimation
     * @implements {dragon.IUIAnimation}
     */
    var BaseBoxAnimation = /** @class */ (function () {
        function BaseBoxAnimation() {
        }
        Object.defineProperty(BaseBoxAnimation.prototype, "displayObject", {
            get: function () {
                return this._displayObject;
            },
            set: function (value) {
                this._displayObject = value;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 指定弹框动画
         * @private
         * @param {IUIAnimationCallback} callback 回调函数
         * @param {Function} boxAnimation         弹框动画
         * @param {Function} maskAnimation        遮罩动画
         * @memberof BoxAnimation
         */
        BaseBoxAnimation.prototype.runAnimation = function (callback, boxAnimation, maskAnimation) {
            var box = this._displayObject.getAnimationDisplay(dragon.UI_TYPE.BOX);
            var mask = this._displayObject.getAnimationDisplay(dragon.UI_TYPE.MASK);
            var aniArr = [];
            if (box) {
                var showBoxAnimation = boxAnimation.call(this, box);
                if (showBoxAnimation) {
                    aniArr.push(showBoxAnimation);
                }
            }
            if (mask) {
                var showMaskAnimation = maskAnimation.call(this, mask);
                if (showMaskAnimation) {
                    aniArr.push(showMaskAnimation);
                }
            }
            if (!aniArr.length) {
                if (callback) {
                    callback();
                }
            }
            else {
                for (var i = 0; i < aniArr.length; i++) {
                    if (i == 0) {
                        aniArr[i].call(callback);
                    }
                    if (!aniArr[i].isRunning) {
                        aniArr[i].run();
                    }
                }
            }
        };
        BaseBoxAnimation.prototype.show = function (callback) {
            this.runAnimation(callback, this.getShowBoxAnimation, this.getShowMaskAnimation);
        };
        BaseBoxAnimation.prototype.close = function (callback) {
            this.runAnimation(callback, this.getCloseBoxAnimation, this.getCloseMaskAnimation);
        };
        /**
         * 弹框显示动画
         * @param {*} box
         * @returns {dragon.IAnimation}
         * @memberof BoxAnimation
         */
        BaseBoxAnimation.prototype.getShowBoxAnimation = function (box) {
            return null;
        };
        /**
         * 遮罩显示动画
         * @param {*} mask
         * @returns {dragon.IAnimation}
         * @memberof BoxAnimation
         */
        BaseBoxAnimation.prototype.getShowMaskAnimation = function (mask) {
            return null;
        };
        /**
         * 弹框关闭动画
         * @param {*} box
         * @returns {dragon.IAnimation}
         * @memberof BoxAnimation
         */
        BaseBoxAnimation.prototype.getCloseBoxAnimation = function (box) {
            return null;
        };
        /**
         * 遮罩关闭动画
         * @param {*} mask
         * @returns {dragon.IAnimation}
         * @memberof BoxAnimation
         */
        BaseBoxAnimation.prototype.getCloseMaskAnimation = function (mask) {
            return null;
        };
        return BaseBoxAnimation;
    }());
    dragon.BaseBoxAnimation = BaseBoxAnimation;
})(dragon || (dragon = {}));
/**
 * @author Andrew_Huang
 */
var dragon;
(function (dragon) {
    /**
     * 动画信息类型
     * @export
     * @enum {number}
     */
    var AniPropsType;
    (function (AniPropsType) {
        AniPropsType[AniPropsType["DELAY"] = 1] = "DELAY";
        AniPropsType[AniPropsType["SET"] = 2] = "SET";
        AniPropsType[AniPropsType["BY"] = 3] = "BY";
        AniPropsType[AniPropsType["REMOVE"] = 4] = "REMOVE";
        AniPropsType[AniPropsType["CALL"] = 5] = "CALL";
    })(AniPropsType = dragon.AniPropsType || (dragon.AniPropsType = {}));
})(dragon || (dragon = {}));
/**
 * @author Andrew_Huang
 * UI动画相关接口
 */
var dragon;
(function (dragon) {
    /**
     * UI类型
     * @export
     * @enum {number}
     */
    var UI_TYPE;
    (function (UI_TYPE) {
        UI_TYPE["BOX"] = "box";
        UI_TYPE["MASK"] = "mask"; //遮罩
    })(UI_TYPE = dragon.UI_TYPE || (dragon.UI_TYPE = {}));
    /**
     * UI 动画进入方向
     * @export
     * @enum {number}
     */
    var ANI_UI_DIRECTION;
    (function (ANI_UI_DIRECTION) {
        ANI_UI_DIRECTION[ANI_UI_DIRECTION["FROM_RIGT"] = 1] = "FROM_RIGT";
        ANI_UI_DIRECTION[ANI_UI_DIRECTION["FROM_LEFT"] = 2] = "FROM_LEFT";
        ANI_UI_DIRECTION[ANI_UI_DIRECTION["FROM_TOP"] = 3] = "FROM_TOP";
        ANI_UI_DIRECTION[ANI_UI_DIRECTION["FROM_BOTTOM"] = 4] = "FROM_BOTTOM";
    })(ANI_UI_DIRECTION = dragon.ANI_UI_DIRECTION || (dragon.ANI_UI_DIRECTION = {}));
})(dragon || (dragon = {}));
/**
 * @author Andrew_Huang
 */
var dragon;
(function (dragon) {
    /**
     * 普通UI动画（关闭和开启自定义）
     * @export
     * @class NoneAnimation
     * @implements {dragon.IUIAnimation}
     */
    var NoneAnimation = /** @class */ (function () {
        function NoneAnimation() {
        }
        Object.defineProperty(NoneAnimation.prototype, "displayObject", {
            get: function () {
                return this._displayObject;
            },
            set: function (value) {
                this._displayObject = value;
            },
            enumerable: true,
            configurable: true
        });
        NoneAnimation.prototype.show = function (callback) {
            if (callback) {
                callback();
            }
        };
        NoneAnimation.prototype.close = function (callback) {
            if (callback) {
                callback();
            }
        };
        return NoneAnimation;
    }());
    dragon.NoneAnimation = NoneAnimation;
})(dragon || (dragon = {}));
/**
 * @author Andrew_Huang
 */
var dragon;
(function (dragon) {
    /**
     * 弹框动画2：缩放式
     * @export
     * @class BoxBounceAnimation
     * @extends {dragon.BaseBoxAnimation}
     */
    var BoxBounceAnimation = /** @class */ (function (_super) {
        __extends(BoxBounceAnimation, _super);
        function BoxBounceAnimation() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        BoxBounceAnimation.prototype.getShowBoxAnimation = function (box) {
            box.scaleX = box.scaleY = 0;
            box.alpha = 0;
            dragon.BaseAnimation.removeAnimationByTarget(box);
            return dragon.BaseAnimation.to(300, { scaleX: 1, scaleY: 1, alpha: 1 }, Back.easeInOut).run(box);
        };
        BoxBounceAnimation.prototype.getShowMaskAnimation = function (mask) {
            var alpha = mask.alpha ? mask.alpha : 0.6;
            mask.alpha = 0;
            return dragon.BaseAnimation.to(300, { alpha: alpha }).run(mask);
        };
        BoxBounceAnimation.prototype.getCloseBoxAnimation = function (box) {
            dragon.BaseAnimation.removeAnimationByTarget(box);
            return dragon.BaseAnimation.to(300, { scaleX: 0, scaleY: 0, alpha: 0 }, Back.easeIn).run(box);
        };
        BoxBounceAnimation.prototype.getCloseMaskAnimation = function (mask) {
            return dragon.BaseAnimation.to(300, { alpha: 0 }).run(mask);
        };
        return BoxBounceAnimation;
    }(dragon.BaseBoxAnimation));
    dragon.BoxBounceAnimation = BoxBounceAnimation;
})(dragon || (dragon = {}));
/**
 * @author Andrew_Huang
 */
var dragon;
(function (dragon) {
    /**
     * 弹框动画1：透明度变化，从中间放大显示
     * @export
     * @class BoxNormalAnimation
     * @extends {dragon.BaseBoxAnimation}
     */
    var BoxNormalAnimation = /** @class */ (function (_super) {
        __extends(BoxNormalAnimation, _super);
        function BoxNormalAnimation() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        BoxNormalAnimation.prototype.getShowBoxAnimation = function (box) {
            box.scaleX = box.scaleY = 0;
            box.alpha = 0;
            dragon.BaseAnimation.removeAnimationByTarget(box);
            return dragon.BaseAnimation.to(150, { alpha: 1, scaleX: 1, scaleY: 1 }).run(box);
        };
        BoxNormalAnimation.prototype.getShowMaskAnimation = function (mask) {
            var alpha = mask.alpha ? mask.alpha : 0.6;
            mask.alpha = 0;
            return dragon.BaseAnimation.to(150, { alpha: alpha }).run(mask);
        };
        return BoxNormalAnimation;
    }(dragon.BaseBoxAnimation));
    dragon.BoxNormalAnimation = BoxNormalAnimation;
})(dragon || (dragon = {}));
/**
 * @author Andrew_Huang
 */
var dragon;
(function (dragon) {
    /**
     * UI 动画：左右切换
     * @export
     * @class UILeftRightAnimation
     * @implements {dragon.IUIAnimation}
     */
    var UILeftRightAnimation = /** @class */ (function () {
        function UILeftRightAnimation(callback, context) {
            if (callback === void 0) { callback = null; }
            if (context === void 0) { context = null; }
            this._width = dragon.stage.width; //UI 高度
            this._direct = dragon.ANI_UI_DIRECTION.FROM_RIGT; //默认初始方向
            this._width = dragon.stage.width;
            this._callback = callback;
        }
        Object.defineProperty(UILeftRightAnimation.prototype, "displayObject", {
            get: function () {
                return this._displayObject;
            },
            set: function (value) {
                this._displayObject = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UILeftRightAnimation.prototype, "direct", {
            set: function (value) {
                this._direct = value;
            },
            enumerable: true,
            configurable: true
        });
        UILeftRightAnimation.prototype.show = function (callback) {
            var displayObject = this.displayObject.getAnimationDisplay();
            dragon.BaseAnimation.removeAnimationByTarget(displayObject);
            displayObject.x = this.getOffsetByDirect();
            if (this._callback) {
                callback = this._callback;
            }
            if (callback) {
                dragon.BaseAnimation.to(200, { x: 0 }, Back.easeOut).call(callback, this).run(displayObject);
            }
            else {
                dragon.BaseAnimation.to(200, { x: 0 }, Back.easeOut).run(displayObject);
            }
        };
        UILeftRightAnimation.prototype.close = function (callback) {
            var displayObject = this.displayObject.getAnimationDisplay();
            dragon.BaseAnimation.removeAnimationByTarget(displayObject);
            var aimX = -this.getOffsetByDirect();
            dragon.BaseAnimation.to(200, { x: aimX }, Back.easeOut).call(callback, this).run(displayObject);
        };
        UILeftRightAnimation.prototype.getOffsetByDirect = function () {
            if (this._direct == dragon.ANI_UI_DIRECTION.FROM_RIGT) {
                return this._width;
            }
            else if (this._direct == dragon.ANI_UI_DIRECTION.FROM_LEFT) {
                return -this._width;
            }
        };
        return UILeftRightAnimation;
    }());
    dragon.UILeftRightAnimation = UILeftRightAnimation;
})(dragon || (dragon = {}));
/**
 * @author Andrew_Huang
 */
var dragon;
(function (dragon) {
    /**
     * UI 动画：上下切换
     * @export
     * @class UILeftRightAnimation
     * @implements {dragon.IUIAnimation}
     */
    var UITopBottomAnimation = /** @class */ (function () {
        function UITopBottomAnimation(callback, context) {
            if (callback === void 0) { callback = null; }
            if (context === void 0) { context = null; }
            this._height = dragon.stage.height; //UI 宽度
            this._direct = dragon.ANI_UI_DIRECTION.FROM_TOP; //默认初始方向
            this._height = dragon.stage.width;
            this._callback = callback;
        }
        Object.defineProperty(UITopBottomAnimation.prototype, "displayObject", {
            get: function () {
                return this._displayObject;
            },
            set: function (value) {
                this._displayObject = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UITopBottomAnimation.prototype, "direct", {
            set: function (value) {
                this._direct = value;
            },
            enumerable: true,
            configurable: true
        });
        UITopBottomAnimation.prototype.show = function (callback) {
            var displayObject = this.displayObject.getAnimationDisplay();
            dragon.BaseAnimation.removeAnimationByTarget(displayObject);
            displayObject.x = this.getOffsetByDirect();
            if (this._callback) {
                callback = this._callback;
            }
            if (callback) {
                dragon.BaseAnimation.to(200, { y: 0 }, Back.easeOut).call(callback, this).run(displayObject);
            }
            else {
                dragon.BaseAnimation.to(200, { y: 0 }, Back.easeOut).run(displayObject);
            }
        };
        UITopBottomAnimation.prototype.close = function (callback) {
            var displayObject = this.displayObject.getAnimationDisplay();
            dragon.BaseAnimation.removeAnimationByTarget(displayObject);
            var aimY = -this.getOffsetByDirect();
            dragon.BaseAnimation.to(200, { y: aimY }, Back.easeOut).call(callback, this).run(displayObject);
        };
        UITopBottomAnimation.prototype.getOffsetByDirect = function () {
            if (this._direct == dragon.ANI_UI_DIRECTION.FROM_TOP) {
                return -this._height;
            }
            else if (this._direct == dragon.ANI_UI_DIRECTION.FROM_BOTTOM) {
                return this._height;
            }
        };
        return UITopBottomAnimation;
    }());
    dragon.UITopBottomAnimation = UITopBottomAnimation;
})(dragon || (dragon = {}));
var dragon;
(function (dragon) {
    /**
     * A星寻路入口
     * @author 黄灿滨
     * @export
     * @class Start
     */
    var AStartMain = /** @class */ (function () {
        function AStartMain() {
            //测试地图数据
            this.array = [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1],
                [1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1],
                [1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1],
                [1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            ];
        }
        /**
         * 根据地图数据、起始坐标和终点坐标获取寻路路径点列表
         * @param {*} mapArray
         * @param {number} startX
         * @param {number} startY
         * @param {number} endX
         * @param {number} endY
         * @returns {Array<egret.Point>}
         * @memberof AStartMain
         */
        AStartMain.prototype.getPathPointList = function (mapArray, startX, startY, endX, endY) {
            var pointList = [];
            var aStart = new AStart(mapArray);
            var start = new dragon.Point(startX, startY);
            var end = new dragon.Point(endX, endY);
            var parent = aStart.findPath(start, end);
            while (parent) {
                var point = new egret.Point(parent.X, parent.Y);
                pointList.push(point);
                parent = parent.parentPoint;
            }
            return pointList.reverse();
        };
        return AStartMain;
    }());
    dragon.AStartMain = AStartMain;
    /**
     * A星寻路
     * @author 黄灿滨
     * @export
     * @class AStart
     */
    var AStart = /** @class */ (function () {
        function AStart(array, oblique, step) {
            if (oblique === void 0) { oblique = 14; }
            if (step === void 0) { step = 10; }
            this.mapArray = array;
            this.OBLIQUE = oblique;
            this.STEP = step;
            this.initList();
        }
        /**
         * 初始化数据
         * @private
         * @memberof AStart
         */
        AStart.prototype.initList = function () {
            this.OpenList = [];
            this.CloseList = [];
        };
        /**
         * 路径寻找
         * @param {Point} startPoint        开始点
         * @param {Point} endPoint          结束点
         * @param {boolean} IsIngnoreCorner 是否忽略在角落的
         * @returns {Point}
         * @memberof AStart
         */
        AStart.prototype.findPath = function (startPoint, endPoint, IsIngnoreCorner) {
            if (IsIngnoreCorner === void 0) { IsIngnoreCorner = false; }
            this.OpenList.push(startPoint);
            while (this.OpenList.length) {
                //找出 F 值最小的店tempStart（作为下面所有相邻点的父节点）
                var tempStart = dragon.PointListHelp.MinPoint(this.OpenList);
                this.CloseList.push(tempStart);
                //找出它的相邻节点（8个点）
                var surroundPoints = this.SurroundPoints(tempStart, IsIngnoreCorner);
                for (var i in surroundPoints) {
                    var item = surroundPoints[i];
                    if (dragon.PointListHelp.pointIsExistInList(this.OpenList, item)) {
                        //在开启列表中
                        //计算G值，如果比原来的大，就什么都不做，否则设置它的父节点为当前点，并更新 G 和 F 的值
                        this.findPointInOpenList(tempStart, item);
                    }
                    else {
                        //如果它们不在开启列表里，就加入，并设置父节点，并计算G、H 和 F 的值
                        this.notFindPointInOpenList(tempStart, endPoint, item);
                    }
                }
                if (dragon.PointListHelp.getPoint(this.OpenList, endPoint)) {
                    return dragon.PointListHelp.getPoint(this.OpenList, endPoint);
                }
            }
            return dragon.PointListHelp.getPoint(this.OpenList, endPoint);
        };
        /**
         * 找出与 point 点相邻的8个节点
         * @private
         * @param {Point} point
         * @param {boolean} IsIngnoreCorner
         * @returns {Array<Point>}
         * @memberof AStart
         */
        AStart.prototype.SurroundPoints = function (point, IsIngnoreCorner) {
            var surroundPoint = [];
            for (var x = point.X - 1; x <= point.X + 1; x++) {
                for (var y = point.Y - 1; y <= point.Y + 1; y++) {
                    if (this.canReach(point, x, y, IsIngnoreCorner)) {
                        var targetPoint = new dragon.Point(x, y);
                        surroundPoint.push(targetPoint);
                    }
                }
            }
            return surroundPoint;
        };
        /**
         * (x,y)点是否可以到达
         * @private
         * @param {Point} start
         * @param {number} x
         * @param {number} y
         * @param {Boolean} IsIngnoreCorner
         * @returns {boolean}
         * @memberof AStart
         */
        AStart.prototype.canReach = function (start, x, y, IsIngnoreCorner) {
            if (!this.notObstacles(x, y) || dragon.PointListHelp.xyIsExistInList(this.CloseList, x, y)) {
                //是障碍物，或者在关闭列表中，为不能到达的点
                return false;
            }
            //不是障碍物，也不在关闭列表中（关闭列表中的点不再进行检查），属于正常需要检查的点
            if (Math.abs(x - start.X) + Math.abs(y - start.Y) == 1) {
                return true;
            }
            else {
                //如果是斜方向，判断是否是'绊脚'
                //(方法：判断当前点横坐标的后一个点和纵坐标的后一个点不是障碍物，则该斜方向即可行走)
                if (this.notObstacles(Math.abs(x - 1), y) && this.notObstacles(x, Math.abs(y - 1))) {
                    return true;
                }
                return IsIngnoreCorner;
            }
        };
        /**
         * 是否为障碍物（0：不是障碍物；1：障碍物）
         * @private
         * @param {number} x
         * @param {number} y
         * @returns {boolean}
         * @memberof AStart
         */
        AStart.prototype.notObstacles = function (x, y) {
            return this.mapArray[y][x] == 0;
        };
        /**
         * 在开启列表中找到点，更新 G 和 F 的值，如果计算出来的 G 值比原来小，则更新父节点，并重新计算 G 值和 F 值
         * @private
         * @param {Point} tempStart 父节点
         * @param {Point} point     子节点（周围的8个可以到达节点之一）
         * @memberof AStart
         */
        AStart.prototype.findPointInOpenList = function (tempStart, point) {
            var G = this.calcG(tempStart, point);
            if (G < point.G) {
                point.parentPoint = tempStart;
                point.G = G;
                point.calcF();
            }
        };
        /**
         * 在开启列表中没找到点，加入到开启列表中，并计算该子节点的 G、H 和 F 的值
         * @private
         * @param {Point} tempStart 父节点
         * @param {Point} end       目标点（终点）
         * @param {Point} point     子节点（周围的8个可以到达的节点之一）
         * @memberof AStart
         */
        AStart.prototype.notFindPointInOpenList = function (tempStart, end, point) {
            point.parentPoint = tempStart;
            point.G = this.calcG(tempStart, point);
            point.H = this.calcH(tempStart, point);
            point.calcF();
            this.OpenList.push(point);
        };
        /**
         * 计算 G：从起点 A 移动到网格上指定方格的移动耗费 (可沿斜方向移动)
         * @private
         * @param {Point} start 父节点
         * @param {Point} point 子节点
         * @returns {number}
         * @memberof AStart
         */
        AStart.prototype.calcG = function (start, point) {
            var G = (Math.abs(point.X - start.X) + Math.abs(point.Y - start.Y)) == 2 ? this.OBLIQUE : this.STEP;
            var parentG = point.parentPoint != null ? point.parentPoint.G : 0;
            return G + parentG;
        };
        /**
         * 计算 H：从指定的方格移动到终点 B 的预计耗费 (H 有很多计算方法, 这里我们设定只可以上下左右移动)
         * @private
         * @param {Point} end   终点
         * @param {Point} point 子节点
         * @returns {number}
         * @memberof AStart
         */
        AStart.prototype.calcH = function (end, point) {
            var step = Math.abs(point.X - end.X) + Math.abs(point.X + end.Y);
            return step * this.STEP;
        };
        return AStart;
    }());
    dragon.AStart = AStart;
})(dragon || (dragon = {}));
var dragon;
(function (dragon) {
    /**
     * 寻路节点
     * @author 黄灿滨
     * @export
     * @class Point
     */
    var Point = /** @class */ (function () {
        function Point(x, y) {
            this.X = x;
            this.Y = y;
        }
        Object.defineProperty(Point.prototype, "parentPoint", {
            get: function () {
                return this._parentPoint;
            },
            set: function (value) {
                this._parentPoint = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Point.prototype, "X", {
            get: function () {
                return this._X;
            },
            set: function (value) {
                this._X = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Point.prototype, "Y", {
            get: function () {
                return this._Y;
            },
            set: function (value) {
                this._Y = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Point.prototype, "F", {
            get: function () {
                return this._F;
            },
            set: function (value) {
                this._F = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Point.prototype, "G", {
            get: function () {
                return this._G;
            },
            set: function (value) {
                this._G = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Point.prototype, "H", {
            get: function () {
                return this._H;
            },
            set: function (value) {
                this._H = value;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 计算总长
         * @memberof Point
         */
        Point.prototype.calcF = function () {
            this.F = this.G + this.H;
        };
        return Point;
    }());
    dragon.Point = Point;
})(dragon || (dragon = {}));
var dragon;
(function (dragon) {
    /**
     * 寻路点辅助工具
     * @author 黄灿滨
     * @export
     * @class PointListHelp
     */
    var PointListHelp = /** @class */ (function () {
        function PointListHelp() {
        }
        /**
         * 点是否在开启列表中
         * @param list
         * @param point
         */
        PointListHelp.pointIsExistInList = function (list, point) {
            for (var i in list) {
                var item = list[i];
                if (item.X == point.X && item.Y == point.Y) {
                    return true;
                }
            }
            return false;
        };
        /**
         * 根据 X 和 Y 坐标，判断是否存在列表中
         * @param {Array<Point>} list
         * @param {number} x
         * @param {number} y
         * @returns {boolean}
         * @memberof PointListHelp
         */
        PointListHelp.xyIsExistInList = function (list, x, y) {
            for (var i in list) {
                var item = list[i];
                if (item.X == x && item.Y == y) {
                    return true;
                }
            }
            return false;
        };
        /**
         * 获取 F 值最小的点，作为下一次检查的父节点
         * @param {Array<Point>} list
         * @returns {Point}
         * @memberof PointListHelp
         */
        PointListHelp.MinPoint = function (list) {
            var pointList = list;
            pointList.sort(function (a, b) {
                return a.F - b.F;
            });
            return pointList.pop();
        };
        /**
         * 添加新的坐标点
         * @param {Array<Point>} list
         * @param {number} x
         * @param {number} y
         * @returns {Point}
         * @memberof PointListHelp
         */
        PointListHelp.addPoint = function (list, x, y) {
            var point = new dragon.Point(x, y);
            list.push(point);
        };
        /**
         * 点列表中是否存在该坐标点
         * @param {Array<Point>} list
         * @param {Point} point
         * @returns {Point}
         * @memberof PointListHelp
         */
        PointListHelp.getPoint = function (list, point) {
            for (var i in list) {
                var item = list[i];
                if (item.X == point.X && point.Y == point.Y) {
                    return item;
                }
            }
            return null;
        };
        /**
         * 从列表中移除坐标点
         * @param {Array<Point>} list
         * @param {number} x
         * @param {number} y
         * @memberof PointListHelp
         */
        PointListHelp.removePointFromList = function (list, x, y) {
            for (var i in list) {
                var point = list[i];
                if (point.X == x && point.Y == y) {
                    list.splice(parseInt(i), 1);
                }
            }
        };
        return PointListHelp;
    }());
    dragon.PointListHelp = PointListHelp;
})(dragon || (dragon = {}));
var dragon;
(function (dragon) {
    var BaseComponent = /** @class */ (function () {
        function BaseComponent() {
        }
        return BaseComponent;
    }());
    dragon.BaseComponent = BaseComponent;
})(dragon || (dragon = {}));
/**
 * 配置数据操作
 * @author Andrew_Huang
 */
var dragon;
(function (dragon) {
    var Config = /** @class */ (function () {
        function Config() {
            this._configMap = {};
        }
        /**
         * 获取配置数据
         * @template T
         * @param {string} name
         * @param {string} key
         * @param {T} defaultValue
         * @returns {T}
         * @memberof Config
         */
        Config.prototype.getConfig = function (name, key, defaultValue) {
            this.addConfData();
            if (is.nul(key)) {
                return this._configMap[name] || defaultValue;
            }
            var ret = defaultValue;
            if (this._configMap.hasOwnProperty(name) && !is.nul(key)) {
                ret = dragon.Obj.getValue(this._configMap[name], key, defaultValue);
            }
            return ret;
        };
        /**
         * 判断key值的数据是否存在name的配置数据中
         * @param {string} name
         * @param {string} key
         * @returns {boolean}
         * @memberof Config
         */
        Config.prototype.exists = function (name, key) {
            this.addConfData();
            if (this._configMap.hasOwnProperty(name)) {
                if (dragon.Obj.hasValue(this._configMap[name], key)) {
                    return true;
                }
            }
            return false;
        };
        Config.prototype.addConfData = function () {
            if (!this._configMap.hasOwnProperty(name)) {
                var data = RES.getRes(name);
                if (data) {
                    this._configMap[name] = data;
                }
            }
        };
        Config.exists = function (name, key) {
            return dragon.singleton(Config).exists(name, key);
        };
        /**
         * 获取配置数据
         * @static
         * @param {string} name
         * @param {string} [key=null]
         * @param {*} [defaultValue=null]
         * @returns {*}
         * @memberof Config
         */
        Config.get = function (name, key, defaultValue) {
            if (key === void 0) { key = null; }
            if (defaultValue === void 0) { defaultValue = null; }
            return dragon.singleton(Config).getConfig(name, key, defaultValue);
        };
        return Config;
    }());
    dragon.Config = Config;
})(dragon || (dragon = {}));
/**
 * @author Andrew_Huang
 */
var dragon;
(function (dragon) {
    /**
     * 游戏常用的平台、运行环境参数
     * @export
     * @class ExtraInfo
     */
    var ExtraInfo = /** @class */ (function () {
        function ExtraInfo() {
            this._spid = egret.getOption('egret.runtime.spid');
            this._version = egret.getOption('fv');
            this._platform = egret.getOption('pf') || 'ND';
            this._bench = egret.getOption('gv') || 'local';
            this._oplayerId = egret.getOption("oplayerId");
            this._channel = egret.getOption("channelTag");
            this._runtime = egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE;
        }
        Object.defineProperty(ExtraInfo.prototype, "spid", {
            get: function () {
                return this._spid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtraInfo.prototype, "platform", {
            get: function () {
                return this._platform;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtraInfo.prototype, "version", {
            get: function () {
                return this._version;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtraInfo.prototype, "bench", {
            get: function () {
                return this._bench;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtraInfo.prototype, "oplayerId", {
            get: function () {
                return this._oplayerId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtraInfo.prototype, "channel", {
            get: function () {
                return this._channel;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtraInfo.prototype, "runtime", {
            get: function () {
                return this._runtime;
            },
            enumerable: true,
            configurable: true
        });
        return ExtraInfo;
    }());
    dragon.ExtraInfo = ExtraInfo;
    var __extra = null;
    dragon.define(dragon, 'extra', function () {
        if (!__extra) {
            __extra = new ExtraInfo();
        }
        return __extra;
    });
})(dragon || (dragon = {}));
/**
 * 游戏框架的基础配置设置
 * @author Andrew_Huang
 */
var dragon;
(function (dragon) {
    /**
     * 数据配置设置（项目）
     * @export
     * @class Setting
     * @implements {ISetting}
     */
    var Setting = /** @class */ (function () {
        function Setting() {
        }
        Setting.prototype.getAnimation = function (animation) {
            if (animation) {
                return animation;
            }
            return "NoneAnimation";
        };
        Object.defineProperty(Setting.prototype, "SimpleLoadingClass", {
            get: function () {
                return this._setting.SimpleLoadingClass;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Setting.prototype, "LoadSceneClass", {
            get: function () {
                return this._setting.LoadSceneClass;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Setting.prototype, "TooltipClass", {
            get: function () {
                return this._setting.TooltipClass;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Setting.prototype, "AnimationBlueprint", {
            get: function () {
                return this._setting.AnimationBlueprint;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Setting.prototype, "ProgressLoadingClass", {
            get: function () {
                return this._setting.ProgressLoadingClass;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Setting.prototype, "GameCallbackClass", {
            get: function () {
                return this._setting.GameCallbackClass;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Setting.prototype, "BoxClass", {
            get: function () {
                return this._setting.BoxClass;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Setting.prototype, "ConfirmClass", {
            get: function () {
                return this._setting.ConfirmClass;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Setting.prototype, "SceneAnimation", {
            get: function () {
                return this.getAnimation(this._setting.SceneAnimation);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Setting.prototype, "PanelAnimation", {
            get: function () {
                return this.getAnimation(this._setting.PanelAnimation);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Setting.prototype, "ItemModelClass", {
            get: function () {
                return this._setting.ItemModelClass;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Setting.prototype, "BoxAnimation", {
            get: function () {
                return this.getAnimation(this._setting.BoxAnimation);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Setting.prototype, "ProjectName", {
            get: function () {
                return this._setting.ProjectName;
            },
            enumerable: true,
            configurable: true
        });
        Setting.prototype.init = function (setting) {
            this._setting = setting;
            dragon.LocalStorage.setPrefix(this._setting.ProjectName + "-" + dragon.extra.spid);
        };
        /**
         * 初始化游戏在项目层级上的配置数据
         * @static
         * @param {*} config
         * @memberof Setting
         */
        Setting.init = function (config) {
            var gameConf = dragon.Obj.getValue(config, "GameConfig");
            dragon.singleton(Setting).init(gameConf);
            var modules = dragon.Obj.getValue(config, "Modules");
            for (var key in modules) {
                var moduleVal = modules[key];
                var className = moduleVal["Setting"];
                if (className) {
                    var definition = egret.getDefinitionByName(className);
                    if (definition) {
                        definition.init(moduleVal["Property"]);
                    }
                }
            }
        };
        return Setting;
    }());
    dragon.Setting = Setting;
    function getSetting() {
        return dragon.singleton(Setting);
    }
    dragon.getSetting = getSetting;
})(dragon || (dragon = {}));
/**
 * @author Andrew_Huang
 */
var dragon;
(function (dragon) {
    /**
     * 基础事件通知
     * 存储流程：事件名 -> 作用域 -> 事件
     * @export
     * @class BaseNotice
     */
    var BaseNotice = /** @class */ (function () {
        function BaseNotice() {
            this._nameObs = {}; //事件存储器
        }
        /**
         * 添加事件通知
         * @param {string} name
         * @param {(...args) => any} callback
         * @param {Object} context
         * @param {number} [priority=0]
         * @returns {*}
         * @memberof BaseNotice
         */
        BaseNotice.prototype.addObserver = function (name, callback, context, priority) {
            if (priority === void 0) { priority = 0; }
            var typeId = dragon.getTypeId(context);
            if (!this._nameObs.hasOwnProperty(name)) {
                this._nameObs[name] = {};
            }
            var obsObj = this._nameObs[name];
            if (!obsObj.hasOwnProperty(typeId)) {
                obsObj[typeId] = [];
            }
            var obj = { name: name, callback: callback, context: context, priority: priority };
            obsObj[typeId].push(obj);
            obsObj[typeId] = obsObj[typeId].sort(function (a, b) {
                return b.priority - a.priority;
            });
            return obj;
        };
        /**
         * 事件只执行一次后自动删除
         * @param {string} name
         * @param {Function} callback
         * @param {Object} context
         * @param {number} [priority=0]
         * @returns {*}
         * @memberof BaseNotice
         */
        BaseNotice.prototype.onceObserver = function (name, callback, context, priority) {
            var _this = this;
            if (priority === void 0) { priority = 0; }
            var result;
            var obj = function () {
                if (callback) {
                    callback.call(context);
                }
                _this.removeObserverByInfo(_this, result);
            };
            result = this.addObserver(name, obj, context, priority);
            return result;
        };
        /**
         * 根据事件名，移除某个作用域下的该事件
         * @param {Object} context
         * @param {NoticeInfo} info
         * @returns {void}
         * @memberof BaseNotice
         */
        BaseNotice.prototype.removeObserverByInfo = function (context, info) {
            if (!dragon.getTypeId(context)) {
                return;
            }
            var obsObj = this._nameObs[info.name];
            var typeId = dragon.getTypeId(context);
            if (obsObj.hasOwnProperty(typeId)) {
                var idx = obsObj[typeId].indexOf(info);
                if (idx > -1) {
                    obsObj[typeId].splice(idx, 1);
                }
            }
        };
        /**
         * 移除事件
         * @param {string} name
         * @param {(...args) => any} callback
         * @param {Object} context
         * @memberof BaseNotice
         */
        BaseNotice.prototype.removeObserver = function (name, callback, context) {
            var observers = this._nameObs[name];
            for (var key in observers) {
                var obs = observers[key];
                dragon.array.remove(obs, function (item) {
                    return item.callback == callback && item.context == context;
                });
            }
        };
        /**
         * 根据作用域移除事件（移除作用域下的所有的事件）
         * @param {Object} context
         * @memberof BaseNotice
         */
        BaseNotice.prototype.removeObserverByObject = function (context) {
            if (!dragon.hasTypeId(context)) {
                return;
            }
            var typeId = dragon.getTypeId(context);
            for (var key in this._nameObs) {
                var obsMap = this._nameObs[key];
                if (obsMap.hasOwnProperty(typeId)) {
                    delete obsMap[typeId];
                }
            }
        };
        /**
         * 根据事件名，移除所有的事件
         * @param {string} name
         * @memberof BaseNotice
         */
        BaseNotice.prototype.removeObserverByName = function (name) {
            if (this._nameObs.hasOwnProperty(name)) {
                delete this._nameObs[name];
            }
        };
        return BaseNotice;
    }());
    dragon.BaseNotice = BaseNotice;
})(dragon || (dragon = {}));
/**
 * @author Andrew_Huang
 */
var dragon;
(function (dragon) {
    /**
     * 事件通知监听，全局方法
     * @export
     * @class Notice
     * @extends {BaseNotice}
     */
    var Notice = /** @class */ (function (_super) {
        __extends(Notice, _super);
        function Notice() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * 发送通知
         * @param {string} name
         * @param {any} args
         * @memberof Notice
         */
        Notice.prototype.postNotice = function (name) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this._postNotice(name, args);
            this._postNotice('ALL', [name].concat(args));
        };
        Notice.prototype._postNotice = function (name, args) {
            var observers = this._nameObs[name];
            if (observers) {
                var arr = [];
                for (var key in observers) {
                    var obsArr = observers[key];
                    arr = arr.concat(obsArr);
                }
                arr.sort(function (a, b) {
                    return b.priority - a.priority;
                });
                for (var i = 0; i < arr.length; i++) {
                    var callback = arr[i].callback;
                    var context = arr[i].context;
                    callback.apply(context, args);
                }
            }
        };
        return Notice;
    }(dragon.BaseNotice));
    dragon.Notice = Notice;
    /**
     * 注册事件通知
     * @export
     * @template T
     * @param {string} name
     * @param {(...args) => any} callback
     * @param {Object} context
     * @param {number} [priority=0]
     */
    function addNotice(name, callback, context, priority) {
        if (priority === void 0) { priority = 0; }
        dragon.singleton(Notice).addObserver(name, callback, context, priority);
    }
    dragon.addNotice = addNotice;
    /**
     * 注册事件通知（通知完后即刻自动移除）
     * @export
     * @param {string} name
     * @param {Function} callback
     * @param {Object} context
     * @param {number} [priority=0]
     */
    function addOnceNotice(name, callback, context, priority) {
        if (priority === void 0) { priority = 0; }
        dragon.singleton(Notice).onceObserver(name, callback, context, priority);
    }
    dragon.addOnceNotice = addOnceNotice;
    /**
     * 移除通知
     * @export
     * @param {string} name
     * @param {(...args) => any} callback
     * @param {Object} context
     */
    function removeNotice(name, callback, context) {
        dragon.singleton(Notice).removeObserver(name, callback, context);
    }
    dragon.removeNotice = removeNotice;
    /**
     * 发送通知
     * @export
     * @param {string} name
     * @param {any} args
     */
    function postNotice(name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        dragon.singleton(Notice).postNotice(name, args);
    }
    dragon.postNotice = postNotice;
    /**
     * 移除指定回调函数的所有事件通知
     * @export
     * @template T
     * @param {T} obj
     */
    function removeNoticeByObject(obj) {
        dragon.singleton(Notice).removeObserverByObject(obj);
    }
    dragon.removeNoticeByObject = removeNoticeByObject;
    /**
     * 移除指定事件名的所有事件通知
     * @export
     * @param {string} name
     */
    function removeNoticeByName(name) {
        dragon.singleton(Notice).removeObserverByName(name);
    }
    dragon.removeNoticeByName = removeNoticeByName;
    /**
     * 移除指定回调函数或者对象的所有事件监听
     * @export
     * @template T
     * @param {T} obj
     */
    function removeNoticeAndPullByObject(obj) {
        dragon.removeNoticeByObject(obj);
        dragon.removePullObjectByObject(obj);
    }
    dragon.removeNoticeAndPullByObject = removeNoticeAndPullByObject;
})(dragon || (dragon = {}));
/**
 * @author Andrew_Huang
 */
var dragon;
(function (dragon) {
    /**
     * 对象拉取监听
     * @export
     * @class PullObject
     * @extends {BaseNotice}
     */
    var PullObject = /** @class */ (function (_super) {
        __extends(PullObject, _super);
        function PullObject() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * 对象事件拉取监听回调
         * @param {string} name
         * @param {any} args
         * @returns {*}
         * @memberof PullObject
         */
        PullObject.prototype.pullObject = function (name) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var result = this._pullObject(name, args, 0);
            args[0] = result;
            result = this._pullObject('ALL', [name].concat(args), 1);
            return result;
        };
        PullObject.prototype._pullObject = function (name, args, idx) {
            if (idx === void 0) { idx = 0; }
            var observers = this._nameObs[name];
            for (var key in observers) {
                var obsArr = observers[key];
                for (var i = 0; i < obsArr.length; i++) {
                    var obs = obsArr[i];
                    var result = obs.callback.call(obs.context, args);
                    if (typeof (result) != 'undefined') {
                        args[idx] = result;
                    }
                }
            }
            return args[idx];
        };
        return PullObject;
    }(dragon.BaseNotice));
    dragon.PullObject = PullObject;
    /**
     * 添加对象拉取监听
     * @export
     * @template T
     * @param {string} name 拉取的对象名
     * @param {(...args) => any} callback
     * @param {T} context
     * @param {number} [private=0]
     */
    function addPullObject(name, callback, context, priority) {
        if (priority === void 0) { priority = 0; }
        dragon.singleton(PullObject).addObserver(name, callback, context, priority);
    }
    dragon.addPullObject = addPullObject;
    /**
     * 移除对象拉取监听
     * @export
     * @template T
     * @param {string} name
     * @param {(...args) => any} callback
     * @param {T} context
     */
    function removePullObject(name, callback, context) {
        dragon.singleton(PullObject).removeObserver(name, callback, context);
    }
    dragon.removePullObject = removePullObject;
    /**
     * 拉取对象
     * @export
     * @template T
     * @param {string} name
     * @param {any} args
     * @returns {T}
     */
    function pullObject(name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return (_a = dragon.singleton(PullObject)).pullObject.apply(_a, [name].concat(args));
        var _a;
    }
    dragon.pullObject = pullObject;
    /**
     * 移除指定对象所有的拉取对象监听
     * @export
     * @template T
     * @param {T} context
     */
    function removePullObjectByObject(context) {
        dragon.singleton(PullObject).removeObserverByObject(context);
    }
    dragon.removePullObjectByObject = removePullObjectByObject;
    /**
     * 移除指定侦听名的所有拉取对象侦听
     * @param name 待移除侦听的名称
     */
    function removePullObjectByName(name) {
        dragon.singleton(PullObject).removeObserverByName(name);
    }
    dragon.removePullObjectByName = removePullObjectByName;
})(dragon || (dragon = {}));
/**
 * @author Andrew_Huang
 */
var dragon;
(function (dragon) {
    /**
     * 对象池
     * @export
     * @class Pool
     * @template T
     */
    var Pool = /** @class */ (function () {
        function Pool(type) {
            this._totalArr = []; //总的对象组列表
            this._useArr = []; //正在使用的对象组列表
            this._leftArr = []; //剩余可以使用的对象组列表
            this._type = type;
        }
        /**
         * 回收对象，当不需要使用对象池创建的对象时，使用该方法回收
         * @param {T} inst
         * @memberof Pool
         */
        Pool.prototype.push = function (inst) {
            dragon.array.remove(this._useArr, inst);
            if (this._leftArr.indexOf(inst) == -1) {
                this._leftArr.push(inst);
            }
        };
        /**
         * 拉取对象，如果对象池不存在任何可供使用的对象，则会创建出新的对象
         * @param {any} args
         * @returns {T}
         * @memberof Pool
         */
        Pool.prototype.pop = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (!this._leftArr.length) {
                var inst = new this._type();
                this._leftArr.push(inst);
                this._totalArr.push(inst);
            }
            var ret = this._leftArr.shift();
            if (is.fun(ret.init)) {
                ret.init.apply(ret, args);
            }
            this._useArr.push(ret);
            return ret;
        };
        /**
         * 获取指定类型的对象池
         * @static
         * @template T
         * @param {T} type    指定的类型
         * @returns {Pool<T>} 类型对象池
         * @memberof Pool
         */
        Pool.getPool = function (type) {
            var typeId = dragon.getTypeId(type);
            if (!this._poolMap.hasOwnProperty(typeId)) {
                this._poolMap[typeId] = new Pool(type);
            }
            return this._poolMap[typeId];
        };
        /**
         * 获取指定分组的类型对象池
         * @static
         * @template T
         * @param {string} name 组名
         * @param {T} type      指定类型
         * @returns {Pool<T>}   类型对象池
         * @memberof Pool
         */
        Pool.getTypePool = function (name, type) {
            var typeId = name + dragon.getTypeId(type);
            if (!this._poolMap.hasOwnProperty(typeId)) {
                this._poolMap[typeId] = new Pool(type);
            }
            return this._poolMap[typeId];
        };
        Pool._poolMap = {};
        return Pool;
    }());
    dragon.Pool = Pool;
    function getPool(type) {
        return Pool.getPool(type);
    }
    dragon.getPool = getPool;
    function getTypePool(name, type) {
        return Pool.getTypePool(name, type);
    }
    dragon.getTypePool = getTypePool;
})(dragon || (dragon = {}));
/**
 * @author Andrew_Huang
 */
var dragon;
(function (dragon) {
    /**
     * 工具类：数组操作
     * @export
     * @class Array
     */
    var array = /** @class */ (function () {
        function array() {
        }
        /**
         * 从数组中移除某些Items
         * @static
         * @template T
         * @param {T[]} arr
         * @param {(((item: any) => boolean | T | T[]))} removeItems
         * @returns {boolean}
         * @memberof Array
         */
        array.remove = function (arr, removeItems) {
            var removed = false;
            if (is.fun(removeItems)) {
                var fun = removeItems;
                for (var i = arr.length - 1; i >= 0; i--) {
                    if (fun(arr[i])) {
                        arr.splice(i, 1);
                        removed = true;
                    }
                }
            }
            else if (is.truthy(removeItems)) {
                var items = [].concat(removeItems);
                for (var i = 0; i < arr.length; i++) {
                    var idx = arr.indexOf(items[i]);
                    if (idx > -1) {
                        arr.splice(idx, 1);
                        removed = true;
                    }
                }
            }
            return removed;
        };
        /**
         * 打乱数组顺序
         * @static
         * @template T
         * @param {T[]} arr
         * @returns {T[]}
         * @memberof Array
         */
        array.shuffle = function (arr) {
            return arr.sort(function () {
                var randomNum = Math.random();
                return randomNum > 0.5 ? 1 : -1;
            });
        };
        /**
         * 获取数组中指定prop的值
         * @static
         * @template T
         * @param {T[]} arr
         * @param {string} propName
         * @returns {any[]}
         * @memberof Array
         */
        array.pluck = function (arr, propName) {
            return arr.map(function (item) {
                return item[propName];
            });
        };
        ;
        /**
         * 生成一段数字数组
         * @static
         * @param {number} start
         * @param {number} [stop=0]
         * @param {number} [step=1]
         * @returns {number[]}
         * @memberof Array
         */
        array.range = function (start, stop, step) {
            if (stop === void 0) { stop = 0; }
            if (step === void 0) { step = 1; }
            if (stop == 0) {
                stop = start || 0;
                start = 0;
            }
            if (step == 1) {
                step = stop < start ? -1 : 1;
            }
            var len = Math.max(Math.ceil((stop - start) / stop), 0);
            var range = Array(len);
            for (var idx = 0; idx < len; idx++, start += step) {
                range[idx] = start;
            }
            return range;
        };
        /**
         * 遍历数组，返回所有的Item，通过回调进行处理
         * @static
         * @template T
         * @param {T[]} arr
         * @param {Function} pre
         * @param {Object} [context=null]
         * @returns {T}
         * @memberof array
         */
        array.find = function (arr, pre, context) {
            if (context === void 0) { context = null; }
            for (var i = 0; i < arr.length; i++) {
                var item = arr[i];
                if (pre && pre.call(context, item)) {
                    return item;
                }
            }
            return null;
        };
        /**
         * 从arr中找到所有obj的数据组成新的数组
         * @static
         * @template T
         * @param {T[]} arr
         * @param {*} obj
         * @returns {T[]}
         * @memberof array
         */
        array.where = function (arr, obj) {
            var keys = Object.keys(obj);
            var ret = [];
            var _loop_1 = function (i) {
                var item = arr[i];
                var find = keys.every(function (t) {
                    return item[t] == obj[t];
                });
                if (find) {
                    ret.push(item);
                }
            };
            for (var i = 0; i < arr.length; i++) {
                _loop_1(i);
            }
            return ret;
        };
        /**
         * 获取列表中匹配正确的第一项
         * @static
         * @template T
         * @param {T[]} arr
         * @param {*} obj
         * @returns {T}
         * @memberof array
         */
        array.findWhere = function (arr, obj) {
            var items = array.where(arr, obj);
            if (items.length > 0) {
                return items[0];
            }
            return null;
        };
        /**
         * arr是否包含满足条件的数据或者包含数据
         * @static
         * @template T
         * @param {T[]} arr
         * @param {((value: T, index: number, array: T[]) => boolean|T)} obj
         * @returns {boolean}
         * @memberof array
         */
        array.contains = function (arr, obj) {
            if (is.fun(obj)) {
                var fun = obj;
                var some = arr.some(fun);
                return some;
            }
            else {
                var idx = arr.indexOf(obj);
                if (idx > -1) {
                    return true;
                }
            }
            return false;
        };
        return array;
    }());
    dragon.array = array;
})(dragon || (dragon = {}));
/**
 * @author Andrew_Huang
 */
var dragon;
(function (dragon) {
    /**
     * 类工厂
     * @export
     * @class ClassFactory
     */
    var ClassFactory = /** @class */ (function () {
        function ClassFactory() {
            this._classList = [];
        }
        /**
         * 注入类信息到类型工厂中
         * @param {string} types
         * @param {*} classType
         * @param {number} priority
         * @memberof ClassFactory
         */
        ClassFactory.prototype.injection = function (types, classType, priority) {
            var info = { types: types.split(' '), classType: classType, priority: priority };
            this._classList.push(info);
            this._classList.sort(function (a, b) {
                return b.priority - a.priority;
            });
        };
        /**
         * 检查key中的值是否在item中
         * @private
         * @param {*} item
         * @param {*} key
         * @returns {boolean}
         * @memberof ClassFactory
         */
        ClassFactory.prototype.checkValue = function (item, key) {
            var keys = key.split('=');
            if (keys.length > 1) {
                return dragon.Obj.getValue(item, keys[0]) == keys[1];
            }
            else {
                return dragon.Obj.hasValue(item, keys[0]);
            }
        };
        /**
         * 通过给定的数据对象，获取类型
         * @param {*} obj
         * @returns {*}
         * @memberof ClassFactory
         */
        ClassFactory.prototype.getClass = function (obj) {
            var _this = this;
            var result;
            if (is.string(obj)) {
                result = dragon.array.find(this._classList, function (item) {
                    return item.types.every(function (key) {
                        return key.split('|').indexOf(obj) > -1;
                    });
                });
            }
            else {
                result = dragon.array.find(this._classList, function (item) {
                    return item.types.every(function (key) {
                        if (key.indexOf('|') > -1) {
                            var arr = key.split('|');
                            return arr.some(function (subKey) {
                                return _this.checkValue(obj, subKey);
                            });
                        }
                        else {
                            return _this.checkValue(obj, key);
                        }
                    });
                });
            }
            if (is.truthy(result)) {
                return result.classType;
            }
            return null;
        };
        /**
         * 通过给定的数据对象，获取类型
         * @static
         * @param {string} name 类型工厂名称
         * @param {*} obj       数据对象
         * @returns {*}
         * @memberof ClassFactory
         */
        ClassFactory.get = function (name, obj) {
            return dragon.typeSingleton(name, ClassFactory).getClass(obj);
        };
        /**
         * 通过给定的数据对象，获取实例
         * @static
         * @template T
         * @param {string} name 类型工厂名称
         * @param {*} obj       数据对象
         * @param {any} args    参数列表
         * @returns {T}
         * @memberof ClassFactory
         */
        ClassFactory.instance = function (name, obj) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var result = this.get(name, obj);
            if (result) {
                return new (result.bind.apply(result, [void 0].concat(args)))();
            }
            return null;
        };
        /**
         * 注入类型到类型工厂
         * @static
         * @param {string} name 类型工厂名称
         * @param {string} types 类型关键字
         * @param {*} classTypes 类型
         * @param {number} [priority=1]
         * @memberof ClassFactory
         */
        ClassFactory.injection = function (name, types, classTypes, priority) {
            if (priority === void 0) { priority = 1; }
            dragon.typeSingleton(name, ClassFactory).injection(types, classTypes, priority);
        };
        return ClassFactory;
    }());
    dragon.ClassFactory = ClassFactory;
})(dragon || (dragon = {}));
/**
 * 定义单例、类型编号、分类的类型单例、指定类的实例、指定类的类型
 * @author Andrew_Huang
 */
var dragon;
(function (dragon) {
    var _TYPE_ID_ = 1;
    var _TYPE_KEY_NAME = '__dragon_type_id__';
    var _singletonMap = {};
    //hasOwnProperty只在属性存在于实例中时才返回true，in操作只要通过对象能访问到属性就能返回true
    /**
     * 返回指定类型的类型编号，作为全局的唯一识别id
     * @export
     * @param {*} type   指定类型
     * @returns {number} 类型标号
     */
    function getTypeId(type) {
        if (!type.hasOwnProperty(_TYPE_KEY_NAME)) {
            type[_TYPE_KEY_NAME] = _TYPE_ID_++;
        }
        return type[_TYPE_KEY_NAME];
    }
    dragon.getTypeId = getTypeId;
    /**
     * 指定类型是否存在类型编号
     * @export
     * @param {*} type    指定类型
     * @returns {boolean} 是否存在类型编号
     */
    function hasTypeId(type) {
        return is.truthy(type) && type.hasOwnProperty(_TYPE_KEY_NAME);
    }
    dragon.hasTypeId = hasTypeId;
    /**
     * 返回指定类型的单例
     * @export
     * @template T
     * @param {{ new(): T; }} type
     * @returns {T}
     */
    function singleton(type) {
        var typeId = getTypeId(type);
        if (!_singletonMap.hasOwnProperty(typeId)) {
            _singletonMap[typeId] = new type();
        }
        return _singletonMap[typeId];
    }
    dragon.singleton = singleton;
    /**
     * 返回指定分类的类型单例
     * @export
     * @template T
     * @param {string} name         分类名称
     * @param {{ new(): T; }} type  单例化的类型
     * @returns {T}
     */
    function typeSingleton(name, type) {
        var typeId = name + getTypeId(type);
        if (!_singletonMap.hasOwnProperty(typeId)) {
            _singletonMap[typeId] = new type();
        }
        return _singletonMap[typeId];
    }
    dragon.typeSingleton = typeSingleton;
    /**
     * 获取指定类的类型
     * @export
     * @template T
     * @param {string} name    类型名称
     * @param {T} defaultType  默认类型
     * @returns {T}
     */
    function getDefinitionType(name, defaultType) {
        if (is.truthy(name)) {
            var d = egret.getDefinitionByName(name);
            if (is.truthy(d)) {
                return d;
            }
        }
        return defaultType;
    }
    dragon.getDefinitionType = getDefinitionType;
    /**
     * 获取指定类的实例
     * @export
     * @template T
     * @param {string} name          类型名称
     * @param {*} [defaultType=null] 默认类型
     * @param {any} args             构造函数参数列表
     * @returns {T}
     */
    function getDefinitionInstance(name, defaultType) {
        if (defaultType === void 0) { defaultType = null; }
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var d = getDefinitionType(name, defaultType);
        if (is.truthy(d)) {
            return new (d.bind.apply(d, [void 0].concat(args)))();
        }
        return null;
    }
    dragon.getDefinitionInstance = getDefinitionInstance;
})(dragon || (dragon = {}));
/**
 * @author Andrew_Huang
 */
var dragon;
(function (dragon) {
    /**
     * 显示相关控制实现类
     * @export
     * @class Display
     */
    var Display = /** @class */ (function () {
        function Display() {
        }
        return Display;
    }());
    dragon.Display = Display;
})(dragon || (dragon = {}));
/**
 * 初始化定义部分数据
 * @author Andrew_Huang
 */
var dragon;
(function (dragon) {
    var __game_callback = null;
    define(dragon, 'stage', function () {
        return egret.MainContext.instance.stage;
    });
    define(dragon, 'GRootStage', function () {
        return fairygui.GRoot.inst;
    });
    function $getCallback() {
        if (!__game_callback) {
            __game_callback = dragon.getDefinitionInstance(dragon.getSetting().GameCallbackClass);
        }
        return __game_callback;
    }
    dragon.$getCallback = $getCallback;
    /**
     * 定义对象（包括修改对象属性数据）
     * configurable：属性是否可以更改；enumerable：是否可以用for..in遍历；
     * @export
     * @param {*} object        目标对象
     * @param {string} property 需要定义的属性或方法的名字
     * @param {*} getter
     * @param {*} [setter]
     */
    function define(object, property, getter, setter) {
        var obj = {};
        obj.configurable = true;
        obj.enumerable = true;
        if (getter) {
            obj.get = getter;
        }
        if (setter) {
            obj.set = setter;
        }
        //obj:目标属性所拥有的特性
        Object.defineProperty(object, property, obj);
    }
    dragon.define = define;
    /**
     * 获取常量数据
     * @export
     * @param {string} name
     * @param {*} [defValue=null]
     * @returns {*}
     */
    function getConst(name, defValue) {
        if (defValue === void 0) { defValue = null; }
    }
    dragon.getConst = getConst;
})(dragon || (dragon = {}));
var dragon;
(function (dragon) {
    var md5 = /** @class */ (function () {
        function md5() {
            this.hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase        */
            this.b64pad = ""; /* base-64 pad character. "=" for strict RFC compliance   */
        }
        /*
         * These are the privates you'll usually want to call
         * They take string arguments and return either hex or base-64 encoded strings
         */
        md5.prototype.hex_md5 = function (s) { return this.rstr2hex(this.rstr_md5(this.str2rstr_utf8(s))); };
        md5.prototype.b64_md5 = function (s) { return this.rstr2b64(this.rstr_md5(this.str2rstr_utf8(s))); };
        md5.prototype.any_md5 = function (s, e) { return this.rstr2any(this.rstr_md5(this.str2rstr_utf8(s)), e); };
        md5.prototype.hex_hmac_md5 = function (k, d) { return this.rstr2hex(this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d))); };
        md5.prototype.b64_hmac_md5 = function (k, d) { return this.rstr2b64(this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d))); };
        md5.prototype.any_hmac_md5 = function (k, d, e) { return this.rstr2any(this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d)), e); };
        /*
         * Perform a simple self-test to see if the VM is working
         */
        md5.prototype.md5_vm_test = function () {
            return this.hex_md5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72";
        };
        /*
         * Calculate the MD5 of a raw string
         */
        md5.prototype.rstr_md5 = function (s) {
            return this.binl2rstr(this.binl_md5(this.rstr2binl(s), s.length * 8));
        };
        /*
         * Calculate the HMAC-MD5, of a key and some data (raw strings)
         */
        md5.prototype.rstr_hmac_md5 = function (key, data) {
            var bkey = this.rstr2binl(key);
            if (bkey.length > 16)
                bkey = this.binl_md5(bkey, key.length * 8);
            var ipad = Array(16), opad = Array(16);
            for (var i = 0; i < 16; i++) {
                ipad[i] = bkey[i] ^ 0x36363636;
                opad[i] = bkey[i] ^ 0x5C5C5C5C;
            }
            var hash = this.binl_md5(ipad.concat(this.rstr2binl(data)), 512 + data.length * 8);
            return this.binl2rstr(this.binl_md5(opad.concat(hash), 512 + 128));
        };
        /*
         * Convert a raw string to a hex string
         */
        md5.prototype.rstr2hex = function (input) {
            try {
                this.hexcase;
            }
            catch (e) {
                this.hexcase = 0;
            }
            var hex_tab = this.hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
            var output = "";
            var x;
            for (var i = 0; i < input.length; i++) {
                x = input.charCodeAt(i);
                output += hex_tab.charAt((x >>> 4) & 0x0F)
                    + hex_tab.charAt(x & 0x0F);
            }
            return output;
        };
        /*
         * Convert a raw string to a base-64 string
         */
        md5.prototype.rstr2b64 = function (input) {
            try {
                this.b64pad;
            }
            catch (e) {
                this.b64pad = '';
            }
            var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var output = "";
            var len = input.length;
            for (var i = 0; i < len; i += 3) {
                var triplet = (input.charCodeAt(i) << 16)
                    | (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0)
                    | (i + 2 < len ? input.charCodeAt(i + 2) : 0);
                for (var j = 0; j < 4; j++) {
                    if (i * 8 + j * 6 > input.length * 8)
                        output += this.b64pad;
                    else
                        output += tab.charAt((triplet >>> 6 * (3 - j)) & 0x3F);
                }
            }
            return output;
        };
        /*
         * Convert a raw string to an arbitrary string encoding
         */
        md5.prototype.rstr2any = function (input, encoding) {
            var divisor = encoding.length;
            var i, j, q, x, quotient;
            /* Convert to an array of 16-bit big-endian values, forming the dividend */
            var dividend = Array(Math.ceil(input.length / 2));
            for (i = 0; i < dividend.length; i++) {
                dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
            }
            /*
             * Repeatedly perform a long division. The binary array forms the dividend,
             * the length of the encoding is the divisor. Once computed, the quotient
             * forms the dividend for the next step. All remainders are stored for later
             * use.
             */
            var full_length = Math.ceil(input.length * 8 /
                (Math.log(encoding.length) / Math.log(2)));
            var remainders = Array(full_length);
            for (j = 0; j < full_length; j++) {
                quotient = Array();
                x = 0;
                for (i = 0; i < dividend.length; i++) {
                    x = (x << 16) + dividend[i];
                    q = Math.floor(x / divisor);
                    x -= q * divisor;
                    if (quotient.length > 0 || q > 0)
                        quotient[quotient.length] = q;
                }
                remainders[j] = x;
                dividend = quotient;
            }
            /* Convert the remainders to the output string */
            var output = "";
            for (i = remainders.length - 1; i >= 0; i--)
                output += encoding.charAt(remainders[i]);
            return output;
        };
        /*
         * Encode a string as utf-8.
         * For efficiency, this assumes the input is valid utf-16.
         */
        md5.prototype.str2rstr_utf8 = function (input) {
            var output = "";
            var i = -1;
            var x, y;
            while (++i < input.length) {
                /* Decode utf-16 surrogate pairs */
                x = input.charCodeAt(i);
                y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
                if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
                    x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
                    i++;
                }
                /* Encode output as utf-8 */
                if (x <= 0x7F)
                    output += String.fromCharCode(x);
                else if (x <= 0x7FF)
                    output += String.fromCharCode(0xC0 | ((x >>> 6) & 0x1F), 0x80 | (x & 0x3F));
                else if (x <= 0xFFFF)
                    output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F));
                else if (x <= 0x1FFFFF)
                    output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07), 0x80 | ((x >>> 12) & 0x3F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F));
            }
            return output;
        };
        /*
         * Encode a string as utf-16
         */
        md5.prototype.str2rstr_utf16le = function (input) {
            var output = "";
            for (var i = 0; i < input.length; i++)
                output += String.fromCharCode(input.charCodeAt(i) & 0xFF, (input.charCodeAt(i) >>> 8) & 0xFF);
            return output;
        };
        md5.prototype.str2rstr_utf16be = function (input) {
            var output = "";
            for (var i = 0; i < input.length; i++)
                output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF, input.charCodeAt(i) & 0xFF);
            return output;
        };
        /*
         * Convert a raw string to an array of little-endian words
         * Characters >255 have their high-byte silently ignored.
         */
        md5.prototype.rstr2binl = function (input) {
            var output = Array(input.length >> 2);
            for (var i = 0; i < output.length; i++)
                output[i] = 0;
            for (var i = 0; i < input.length * 8; i += 8)
                output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
            return output;
        };
        /*
         * Convert an array of little-endian words to a string
         */
        md5.prototype.binl2rstr = function (input) {
            var output = "";
            for (var i = 0; i < input.length * 32; i += 8)
                output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
            return output;
        };
        /*
         * Calculate the MD5 of an array of little-endian words, and a bit length.
         */
        md5.prototype.binl_md5 = function (x, len) {
            /* append padding */
            x[len >> 5] |= 0x80 << ((len) % 32);
            x[(((len + 64) >>> 9) << 4) + 14] = len;
            var a = 1732584193;
            var b = -271733879;
            var c = -1732584194;
            var d = 271733878;
            for (var i = 0; i < x.length; i += 16) {
                var olda = a;
                var oldb = b;
                var oldc = c;
                var oldd = d;
                a = this.md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
                d = this.md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
                c = this.md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
                b = this.md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
                a = this.md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
                d = this.md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
                c = this.md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
                b = this.md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
                a = this.md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
                d = this.md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
                c = this.md5_ff(c, d, a, b, x[i + 10], 17, -42063);
                b = this.md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
                a = this.md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
                d = this.md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
                c = this.md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
                b = this.md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
                a = this.md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
                d = this.md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
                c = this.md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
                b = this.md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
                a = this.md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
                d = this.md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
                c = this.md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
                b = this.md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
                a = this.md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
                d = this.md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
                c = this.md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
                b = this.md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
                a = this.md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
                d = this.md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
                c = this.md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
                b = this.md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
                a = this.md5_hh(a, b, c, d, x[i + 5], 4, -378558);
                d = this.md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
                c = this.md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
                b = this.md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
                a = this.md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
                d = this.md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
                c = this.md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
                b = this.md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
                a = this.md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
                d = this.md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
                c = this.md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
                b = this.md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
                a = this.md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
                d = this.md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
                c = this.md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
                b = this.md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
                a = this.md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
                d = this.md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
                c = this.md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
                b = this.md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
                a = this.md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
                d = this.md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
                c = this.md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
                b = this.md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
                a = this.md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
                d = this.md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
                c = this.md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
                b = this.md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
                a = this.md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
                d = this.md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
                c = this.md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
                b = this.md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
                a = this.safe_add(a, olda);
                b = this.safe_add(b, oldb);
                c = this.safe_add(c, oldc);
                d = this.safe_add(d, oldd);
            }
            return [a, b, c, d];
        };
        /*
         * These privates implement the four basic operations the algorithm uses.
         */
        md5.prototype.md5_cmn = function (q, a, b, x, s, t) {
            return this.safe_add(this.bit_rol(this.safe_add(this.safe_add(a, q), this.safe_add(x, t)), s), b);
        };
        md5.prototype.md5_ff = function (a, b, c, d, x, s, t) {
            return this.md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
        };
        md5.prototype.md5_gg = function (a, b, c, d, x, s, t) {
            return this.md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
        };
        md5.prototype.md5_hh = function (a, b, c, d, x, s, t) {
            return this.md5_cmn(b ^ c ^ d, a, b, x, s, t);
        };
        md5.prototype.md5_ii = function (a, b, c, d, x, s, t) {
            return this.md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
        };
        /*
         * Add integers, wrapping at 2^32. This uses 16-bit operations internally
         * to work around bugs in some JS interpreters.
         */
        md5.prototype.safe_add = function (x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        };
        /*
         * Bitwise rotate a 32-bit number to the left.
         */
        md5.prototype.bit_rol = function (num, cnt) {
            return (num << cnt) | (num >>> (32 - cnt));
        };
        return md5;
    }());
    dragon.md5 = md5;
})(dragon || (dragon = {}));
/**
 * @author Andrew_Huang
 */
var dragon;
(function (dragon) {
    /**
     * 数字操作类
     * @export
     * @class Num
     */
    var Num = /** @class */ (function () {
        function Num() {
        }
        /**
         * 在指定数字范围内随机一个整数
         * @static
         * @param {number} min
         * @param {number} max
         * @returns {number}
         * @memberof Num
         */
        Num.randInt = function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        /**
         * 在指定范围内随机一个浮点数
         * @static
         * @param {number} min
         * @param {number} max
         * @returns {number}
         * @memberof Num
         */
        Num.randFloat = function (min, max) {
            return Math.random() * (max - min) + min;
        };
        /**
         * 格式化时间数字
         * 如：1，传入DD或者HH，则返回01，传入D或者H，则返回1
         * @static
         * @param {number} num    时间
         * @param {string} format 时间格式：如DD、HH、MM、SS
         * @returns {*}
         * @memberof Num
         */
        Num.padNum = function (num, format) {
            var numStr = num.toString();
            var len = format.length - numStr.length;
            if (len > 0) {
                return '0' + numStr;
            }
            return numStr;
        };
        /**
         * 格式化倒计时时间
         * @param time 倒计时时间(秒)
         * @param format 格式化时间格式（[DD:HH:MM:SS];[D:H:M:S]）
         * @returns {string}
         */
        Num.toCountdown = function (time, format) {
            var _this = this;
            var day = Math.floor(time / 86400);
            time = time % 86400;
            var hour = Math.floor(time / 3600);
            time = time % 3600;
            var minutes = Math.floor(time / 60);
            time = time % 60;
            var seconds = Math.floor(time);
            var str = format.replace(/((\[)(.*?))?(D{1,2})(([^\]]?)\])?/gi, function (all, _, prefix, before, key, suffix, after) {
                if (prefix == '[' && day <= 0) {
                    return '';
                }
                return (before || "") + _this.padNum(day, key) + (after || "");
            });
            str = str.replace(/((\[)(.*?))?(H{1,2})(([^\]]?)\])?/gi, function (all, _, prefix, before, key, suffix, after) {
                if (prefix == '[' && hour <= 0) {
                    return '';
                }
                return (before || "") + _this.padNum(hour, key) + (after || "");
            });
            str = str.replace(/((\[)(.*?))?(M{1,2})(([^\]]?)\])?/gi, function (all, _, prefix, before, key, suffix, after) {
                if (prefix == '[' && hour <= 0 && minutes <= 0) {
                    return '';
                }
                return (before || "") + _this.padNum(minutes, key) + (after || "");
            });
            str = str.replace(/((\[)(.*?))?(S{1,2})(([^\]]?)\])?/gi, function (all, _, prefix, before, key, suffix, after) {
                if (prefix == '[' && hour > 0) {
                    return '';
                }
                return (before || '') + _this.padNum(seconds, key) + (after || '');
            });
            return str;
        };
        return Num;
    }());
    dragon.Num = Num;
})(dragon || (dragon = {}));
/**
 * 对象数据操作
 * @author Andrew_Huang
 */
var dragon;
(function (dragon) {
    var Obj = /** @class */ (function () {
        function Obj() {
        }
        /**
         * clone数据对象
         * @static
         * @param {*} obj
         * @returns {*}
         * @memberof ObjectData
         */
        Obj.clone = function (obj) {
            var _this = this;
            if (is.falsy(obj) || is.not.object(obj)) {
                return obj;
            }
            if (obj instanceof RegExp) {
                return obj;
            }
            var result = (Array.isArray(obj)) ? [] : {};
            Object.keys(obj).forEach(function (key) {
                if (is.object(obj[key])) {
                    result[key] = _this.clone(obj[key]);
                }
                else {
                    result[key] = obj[key];
                }
            });
            return result;
        };
        /**
         * 获取所有对象的所有 key 值
         * @static
         * @param {*} obj
         * @returns {string[]}
         * @memberof ObjectData
         */
        Obj.keys = function (obj) {
            var keys = [];
            for (var key in obj) {
                keys.push(key);
            }
            return keys;
        };
        /**
         * 获取对象的所有 value 值
         * @static
         * @param {*} obj
         * @returns {any[]}
         * @memberof Obj
         */
        Obj.values = function (obj) {
            var keys = this.keys(obj);
            var len = keys.length;
            var values = Array(len);
            for (var i = 0; i < len; i++) {
                values[i] = obj[keys[i]];
            }
            return values;
        };
        /**
         * 属性是否完全跟对象一样
         * @static
         * @param {*} object
         * @param {*} attrs
         * @returns {boolean}
         * @memberof Obj
         */
        Obj.isMatch = function (object, attrs) {
            var keys = this.keys(attrs);
            var len = keys.length;
            if (object == null) {
                return !len;
            }
            var obj = Object(object);
            for (var i = 0; i < len; i++) {
                var key = keys[i];
                if (attrs[key] !== obj[key] || !(key in obj)) {
                    return false;
                }
            }
            return true;
        };
        Obj.matches = function (props) {
            var _this = this;
            return function (obj) {
                return _this.isMatch(obj, props);
            };
        };
        /**
         * 判断对象数据中是否存在对应key的数据
         * @static
         * @param {*} data
         * @param {*} key
         * @returns {boolean}
         * @memberof Obj
         */
        Obj.hasValue = function (data, key) {
            if (!data) {
                return false;
            }
            key = key + '';
            var keyArr = key.split('.');
            var obj = data;
            while (keyArr.length > 0 && obj) {
                var k = keyArr.shift();
                if (!obj.hasOwnProperty(k)) {
                    return false;
                }
                obj = obj[k];
            }
            return true;
        };
        /**
         * 设置对象的数据
         * @static
         * @param {*} data
         * @param {*} key
         * @param {*} val
         * @param {boolean} [forceSet=false]
         * @returns {void}
         * @memberof Obj
         */
        Obj.setValue = function (data, key, val, forceSet) {
            if (forceSet === void 0) { forceSet = false; }
            if (is.falsy(data)) {
                return;
            }
            key = key + '';
            var keyArr = key.split('.');
            var obj = data;
            for (var i = 0; i < keyArr.length; i++) {
                key = keyArr[i];
                if (is.array(obj)) {
                    obj = obj[parseInt(key)];
                }
                else {
                    obj = obj[key];
                }
                if (is.falsy(obj)) {
                    break;
                }
            }
            if (is.truthy(obj)) {
                var lastKey = keyArr[keyArr.length - 1];
                if (forceSet) {
                    obj[lastKey] = val;
                }
                else {
                    if (obj.hasOwnProperty(lastKey)) {
                        obj[lastKey] = val;
                    }
                }
            }
        };
        /**
         * 获取对象数据
         * @static
         * @param {*} data
         * @param {*} key
         * @param {*} [defaultValue=null]
         * @returns {*}
         * @memberof Obj
         */
        Obj.getValue = function (data, key, defaultValue) {
            if (defaultValue === void 0) { defaultValue = null; }
            if (is.falsy(data)) {
                return defaultValue;
            }
            key = key + "";
            var keyArr = key.split('.');
            var curObj = data;
            for (var i = 0; i < keyArr.length; i++) {
                var key_1 = keyArr[i];
                if (is.array(curObj)) {
                    curObj = curObj[parseInt(key_1)];
                }
                else {
                    if (key_1 == '') {
                        curObj = curObj;
                    }
                    else {
                        curObj = curObj[key_1];
                    }
                }
                if (is.not.existy(curObj)) {
                    break;
                }
            }
            if (is.not.existy(curObj)) {
                return defaultValue;
            }
            return curObj;
        };
        /**
         * 深层clone
         * @static
         * @param {*} obj
         * @returns {*}
         * @memberof Obj
         */
        Obj.deepClone = function (obj) {
            var _this = this;
            if (is.falsy(obj) || is.not.object(obj)) {
                return obj;
            }
            var result = (Array.isArray(obj)) ? [] : {};
            Object.getOwnPropertyNames(obj).forEach(function (key) {
                if (is.object(obj[key])) {
                    result[key] = _this.deepClone(obj[key]);
                }
                else {
                    result[key] = obj[key];
                }
            });
            return result;
        };
        /**
         * 判断两个对象数据是否完全相同
         * @static
         * @param {*} one
         * @param {*} other
         * @returns {boolean}
         * @memberof Obj
         */
        Obj.equals = function (one, other) {
            if (one === other) {
                return true;
            }
            if (one === null || one === undefined || other === null || other === undefined) {
                return false;
            }
            if (typeof one !== typeof other) {
                return false;
            }
            if (typeof one !== 'object') {
                return false;
            }
            if ((Array.isArray(one)) !== (Array.isArray(other))) {
                return false;
            }
            var i;
            var key;
            if (Array.isArray(one)) {
                if (one.length !== other.length) {
                    return false;
                }
                for (i = 0; i < one.length; i++) {
                    if (!this.equals(one[i], other[i])) {
                        return false;
                    }
                }
            }
            else {
                var oneKeys = [];
                for (key in one) {
                    oneKeys.push(key);
                }
                oneKeys.sort();
                var otherKeys = [];
                for (key in other) {
                    otherKeys.push(key);
                }
                otherKeys.sort();
                if (!this.equals(oneKeys, otherKeys)) {
                    return false;
                }
                for (i = 0; i < oneKeys.length; i++) {
                    if (!this.equals(one[oneKeys[i]], other[oneKeys[i]])) {
                        return false;
                    }
                }
            }
            return true;
        };
        return Obj;
    }());
    dragon.Obj = Obj;
    function v(obj, paths, defVal) {
        if (defVal === void 0) { defVal = null; }
        return dragon.Obj.getValue(obj, paths, defVal);
    }
    dragon.v = v;
})(dragon || (dragon = {}));
/**
 * @author Andrew_Huang
 */
var dragon;
(function (dragon) {
    /**
     * 平台的功能支持类型
     * @export
     * @enum {number}
     */
    var PlatformFunType;
    (function (PlatformFunType) {
        PlatformFunType[PlatformFunType["SendToDesktop"] = 1] = "SendToDesktop";
        PlatformFunType[PlatformFunType["TencentLogin"] = 2] = "TencentLogin";
        PlatformFunType[PlatformFunType["InvitationFriend"] = 3] = "InvitationFriend";
        PlatformFunType[PlatformFunType["OpenBBS"] = 4] = "OpenBBS";
        PlatformFunType[PlatformFunType["Share"] = 5] = "Share";
    })(PlatformFunType = dragon.PlatformFunType || (dragon.PlatformFunType = {}));
    /**
     * 返回当前运行环境的平台对象
     * @export
     * @returns {IPlatform}
     */
    function getPlatform() {
        var platform = dragon.extra.platform || 'ND';
        return dragon.ClassFactory.instance('pf', platform);
    }
    dragon.getPlatform = getPlatform;
})(dragon || (dragon = {}));
/**
 * @author Andrew_Huang
 */
var dragon;
(function (dragon) {
    /**
     * 本地数据存储器
     * @export
     * @class LocalStorage
     */
    var LocalStorage = /** @class */ (function () {
        function LocalStorage() {
        }
        LocalStorage.setPrefix = function (prefix) {
            this._prefix = prefix;
            this._enable = egret.localStorage.setItem('enabled', '1');
        };
        LocalStorage.isSetPrefix = function () {
            return this._prefix != null;
        };
        LocalStorage.checkPrefix = function () {
            if (is.nul(this._prefix)) {
                throw new Error("请设置 localStorage.setPrefix");
            }
        };
        LocalStorage.getItemKey = function (key) {
            key = this._prefix + '-' + key;
            return key;
        };
        /**
         * 设置Item数据
         * @static
         * @param {string} key
         * @param {*} value
         * @memberof LocalStorage
         */
        LocalStorage.setItem = function (key, value) {
            this.checkPrefix();
            if (this._enable) {
                egret.localStorage.setItem(this.getItemKey(key), value);
            }
            else {
                this._localStorage[this.getItemKey(key)] = value;
            }
        };
        /**
         * 获取Item数据
         * @static
         * @param {string} key
         * @param {*} [defaultValue=null]
         * @returns {*}
         * @memberof LocalStorage
         */
        LocalStorage.getItem = function (key, defaultValue) {
            if (defaultValue === void 0) { defaultValue = null; }
            this.checkPrefix();
            if (this._enable) {
                return egret.localStorage.getItem(this.getItemKey(key)) || defaultValue;
            }
            else {
                return this._localStorage[this.getItemKey(key)] || defaultValue;
            }
        };
        /**
         * 移除Item数据
         * @static
         * @param {string} key
         * @memberof LocalStorage
         */
        LocalStorage.removeItem = function (key) {
            this.checkPrefix();
            if (this._enable) {
                egret.localStorage.removeItem(this.getItemKey(key));
            }
            else {
                delete this._localStorage[this.getItemKey(key)];
            }
        };
        LocalStorage._prefix = null; //项目前缀
        LocalStorage._enable = true; //是否可以保存在egret.localStorage中
        LocalStorage._localStorage = {};
        return LocalStorage;
    }());
    dragon.LocalStorage = LocalStorage;
})(dragon || (dragon = {}));
/**
 * @author Andrew_Huang
 */
var dragon;
(function (dragon) {
    /**
     * 填补方向
     * @export
     * @enum {number}
     */
    var PadDirection;
    (function (PadDirection) {
        PadDirection[PadDirection["LEFT"] = 0] = "LEFT";
        PadDirection[PadDirection["MIDDLE"] = 1] = "MIDDLE";
        PadDirection[PadDirection["RIGHT"] = 2] = "RIGHT";
    })(PadDirection = dragon.PadDirection || (dragon.PadDirection = {}));
    /**
     * 字符相关操作类
     * @export
     * @class Str
     */
    var Str = /** @class */ (function () {
        function Str() {
        }
        /**
         * 字符串填补
         * @static
         * @param {string} str       需要填补的原字符串
         * @param {number} [len=0]   填补的长度
         * @param {string} [pad=" "] 填补的类型（默认空格）
         * @param {PadDirection} [dir=PadDirection.MIDDLE] 填补的方向
         * @returns {string}
         * @memberof Str
         */
        Str.pad = function (str, len, pad, dir) {
            if (len === void 0) { len = 0; }
            if (pad === void 0) { pad = " "; }
            if (dir === void 0) { dir = PadDirection.MIDDLE; }
            var padlen = 0;
            if (len >= 1) {
                len += str.length;
                switch (dir) {
                    case PadDirection.LEFT:
                        str = new Array(len + 1 - str.length).join(pad) + str;
                        break;
                    case PadDirection.MIDDLE:
                        var right = Math.ceil((padlen = len - str.length) / 2);
                        var left = padlen - right;
                        str = new Array(left + 1).join(pad) + str + new Array(right + 1).join(pad);
                        break;
                    default: {
                        str = str + new Array(len + 1 - str.length).join(pad);
                        break;
                    }
                }
            }
            return str;
        };
        /**
         * 替换字符串str中的所有search，替代内容为replace
         * new RegExp(search, 'g')：g表示gloabl，找到search字符的所有存在点
         * @static
         * @param {string} str     原始字符串
         * @param {string} search  需要替换的内容
         * @param {string} replace 替换内容
         * @returns {string}
         * @memberof Str
         */
        Str.replaceAll = function (str, search, replace) {
            return str.replace(new RegExp(search, 'g'), replace);
        };
        /**
         * 使用对象数据替换文本中的标记位置
         * 示例：str="AAA{a}BBB",arg={a:1} => 结果：str="AAA1BBB"
         * @static
         * @param {string} str
         * @param {*} args
         * @returns {string}
         * @memberof Str
         */
        Str.replaceFromObject = function (str, args) {
            if (is.object(args)) {
                for (var key in args) {
                    var search = '{' + key + '}';
                    var replace = '' + args[key];
                    str = this.replaceAll(str, search, replace);
                }
            }
            return str;
        };
        /**
         * 数组数据替换：格式化形如str格式的字符，并用args替换里面的数据
         * 举例：value="{02}",args=[1,2,3] => match:{02},group:02,结果为3
         * @static
         * @param {string} str
         * @param {...any[]} args
         * @returns {string}
         * @memberof Str
         */
        Str.format = function (str) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (!args.length) {
                return str;
            }
            return str.replace(this._formatRegexp, function (match, group) {
                var idx = parseInt(group, 10);
                return isNaN(idx) || idx < 0 || idx > args.length ? match : args[idx];
            });
        };
        /**
         * 对象数据替换：格式化形如str格式的字符，并用args替换里面的数据
         * @static
         * @param {string} str
         * @param {*} args
         * @returns {string}
         * @memberof Str
         */
        Str.formatFromObject = function (str, args) {
            if (is.falsy(str) || is.empty(args)) {
                return str;
            }
            return str.replace(this._formatObjRegexp, function (match, group) {
                if (args.hasOwnProperty(group)) {
                    return args[group];
                }
                return match;
            });
        };
        /**
         * 重复字符串输出
         * @static
         * @param {string} str
         * @param {number} count
         * @returns {string}
         * @memberof Str
         */
        Str.repeat = function (str, count) {
            var arr = new Array(count);
            for (var i = 0; i < count; i++) {
                arr[i] = str;
            }
            return arr.join('');
        };
        /**
         * 去除str中的space字符，并格式化
         * @static
         * @param {string} [str]
         * @param {string} [space]
         * @returns {string}
         * @memberof Str
         */
        Str.trim = function (str, space) {
            var trimmed = this.lTrim(str, space);
            return this.rTrim(trimmed, space);
        };
        /**
         * 去除左边的space字符
         * @static
         * @param {string} [str]
         * @param {string} [space]
         * @returns {string}
         * @memberof Str
         */
        Str.lTrim = function (str, space) {
            if (!str || !space) {
                return str;
            }
            var needLen = space.length;
            if (needLen === 0 || str.length === 0) {
                return str;
            }
            var offset = 0;
            var idx = -1;
            while ((idx = str.indexOf(space, offset)) === offset) {
                offset += needLen;
            }
            return str.substr(offset);
        };
        /**
         * 去除右边的space字符
         * @static
         * @param {string} [str]
         * @param {string} [space]
         * @returns {string}
         * @memberof Str
         */
        Str.rTrim = function (str, space) {
            if (!str || !space) {
                return str;
            }
            var needleLen = space.length;
            var strLen = str.length;
            if (needleLen === 0 || strLen === 0) {
                return str;
            }
            var offset = strLen;
            var idx = -1;
            while (true) {
                idx = str.lastIndexOf(space, offset - 1);
                if (idx === -1 || idx + needleLen !== offset) {
                    break;
                }
                if (idx === 0) {
                    return '';
                }
                offset = idx;
            }
            return str.substring(0, offset);
        };
        /**
         * 判断space是否存在于str的头部
         * @static
         * @param {string} str
         * @param {string} space
         * @returns {boolean}
         * @memberof Str
         */
        Str.startWith = function (str, space) {
            if (str.length < space.length) {
                return false;
            }
            for (var i = 0; i < space.length; i++) {
                if (str[i] !== space[i]) {
                    return false;
                }
            }
            return true;
        };
        /**
         * 判断space是否存在于str的尾部
         * @static
         * @param {string} str
         * @param {string} space
         * @returns {boolean}
         * @memberof Str
         */
        Str.endWith = function (str, space) {
            var diff = str.length - space.length;
            if (diff > 0) {
                return str.lastIndexOf(space) === diff;
            }
            else if (diff === 0) {
                return str === space;
            }
            else {
                return false;
            }
        };
        /**
         * 匹配格式：如{num},num为数字组合
         * \d:匹配一个数字字符，相当于[0-9]
         * +:匹配1或多个正好在它之前的那个字符
         */
        Str._formatRegexp = /{(\d+)}/g;
        /**
         * 匹配{}格式的字符
         */
        Str._formatObjRegexp = /{([^\}]+)}/g;
        return Str;
    }());
    dragon.Str = Str;
})(dragon || (dragon = {}));
/**
 * @author Andrew_Huang
 * 时间操作类：延迟、判断时间戳
 */
var dragon;
(function (dragon) {
    var timestamp = /^\d{10}$|^\d{13}$/; //时间戳：10或者13个整数
    /**
     * 指定的时间数值是否是时间戳
     * @export
     * @param {number} time
     * @returns {boolean}
     */
    function isTimestamp(time) {
        return timestamp.test(time.toString());
    }
    dragon.isTimestamp = isTimestamp;
    /**
     * 以指定的延迟（以毫秒为单位）间隔循环调用指定的函数
     * @export
     * @template T
     * @param {(context: T, ...args) => void} callback  侦听函数
     * @param {T} context this对象
     * @param {number} time 延迟时间，以毫秒为单位
     * @param {any} args 参数列表
     * @returns {number}  返回索引，可以用于 clearInterval
     */
    function setInterval(callback, context, time) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        return egret.setInterval.apply(egret, [callback, context, time].concat(args));
    }
    dragon.setInterval = setInterval;
    /**
     * 清除指定延迟后运行的函数
     * @export
     * @param {number} timeId egret.setInterval所返回的索引
     */
    function clearInterval(timeId) {
        egret.clearInterval(timeId);
    }
    dragon.clearInterval = clearInterval;
    /**
     * 在指定的延迟（以毫秒为单位）后运行指定的函数
     * @export
     * @template T
     * @param {(context: T, ...args) => void} callback 侦听函数
     * @param {T} context this对象
     * @param {number} time 延迟时间，以毫秒为单位
     * @param {...any[]} args 参数列表
     * @returns {number} 返回索引，可以用于 clearTimeout
     */
    function setTimeout(callback, context, time) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        return egret.setTimeout.apply(egret, [callback, context, time].concat(args));
    }
    dragon.setTimeout = setTimeout;
    /**
     * 清除指定延迟后运行的函数
     * @export
     * @param {number} timeId egret.setTimeout所返回的索引
     */
    function clearTimeout(timeId) {
        egret.clearTimeout(timeId);
    }
    dragon.clearTimeout = clearTimeout;
})(dragon || (dragon = {}));
/**
 * @author Andrew_Huang
 */
var dragon;
(function (dragon) {
    /**
     * 时间计时器（单位时间记录）
     * @export
     * @class TimeRecorder
     */
    var TimeRecorder = /** @class */ (function () {
        function TimeRecorder() {
            this._lastDate = -1; //最新的时间戳（毫秒）
            this._offsetTime = 0; //向下取整后的时间差之和
            this._tickNum = 0; //心跳数
        }
        Object.defineProperty(TimeRecorder.prototype, "tickNum", {
            get: function () {
                return this._tickNum;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimeRecorder.prototype, "seconds", {
            get: function () {
                return this._seconds;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 每次计时返回的时间长度
         * @returns {number}
         * @memberof TimeRecorder
         */
        TimeRecorder.prototype.tick = function () {
            var seconds = 1;
            this._data = new Date();
            var time = this._data.getTime();
            if (this._lastDate != -1) {
                var sec = (time - this._lastDate) / 1000;
                seconds = Math.floor(sec);
                if (seconds < 1) {
                    seconds = 1;
                }
                this._offsetTime += (sec - seconds);
                //当时间差累计超过1秒时，累加到seconds中
                if (this._offsetTime >= 1) {
                    sec = Math.floor(this._offsetTime);
                    seconds += sec;
                    this._offsetTime -= sec;
                }
            }
            this._lastDate = time;
            this._tickNum += seconds;
            this._seconds = seconds;
            return seconds;
        };
        return TimeRecorder;
    }());
    dragon.TimeRecorder = TimeRecorder;
})(dragon || (dragon = {}));

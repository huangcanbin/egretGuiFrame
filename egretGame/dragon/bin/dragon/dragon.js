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
     * 动画基类
     * @export
     * @class BaseAnimation
     * @implements {dragon.IAnimation}
     */
    var Animation = /** @class */ (function () {
        function Animation() {
            this._isRunning = false; //动画是否正在播放
            this._timeLine = new TimelineMax({
                onComplete: this.onComplete.bind(this)
            });
            this._aniInfoArr = [];
        }
        Object.defineProperty(Animation.prototype, "target", {
            get: function () {
                return this._target;
            },
            set: function (value) {
                this._target = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animation.prototype, "isRunning", {
            get: function () {
                return this._isRunning;
            },
            enumerable: true,
            configurable: true
        });
        Animation.prototype.onComplete = function () {
            Animation.removeAnimation(this.target, this);
        };
        /**
         * 设置动画目标，并返回动画实例
         * @param {*} obj
         * @returns {dragon.IAnimation}
         * @memberof BaseAnimation
         */
        Animation.prototype.setTarget = function (obj) {
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
        Animation.prototype.to = function (duration, props, ease) {
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
        Animation.prototype.mergeEase = function (props, ease) {
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
        Animation.prototype.toProps = function (props, type) {
            if (type === void 0) { type = 'by'; }
            var obj = {};
            for (var key_1 in props) {
                var num = props[key_1];
                if (type == 'by' || key_1 == 'x' || key_1 == 'y') {
                    obj[key_1] = num > 0 ? '+=' + num : '-=' + Math.abs(num);
                }
                else {
                    obj[key_1] = '' + num;
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
        Animation.prototype.fromProps = function (props, type) {
            if (type === void 0) { type = 'by'; }
            var obj = {};
            for (var key_2 in props) {
                obj[key_2] = '+=0';
            }
            return obj;
        };
        /**
         * 设置动画信息：设置参数
         * @param {*} props
         * @returns {dragon.IAnimation}
         * @memberof BaseAnimation
         */
        Animation.prototype.setProps = function (props) {
            this._aniInfoArr.push({ duration: 0, props: props, type: dragon.AniPropsType.SET });
            return this;
        };
        /**
         * 设置动画信息：移除
         * @returns {dragon.IAnimation}
         * @memberof BaseAnimation
         */
        Animation.prototype.remove = function () {
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
        Animation.prototype.zoom = function (duration, scale, delay, ease) {
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
        Animation.prototype.by = function (duration, props, ease) {
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
        Animation.prototype.delay = function (duration) {
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
        Animation.prototype.call = function (callback, context) {
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
        Animation.prototype.blink = function (duration, blinks, ease) {
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
        Animation.prototype.fadeInOut = function (duration, ease) {
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
        Animation.prototype.run = function (target, isLoop) {
            var _this = this;
            if (target === void 0) { target = this._target; }
            Animation.addAnimation(target, this);
            if (isLoop) {
                this._timeLine.repeat(-1);
            }
            for (var i = 0; i < this._aniInfoArr.length; i++) {
                var info = this._aniInfoArr[i];
                var type = info.type;
                switch (type) {
                    case dragon.AniPropsType.DELAY: //延迟动画
                        this._timeLine.to(target, info.duration, {});
                        break;
                    case dragon.AniPropsType.SET: //参数设置
                        this._timeLine.set(target, info.props);
                        break;
                    case dragon.AniPropsType.BY: //运动
                        this._timeLine.fromTo(target, info.duration, this.fromProps(info.props), this.toProps(info.props));
                        break;
                    case dragon.AniPropsType.REMOVE: //移除
                        this._timeLine.call(function () {
                            if (target && target.parent) {
                                target.parent.remove(target);
                            }
                        });
                        break;
                    case dragon.AniPropsType.CALL: //回调
                        var callback = info.props['callback'];
                        var context = info.props['context'];
                        if (callback) {
                            this._timeLine.call(callback.bind(context));
                        }
                        break;
                    default:
                        this._timeLine.to(target, info.duration, info.props);
                        break;
                }
            }
            if (!isLoop) {
                this._timeLine.call(function () {
                    Animation.removeAnimation(target, _this);
                });
            }
            this._isRunning = true;
            return this;
        };
        Animation.prototype.shake = function (duration, offsetX, offestY, ease) {
            return null;
        };
        Animation.prototype.score = function (duration, beginScore, endScore, ease) {
            return null;
        };
        /**
         * 停止动画（进度设置为1表示完成）
         * @memberof BaseAnimation
         */
        Animation.prototype.stop = function () {
            this._timeLine.totalProgress(1);
            Animation.removeAnimation(this.target, this);
        };
        Animation.prototype.pause = function () {
            this._timeLine.pause();
        };
        Animation.prototype.resume = function () {
            this._timeLine.resume();
        };
        Animation.prototype.destroy = function () {
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
        Animation.addAnimation = function (target, animation) {
            if (!target.$__aniId_) {
                target.$__aniId_ = Animation._aniId++;
            }
            if (!Animation._aniMap.hasOwnProperty(target.$__aniId_)) {
                Animation._aniMap[target.$__aniId_] = [];
            }
            Animation._aniMap[target.$__aniId_].push(animation);
        };
        /**
         * 移除动画目标
         * @static
         * @param {*} target
         * @param {dragon.IAnimation} animation
         * @memberof BaseAnimation
         */
        Animation.removeAnimation = function (target, animation) {
            if (target && target.$__aniId_) {
                var arr = Animation._aniMap[target.$__aniId_];
                if (arr && arr.length > 0) {
                    var idx = arr.indexOf(animation);
                    if (idx > -1) {
                        animation.destroy();
                        arr.splice(idx, 1);
                    }
                    if (!arr.length) {
                        delete Animation._aniMap[target.$__aniId_];
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
        Animation.stopAnimationByTarget = function (target, remove) {
            if (remove === void 0) { remove = true; }
            if (target && target.$__aniId_) {
                var arr = Animation._aniMap[target.$__aniId_];
                if (arr && arr.length) {
                    if (remove) {
                        while (arr.length) {
                            arr.shift().stop();
                        }
                        delete Animation._aniMap[target.$__aniId_];
                    }
                    else {
                        Animation.pauseAnimationByTarget(target);
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
        Animation.pauseAnimationByTarget = function (target) {
            if (target && target.$__aniId_) {
                var arr = Animation._aniMap[target.$__aniId_];
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
        Animation.resumeAnimationByTarget = function (target) {
            if (target && target.$__aniId_) {
                var arr = Animation._aniMap[target.$__aniId_];
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
        Animation.removeAnimationByTarget = function (target) {
            if (target && target.$__aniId_) {
                var arr = Animation._aniMap[target.$__aniId_];
                if (arr && arr.length) {
                    while (arr.length) {
                        arr.shift().destroy();
                    }
                    delete Animation._aniMap[target.$__aniId_];
                }
            }
        };
        Animation.by = function (duration, props, ease) {
            return new Animation().by(duration, props, ease);
        };
        Animation.to = function (duration, props, ease) {
            return new Animation().to(duration, props, ease);
        };
        Animation.call = function (callback, context) {
            return new Animation().call(callback, context);
        };
        Animation.delay = function (delay) {
            return new Animation().delay(delay);
        };
        Animation._aniMap = []; //存储动画目标与动画对象
        Animation._aniId = 1; //动画Id
        return Animation;
    }());
    dragon.Animation = Animation;
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
            dragon.Animation.removeAnimationByTarget(box); //Back.easeInOut
            return dragon.Animation.to(300, { scaleX: 1, scaleY: 1, alpha: 1 }, egret.Ease.bounceInOut).run(box);
        };
        BoxBounceAnimation.prototype.getShowMaskAnimation = function (mask) {
            var alpha = mask.alpha ? mask.alpha : 0.6;
            mask.alpha = 0;
            return dragon.Animation.to(300, { alpha: alpha }).run(mask);
        };
        BoxBounceAnimation.prototype.getCloseBoxAnimation = function (box) {
            dragon.Animation.removeAnimationByTarget(box); //Back.easeIn
            return dragon.Animation.to(300, { scaleX: 0, scaleY: 0, alpha: 0 }, egret.Ease.bounceIn).run(box);
        };
        BoxBounceAnimation.prototype.getCloseMaskAnimation = function (mask) {
            return dragon.Animation.to(300, { alpha: 0 }).run(mask);
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
            dragon.Animation.removeAnimationByTarget(box);
            return dragon.Animation.to(150, { alpha: 1, scaleX: 1, scaleY: 1 }).run(box);
        };
        BoxNormalAnimation.prototype.getShowMaskAnimation = function (mask) {
            var alpha = mask.alpha ? mask.alpha : 0.6;
            mask.alpha = 0;
            return dragon.Animation.to(150, { alpha: alpha }).run(mask);
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
            dragon.Animation.removeAnimationByTarget(displayObject);
            displayObject.x = this.getOffsetByDirect();
            if (this._callback) {
                callback = this._callback;
            }
            if (callback) {
                dragon.Animation.to(200, { x: 0 }, Back.easeOut).call(callback, this).run(displayObject);
            }
            else {
                dragon.Animation.to(200, { x: 0 }, Back.easeOut).run(displayObject);
            }
        };
        UILeftRightAnimation.prototype.close = function (callback) {
            var displayObject = this.displayObject.getAnimationDisplay();
            dragon.Animation.removeAnimationByTarget(displayObject);
            var aimX = -this.getOffsetByDirect();
            dragon.Animation.to(200, { x: aimX }, Back.easeOut).call(callback, this).run(displayObject);
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
            dragon.Animation.removeAnimationByTarget(displayObject);
            displayObject.x = this.getOffsetByDirect();
            if (this._callback) {
                callback = this._callback;
            }
            if (callback) {
                dragon.Animation.to(200, { y: 0 }, Back.easeOut).call(callback, this).run(displayObject);
            }
            else {
                dragon.Animation.to(200, { y: 0 }, Back.easeOut).run(displayObject);
            }
        };
        UITopBottomAnimation.prototype.close = function (callback) {
            var displayObject = this.displayObject.getAnimationDisplay();
            dragon.Animation.removeAnimationByTarget(displayObject);
            var aimY = -this.getOffsetByDirect();
            dragon.Animation.to(200, { y: aimY }, Back.easeOut).call(callback, this).run(displayObject);
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
            if (Math.abs(x - start.X) + Math.abs(y - start.Y) == 1) { //上下左右相邻的点（X+Y的间隔之和为1个单位）
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
    /**
     * 组件操作状态（进入和退出）
     * @export
     * @enum {number}
     */
    var OperateState;
    (function (OperateState) {
        OperateState[OperateState["enter"] = 0] = "enter";
        OperateState[OperateState["exit"] = 1] = "exit";
    })(OperateState = dragon.OperateState || (dragon.OperateState = {}));
    /**
     * 基础UI组件
     * @export
     * @class BaseComponent
     * @extends {egret.EventDispatcher}
     * @implements {IComponent}
     * @implements {dragon.IUIAnimationDisplay}
     */
    var BaseComponent = /** @class */ (function (_super) {
        __extends(BaseComponent, _super);
        function BaseComponent() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _this = _super.call(this) || this;
            _this.$_componentState = OperateState.exit;
            _this._dataMapArr = [];
            _this._isHistoryComponent = false;
            _this._args = [];
            if (args[0] && (egret.getQualifiedSuperclassName(args[0]) == 'fairygui.GComponent')) {
                var ui = args.splice(0, 1)[0];
                _this._args = args;
                _this.display = ui;
            }
            else {
                _this._args = args;
            }
            return _this;
        }
        Object.defineProperty(BaseComponent.prototype, "displayObject", {
            get: function () {
                return this.display.displayObject;
            },
            enumerable: true,
            configurable: true
        });
        BaseComponent.prototype.onDisplay = function (value) {
            this.clean = true;
            this.display['$_class'] = this;
            this.setArgs(this._args);
        };
        Object.defineProperty(BaseComponent.prototype, "Sprite", {
            get: function () {
                return this._sprite;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseComponent.prototype, "args", {
            /**
             * 获取参数数据
             * @readonly
             * @type {*}
             * @memberof BaseComponent
             */
            get: function () {
                return this._args;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 设置参数
         * @param {*} args
         * @memberof BaseComponent
         */
        BaseComponent.prototype.setArgs = function (args) {
            this._args = args;
            this.pullData();
        };
        /**
         * 进入
         * @param {any} args
         * @memberof BaseComponent
         */
        BaseComponent.prototype.onOpen = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this.setCenter();
        };
        /**
         * 退出
         * @memberof BaseComponent
         */
        BaseComponent.prototype.onClose = function () {
            // if (this.display)
            // {
            // 	this.display.removeChildren();
            // 	this.display.dispose();
            // }
        };
        /**
         * 设置数据
         * @param {*} data
         * @param {*} [type]
         * @returns {IComponent}
         * @memberof BaseComponent
         */
        BaseComponent.prototype.setData = function (data, type) {
            if (type == 'data') {
                this.data = data;
                if (data) {
                    this.addDataMap('data');
                }
            }
            else {
                this[type] = data;
                if (data) {
                    this.addDataMap(type);
                    dragon.PropertyEvent.dispatchPropertyEvent(this.display, dragon.PropertyEvent.PROPERTY_CHANGE, type);
                }
            }
            if (this._hook && data) {
                this._hook.setData(data, type);
            }
            return this;
        };
        BaseComponent.prototype.setComName = function () {
            this.componentName = name;
            return this;
        };
        BaseComponent.prototype.pullData = function () {
            console.log("下拉数据");
        };
        /**
         * 获取动画的显示容器
         * @param {UI_TYPE} [type]
         * @memberof BaseComponent
         */
        BaseComponent.prototype.getAnimationDisplay = function (type) {
            if (!type || is.falsy(type)) {
                return this.display;
            }
            if (type == dragon.UI_TYPE.BOX) {
                return this.display;
            }
            else if (type == dragon.UI_TYPE.MASK) {
                return dragon.UI.getBoxMask();
            }
        };
        Object.defineProperty(BaseComponent.prototype, "data", {
            get: function () {
                return this.$_data;
            },
            set: function (value) {
                this.$_data = value;
                if (value != null) {
                    this.addDataMap('data');
                    dragon.PropertyEvent.dispatchPropertyEvent(this.display, dragon.PropertyEvent.PROPERTY_CHANGE, 'data');
                }
                this.dataChanged();
            },
            enumerable: true,
            configurable: true
        });
        BaseComponent.prototype.addDataMap = function (name) {
            if (this._dataMapArr.indexOf(name) == -1) {
                this._dataMapArr.push(name);
            }
        };
        BaseComponent.prototype.dataChanged = function () {
        };
        /**
         * 销毁数据
         * @memberof BaseComponent
         */
        BaseComponent.prototype.destroyData = function () {
            while (this._dataMapArr.length) {
                this[this._dataMapArr.shift()] = null;
            }
            dragon.display.destroyChildren(this.displayObject);
        };
        Object.defineProperty(BaseComponent.prototype, "animation", {
            get: function () {
                return this.$_anim;
            },
            /**
             * 为组件设置动画类
             * @memberof BaseComponent
             */
            set: function (value) {
                if (value) {
                    this.$_anim = value;
                    this.$_anim.displayObject = this;
                }
            },
            enumerable: true,
            configurable: true
        });
        BaseComponent.prototype.setHistoryComponent = function (isHistory) {
            this._isHistoryComponent = isHistory;
        };
        BaseComponent.prototype.setType = function (type) {
            this._type = type;
        };
        BaseComponent.prototype.isType = function (type) {
            if (type == dragon.UIType.ANY) {
                return this._type > dragon.UIType.MIN && this._type < dragon.UIType.ANY;
            }
            return this._type == type;
        };
        BaseComponent.prototype.isHistoryComponent = function () {
            return this._isHistoryComponent;
        };
        Object.defineProperty(BaseComponent.prototype, "autoId", {
            get: function () {
                return this.$_data ? this.$_data.autoId : '';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseComponent.prototype, "componentState", {
            get: function () {
                return this.$_componentState;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseComponent.prototype, "componentName", {
            get: function () {
                if (this._componentName) {
                    return this._componentName;
                }
                return '';
            },
            set: function (value) {
                this._componentName = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseComponent.prototype, "hook", {
            get: function () {
                return this._hook;
            },
            set: function (value) {
                this._hook = value;
            },
            enumerable: true,
            configurable: true
        });
        return BaseComponent;
    }(frame.layout.Window));
    dragon.BaseComponent = BaseComponent;
})(dragon || (dragon = {}));
/**
 * @author Andrew_Huang
 */
var dragon;
(function (dragon) {
    /**
     *
     * @export
     * @class BaseOperate
     * @extends {egret.HashObject}
     * @implements {IComponentOperate<T>}
     * @template T
     */
    var BaseOperate = /** @class */ (function (_super) {
        __extends(BaseOperate, _super);
        function BaseOperate() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._complete = false;
            return _this;
        }
        Object.defineProperty(BaseOperate.prototype, "state", {
            get: function () {
                return this._state;
            },
            set: function (value) {
                this._state = value;
            },
            enumerable: true,
            configurable: true
        });
        BaseOperate.prototype.getType = function () {
            return 'none';
        };
        Object.defineProperty(BaseOperate.prototype, "type", {
            get: function () {
                return this.getType();
            },
            enumerable: true,
            configurable: true
        });
        BaseOperate.prototype.setComplete = function () {
            this._complete = true;
        };
        BaseOperate.prototype.getIsComplete = function () {
            return this._complete;
        };
        Object.defineProperty(BaseOperate.prototype, "isComplete", {
            get: function () {
                return this.getIsComplete();
            },
            enumerable: true,
            configurable: true
        });
        BaseOperate.prototype.getName = function () {
            return this._name;
        };
        BaseOperate.prototype.setName = function (val) {
            this._name = val;
            var result = this;
            return result;
        };
        BaseOperate.prototype.serialize = function () {
            return null;
        };
        BaseOperate.prototype.unserialize = function (data) {
        };
        BaseOperate.prototype.enter = function (component) {
        };
        BaseOperate.prototype.exit = function (component) {
        };
        return BaseOperate;
    }(egret.HashObject));
    dragon.BaseOperate = BaseOperate;
})(dragon || (dragon = {}));
var dragon;
(function (dragon) {
    /**
     * 弹框基类
     * @export
     * @class Box
     * @extends {dragon.BaseComponent}
     */
    var CommonBox = /** @class */ (function (_super) {
        __extends(CommonBox, _super);
        function CommonBox() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _this = _super.apply(this, args) || this;
            _this._maskClick = false;
            _this.removeMaskEvent();
            return _this;
        }
        Object.defineProperty(CommonBox.prototype, "maskClick", {
            get: function () {
                return this._maskClick;
            },
            set: function (value) {
                this._maskClick = value;
                if (dragon.UI.getBoxMask() && value) {
                    dragon.UI.getBoxMask().addClickListener(this.closeView, this);
                }
            },
            enumerable: true,
            configurable: true
        });
        CommonBox.prototype.closeView = function () {
            this.removeMaskEvent();
            dragon.display.removeFromParent(this);
        };
        CommonBox.prototype.removeMaskEvent = function () {
            if (dragon.UI.getBoxMask()) {
                dragon.UI.getBoxMask().removeClickListener(this.closeView, this);
            }
        };
        CommonBox.prototype.setCenter = function () {
            if (this.display) {
                this.display.x = (dragon.stage.stageWidth - this.display.width) / 2 + this.display.pivotX * this.display.width;
                this.display.y = (dragon.stage.stageHeight - this.display.height) / 2 + this.display.pivotY * this.display.height;
                ;
                // this.display.addRelation(fairygui.GRoot.inst, fairygui.RelationType.Left_Center);
                // this.display.addRelation(fairygui.GRoot.inst, fairygui.RelationType.Middle_Middle);
            }
        };
        CommonBox.prototype.onClose = function () {
            _super.prototype.onClose.call(this);
            dragon.UI.clearBoxMask();
        };
        return CommonBox;
    }(dragon.BaseComponent));
    dragon.CommonBox = CommonBox;
})(dragon || (dragon = {}));
var dragon;
(function (dragon) {
    /**
     * 场景底层绘图区（在这可以添加原生Sprite）
     * @export
     * @class BaseCanvas
     * @extends {frame.scene.Canvas}
     */
    var BaseCanvas = /** @class */ (function (_super) {
        __extends(BaseCanvas, _super);
        function BaseCanvas(display) {
            return _super.call(this, display) || this;
        }
        /**
         * 退出
         */
        BaseCanvas.prototype.onExit = function () {
            _super.prototype.onExit.call(this);
        };
        return BaseCanvas;
    }(frame.scene.Canvas));
    dragon.BaseCanvas = BaseCanvas;
})(dragon || (dragon = {}));
var dragon;
(function (dragon) {
    /**
     * 场景加载界面
     * @export
     * @abstract
     * @class LoadingScene
     * @extends {frame.scene.Scene}
     */
    var BaseLoadingScene = /** @class */ (function (_super) {
        __extends(BaseLoadingScene, _super);
        function BaseLoadingScene() {
            var _this = _super.call(this) || this;
            _this._urls = _this.urls();
            return _this;
        }
        /**
         * 添加资源路径
         * @param {string} url
         * @memberof BaseLoadingScene
         */
        BaseLoadingScene.prototype.push = function (url) {
            this._urls.push(url);
        };
        BaseLoadingScene.prototype.onOpen = function () {
            console.log("进入Loading");
            // this.load();
        };
        BaseLoadingScene.prototype.onClose = function () {
            console.log("退出Loading");
        };
        BaseLoadingScene.prototype.load = function () {
            this.loaders = new frame.loading.LoaderList();
            var length = this._urls.length;
            for (var i = 0; i < length; ++i)
                this.loaders.addChild(new frame.loading.LoaderItem(this._urls[i]));
            this.loaders.addEventListener(egret.Event.COMPLETE, this._onComplete, this);
            this.loaders.addEventListener(egret.ProgressEvent.PROGRESS, this._onProgress, this);
            this.loaders.load();
        };
        BaseLoadingScene.prototype._onComplete = function (event) {
            this.onComplete();
            this.dispatchEventWith(egret.Event.COMPLETE);
        };
        BaseLoadingScene.prototype._onProgress = function (event) {
            var progress = event.data;
            this.onProgress(progress);
        };
        BaseLoadingScene.prototype.newCanvas = function (root) {
            return new dragon.BaseCanvas(root);
        };
        return BaseLoadingScene;
    }(frame.scene.Scene));
    dragon.BaseLoadingScene = BaseLoadingScene;
})(dragon || (dragon = {}));
var dragon;
(function (dragon) {
    /**
     * 基础场景类（实际场景类）
     * @export
     * @class BaseScene
     * @extends {frame.scene.Scene}
     */
    var BaseScene = /** @class */ (function (_super) {
        __extends(BaseScene, _super);
        function BaseScene() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * 进入场景
         * @memberof BaseScene
         */
        BaseScene.prototype.onOpen = function () {
        };
        /**
         * 退出场景
         * @memberof BaseScene
         */
        BaseScene.prototype.onClose = function () {
        };
        /**
         * 设置场景绘图区
         * @protected
         * @param {egret.Sprite} root
         * @returns {frame.scene.Canvas}
         * @memberof BaseScene
         */
        BaseScene.prototype.newCanvas = function (root) {
            return null;
        };
        return BaseScene;
    }(frame.scene.Scene));
    dragon.BaseScene = BaseScene;
})(dragon || (dragon = {}));
var dragon;
(function (dragon) {
    /**
     * 场景管理器
     * @export
     * @class SceneManager
     * @extends {frame.scene.SceneManager}
     */
    var SceneManager = /** @class */ (function (_super) {
        __extends(SceneManager, _super);
        function SceneManager(root) {
            var _this = this;
            if (SceneManager.INSTANCE) {
                throw new Error("ERROR");
            }
            else {
                _this = _super.call(this, root) || this;
                SceneManager.INSTANCE = _this;
            }
            return _this;
        }
        SceneManager.getInstance = function () {
            return SceneManager.INSTANCE;
        };
        /**
         * 表明场景要使用的窗口管理器
         */
        SceneManager.prototype.newWindows = function (root) {
            return dragon.UI.getInstance();
        };
        return SceneManager;
    }(frame.scene.SceneManager));
    dragon.SceneManager = SceneManager;
    /**
     * 获取全局场景管理器
     * @export
     * @param {egret.Sprite} root
     * @returns {dragon.SceneManager}
     */
    function getSceneManager(root) {
        return new dragon.SceneManager(root);
    }
    dragon.getSceneManager = getSceneManager;
})(dragon || (dragon = {}));
var dragon;
(function (dragon) {
    /**
      * 有loading界面的场景
      */
    var SceneMerger = /** @class */ (function (_super) {
        __extends(SceneMerger, _super);
        function SceneMerger() {
            var _this = _super.call(this) || this;
            _this.studio = _this.newStudio();
            _this.loading = _this.newLoading();
            return _this;
        }
        /**
         * 开始加载资源
         */
        SceneMerger.prototype.load = function () {
            var urls = this.urls();
            for (var i = 0; i < urls.length; ++i)
                this.loading.push(urls[i]);
            this.loading.addEventListener(egret.Event.COMPLETE, this._onComplete, this);
        };
        SceneMerger.prototype.onOpen = function () {
            this.open(this.loading);
            this.load();
            this.loading.load();
        };
        SceneMerger.prototype.onClose = function () {
        };
        SceneMerger.prototype._onComplete = function (event) {
            this.open(this.studio);
        };
        return SceneMerger;
    }(frame.scene.SceneSet));
    dragon.SceneMerger = SceneMerger;
})(dragon || (dragon = {}));
/*
 * tip和confirm相关接口
 * @Author: Andrew_Huang
 * @Date: 2018-04-24 13:48:42
 * @Last Modified by:   Andrew_Huang
 * @Last Modified time: 2018-04-24 13:48:42
 */
var dragon;
(function (dragon) {
    /**
     * 确认框按钮类型
     * @export
     * @enum {number}
     */
    var ConfirmButton;
    (function (ConfirmButton) {
        ConfirmButton[ConfirmButton["close"] = 0] = "close";
        ConfirmButton[ConfirmButton["yes"] = 1] = "yes";
        ConfirmButton[ConfirmButton["no"] = 2] = "no";
    })(ConfirmButton = dragon.ConfirmButton || (dragon.ConfirmButton = {}));
})(dragon || (dragon = {}));
/**
 * @author Andrew_Huang
 */
var dragon;
(function (dragon) {
    var _proxyLoadingMap = {}; //请求时的加载界面实例映射
    var _loading; //场景加载时的实例映射
    var _tooltip; //tip
    /**
     * 获取请求时的进度加载实例（打开进度加载）,可自定义加载皮肤
     * @param {string} skinName
     * @returns {IProgressLoading}
     */
    function getProgressLoading(skinName) {
        if (!_proxyLoadingMap.hasOwnProperty(skinName)) {
            var loading = dragon.getDefinitionInstance(dragon.getSetting().ProgressLoadingClass, null, skinName);
            if (DEBUG && !loading) {
                console.error("请配置ProgressLoadingClass");
            }
            if (loading) {
                dragon.UI.addTooltip(loading);
                _proxyLoadingMap[skinName] = loading;
            }
        }
        return _proxyLoadingMap[skinName];
    }
    /**
     * 获取场景加载界面实例（打开场景加载）
     * @returns {IProgressLoading}
     */
    function getLoadScene() {
        var loading = dragon.getDefinitionInstance(dragon.getSetting().LoadSceneClass, null);
        if (loading) {
            //dragon.UI.runScene(loading);
        }
        return loading;
    }
    /**
     * 获取通用加载界面实例（打开进度加载界面）
     * @returns {ISimpleLoading}
     */
    function getSimpleLoading() {
        if (!_loading) {
            _loading = dragon.getDefinitionInstance(dragon.getSetting().SimpleLoadingClass, null);
            if (DEBUG && !_loading) {
                console.error('请配置SimpleLoadingClass');
            }
            if (_loading) {
                dragon.UI.addTooltip(_loading);
            }
        }
        return _loading;
    }
    /**
     * 显示简单加载条
     * @export
     */
    function showSimpleLoading() {
        var loading = getSimpleLoading();
        if (loading) {
            loading.show();
        }
    }
    dragon.showSimpleLoading = showSimpleLoading;
    /**
     * 隐藏简单加载条
     * @export
     */
    function hideSimpleLoading() {
        var loading = getSimpleLoading();
        if (loading) {
            loading.hide();
        }
    }
    dragon.hideSimpleLoading = hideSimpleLoading;
    // private scens: frame.layout.SceneManger;
    /**
     * 获取 tip 实例
     * @returns {ITooltip}
     */
    function getTooltip() {
        if (!_tooltip) {
            _tooltip = dragon.getDefinitionInstance(dragon.getSetting().TooltipClass);
            if (_tooltip) {
                dragon.UI.addTooltip(_tooltip);
            }
            if (DEBUG && !_tooltip) {
                console.error("请配置TooltipClass");
            }
        }
        return _tooltip;
    }
    /**
     * 显示浮动 tip 提示
     * @export
     * @param {(dragon.TooltipInfo | string)} info
     * @param {string} [display]
     */
    function tooltip(info, display) {
        var tip = getTooltip();
        if (tip) {
            tip.show(info, display);
        }
    }
    dragon.tooltip = tooltip;
    function customTooltip(display, data, delay) {
        var tip = getTooltip();
        if (tip) {
            tip.customView(display, data, delay);
        }
    }
    dragon.customTooltip = customTooltip;
    var BoxType;
    (function (BoxType) {
        BoxType[BoxType["Box"] = 0] = "Box";
        BoxType[BoxType["HistoryBox"] = 1] = "HistoryBox";
        BoxType[BoxType["SequnceBox"] = 2] = "SequnceBox";
        BoxType[BoxType["GroupSequnceBox"] = 3] = "GroupSequnceBox";
    })(BoxType = dragon.BoxType || (dragon.BoxType = {}));
    /**
     * 弹出提示框
     * @export
     * @param {(ConfirmInfo | string)} info
     * @param {BoxType} [boxType=BoxType.Box]
     * @param {any} args
     * @returns {*}
     */
    function confirm(info, boxType) {
        var _this = this;
        if (boxType === void 0) { boxType = BoxType.Box; }
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var promise = new Promise(function (resolve, reject) {
            var result = dragon.getDefinitionInstance(dragon.getSetting().ConfirmClass, null, info);
            if (result) {
                if (boxType == BoxType.Box) {
                    dragon.UI.addBox(result);
                }
                else if (boxType == BoxType.HistoryBox) {
                    (_a = dragon.UI).addHistoryBox.apply(_a, [result].concat(args));
                }
                else if (boxType == BoxType.SequnceBox) {
                    (_b = dragon.UI).addSequenceBox.apply(_b, [result].concat(args));
                }
                else if (boxType == BoxType.GroupSequnceBox) {
                    dragon.UI.addGroupSequenceBox(result, args[0], args[1], args.slice(2));
                }
                result.show(function (button) {
                    if (button == dragon.ConfirmButton.yes) {
                        resolve();
                    }
                    else {
                        reject(button);
                    }
                }, _this);
            }
            var _a, _b;
        });
        return promise;
    }
    dragon.confirm = confirm;
})(dragon || (dragon = {}));
/**
 * @author Andrew_Huang
 */
var dragon;
(function (dragon) {
    var HookAction;
    (function (HookAction) {
        HookAction[HookAction["SET_DATA"] = 0] = "SET_DATA";
        HookAction[HookAction["ADD_OPERATE"] = 1] = "ADD_OPERATE";
    })(HookAction = dragon.HookAction || (dragon.HookAction = {}));
    /**
     * UI 层级类型
     * @export
     * @enum {number}
     */
    var UIType;
    (function (UIType) {
        UIType[UIType["MIN"] = 0] = "MIN";
        UIType[UIType["TOOLTIP"] = 1] = "TOOLTIP";
        UIType[UIType["GUIDE"] = 2] = "GUIDE";
        UIType[UIType["BOX"] = 3] = "BOX";
        UIType[UIType["TOPSCENE"] = 4] = "TOPSCENE";
        UIType[UIType["MENU"] = 5] = "MENU";
        UIType[UIType["PANEL"] = 6] = "PANEL";
        UIType[UIType["COMMON"] = 7] = "COMMON";
        UIType[UIType["SCENE"] = 8] = "SCENE";
        UIType[UIType["ANY"] = 9] = "ANY";
    })(UIType = dragon.UIType || (dragon.UIType = {}));
    /**
     * UI 事件
     * @export
     * @class UIEvent
     * @extends {egret.Event}
     */
    var UIEvent = /** @class */ (function (_super) {
        __extends(UIEvent, _super);
        function UIEvent(type, component, group) {
            if (group === void 0) { group = null; }
            var _this = _super.call(this, type) || this;
            _this._component = component;
            _this._group = group;
            return _this;
        }
        Object.defineProperty(UIEvent.prototype, "component", {
            get: function () {
                return this._component;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIEvent.prototype, "group", {
            get: function () {
                return this._group;
            },
            enumerable: true,
            configurable: true
        });
        UIEvent.SHOW_PANEL = "showpanel";
        UIEvent.HIDE_PANEL = "hidepanel";
        UIEvent.ADD_BOX = "addbox";
        UIEvent.CLEAR_SEQUENCE_BOX = "clear_sequence";
        UIEvent.REMOVE_BOX = "removebox";
        UIEvent.RUN_SCENE = "runscene";
        UIEvent.REMOVE_SCENE = "removescene";
        UIEvent.SET_MENU = "setmenu";
        UIEvent.REMOVE_MENU = "removemenu";
        UIEvent.ADD_TOOLTIP = "addtooltip";
        UIEvent.REMOVE_TOOLTIP = "removetooltip";
        UIEvent.ADD_GUIDE = "addguide";
        UIEvent.REMOVE_GUIDE = "remove_guide";
        UIEvent.ADD_COMPONENT = "add_component";
        UIEvent.REMOVE_COMPONENT = "remove_component";
        UIEvent.ADD_COMMON = "add_common";
        UIEvent.REMOVE_COMMON = "remove_common";
        return UIEvent;
    }(egret.Event));
    dragon.UIEvent = UIEvent;
    /**
     * UI 记录
     * @export
     * @class UIHistory
     */
    var UIHistory = /** @class */ (function () {
        function UIHistory() {
            this._history = [];
        }
        UIHistory.prototype.pushHistory = function (type, args, isUnder, hookList) {
            if (hookList === void 0) { hookList = []; }
            this._history.push({ type: type, args: args, isUnder: isUnder, hookList: hookList });
        };
        UIHistory.prototype.getLastItem = function () {
            if (this.count()) {
                return this._history[this.count() - 1];
            }
        };
        UIHistory.prototype.count = function () {
            return this._history.length;
        };
        UIHistory.prototype.hasHistory = function () {
            return this._history.length > 0;
        };
        UIHistory.prototype.clear = function () {
            this._history.length = 0;
        };
        UIHistory.prototype.popHistory = function () {
            return this._history.pop();
        };
        return UIHistory;
    }());
    dragon.UIHistory = UIHistory;
    var Container = frame.layout.Container;
    /**
     * UI 控制器
     * 层级从下往上:场景层、公共UI层、面板层、菜单层、弹框层、新手引导层、浮动层
     * @export
     * @class UI
     * @extends {fairygui.UIContainer}
     */
    var UI = /** @class */ (function (_super) {
        __extends(UI, _super);
        function UI(root) {
            var _this = _super.call(this, root) || this;
            _this._panelTypeMap = {}; //面板信息映射表
            _this._panelInstanceMap = {}; //面板实例映射
            _this._currentPanel = null; //当前面板
            _this._sequenceBoxMap = {}; //弹框序列映射
            _this._common = new Container();
            _this.addChild(_this._common);
            _this._panel = new Container();
            _this.addChild(_this._panel);
            _this._menu = new Container();
            _this.addChild(_this._menu);
            _this._topScene = new Container();
            _this.addChild(_this._topScene);
            _this._box = new Container();
            _this.addChild(_this._box);
            _this._guide = new Container();
            _this.addChild(_this._guide);
            _this._tooltip = new Container();
            _this.addChild(_this._tooltip);
            _this._containerArr = [_this._common, _this._panel, _this._menu, _this._topScene, _this._box, _this._guide, _this._tooltip];
            return _this;
        }
        /**
         * 注入面板到控制器中
         * @param {string} name 面板名称
         * @param {*} type      面板类型(类)
         * @param {*} args      参数列表
         * @memberof UI
         */
        UI.prototype.injectPanel = function (name, type, args) {
            this._panelTypeMap[name] = { name: name, type: type, args: args };
        };
        /**
         * 隐藏面板
         * @param {*} [panel]
         * @memberof UI
         */
        UI.prototype.hidePanel = function (panel) {
            if (!panel) {
                this.setPanelHide(this._currentPanel);
            }
            else {
                if (is.string(panel)) {
                    this.setPanelHide(this._panelInstanceMap[panel]);
                }
                else {
                    this.setPanelHide(panel);
                }
            }
        };
        /**
         * 面板是否显示
         * @param {string} name
         * @returns {boolean}
         * @memberof UI
         */
        UI.prototype.panelIsDisplay = function (name) {
            if (this._currentPanel && this._currentPanel.getComponentName() == name) {
                return this._currentPanel.visible;
            }
            return false;
        };
        /**
         * 设置面板隐藏
         * @private
         * @param {BaseComponent} panel
         * @memberof UI
         */
        UI.prototype.setPanelHide = function (panel) {
            if (this._currentPanel && this._currentPanel == panel) {
                this.onExit2(this._currentPanel, !this.panelInInstanceMap(panel));
                fairygui.GRoot.inst.dispatchEvent(new UIEvent(UIEvent.HIDE_PANEL, this._currentPanel));
            }
        };
        /**
         * 面板是否在实例映射表中
         * @private
         * @param {*} panel
         * @returns {boolean}
         * @memberof UI
         */
        UI.prototype.panelInInstanceMap = function (panel) {
            for (var key_3 in this._panelInstanceMap) {
                if (this._panelInstanceMap[key_3] == panel) {
                    return true;
                }
            }
            return false;
        };
        /**
         * 退出，执行相关动画与移除操作
         * @private
         * @param {BaseComponent} component
         * @param {boolean} remove
         * @memberof UI
         */
        UI.prototype.onExit2 = function (component, remove) {
            if (component.animation) {
                component.animation.close(function () {
                    component.display.visible = false;
                    if (remove) {
                        component.destroyData();
                        dragon.display.removeFromParent(component, true);
                    }
                });
            }
            else {
                if (remove) {
                    component.destroyData();
                    dragon.display.removeFromParent(component, true);
                }
            }
        };
        /**
         * 进入，执行相关动画操作
         * @private
         * @param {BaseComponent} component
         * @memberof UI
         */
        UI.prototype.onEnter2 = function (component) {
            var _this = this;
            if (component.animation) {
                component.displayObject.visible = true;
                if (component.displayObject.parent) {
                    this.showAnimation(component);
                }
                else {
                    component.displayObject.once(egret.Event.ADDED_TO_STAGE, function () {
                        _this.showAnimation(component);
                    }, this);
                }
            }
        };
        UI.prototype.showAnimation = function (component) {
            egret.callLater(function () {
                component.animation.show(function () { });
            }, this);
        };
        /**
         * 清除所有的弹框
         * @memberof UI
         */
        UI.prototype.clearBox = function () {
            this.boxHistory.clear();
            for (var i = this._box.numChildren - 1; i >= 0; i--) {
                var box = this._box.getChildAt(i);
                dragon.UI.remove(box, false);
            }
        };
        /**
         * 设置实例的动画
         * @private
         * @param {string} animationName 动画名
         * @param {*} instance           实例
         * @memberof UI
         */
        UI.prototype.setAnimation = function (animationName, instance) {
            if (!instance.animation && animationName) {
                var animType = egret.getDefinitionByName(animationName);
                if (animType) {
                    var animInstance = new animType();
                    instance.animation = animInstance;
                }
            }
        };
        /**
         * 显示面板（面板名为字符串）
         * @private
         * @param {string} name
         * @param {*} args
         * @returns {*}
         * @memberof UI
         */
        UI.prototype._showPanel = function (name, args) {
            this.setPanelHide(this._currentPanel);
            if (!this._panelInstanceMap.hasOwnProperty(name)) {
                var info = this._panelTypeMap[name];
                var inst = new ((_a = info.type).bind.apply(_a, [void 0].concat(info.args)))();
                this._panelInstanceMap[name] = inst;
                inst.componentName = name;
                // display.setFullDisplay(inst);
                this._panel.addChild(inst);
            }
            this._currentPanel = this._panelInstanceMap[name];
            this._currentPanel.setType(UIType.PANEL);
            if (this._currentPanel.setArgs) {
                (_b = this._currentPanel).setArgs.apply(_b, args);
            }
            //getSetting().PanelAnimation
            this.setAnimation(null, this._currentPanel);
            fairygui.GRoot.inst.dispatchEvent(new UIEvent(UIEvent.SHOW_PANEL, this._currentPanel));
            return this._currentPanel;
            var _a, _b;
        };
        /**
         * 添加面板层（面板名为非字符串）
         * @private
         * @param {*} panelType
         * @param {*} args
         * @returns {BaseComponent}
         * @memberof UI
         */
        UI.prototype._addPanel = function (panelType, args) {
            this.hidePanel(this._currentPanel);
            //getSetting().PanelAnimation
            var panelInst = this.getTypeInst(panelType, null, args, UIType.PANEL);
            // display.setFullDisplay(panelInst.display);
            this._panel.addChild(panelInst);
            this._currentPanel = panelInst;
            fairygui.GRoot.inst.dispatchEvent(new UIEvent(UIEvent.SHOW_PANEL, panelInst));
            fairygui.GRoot.inst.dispatchEvent(new UIEvent(UIEvent.ADD_COMPONENT, panelInst));
            return panelInst;
        };
        /**
         * 显示面板
         * @private
         * @param {*} panel
         * @param {*} args
         * @returns {BaseComponent}
         * @memberof UI
         */
        UI.prototype.showPanel = function (panel, args) {
            if (is.string(panel)) {
                return this._showPanel(panel, args);
            }
            else {
                return this._addPanel(panel, args);
            }
        };
        /**
         * 获取类型实例
         * @private
         * @param {*} type            类型
         * @param {string} animation  动画
         * @param {any[]} args        参数
         * @param {UIType} uiType     UI类型
         * @returns {BaseComponent}
         * @memberof UI
         */
        UI.prototype.getTypeInst = function (type, animation, args, uiType) {
            var inst = null;
            if (typeof type == 'string') {
                if (uiType == UIType.BOX) {
                    //type = dragon.getDefinitionType(getSetting().BoxClass, BaseComponent);
                    type = dragon.CommonBox;
                }
                else {
                    type = dragon.CommonBox;
                }
            }
            if (type.constructor.name == 'Function') {
                inst = new (type.bind.apply(type, [void 0].concat(args)))();
            }
            else {
                inst = type;
                if (inst.setArgs) {
                    inst.setArgs(args);
                }
            }
            if (inst instanceof dragon.BaseComponent) {
                inst.setType(uiType);
            }
            // if (egret.is(inst, 'dragon.BaseComponent'))
            // {
            //     inst.setType(uiType);
            // }
            this.setAnimation(animation, inst);
            this.onEnter2(inst);
            return inst;
        };
        /**
         * 设置主菜单栏
         * @private
         * @param {*} menuTtype
         * @param {*} args
         * @memberof UI
         */
        UI.prototype.setMenu = function (menuTtype, args) {
            if (this._menuInst) {
                this.remove(this._menuInst);
            }
            var menuInst = this.getTypeInst(menuTtype, null, args, dragon.UIType.MENU);
            // display.setFullDisplay(menuInst.display);
            this._menuInst = menuInst;
            this._menuInst.display.y = dragon.stage.stageHeight - this._menuInst.display.height;
            this._menu.addChild(this._menuInst);
            fairygui.GRoot.inst.dispatchEvent(new UIEvent(UIEvent.SET_MENU, menuInst));
            fairygui.GRoot.inst.dispatchEvent(new UIEvent(UIEvent.ADD_COMPONENT, menuInst));
        };
        /**
         * 添加引导层
         * @private
         * @param {*} guideType
         * @param {*} args
         * @returns {BaseComponent}
         * @memberof UI
         */
        UI.prototype.addGuide = function (guideType, args) {
            var guideInst = this.getTypeInst(guideType, null, args, dragon.UIType.GUIDE);
            // display.setFullDisplay(guideInst.display);
            this._guide.addChild(guideInst);
            fairygui.GRoot.inst.dispatchEvent(new UIEvent(UIEvent.ADD_GUIDE, guideInst));
            fairygui.GRoot.inst.dispatchEvent(new UIEvent(UIEvent.ADD_COMPONENT, guideInst));
            return guideInst;
        };
        UI.prototype.addBox = function (boxType, args) {
            // if (this.isFindBox(boxType, args))
            // {
            //     return;
            // }
            // this.addBoxMask();
            //getSetting().BoxAnimation
            var boxInst = this.getTypeInst(boxType, null, args, UIType.BOX);
            // display.setFullDisplay(boxInst.display);
            this._box.addChild(boxInst);
            fairygui.GRoot.inst.dispatchEvent(new UIEvent(UIEvent.ADD_BOX, boxInst));
            fairygui.GRoot.inst.dispatchEvent(new UIEvent(UIEvent.ADD_COMPONENT, boxInst));
            return boxInst;
        };
        UI.prototype.isFindBox = function (boxType, args) {
            var boxClassName = '';
            if (typeof boxType == 'string') {
                boxClassName = boxType;
            }
            else if (typeof boxType == 'function') {
                boxClassName = boxType.name;
            }
            if (boxClassName) {
                for (var i = 0; i < this._box.numChildren; i++) {
                    var child = this._box.getChildAt(i);
                    if (boxClassName == child['$_class']) {
                        return true;
                    }
                }
            }
            return false;
        };
        UI.prototype.addBoxMask = function () {
            // let index: number = this._box.numChildren - 1 > 0 ? this._box.numChildren - 1 : 0;
            // if (!this._boxMask)
            // {
            // 	this._boxMask = new fairygui.GGraph();
            // 	this._boxMask.name = dragon.UI_TYPE.MASK;
            // 	this._boxMask.setSize(dragon.stage.width, dragon.stage.height);
            // 	this._boxMask.drawRect(1, 0x000000, 0, 0x000000, 0.3);
            // 	this._box.addChildAt(this._boxMask, index);
            // }
            // else
            // {
            // 	this._box.setChildIndex(this._boxMask, index);
            // }
        };
        UI.prototype.clearBoxMask = function () {
            // let mask = this._box.getChild(dragon.UI_TYPE.MASK);
            // let num: number = this._box.numChildren;
            // if (mask && num == 1)
            // {
            // 	this._box.removeChildren();
            // 	this._boxMask.dispose();
            // 	this._boxMask = null;
            // }
            // else if (mask && num >= 2)
            // {
            // 	this._box.setChildIndex(this._boxMask, this._box.numChildren - 2);
            // }
        };
        UI.prototype.getBoxMask = function () {
            return this._boxMask;
        };
        /**
         * 添加通用普通界面
         * @private
         * @param {*} commonType
         * @param {*} args
         * @memberof UI
         */
        UI.prototype.addCommon = function (commonType, args) {
            var commonInst = this.getTypeInst(commonType, null, args, UIType.COMMON);
            // display.setFullDisplay(commonInst.display);
            this._common.addChild(commonInst);
            fairygui.GRoot.inst.dispatchEvent(new UIEvent(UIEvent.ADD_COMMON, commonInst));
            fairygui.GRoot.inst.dispatchEvent(new UIEvent(UIEvent.ADD_COMPONENT, commonInst));
        };
        /**
         * 添加tips
         * @private
         * @param {*} tooltipType
         * @param {*} args
         * @memberof UI
         */
        UI.prototype.addTooltip = function (tooltipType, args) {
            var tooltipInst = this.getTypeInst(tooltipType, null, args, UIType.TOOLTIP);
            // display.setFullDisplay(tooltipInst.display);
            this._tooltip.addChild(tooltipInst);
            if (egret.is(tooltipInst, 'dragon.BaseComponent')) {
                fairygui.GRoot.inst.dispatchEvent(new UIEvent(UIEvent.ADD_TOOLTIP, tooltipInst));
                fairygui.GRoot.inst.dispatchEvent(new UIEvent(UIEvent.ADD_COMPONENT, tooltipInst));
            }
        };
        /**
         * 添加定级场景
         * @private
         * @param {*} sceneType
         * @param {*} args
         * @returns {BaseComponent}
         * @memberof UI
         */
        UI.prototype.addTopScene = function (sceneType, args) {
            //getSetting().SceneAnimation
            var sceneInst = this.getTypeInst(sceneType, null, args, UIType.SCENE);
            this._topScene.addChild(sceneInst);
            return sceneInst;
        };
        /**
         * 移除
         * @private
         * @param {*} instance
         * @param {boolean} [isHistory=null]
         * @param {boolean} [checkHistory=true]
         * @memberof UI
         */
        UI.prototype.remove = function (instance, isHistory, checkHistory) {
            var _this = this;
            if (isHistory === void 0) { isHistory = null; }
            if (checkHistory === void 0) { checkHistory = true; }
            var gotoHistory = isHistory;
            if (!isHistory && instance.isHistoryComponent()) {
                gotoHistory = true;
            }
            if (instance.isType(UIType.BOX) === true) {
                this.onExit2(instance, true);
                if (checkHistory) {
                    this.checkHistory(gotoHistory, this.boxHistory, function (item) {
                        _this.addHistoryBox(item.type, item.args);
                    });
                }
            }
            else if (instance.isType(UIType.SCENE) === true) {
                this.onExit2(instance, true);
                if (checkHistory) {
                    this.checkHistory(gotoHistory, this.sceneHistory, function (item) {
                        // this.addScene(item.type, item.isUnder, item.args);
                    });
                }
            }
            else if (instance.isType(UIType.PANEL) === true) {
                this.hidePanel(instance);
                if (checkHistory) {
                    this.checkHistory(gotoHistory, this.panelHistory, function (item) {
                        _this.resetHookList(_this.showHistoryPanel(item.type, item.args), item.hookList);
                    });
                }
            }
            else {
                this.onExit2(instance, true);
            }
            if (instance.isType(UIType.BOX) === true) {
                fairygui.GRoot.inst.dispatchEvent(new UIEvent(UIEvent.REMOVE_BOX, instance));
                fairygui.GRoot.inst.dispatchEvent(new UIEvent(UIEvent.REMOVE_COMPONENT, instance));
                this.onRemoveBox(instance);
            }
            else if (instance.isType(UIType.SCENE) === true) {
                fairygui.GRoot.inst.dispatchEvent(new UIEvent(UIEvent.REMOVE_SCENE, instance));
                fairygui.GRoot.inst.dispatchEvent(new UIEvent(UIEvent.REMOVE_COMPONENT, instance));
            }
            else if (instance.isType(UIType.MENU) === true) {
                fairygui.GRoot.inst.dispatchEvent(new UIEvent(UIEvent.REMOVE_MENU, instance));
                fairygui.GRoot.inst.dispatchEvent(new UIEvent(UIEvent.REMOVE_COMPONENT, instance));
            }
            else if (instance.isType(UIType.GUIDE) === true) {
                fairygui.GRoot.inst.dispatchEvent(new UIEvent(UIEvent.REMOVE_GUIDE, instance));
                fairygui.GRoot.inst.dispatchEvent(new UIEvent(UIEvent.REMOVE_COMPONENT, instance));
            }
            else if (instance.isType(UIType.TOOLTIP) === true) {
                fairygui.GRoot.inst.dispatchEvent(new UIEvent(UIEvent.REMOVE_TOOLTIP, instance));
                fairygui.GRoot.inst.dispatchEvent(new UIEvent(UIEvent.REMOVE_COMPONENT, instance));
            }
            else if (instance.isType(UIType.COMMON) === true) {
                fairygui.GRoot.inst.dispatchEvent(new UIEvent(UIEvent.REMOVE_COMMON, instance));
                fairygui.GRoot.inst.dispatchEvent(new UIEvent(UIEvent.REMOVE_COMPONENT, instance));
            }
        };
        /**
         * 显示记录面板
         * @private
         * @param {*} type
         * @param {*} args
         * @returns {BaseComponent}
         * @memberof UI
         */
        UI.prototype.showHistoryPanel = function (type, args) {
            var hookList = [];
            var hook = {
                setData: function (data, type) {
                    hookList.push({ action: HookAction.SET_DATA, data: data, type: type });
                }, addOperate: function (operate) {
                    hookList.push({ action: HookAction.ADD_OPERATE, operate: operate, data: operate.serialize() });
                }
            };
            this.panelHistory.pushHistory(type, args, false, hookList);
            var panel = this.showPanel(type, args);
            panel.hook = hook;
            panel.setHistoryComponent(true);
            return panel;
        };
        /**
         * 显示记录弹框
         * @private
         * @param {*} boxType
         * @param {*} args
         * @memberof UI
         */
        UI.prototype.addHistoryBox = function (boxType, args) {
            for (var i = this._box.numChildren - 1; i >= 0; i--) {
                var boxInst = this._box.getChildAt(i);
                if (boxInst.isHistoryComponent() === true) {
                    dragon.display.removeFromParent(boxInst, true);
                }
            }
            this.boxHistory.pushHistory(boxType, args, false);
            var box = this.addBox(boxType, args);
            box.setHistoryComponent(true);
        };
        /**
         * 记录检查
         * @private
         * @param {boolean} gotoHistory
         * @param {UIHistory} history
         * @param {Function} gotoBackFun
         * @returns {void}
         * @memberof UI
         */
        UI.prototype.checkHistory = function (gotoHistory, history, gotoBackFun) {
            if (!history) {
                return;
            }
            if (gotoHistory && history.hasHistory()) {
                history.popHistory();
                var item = history.getLastItem();
                if (item) {
                    gotoBackFun(item);
                }
            }
            else {
                history.clear();
            }
        };
        /**
         * 重置面板的钩子列表
         * @private
         * @param {BaseComponent} panel
         * @param {any[]} hookList
         * @memberof UI
         */
        UI.prototype.resetHookList = function (panel, hookList) {
            for (var i = 0; i < hookList.length; i++) {
                var item = hookList[i];
                if (item.action == HookAction.SET_DATA) {
                    panel.setData(item.data, item.type);
                }
                else if (item.action == HookAction.ADD_OPERATE) {
                    var data_1 = item.data;
                    item.operate.unserialize(data_1);
                    // panel.addOperate(item.operate);
                }
            }
        };
        /**
         * 添加序列弹框
         * @private
         * @param {*} boxType
         * @param {string} group
         * @param {number} priority
         * @param {*} args
         * @param {string} [type=null]
         * @memberof UI
         */
        UI.prototype.addSequnceBox = function (boxType, group, priority, args, type) {
            if (type === void 0) { type = null; }
            if (!this._sequenceBoxMap.hasOwnProperty(group)) {
                this._sequenceBoxMap[group] = [];
            }
            var arr = this._sequenceBoxMap[group];
            var obj = { boxType: boxType, group: group, args: args, priority: priority, type: type };
            if (!arr.length && group == '__normal__') {
                this.runSeqBox(arr, group, obj);
            }
            else {
                arr.push(obj);
                if (priority != -9999) {
                    arr = arr.sort(function (a, b) {
                        return b.priority - a.priority;
                    });
                }
            }
        };
        UI.prototype.getSequnceCount = function (group) {
            var arr = this._sequenceBoxMap[group];
            if (arr && arr.length > 0) {
                return arr.length;
            }
            return 0;
        };
        UI.prototype.runSequnceBox = function (group) {
            var arr = this._sequenceBoxMap[group];
            if (arr && arr.length > 0) {
                var top_1 = arr.shift();
                this.runSeqBox(arr, group, top_1);
            }
        };
        UI.prototype.runSeqBox = function (arr, group, top) {
            var _this = this;
            var box = null;
            if (top.type == 'fun') {
                box = top.args[0];
                egret.callLater(function () {
                    box(function () {
                        _this.onRemoveBox(box);
                    });
                }, this);
            }
            else {
                box = this.addBox(top.boxType, top.args);
            }
            box['__box_group__'] = group;
            arr.push(box);
        };
        UI.prototype.onRemoveBox = function (box) {
            var group = box['__box_group__'];
            if (group) {
                var arr = this._sequenceBoxMap[group];
                if (arr) {
                    var idx = arr.indexOf(box);
                    if (idx > -1) {
                        arr.splice(idx, 1);
                    }
                    if (!arr.length) {
                        delete this._sequenceBoxMap[group];
                        fairygui.GRoot.inst.dispatchEvent(new UIEvent(UIEvent.CLEAR_SEQUENCE_BOX, null, group));
                    }
                    else {
                        var top_2 = arr.shift();
                        this.runSeqBox(arr, group, top_2);
                    }
                }
            }
        };
        /**
         * 根据名称获取组件
         * @private
         * @param {string} name
         * @param {egret.DisplayObjectContainer} container
         * @returns {BaseComponent}
         * @memberof UI
         */
        UI.prototype.getComponentByName = function (name, container) {
            var num = container.numChildren;
            for (var i = 0; i < num; i++) {
                var child = container.getChildAt(i);
                if (child.componentName == name) {
                    return child;
                }
            }
            return null;
        };
        /**
         * 获取组件
         * @param {string} name
         * @returns {IComponent}
         * @memberof UI
         */
        UI.prototype.getComponent = function (name) {
            var pullComponent = dragon.pullObject(dragon.NoticeKey.GetComponent, name);
            if (pullComponent && pullComponent != name) {
                return pullComponent;
            }
            for (var i = 0; i < this._containerArr.length; i++) {
                var container = this._containerArr[i];
                var component = this.getComponentByName(name, container);
                if (component) {
                    return component;
                }
            }
            return null;
        };
        /**
         * 根据组件名，移除组件
         * @param {string} name
         * @memberof UI
         */
        UI.prototype.removeComponent = function (name) {
            var obj = this.getComponent(name);
            if (obj instanceof dragon.BaseComponent) {
                if (!this.isSingleContainer(obj)) {
                    this.remove(obj);
                }
            }
        };
        /**
         * 根据 UI 类型获取对应的层级的显示容器
         * @param {UIType} type
         * @returns {fairygui.UIContainer}
         * @memberof UI
         */
        UI.prototype.getContainerByType = function (type) {
            switch (type) {
                case UIType.COMMON: return this._common;
                case UIType.PANEL: return this._panel;
                case UIType.MENU: return this._menu;
                case UIType.TOPSCENE: return this._topScene;
                case UIType.BOX: return this._box;
                case UIType.GUIDE: return this._guide;
                case UIType.TOOLTIP: return this._tooltip;
            }
            return null;
        };
        /**
         * 是否存在面板显示着
         * @returns {boolean}
         * @memberof UI
         */
        UI.prototype.hasPanel = function () {
            var panel = this._panel;
            var num = this._panel.numChildren;
            for (var i = 0; i < num; i++) {
                var child = panel.getChildAt(i);
                if (child.visible) {
                    return true;
                }
            }
            return false;
        };
        /**
         * 判断组件是否是场景容器或者菜单容器
         * @private
         * @param {*} component
         * @returns {boolean}
         * @memberof UI
         */
        UI.prototype.isSingleContainer = function (component) {
            if (component.isType(UIType.SCENE) && component.isType(UIType.MENU)) {
                return true;
            }
            return false;
        };
        Object.defineProperty(UI.prototype, "boxHistory", {
            /**
             * 弹框记录列表
             * @readonly
             * @type {UIHistory}
             * @memberof UI
             */
            get: function () {
                return dragon.typeSingleton('__UI_BOX__', UIHistory);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UI.prototype, "panelHistory", {
            /**
             * 面板记录列表
             * @readonly
             * @type {UIHistory}
             * @memberof UI
             */
            get: function () {
                return dragon.typeSingleton('__UI_PANEL_', UIHistory);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UI.prototype, "sceneHistory", {
            /**
             * 场景记录列表
             * @readonly
             * @type {UIHistory}
             * @memberof UI
             */
            get: function () {
                return dragon.typeSingleton('__UI_SCENE__', UIHistory);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 设置根容器
         * @private
         * @param {fairygui.GComponent} container
         * @memberof UI
         */
        UI.prototype.setRoot = function (container) {
            if (container) {
                container.addChild(fairygui.GRoot.inst.displayListContainer);
            }
        };
        UI.getInstance = function () {
            return UI.INSTANCE ? UI.INSTANCE : UI.INSTANCE = new UI(fairygui.GRoot.inst);
        };
        // public static getComponent<T extends IComponent>(name: string): T;
        UI.getComponent = function (name) {
            return UI.getInstance().getComponent(name);
        };
        UI.panelIsDisplay = function (name) {
            return UI.getInstance().panelIsDisplay(name);
        };
        UI.hasPanel = function () {
            return UI.getInstance().hasPanel();
        };
        UI.removeComponentByName = function (name) {
            UI.getInstance().removeComponent(name);
        };
        UI.setMenu = function (type) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            UI.getInstance().setMenu(type, args);
        };
        UI.addGuide = function (type) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return UI.getInstance().addGuide(type, args);
        };
        UI.addBox = function (type) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return UI.getInstance().addBox(type, args);
        };
        UI.showPanel = function (type) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return UI.getInstance().showPanel(type, args);
        };
        UI.addCommon = function (type) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            UI.getInstance().addCommon(type, args);
        };
        UI.addTooltip = function (type) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            UI.getInstance().addTooltip(type, args);
        };
        UI.addTopScene = function (sceneType) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return UI.getInstance().addTopScene(sceneType, args);
        };
        UI.addSequenceBox = function (type) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            UI.getInstance().addSequnceBox(type, '_normal_', -99999, args);
        };
        UI.getSequenceCount = function (group) {
            return UI.getInstance().getSequnceCount(group);
        };
        UI.addHistoryBox = function (type) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            UI.getInstance().addHistoryBox(type, args);
        };
        UI.getBoxMask = function () {
            return UI.getInstance().getBoxMask();
        };
        UI.clearBoxMask = function () {
            UI.getInstance().clearBoxMask();
        };
        UI.showHistoryPanel = function (type) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return UI.getInstance().showHistoryPanel(type, args);
        };
        UI.runGroupSequenceBox = function (group) {
            UI.getInstance().runSequnceBox(group);
        };
        UI.injectPanel = function (name, type) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            args.unshift(name);
            UI.getInstance().injectPanel(name, type, args);
        };
        UI.remove = function (instance, gotoHistory) {
            if (gotoHistory === void 0) { gotoHistory = null; }
            UI.getInstance().remove(instance, gotoHistory);
        };
        UI.addGroupSequenceBox = function (type, group, priority) {
            var args = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                args[_i - 3] = arguments[_i];
            }
            UI.getInstance().addSequnceBox(type, group, priority, args);
        };
        UI.addGroupSequenceFun = function (fun, group, priority) {
            UI.getInstance().addSequnceBox(null, group, priority, [fun], 'fun');
        };
        UI.clearBox = function () {
            UI.getInstance().clearBox();
        };
        UI.getMenu = function () {
            var ui = UI.getInstance()._menuInst;
            return ui;
        };
        UI.getScene = function () {
            var ui = UI.getInstance()._sceneInst;
            return ui;
        };
        UI.getContainerByType = function (type) {
            return UI.getInstance().getContainerByType(type);
        };
        UI.hidePanel = function (panel) {
            UI.getInstance().hidePanel(panel);
        };
        Object.defineProperty(UI, "panelHistory", {
            get: function () {
                return UI.getInstance().panelHistory;
            },
            enumerable: true,
            configurable: true
        });
        UI.setBoxVisible = function (visible, without) {
            if (without === void 0) { without = null; }
            var u = UI.getInstance();
            for (var i = 0, len = u._box.numChildren; i < len; i++) {
                if (u._box.getChildAt(i).display != without) {
                    u._box.getChildAt(i).display.visible = visible;
                }
            }
        };
        UI.setRoot = function (container) {
            UI.getInstance().setRoot(container);
        };
        return UI;
    }(frame.layout.WindowManager));
    dragon.UI = UI;
})(dragon || (dragon = {}));
/*
 * @Author: Andrew_Huang
 * @Date: 2018-05-04 11:26:07
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-05-04 11:31:27
 */
var dragon;
(function (dragon) {
    /**
     * 龙骨骨架基础工厂
     * @author Andrew_Huang
     * @export
     * @class MovieBaseFactory
     * @extends {dragonBones.BaseFactory}
     */
    var MovieBaseFactory = /** @class */ (function (_super) {
        __extends(MovieBaseFactory, _super);
        function MovieBaseFactory(dataParser) {
            return _super.call(this, dataParser) || this;
        }
        MovieBaseFactory.prototype._buildTextureAtlasData = function (textureAtlasData, textureAtlas) {
            throw new Error("Method not implemented.");
        };
        MovieBaseFactory.prototype._buildArmature = function (dataPackage) {
            throw new Error("Method not implemented.");
        };
        MovieBaseFactory.prototype._buildSlot = function (dataPackage, slotData, displays, armature) {
            throw new Error("Method not implemented.");
        };
        /**
         * 将原始数据解析为 DragonBonesData 实例，并缓存到工厂中
         * @author Andrew_Huang
         * @param {*} rawData                 原始数据
         * @param {(string | null)} [name]    为该实例指定一个缓存名称，以便可以通过此名称获取该实例。 （如果未设置，则使用该实例中的名称）
         * @param {number} [scale]            为所有的骨架指定一个缩放值。 （默认: 1.0）
         * @returns {(dragonBones.DragonBonesData | null)}
         * @memberof MovieBaseFactory
         */
        MovieBaseFactory.prototype.parseDragonBonesData = function (rawData, name, scale) {
            return _super.prototype.parseDragonBonesData.call(this, rawData, name, scale);
        };
        /**
         * 将原始贴图集数据和贴图集对象解析为 TextureAtlasData 实例，并缓存到工厂中
         * @author Andrew_Huang
         * @param {*} rawData               原始贴图集数据
         * @param {*} textureAtlas          贴图集对象
         * @param {(string | null)} [name]  为该实例指定一个缓存名称，以便可以通过此名称获取该实例。 （如果未设置，则使用该实例中的名称）
         * @param {number} [scale]          为贴图集指定一个缩放值。 （默认: 1.0）
         * @returns {TextureAtlasData}
         * @memberof MovieBaseFactory
         */
        MovieBaseFactory.prototype.parseTextureAtlasData = function (rawData, textureAtlas, name, scale) {
            return _super.prototype.parseTextureAtlasData.call(this, rawData, textureAtlas, name, scale);
        };
        return MovieBaseFactory;
    }(dragonBones.BaseFactory));
    dragon.MovieBaseFactory = MovieBaseFactory;
    /**
     * 创建一个龙骨工厂实例。 （通常只需要一个全局工厂实例）
     * @author Andrew_Huang
     * @export
     * @returns {dragon.MovieBaseFactory}
     */
    function BaseFactory() {
        return dragon.singleton(dragon.MovieBaseFactory);
    }
    dragon.BaseFactory = BaseFactory;
})(dragon || (dragon = {}));
/*
 * @Author: Andrew_Huang
 * @Date: 2018-05-04 13:58:05
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-05-04 14:09:15
 */
var dragon;
(function (dragon) {
    /**
     * 龙骨动画事件
     * @author Andrew_Huang
     * @export
     * @class MovieEvent
     * @extends {egret.Event}
     */
    var MovieEvent = /** @class */ (function (_super) {
        __extends(MovieEvent, _super);
        function MovieEvent(name, label) {
            if (label === void 0) { label = null; }
            var _this = _super.call(this, name) || this;
            _this._frameLabel = label;
            return _this;
        }
        Object.defineProperty(MovieEvent.prototype, "frameLabel", {
            get: function () {
                return this._frameLabel;
            },
            enumerable: true,
            configurable: true
        });
        MovieEvent.START = 'start'; //动画开始
        MovieEvent.FRAME_LABEL = 'frame_label'; //帧捕捉
        MovieEvent.LOOP_COMPLETE = 'loop_complete'; //循环一次完成
        MovieEvent.COMPLETE = 'complete'; //完成
        return MovieEvent;
    }(egret.Event));
    dragon.MovieEvent = MovieEvent;
})(dragon || (dragon = {}));
/*
 * @Author: Andrew_Huang
 * @Date: 2018-05-04 11:40:42
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-05-04 11:43:26
 */
var dragon;
(function (dragon) {
    /**
     * 播放器（一次龙骨播放创建一个播放器）
     * @author Andrew_Huang
     * @export
     * @class MoviePlay
     * @implements {dragon.IMoviePlay}
     */
    var MoviePlay = /** @class */ (function () {
        function MoviePlay(name, playTimes) {
            this._name = name;
            this._playTimes = playTimes;
        }
        /**
         * 动画播放
         * @author Andrew_Huang
         * @param {dragonBones.Animation} animation
         * @memberof MoviePlay
         */
        MoviePlay.prototype.play = function (animation) {
            animation.play(this._name, this._playTimes);
        };
        Object.defineProperty(MoviePlay.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        return MoviePlay;
    }());
    dragon.MoviePlay = MoviePlay;
})(dragon || (dragon = {}));
/*
 * @Author: Andrew_Huang
 * @Date: 2018-05-04 10:16:39
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-05-04 14:10:35
 */
var dragon;
(function (dragon) {
    /**
     * 龙骨动画
     * @author Andrew_Huang
     * @export
     * @class DragonMovie
     * @extends {frame.animation.DragonBone}
     */
    var DragonMovie = /** @class */ (function (_super) {
        __extends(DragonMovie, _super);
        /**
         * 初始化
         * @author Andrew_Huang
         * @param {Object} skeleton       龙骨DragonBone的Json数据
         * @param {Object} format         纹理图集的Json数据
         * @param {egret.Texture} texture 纹理图集
         * @param {string} armatureName   骨架数据名称
         * @param {number} frameRate      帧频，控制动画播放速度
         * @memberof DragonMovie
         */
        function DragonMovie(skeleton, format, texture, armatureName, frameRate) {
            if (frameRate === void 0) { frameRate = null; }
            var _this = _super.call(this) || this;
            _this._frameRate = null; //帧频，控制动画播放速度
            _this._replaceDisplayArr = [];
            _this._intialized = false;
            if (skeleton && format && texture) {
                _this._skeleton = skeleton;
                _this._format = format;
                _this._texture = texture;
                _this._armatureName = armatureName;
                _this._frameRate = frameRate;
                _this.init();
            }
            else {
                console.warn('Please Check Skeleton Or Format Or Texture');
            }
            return _this;
        }
        DragonMovie.prototype.init = function () {
            this._factory = dragon.BaseFactory();
            this._bones = this._factory.parseDragonBonesData(this._skeleton);
            //this._factory.addDragonBonesData(this._bones);
            this._images = this._factory.parseTextureAtlasData(this._format, this._texture);
            //this._factory.addTextureAtlasData(this._images);
            if (!this._intialized) {
                this._intialized = true;
                if (this.stage) {
                    this.onAddToStage();
                }
                if (!this.hasEventListener(egret.Event.ADDED_TO_STAGE)) {
                    this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
                }
                if (!this.hasEventListener(egret.Event.REMOVED_FROM_STAGE)) {
                    this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
                }
            }
        };
        DragonMovie.prototype.onAddToStage = function () {
            if (this._armature) {
                dragonBones.WorldClock.clock.add(this._armature);
                if (this._armature.animation) {
                    this._armature.animation.play();
                }
                this._armature.addEventListener(dragonBones.EventObject.START, this.onStart, this);
                this._armature.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.onComplete, this);
                this._armature.addEventListener(dragonBones.EventObject.COMPLETE, this.onComplete, this);
                this._armature.addEventListener(dragonBones.EventObject.FRAME_EVENT, this.onFrame, this);
            }
        };
        DragonMovie.prototype.onRemoveFromStage = function () {
            dragonBones.WorldClock.clock.remove(this._armature);
            if (this._armature) {
                this._armature.addEventListener(dragonBones.EventObject.START, this.onStart, this);
                this._armature.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.onComplete, this);
                this._armature.addEventListener(dragonBones.EventObject.COMPLETE, this.onComplete, this);
                this._armature.addEventListener(dragonBones.EventObject.FRAME_EVENT, this.onFrame, this);
            }
        };
        DragonMovie.prototype._play = function () {
            if (this._armature) {
                this._moviePlay.play(this._armature.animation);
                return;
            }
            dragonBones.WorldClock.clock.remove(this._armature);
            this._armature = this._factory.buildArmature(this._armatureName);
            this._armature.display.x = 0;
            this._armature.display.y = 0;
            this._moviePlay.play(this._armature.animation);
            this._armature.addEventListener(dragonBones.EventObject.START, this.onStart, this);
            this._armature.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.onComplete, this);
            this._armature.addEventListener(dragonBones.EventObject.COMPLETE, this.onComplete, this);
            this._armature.addEventListener(dragonBones.EventObject.FRAME_EVENT, this.onFrame, this);
            this.addChild(this._armature.display);
            while (this._replaceDisplayArr.length > 0) {
                var info = this._replaceDisplayArr.shift();
                this.replaceDisplay(info.name, info.display);
            }
            dragonBones.WorldClock.clock.add(this._armature);
            if (this._frameRate) {
                this.frameRate = this._frameRate;
            }
        };
        /**
         * 插槽数据替换
         * @author Andrew_Huang
         * @public
         * @param {string} slotName
         * @param {egret.DisplayObject} display
         * @memberof DragonMovie
         */
        DragonMovie.prototype.replaceDisplay = function (slotName, display) {
            if (this._armature) {
                var slot = this._armature.getSlot(slotName);
                slot.displayIndex = 0;
                slot.display = display;
            }
            else {
                this._replaceDisplayArr.push({ name: slotName, display: display });
            }
        };
        /**
         * 动画开始
         * @author Andrew_Huang
         * @private
         * @param {dragonBones.EventObject} event
         * @memberof DragonMovie
         */
        DragonMovie.prototype.onStart = function (event) {
            var movieEvent = new dragon.MovieEvent(dragon.MovieEvent.START);
            this.dispatchEvent(movieEvent);
        };
        /**
         * 每一帧监听，动画帧事件
         * @author Andrew_Huang
         * @private
         * @param {dragonBones.EgretEvent} event
         * @memberof DragonMovie
         */
        DragonMovie.prototype.onFrame = function (event) {
            var movieEvent = new dragon.MovieEvent(dragon.MovieEvent.FRAME_LABEL, event.name);
            this.dispatchEvent(movieEvent);
        };
        /**
         * 动画播放完成（循环一次）
         * @author Andrew_Huang
         * @private
         * @param {dragonBones.EgretEvent} event
         * @memberof DragonMovie
         */
        DragonMovie.prototype.onComplete = function (event) {
            var movieEvent = new dragon.MovieEvent(dragon.MovieEvent.COMPLETE);
            this.dispatchEvent(movieEvent);
        };
        /**
         * 动画播放
         * @author Andrew_Huang
         * @param {string} name
         * @param {number} [playTimes] 循环播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次] （默认: -1）
         * @memberof DragonMovie
         */
        DragonMovie.prototype.play = function (name, playTimes) {
            if (this.armatureName) {
                this._moviePlay = new dragon.MoviePlay(name, playTimes);
                this._play();
            }
        };
        Object.defineProperty(DragonMovie.prototype, "armatureName", {
            /**
             * 骨架数据名称
             */
            get: function () {
                return this._armatureName;
            },
            /**
             * 骨架数据名称
             */
            set: function (value) {
                this._armatureName = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DragonMovie.prototype, "frameRate", {
            get: function () {
                return this._frameRate;
            },
            /**
             * 播放速度，用于控制动画变速播放
             * @memberof DragonMovie
             */
            set: function (value) {
                this._frameRate = value;
                if (this._armature) {
                    this._armature.clock.timeScale = this._frameRate / 24;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DragonMovie.prototype, "animationName", {
            /**
             * 获取动画名称
             * @readonly
             * @type {string}
             * @memberof DragonMovie
             */
            get: function () {
                return this._armature.animation.lastAnimationState.name;
            },
            enumerable: true,
            configurable: true
        });
        DragonMovie.prototype.destroy = function () {
        };
        return DragonMovie;
    }(egret.Sprite));
    dragon.DragonMovie = DragonMovie;
})(dragon || (dragon = {}));
/*
 * @Author: Andrew_Huang
 * @Date: 2018-05-04 10:08:37
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-05-04 10:14:38
 */
var dragon;
(function (dragon) {
    /**
     * 基于TexturePacker的动画
     * @author Andrew_Huang
     * @export
     * @class Movie
     * @extends {frame.animation.TexturePacker}
     */
    var Movie = /** @class */ (function (_super) {
        __extends(Movie, _super);
        /**
         * 初始化
         * @author Andrew_Huang
         * @param {Object} format            Texture导出的Json数据
         * @param {egret.Texture} texture    Texture导出的纹理图集
         * @memberof Movie
         */
        function Movie(format, texture) {
            var _this = _super.call(this, format, texture) || this;
            _this.addEventListener(dragon.Movie.EACH_FRAME, _this.enterFrame, _this);
            return _this;
        }
        Movie.prototype.play = function (label) {
            _super.prototype.play.call(this, label);
        };
        Movie.prototype.enterFrame = function (data) {
        };
        Movie.prototype.stop = function () {
            _super.prototype.stop.call(this);
            this.removeEventListener(dragon.Movie.EACH_FRAME, this.enterFrame, this);
        };
        Movie.prototype.destroy = function () {
            this.stop();
        };
        Movie.EACH_FRAME = 'frame';
        return Movie;
    }(frame.animation.TexturePacker));
    dragon.Movie = Movie;
})(dragon || (dragon = {}));
/*
 * @Author: Andrew_Huang
 * @Date: 2018-04-23 13:37:04
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-04-23 17:17:05
 */
var dragon;
(function (dragon) {
    /**
     * 配置数据
     * @author Andrew_Huang
     * @export
     * @class Config
     */
    var Config = /** @class */ (function () {
        function Config() {
            this._configMap = {};
        }
        /**
         * 获取配置数据
         * @author Andrew_Huang
         * @private
         * @template T
         * @param {string} name
         * @param {T} defaultValue
         * @returns {T}
         * @memberof Config
         */
        Config.prototype.getConfig = function (name, key, defaultValue) {
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
            if (this._configMap.hasOwnProperty(name)) {
                if (dragon.Obj.hasValue(this._configMap[name], key)) {
                    return true;
                }
            }
            return false;
        };
        /**
         * 添加JSON数据到map中
         * @author Andrew_Huang
         * @private
         * @param {*} data
         * @param {string} key
         * @memberof Config
         */
        Config.prototype.addConfData = function (data, name) {
            if (!this._configMap.hasOwnProperty(name)) {
                this._configMap[name] = data;
            }
        };
        /**
         * 判断name值的数据上是否存在key值的数据
         * @author Andrew_Huang
         * @static
         * @param {string} name
         * @param {string} key
         * @returns {boolean}
         * @memberof Config
         */
        Config.exists = function (name, key) {
            return dragon.singleton(Config).exists(name, key);
        };
        /**
         * 获取配置数据
         * @static
         * @param {string} name            配置名
         * @param {string} [key=null]      数据的key值
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
/*
 * @Author: Andrew_Huang
 * @Date: 2018-04-28 11:28:07
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-04-28 11:47:14
 */
var dragon;
(function (dragon) {
    /**
     * 全局事件名 Key 值
     * @export
     * @class NoticeNameKey
     */
    var NoticeKey = /** @class */ (function () {
        function NoticeKey() {
        }
        /**
         * 服务端数据模块变化
         * @author Andrew_Huang
         * @static
         * @param {string} mod
         * @returns {string}
         * @memberof NoticeNameKey
         */
        NoticeKey.SERVER_DATA_CHANGE = function (mod) {
            return 'SERVER_DATA_CHANGE.' + mod;
        };
        /**
         * 数据模块变更
         * @author Andrew_Huang
         * @static
         * @param {string} mod
         * @returns {string}
         * @memberof NoticeNameKey
         */
        NoticeKey.CHANGE_MODEL = function (mod) {
            return 'CHANGE_MODEL.' + mod;
        };
        /**
         * 数据变更通知
         * @author Andrew_Huang
         * @static
         * @param {string} mod
         * @returns {string}
         * @memberof NoticeNameKey
         */
        NoticeKey.POSTCHANGE = function (mod) {
            return 'CHANGE.' + mod;
        };
        NoticeKey.GetComponent = "get_component";
        return NoticeKey;
    }());
    dragon.NoticeKey = NoticeKey;
    dragon.key = NoticeKey;
})(dragon || (dragon = {}));
/*
 * @Author: Andrew_Huang
 * @Date: 2018-04-27 13:32:51
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-04-28 11:27:23
 */
var dragon;
(function (dragon) {
    /**
     * 基础数据
     * @author Andrew_Huang
     * @export
     * @class BaseData
     * @extends {egret.EventDispatcher}
     */
    var BaseData = /** @class */ (function (_super) {
        __extends(BaseData, _super);
        function BaseData(mod) {
            var _this = _super.call(this) || this;
            _this._mod = mod;
            dragon.addNotice(dragon.NoticeKey.SERVER_DATA_CHANGE(_this._mod), _this.onChangeData, _this);
            return _this;
        }
        /**
         * 服务端数据变更
         * @author Andrew_Huang
         * @protected
         * @param {*} data
         * @memberof BaseData
         */
        BaseData.prototype.onChangeData = function (data) {
            this._changeData = data;
        };
        /**
         * 发送数据变更通知
         * @author Andrew_Huang
         * @param {*} data
         * @memberof BaseData
         */
        BaseData.prototype.postNotice = function (data) {
            dragon.postNotice(dragon.NoticeKey.POSTCHANGE(this._mod), data);
        };
        Object.defineProperty(BaseData.prototype, "changeData", {
            get: function () {
                return this._changeData;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseData.prototype, "mod", {
            get: function () {
                return this._mod;
            },
            enumerable: true,
            configurable: true
        });
        BaseData.prototype.destroy = function () {
            this._changeData = null;
            this._mod = null;
            dragon.removeNotice(dragon.NoticeKey.SERVER_DATA_CHANGE(this._mod), this.onChangeData, this);
        };
        return BaseData;
    }(egret.EventDispatcher));
    dragon.BaseData = BaseData;
})(dragon || (dragon = {}));
/*
 * @Author: Andrew_Huang
 * @Date: 2018-04-26 13:52:17
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-05-02 10:14:37
 */
var dragon;
(function (dragon) {
    /**
     * 数据模型信息
     * @author Andrew_Huang
     * @export
     * @class ModelInfo
     */
    var ModelInfo = /** @class */ (function () {
        function ModelInfo(mod, autokey, confKey, otherKeys, factory, subCoreFactory, isMultiple) {
            if (subCoreFactory === void 0) { subCoreFactory = null; }
            if (isMultiple === void 0) { isMultiple = false; }
            this._isMultiple = false; //是否合并（即将基础数据工厂作为二级数据工厂的配置数据）
            this._mod = mod;
            this._autoKey = autokey;
            this._confKey = confKey;
            this._otherKey = otherKeys;
            this._factory = factory;
            this._subCoreFactory = subCoreFactory;
            this._isMultiple = isMultiple;
        }
        Object.defineProperty(ModelInfo.prototype, "isMultiple", {
            get: function () {
                return this._isMultiple;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModelInfo.prototype, "type", {
            get: function () {
                return this._type;
            },
            set: function (value) {
                this._type = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModelInfo.prototype, "mod", {
            get: function () {
                return this._mod;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModelInfo.prototype, "autoKey", {
            get: function () {
                return this._autoKey;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModelInfo.prototype, "confKey", {
            get: function () {
                return this._confKey;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModelInfo.prototype, "otherKey", {
            get: function () {
                return this._otherKey;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModelInfo.prototype, "factory", {
            get: function () {
                return this._factory;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModelInfo.prototype, "subCoreFactory", {
            get: function () {
                return this._subCoreFactory;
            },
            enumerable: true,
            configurable: true
        });
        return ModelInfo;
    }());
    dragon.ModelInfo = ModelInfo;
})(dragon || (dragon = {}));
/*
 * @Author: Andrew_Huang
 * @Date: 2018-04-26 11:58:01
 * @Last Modified by:   Andrew_Huang
 * @Last Modified time: 2018-04-26 11:58:01
 */
var dragon;
(function (dragon) {
    /**
     * 获取对象模型数据
     * 先从服务端获取数据，找不到name值的数据对象，再从客户端获取，否则返回默认值
     * @author Andrew_Huang
     * @param {any} s          服务端数据对象
     * @param {any} c          客户端配置数据对象
     * @param {any} name       需要获取的数据对象的key值
     * @param {any} defaultVal 默认值
     * @returns {*}
     */
    function getModelVal(s, c, name, defaultVal) {
        var ret = dragon.Obj.getValue(s, name, null);
        if (ret == null) {
            ret = dragon.Obj.getValue(c, name, defaultVal);
        }
        return ret;
    }
    /**
     * 二级数据模型（类似BaseModel结构）
     * @author Andrew_Huang
     * @export
     * @class SubModelCore
     * @extends {egret.EventDispatcher}
     */
    var SubModelCore = /** @class */ (function (_super) {
        __extends(SubModelCore, _super);
        function SubModelCore() {
            return _super.call(this) || this;
        }
        Object.defineProperty(SubModelCore.prototype, "c", {
            get: function () {
                return this._c;
            },
            set: function (value) {
                this._c = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SubModelCore.prototype, "s", {
            get: function () {
                return this._s;
            },
            set: function (value) {
                this._s = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SubModelCore.prototype, "host", {
            get: function () {
                return this._host;
            },
            set: function (value) {
                this._host = value;
            },
            enumerable: true,
            configurable: true
        });
        SubModelCore.prototype.getProperty = function (name, format) {
            return null;
        };
        SubModelCore.prototype.update = function () {
        };
        SubModelCore.prototype.destroy = function () {
        };
        return SubModelCore;
    }(egret.EventDispatcher));
    dragon.SubModelCore = SubModelCore;
    /**
     * 数据模型(存在二级数据模型时使用)
     * @author Andrew_Huang
     * @export
     * @class BaseSubModel
     * @extends {egret.EventDispatcher}
     */
    var BaseSubModel = /** @class */ (function (_super) {
        __extends(BaseSubModel, _super);
        function BaseSubModel() {
            return _super.call(this) || this;
        }
        Object.defineProperty(BaseSubModel.prototype, "c", {
            get: function () {
                return this._core.c;
            },
            set: function (value) {
                this._core.c = value;
                this.initConfig();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseSubModel.prototype, "s", {
            get: function () {
                return this._core.s;
            },
            set: function (value) {
                this._core.s = value;
                this.initServer();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseSubModel.prototype, "core", {
            get: function () {
                return this._core;
            },
            set: function (value) {
                if (this._core) {
                    value.s = this._core.s;
                    value.c = this._core.c;
                }
                this._core = value;
                if (value) {
                    value.host = this;
                }
            },
            enumerable: true,
            configurable: true
        });
        BaseSubModel.prototype.initConfig = function () {
        };
        BaseSubModel.prototype.initServer = function () {
        };
        /**
         * 根据name值从服务端/客户端获取数据
         * @author Andrew_Huang
         * @param {string} name
         * @param {*} [defaultValue=null]
         * @returns {*}
         * @memberof BaseModel
         */
        BaseSubModel.prototype.getValue = function (name, defaultValue) {
            if (defaultValue === void 0) { defaultValue = null; }
            return null;
            // return getModelVal(this.s, this.c, name, defaultValue);
        };
        BaseSubModel.prototype.destroy = function () {
        };
        return BaseSubModel;
    }(egret.EventDispatcher));
    dragon.BaseSubModel = BaseSubModel;
    /**
     * 基础数据模型（客户端+服务端，通过key值连接）
     * @author Andrew_Huang
     * @export
     * @class BaseModel
     * @extends {egret.EventDispatcher}
     */
    var BaseModel = /** @class */ (function (_super) {
        __extends(BaseModel, _super);
        function BaseModel() {
            return _super.call(this) || this;
        }
        Object.defineProperty(BaseModel.prototype, "c", {
            get: function () {
                return this._configData;
            },
            set: function (value) {
                this._configData = value;
                this.initConfig();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseModel.prototype, "s", {
            get: function () {
                return this._serverData;
            },
            set: function (value) {
                this._serverData = value;
                this.initServer();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 根据name值从服务端/客户端获取数据
         * @author Andrew_Huang
         * @param {string} name
         * @param {*} [defaultValue=null]
         * @returns {*}
         * @memberof BaseModel
         */
        BaseModel.prototype.getValue = function (name, defaultValue) {
            if (defaultValue === void 0) { defaultValue = null; }
            return getModelVal(this.s, this.c, name, defaultValue);
        };
        /**
         * 初始化配置数据
         * @author Andrew_Huang
         * @protected
         * @memberof BaseModel
         */
        BaseModel.prototype.initConfig = function () {
        };
        /**
         * 初始化服务端数据
         * @author Andrew_Huang
         * @protected
         * @memberof BaseModel
         */
        BaseModel.prototype.initServer = function () {
        };
        BaseModel.prototype.destroy = function () {
        };
        return BaseModel;
    }(egret.EventDispatcher));
    dragon.BaseModel = BaseModel;
})(dragon || (dragon = {}));
/*
 * @Author: Andrew_Huang
 * @Date: 2018-04-26 11:49:25
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-04-28 15:14:06
 */
var dragon;
(function (dragon) {
    /**
     * 数据缓存库（一个key值存在catchMap中存在一个数据缓存的）
     * @author Andrew_Huang
     * @export
     * @class DatsStore
     * @implements {IDataStore}
     */
    var DataStore = /** @class */ (function () {
        function DataStore(propertyName) {
            this._catchMap = {}; //数据缓存映射表
            this._instMap = {}; //数据实例映射表
            this._propertyName = propertyName;
        }
        Object.defineProperty(DataStore.prototype, "propertyName", {
            get: function () {
                return this._propertyName;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 是否存key值的数据对象
         * @author Andrew_Huang
         * @param {string} value
         * @returns {boolean}
         * @memberof DataStore
         */
        DataStore.prototype.has = function (key) {
            return this._catchMap.hasOwnProperty(key) && this._catchMap[key].length > 0;
        };
        /**
         * 根据key值获取数据对象
         * @author Andrew_Huang
         * @param {*} model
         * @returns {*}
         * @memberof DataStore
         */
        DataStore.prototype.getValue = function (model) {
            var ret = model.getValue(this._propertyName);
            if (is.truthy(ret)) {
                return ret;
            }
            console.warn("Can't Find data by " + this._propertyName);
            return null;
        };
        /**
         * 添加数据对象
         * @author Andrew_Huang
         * @param {*} model
         * @memberof DataStore
         */
        DataStore.prototype.onAdd = function (model) {
            var value = this.getValue(model);
            if (is.truthy(value)) {
                if (!this._catchMap.hasOwnProperty(value)) {
                    this._catchMap[value] = [];
                }
                this._instMap[model.hashCode] = value;
                if (this._catchMap[value].indexOf(model) == -1) {
                    this._catchMap[value].push(model);
                }
            }
        };
        /**
         * 删除数据
         * @author Andrew_Huang
         * @param {*} model
         * @memberof DataStore
         */
        DataStore.prototype.onDelete = function (model) {
            var value = this.getValue(model);
            delete this._instMap[model.hashCode];
            if (this._catchMap.hasOwnProperty(value)) {
                var arr = this._catchMap[value];
                dragon.array.remove(arr, model);
            }
        };
        /**
         * 更新数据
         * @author Andrew_Huang
         * @param {*} model
         * @memberof DataStore
         */
        DataStore.prototype.update = function (model, newModel) {
            //删除
            var value = this.getValue(model);
            delete this._instMap[model.hashCode];
            if (this._catchMap.hasOwnProperty(value)) {
                var arr = this._catchMap[value];
                dragon.array.remove(arr, model);
            }
            //添加
            var newValue = this.getValue(newModel);
            if (is.truthy(newValue)) {
                if (!this._catchMap.hasOwnProperty(newValue)) {
                    this._catchMap[newValue] = [];
                }
                this._instMap[newModel.hashCode] = newValue;
                if (this._catchMap[newValue].indexOf(newModel) == -1) {
                    this._catchMap[newValue].push(newModel);
                }
            }
        };
        /**
         * 根据key值获取数据模型
         * @author Andrew_Huang
         * @param {string} type
         * @param {...any[]} args
         * @memberof DataStore
         */
        DataStore.prototype.getModel = function (type) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (type == this._propertyName) {
                var arr = [];
                for (var i = 0; i < args.length; i++) {
                    if (this._catchMap.hasOwnProperty(args[i])) {
                        arr = arr.concat(this._catchMap[args[i]]);
                    }
                }
                return arr;
            }
        };
        DataStore.prototype.getNewModel = function (type, arg) {
            return null;
        };
        return DataStore;
    }());
    dragon.DataStore = DataStore;
})(dragon || (dragon = {}));
/*
 * @Author: Andrew_Huang
 * @Date: 2018-04-26 14:00:08
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-04-27 18:18:04
 */
var dragon;
(function (dragon) {
    var data;
    (function (data) {
        /**
         * 数据格式化工具
         * @author Andrew_Huang
         * @export
         * @class DateUtils
         */
        var DateUtils = /** @class */ (function () {
            function DateUtils() {
            }
            /**
             * 格式化别名格式的字符串，获取客户端配置key值与服务端key
             * @author Andrew_Huang
             * @static
             * @param {string} key
             * @returns {AliaseKey}
             * @memberof DateUtils
             */
            DateUtils.formatAliaseKey = function (key) {
                //正则检测的key值格式："xx as xx"
                var reqStr = /([a-zA-Z_]+)\s*(as)\s*([a-zA-Z_]+)/gi;
                var obj = {};
                if (reqStr.test(key)) {
                    obj.serverKey = RegExp.$1;
                    obj.configKey = RegExp.$3;
                }
                else {
                    obj.serverKey = obj.configKey = key;
                }
                return obj;
            };
            return DateUtils;
        }());
        data.DateUtils = DateUtils;
    })(data = dragon.data || (dragon.data = {}));
})(dragon || (dragon = {}));
/*
 * @Author: Andrew_Huang
 * @Date: 2018-04-26 19:17:03
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-04-26 20:08:02
 */
var dragon;
(function (dragon) {
    /**
     * 配置数据缓存库
     * @author Andrew_Huang
     * @export
     * @class ConfigDataStore
     */
    var ConfigDataStore = /** @class */ (function (_super) {
        __extends(ConfigDataStore, _super);
        function ConfigDataStore(type, info) {
            var _this = _super.call(this, type) || this;
            _this._info = info;
            return _this;
        }
        /**
         * 根据类型获取数据模型（单个）
         * @author Andrew_Huang
         * @param {string} type
         * @param {any} arg
         * @returns {*}
         * @memberof ConfigDataStore
         */
        ConfigDataStore.prototype.getNewModel = function (type, propertyValue) {
            var conf = this._info.factory(propertyValue);
            var inst = new this._info.type();
            if (inst instanceof dragon.BaseSubModel && this._info.subCoreFactory) {
                inst.core = this._info.subCoreFactory(propertyValue);
            }
            inst.c = conf;
            return inst;
        };
        /**
         * 根据类型获取数据模型(多个proertyValue值)
         * @author Andrew_Huang
         * @param {string} type
         * @param {any} args
         * @returns {*}
         * @memberof ConfigDataStore
         */
        ConfigDataStore.prototype.getModel = function (type) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var ret = [];
            for (var i = 0; i < args.length; i++) {
                var arg = args[i];
                if (!this.has(arg)) {
                    var config = this._info.factory(arg);
                    var inst = new this._info.type();
                    if (inst instanceof dragon.BaseSubModel && this._info.subCoreFactory) {
                        inst.core = this._info.subCoreFactory(arg);
                    }
                    inst.c = config;
                    this.onAdd(inst);
                }
                ret = ret.concat(_super.prototype.getModel.call(this, type, arg));
            }
            return ret;
        };
        return ConfigDataStore;
    }(dragon.DataStore));
    dragon.ConfigDataStore = ConfigDataStore;
})(dragon || (dragon = {}));
/*
 * @Author: Andrew_Huang
 * @Date: 2018-04-26 15:28:47
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-04-26 19:26:41
 */
var dragon;
(function (dragon) {
    /**
     * 主数据缓存库（properName来自服务端的autoKey）
     * @author Andrew_Huang
     * @export
     * @class MainDataStore
     * @extends {DataStore}
     */
    var MainDataStore = /** @class */ (function (_super) {
        __extends(MainDataStore, _super);
        function MainDataStore() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._list = [];
            return _this;
        }
        /**
         * 添加
         * @author Andrew_Huang
         * @param {*} obj
         * @memberof MainDataStore
         */
        MainDataStore.prototype.onAdd = function (obj) {
            _super.prototype.onAdd.call(this, obj);
            this._list.push(obj);
        };
        /**
         * 删除
         * @author Andrew_Huang
         * @param {*} obj
         * @memberof MainDataStore
         */
        MainDataStore.prototype.onDelete = function (obj) {
            _super.prototype.onDelete.call(this, obj);
            dragon.array.remove(this._list, obj);
        };
        /**
         * 更新
         * @author Andrew_Huang
         * @param {*} model
         * @param {*} newModel
         * @memberof MainDataStore
         */
        MainDataStore.prototype.update = function (model, newModel) {
            _super.prototype.update.call(this, model, newModel);
            dragon.array.remove(this._list, model);
            this._list.push(newModel);
        };
        /**
         * 获取所有的数据列表
         * @author Andrew_Huang
         * @returns {any[]}
         * @memberof MainDataStore
         */
        MainDataStore.prototype.getList = function () {
            return this._list;
        };
        return MainDataStore;
    }(dragon.DataStore));
    dragon.MainDataStore = MainDataStore;
})(dragon || (dragon = {}));
/*
 * @Author: Andrew_Huang
 * @Date: 2018-04-26 14:25:42
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-04-28 15:14:29
 */
var dragon;
(function (dragon) {
    /**
     * 数据
     * @author Andrew_Huang
     * @export
     * @class Data
     */
    var Data = /** @class */ (function () {
        function Data(type) {
            this._dataStoreMap = {}; //其他数据存储类（如配置数据等）
            this._deleteModels = []; //删除数据缓存库
            this._addModels = []; //添加数据缓存库
            this._type = type;
            this._info = type.info; //赋值数据模型info
            this._info.type = type;
            this._mod = this._info.mod; //数据识别Key
            this._mainStore = new dragon.MainDataStore(this._info.autoKey);
            if (this._info.confKey) {
                this._aliaseKey = dragon.data.DateUtils.formatAliaseKey(this._info.confKey);
                this._dataStoreMap[this._aliaseKey.configKey] = new dragon.ConfigDataStore(this._aliaseKey.configKey, this._info);
            }
            for (var i = 0; i < this._info.otherKey.length; i++) {
                var otherKey = this._info.otherKey[i];
                this._dataStoreMap[otherKey] = new dragon.DataStore(otherKey);
            }
            //捕捉mod，添加数据变更监听
            //增删改查监听
            dragon.addNotice(dragon.NoticeKey.SERVER_DATA_CHANGE(this._mod), this.changeModel, this);
            // addNotice(NoticeNameKey.CHANGE_MODEL(this._mod), this.changeServerData, this);
        }
        /**
         * 接收到服务端的数据（增删改查）
         * @author Andrew_Huang
         * @private
         * @memberof Data
         */
        Data.prototype.changeModel = function (list) {
            for (var i = 0; i < list.length; i++) {
                var data_2 = list[i]; //数据对象
                if (this.isExist(data_2)) {
                    if (data_2.rem) {
                        this.delete(data_2);
                    }
                    else {
                        this.update(data_2);
                    }
                }
                else {
                    this.add(data_2);
                }
            }
            dragon.postNotice(dragon.NoticeKey.CHANGE_MODEL(this._mod), list);
        };
        /**
         * 删除数据对象
         * @author Andrew_Huang
         * @private
         * @param {string} autoKey 服务端key值
         * @param {number} id      服务端value值
         * @memberof Data
         */
        Data.prototype.delete = function (data) {
            if (data.rem) {
                var id = dragon.Obj.getValue(data, this._info.autoKey, null);
                if (id) {
                    var modelArr = this._mainStore.getModel(this._info.autoKey, id);
                    for (var i = 0; i < modelArr.length; i++) {
                        var model = modelArr[i];
                        this._deleteModels.push(model);
                        this.deleteModel(model);
                    }
                }
            }
        };
        /**
         * 添加数据对象
         * @author Andrew_Huang
         * @private
         * @param {*} data
         * @memberof Data
         */
        Data.prototype.add = function (data) {
            if (!this.isExist(data)) {
                this.addModule(data);
            }
        };
        /**
         * 更新数据对象
         * @author Andrew_Huang
         * @private
         * @param {*} data
         * @memberof Data
         */
        Data.prototype.update = function (data) {
            if (data.rem) {
                return;
            }
            var id = dragon.Obj.getValue(data, this._info.autoKey, null);
            if (id) {
                var modelArr = this.get(this._info.autoKey, id);
                var newModel = this.getModel(data);
                if (is.not.nul(modelArr)) {
                    for (var i = 0; i < modelArr.length; i++) {
                        var model = modelArr[i];
                        this._mainStore.update(model, newModel);
                        for (var key_4 in this._dataStoreMap) {
                            if (this._dataStoreMap.hasOwnProperty(key_4)) {
                                this._dataStoreMap[key_4].update(model, newModel);
                            }
                        }
                    }
                }
                else {
                    return;
                }
            }
        };
        /**
         * 删除数据对象（配置数据仓库不删除，如果是关联二级服务端和配置数据，则删除）
         * @author Andrew_Huang
         * @private
         * @param {*} model
         * @memberof Data
         */
        Data.prototype.deleteModel = function (model) {
            this._mainStore.onDelete(model);
            for (var key_5 in this._dataStoreMap) {
                if (key_5 != this._aliaseKey.configKey || this._info.isMultiple) {
                    var store = this._dataStoreMap[key_5];
                    store.onDelete(model);
                }
            }
        };
        /**
         * 添加数据模块
         * @author Andrew_Huang
         * @private
         * @param {*} item
         * @memberof Data
         */
        Data.prototype.addModule = function (item) {
            var model = this.getModel(item);
            this._addModels.push(model);
            this._mainStore.onAdd(model);
            for (var key_6 in this._dataStoreMap) {
                var store = this._dataStoreMap[key_6];
                store.onAdd(model);
            }
        };
        /**
         * 服务端数据是否已经存在于主缓存库中
         * @author Andrew_Huang
         * @private
         * @param {*} data
         * @returns {boolean}
         * @memberof Data
         */
        Data.prototype.isExist = function (data) {
            var id = dragon.Obj.getValue(data, this._info.autoKey, null);
            if (id) {
                var modelArr = this._mainStore.getModel(this._info.autoKey, id);
                if (modelArr && modelArr.length) {
                    return modelArr;
                }
                return null;
            }
            return null;
        };
        /**
         * 获取数据模型对象（相当于新建一个数据模型Item）
         * @author Andrew_Huang
         * @private
         * @param {*} item
         * @returns {*}
         * @memberof Data
         */
        Data.prototype.getModel = function (item) {
            var configKey = this._info.confKey;
            var aliaseKey = dragon.data.DateUtils.formatAliaseKey(configKey);
            var value = dragon.Obj.getValue(item, aliaseKey.serverKey, null);
            var model = null;
            if (is.not.nul(value)) {
                //存在服务端数据，设置对应的客户端配置数据
                if (this._info.isMultiple) {
                    model = this._dataStoreMap[aliaseKey.configKey].getNewModel(aliaseKey.configKey, value);
                }
                else {
                    var modelArr = this._dataStoreMap[aliaseKey.configKey].getModel(aliaseKey.configKey, value);
                    if (modelArr && modelArr.length) {
                        model = modelArr[0];
                    }
                }
            }
            if (!model) {
                model = new this._info.type();
            }
            model.s = item;
            return model;
        };
        /**
         * 获取一个参数key值多个value值的数据模型
         * @author Andrew_Huang
         * @param {string} propertyName
         * @param {any} values
         * @returns {any[]}
         * @memberof Data
         */
        Data.prototype.getMultiple = function (propertyName) {
            var values = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                values[_i - 1] = arguments[_i];
            }
            var store = this.getDataStore(propertyName);
            if (store) {
                return store.getModel.apply(store, [propertyName].concat(values));
            }
            return [];
        };
        /**
         * 获取数据模型
         * @author Andrew_Huang
         * @param {string} propertyName key值参数（获取对应的数据仓库）
         * @param {*} propertyValue     value值
         * @returns {any[]}
         * @memberof Data
         */
        Data.prototype.get = function (propertyName, propertyValue) {
            var store = this.getDataStore(propertyName);
            if (store) {
                return store.getModel(propertyName, propertyValue);
            }
            return [];
        };
        /**
         * 根据key值获取对应的数据缓存库
         * @author Andrew_Huang
         * @param {string} propertyName
         * @returns {DataStore}
         * @memberof Data
         */
        Data.prototype.getDataStore = function (propertyName) {
            if (propertyName == this._info.autoKey) {
                return this._mainStore;
            }
            if (this._dataStoreMap.hasOwnProperty(propertyName)) {
                var store = this._dataStoreMap[propertyName];
                return store;
            }
            return null;
        };
        /**
         * 获取服务端所有的数据Item
         * @author Andrew_Huang
         * @returns {any[]}
         * @memberof Data
         */
        Data.prototype.getList = function () {
            return this._mainStore.getList();
        };
        Object.defineProperty(Data.prototype, "mod", {
            get: function () {
                return this._mod;
            },
            enumerable: true,
            configurable: true
        });
        return Data;
    }());
    dragon.Data = Data;
})(dragon || (dragon = {}));
/*
 * @Author: Andrew_Huang
 * @Date: 2018-04-27 13:15:25
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-05-02 11:31:45
 */
var dragon;
(function (dragon) {
    /**
     * 数据中心
     * @author Andrew_Huang
     * @export
     * @class DataCenter
     */
    var DataCenter = /** @class */ (function () {
        function DataCenter() {
            this._modelDataMap = {}; //数据模型
            this._baseDataMap = {}; //基础数据模块
            this._modDataMap = {}; //模块化数据映射表
        }
        /**
         * 获取服务端数据
         * @author Andrew_Huang
         * @private
         * @param {*} data
         * @memberof DataCenter
         */
        DataCenter.prototype.getServerData = function (data) {
            var seq = data.seq;
            var code = data.code;
            var msg = data.msg;
            if (data.data && code == 200) {
                this.analyiseData(data.data);
            }
        };
        /**
         * 解析服务端body数据
         * @author Andrew_Huang
         * @private
         * @param {*} data
         * @memberof DataCenter
         */
        DataCenter.prototype.analyiseData = function (data) {
            for (var key_7 in data) {
                var modName = key_7;
                var models = data[key_7];
                dragon.postNotice(dragon.NoticeKey.SERVER_DATA_CHANGE(modName), models);
            }
        };
        /**
         * 基础数据模块注入
         * @author Andrew_Huang
         * @static
         * @template T
         * @param {string} modName
         * @param {T} data
         * @memberof DataCenter
         */
        DataCenter.prototype.injectBaseData = function (modName, data) {
            if (!this._baseDataMap.hasOwnProperty(modName)) {
                this._baseDataMap[modName] = new data(modName);
            }
        };
        /**
         * 注入数据模型
         * @author Andrew_Huang
         * @private
         * @template T
         * @param {T} type
         * @memberof DataCenter
         */
        DataCenter.prototype.injectDataModel = function (type) {
            var id = dragon.getTypeId(type);
            if (!this._modelDataMap.hasOwnProperty(id)) {
                this._modelDataMap[id] = new dragon.Data(type);
            }
        };
        /**
         * 获取基础数据模块
         * @author Andrew_Huang
         * @private
         * @param {string} modName
         * @returns {BaseData}
         * @memberof DataCenter
         */
        DataCenter.prototype.getBaseData = function (modName) {
            return this._baseDataMap[modName];
        };
        /**
         * 根据数据模型类获取数据模型
         * @author Andrew_Huang
         * @private
         * @template T
         * @param {T} type
         * @returns {Data}
         * @memberof DataCenter
         */
        DataCenter.prototype.getDataModel = function (type) {
            var id = dragon.getTypeId(type);
            if (!this._modelDataMap.hasOwnProperty(id)) {
                this._modelDataMap[id] = new dragon.Data(type);
            }
            return this._modelDataMap[id];
        };
        /**
         * 根据，数据模型类+key值参数+key值，获取具体的单个模型数据
         * @author Andrew_Huang
         * @private
         * @template T
         * @param {T} type
         * @param {string} propertyName
         * @param {*} propertyValue
         * @returns {*}
         * @memberof DataCenter
         */
        DataCenter.prototype.getModel = function (type, propertyName, propertyValue) {
            var ret = this.getDataModel(type).get(propertyName, propertyValue);
            if (ret && ret.length > 0) {
                return ret[0];
            }
            return null;
        };
        /**
         * 获取多个参数值的数据模型集合
         * @author Andrew_Huang
         * @private
         * @template T
         * @param {T} type
         * @param {string} propertyName
         * @param {any} vals
         * @returns {any[]}
         * @memberof DataCenter
         */
        DataCenter.prototype.getMultiple = function (type, propertyName) {
            var vals = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                vals[_i - 2] = arguments[_i];
            }
            var ret = (_a = this.getDataModel(type)).getMultiple.apply(_a, [propertyName].concat(vals));
            if (!ret) {
                return [];
            }
            return ret;
            var _a;
        };
        /**
         * 获取某个数据模型类的所有数据对象model
         * @author Andrew_Huang
         * @private
         * @template T
         * @param {T} type
         * @returns {any[]}
         * @memberof DataCenter
         */
        DataCenter.prototype.getDataModelList = function (type) {
            return this.getDataModel(type).getList();
        };
        DataCenter.prototype.getWhereValue = function (where, defaultValue) {
            if (defaultValue === void 0) { defaultValue = 0; }
            var str = where.split('.');
            var mod = str.splice(0, 1)[0];
            var data = this.getBaseData(mod);
            var key = str[0];
            if (data[key]) {
                return data[key];
            }
            return defaultValue;
        };
        return DataCenter;
    }());
    dragon.DataCenter = DataCenter;
    /**
     * 基础数据注入
     * @author Andrew_Huang
     * @export
     * @template T
     * @param {string} modName
     * @param {T} data
     */
    function injectBaseData(modName, data) {
        dragon.singleton(DataCenter).injectBaseData(modName, data);
    }
    dragon.injectBaseData = injectBaseData;
    /**
     * 数据模型注入
     * @author Andrew_Huang
     * @export
     * @param {*} type
     */
    function injectDataModel(type) {
        dragon.singleton(DataCenter).injectDataModel(type);
    }
    dragon.injectDataModel = injectDataModel;
    /**
     * 获取服务器数据解析
     * @author Andrew_Huang
     * @export
     * @param {*} data
     */
    function getServerData(data) {
        dragon.singleton(DataCenter).getServerData(data);
    }
    dragon.getServerData = getServerData;
    /**
     * 根据模块名获取基础数据模块
     * @author Andrew_Huang
     * @export
     * @param {string} modName
     * @returns {BaseData}
     */
    function getBaseData(modName) {
        return dragon.singleton(DataCenter).getBaseData(modName);
    }
    dragon.getBaseData = getBaseData;
    /**
     * 通过指定属性名和属性值来获取指定类型的模型对象
     * @author Andrew_Huang
     * @export
     * @template T
     * @param {{ new(): T; }} type   对象模型类型
     * @param {string} propertyName  属性名
     * @param {*} propertyVal        属性值
     * @returns {T}
     */
    function getDataModel(type, propertyName, propertyVal) {
        return dragon.singleton(DataCenter).getModel(type, propertyName, propertyVal);
    }
    dragon.getDataModel = getDataModel;
    /**
     * 通过指定属性名和属性值来获取指定类型的多个模型对象
     * @author Andrew_Huang
     * @export
     * @template T
     * @param {{ new(): T; }} type  对象模型类型
     * @param {string} propertyName 属性名
     * @param {any} valueArr        属性值
     * @returns {T[]}
     */
    function getMultipleModel(type, propertyName) {
        var valueArr = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            valueArr[_i - 2] = arguments[_i];
        }
        return (_a = dragon.singleton(DataCenter)).getMultiple.apply(_a, [type, propertyName].concat(valueArr));
        var _a;
    }
    dragon.getMultipleModel = getMultipleModel;
    function getDataModelList(type) {
        return dragon.singleton(DataCenter).getDataModelList(type);
    }
    dragon.getDataModelList = getDataModelList;
    /**
     * 获取指定点的数据值
     * @author Andrew_Huang
     * @export
     * @param {string} where
     * @param {number} [defaultValue=0]
     * @returns {number}
     */
    function getWhereValue(where, defaultValue) {
        if (defaultValue === void 0) { defaultValue = 0; }
        return dragon.singleton(DataCenter).getWhereValue(where, defaultValue);
    }
    dragon.getWhereValue = getWhereValue;
})(dragon || (dragon = {}));
/*
 * @Author: Andrew_Huang
 * @Date: 2018-05-02 09:48:13
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-05-02 10:33:43
 */
var dragon;
(function (dragon) {
    var Item = /** @class */ (function () {
        function Item() {
        }
        /**
         * 获取道具模型实例
         * @author Andrew_Huang
         * @static
         * @returns {*}
         * @memberof Item
         */
        Item.getItemInst = function () {
            var itemClass = dragon.getSetting().ItemModelClass;
            var itemInst = dragon.getDefinitionInstance(itemClass, null);
            if (itemInst) {
                return itemInst;
            }
            return null;
        };
        /**
         * 获取指定道具的名称
         * 道具模型需要存在 NameKey 的属性值作为道具名的key值（关联配置表），默认name
         * @author Andrew_Huang
         * @static
         * @param {number} configId 道具配置Id
         * @returns {string}
         * @memberof Item
         */
        Item.getName = function (configId) {
            var itemInst = this.getItemInst();
            if (itemInst) {
                var nameKey = itemInst.NameKey ? itemInst.NameKey : 'name';
                var key_8 = itemInst.info.configKey;
                var aliasInfo = dragon.data.DateUtils.formatAliaseKey(key_8);
                var model = dragon.getDataModel(itemInst, aliasInfo.configKey, configId);
                if (model && model.c) {
                    return dragon.Obj.getValue(model.c, nameKey, null);
                }
                return null;
            }
        };
        /**
         * 获取指定道具的拥有数量
         * 道具模型需要存在 NumKey 的属性名作为道具数量key值（关联服务端数据）。默认num
         * @author Andrew_Huang
         * @static
         * @param {number} configId 道具配置Id
         * @returns {number}
         * @memberof Item
         */
        Item.getNum = function (configId) {
            var itemInst = this.getItemInst();
            if (itemInst) {
                var numKey = itemInst.NumKey ? itemInst.NumKey : 'num';
                var key_9 = itemInst.info.configKey;
                var aliasInfo = dragon.data.DateUtils.formatAliaseKey(key_9);
                var model = dragon.getDataModel(itemInst, aliasInfo.configKey, configId);
                if (model && model.s) {
                    return dragon.Obj.getValue(model.s, numKey, 0);
                }
            }
            return 0;
        };
        /**
         * 获取指定道具配置Id的道具模型实例
         * @author Andrew_Huang
         * @static
         * @param {number} configId 道具配置Id
         * @returns {*}
         * @memberof Item
         */
        Item.getItemByConfigId = function (configId) {
            var itemInst = this.getItemInst();
            if (itemInst) {
                var key_10 = itemInst.info.configKey;
                var aliasInfo = dragon.data.DateUtils.formatAliaseKey(key_10);
                var model = dragon.getDataModel(itemInst, aliasInfo.configKey, configId);
                return model;
            }
            return null;
        };
        /**
         * 获取指定服务器Id的道具模型实例
         * @author Andrew_Huang
         * @static
         * @param {number} serverId 服务器Id
         * @returns {*}
         * @memberof Item
         */
        Item.getItemByServerId = function (serverId) {
            var itemInst = this.getItemInst();
            if (itemInst) {
                var key_11 = itemInst.info.autoKey;
                var model = dragon.getDataModel(itemInst, key_11, serverId);
                return model;
            }
            return null;
        };
        /**
         * 获取所有道具的模型实例列表
         * @author Andrew_Huang
         * @returns {any[]}
         * @memberof Item
         */
        Item.getItems = function () {
            var itemInst = this.getItemInst();
            if (itemInst) {
                return dragon.getDataModelList(itemInst);
            }
            return [];
        };
        /**
         * 获取指定属性名和属性值的所有模型实例
         * @author Andrew_Huang
         * @static
         * @param {string} key 属性名
         * @param {*} value    属性值
         * @returns {any[]}
         * @memberof Item
         */
        Item.getItemByKey = function (key, value) {
            var itemInst = this.getItemInst();
            if (itemInst) {
                return dragon.getMultipleModel(itemInst, key, value);
            }
            return [];
        };
        return Item;
    }());
    dragon.Item = Item;
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
            for (var key_12 in modules) {
                var moduleVal = modules[key_12];
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
     * 对象的一个属性发生更改时传递到事件侦听器的事件
     * @export
     * @class PropertyEvent
     * @extends {egret.Event}
     */
    var PropertyEvent = /** @class */ (function (_super) {
        __extends(PropertyEvent, _super);
        function PropertyEvent(type, bubbles, cancelable, property) {
            return _super.call(this, type, bubbles, cancelable, property) || this;
        }
        PropertyEvent.dispatchPropertyEvent = function (target, eventType, property) {
            if (!target.hasEventListener(eventType)) {
                return true;
            }
            var event = egret.Event.create(PropertyEvent, eventType);
            event.property = property;
            var result = target.dispatchEvent(event);
            egret.Event.release(event);
            return result;
        };
        PropertyEvent.PROPERTY_CHANGE = "PROPERTY_CHANGE";
        return PropertyEvent;
    }(egret.Event));
    dragon.PropertyEvent = PropertyEvent;
})(dragon || (dragon = {}));
/*
 * @Author: Andrew_Huang
 * @Date: 2018-04-23 15:57:56
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-04-23 17:11:59
 */
var dragon;
(function (dragon) {
    /**
     * 资源事件
     * @export
     * @enum {number}
     */
    var Resource;
    (function (Resource) {
        Resource["ITEM_COM"] = "item_com";
        Resource["ITEM_PRO"] = "item _pro";
        Resource["ITEMS_COM"] = "items_com";
        Resource["ITEMS_PRO"] = "items_pro";
    })(Resource = dragon.Resource || (dragon.Resource = {}));
    /**
     * 资源加载
     * @author Andrew_Huang
     * @export
     * @class ResourceLoader
     */
    var ResourceLoader = /** @class */ (function () {
        function ResourceLoader() {
            this._scenes = {};
            this._resourcePath = '';
            this._isResource = false;
            this._scenes = {};
        }
        /**
         * 单项资源加载
         * @private
         * @param {string} path
         * @param {Function} [callback=null]
         * @param {Object} [context=null]
         * @memberof ResourceLoader
         */
        ResourceLoader.prototype.loadItem = function (path, callback, context, isResource) {
            if (callback === void 0) { callback = null; }
            if (context === void 0) { context = null; }
            if (isResource === void 0) { isResource = false; }
            this._isResource = isResource;
            if (this._isResource) {
                this._resourcePath = path;
            }
            this._loader = new frame.loading.LoaderItem(path);
            if (this._loader) {
                this._loader.once(egret.Event.COMPLETE, function () {
                    if (callback && context) {
                        callback.call(context);
                    }
                }, this);
                this._loader.once(egret.ProgressEvent.PROGRESS, this.onItemProgress, this);
                this._loader.load();
            }
        };
        /**
         * 解析资源配置
         * @private
         * @memberof ResourceLoader
         */
        ResourceLoader.prototype.analysicsResource = function (path) {
            if (path) {
                var res = this.getRes(path);
                if (res) {
                    for (var i in res) {
                        this._scenes[i] = res[i];
                    }
                    return true;
                }
            }
            return false;
        };
        /**
         * 根据组的key值获取该组下所有的资源路径
         * @private
         * @param {string} key
         * @returns {Array<string>}
         * @memberof ResourceLoader
         */
        ResourceLoader.prototype.getItemsPath = function (key) {
            var items = this._scenes[key];
            if (items && items.length) {
                return items;
            }
            return [];
        };
        /**
         * 根据资源组的key值加载资源该组资源
         * @private
         * @param {string} key
         * @memberof ResourceLoader
         */
        ResourceLoader.prototype.loadItemsByGroupKey = function (key, callback, context) {
            if (callback === void 0) { callback = null; }
            if (context === void 0) { context = null; }
            var items = this.getItemsPath(key);
            if (items.length) {
                this.loadItems(items, function () {
                    if (callback && context) {
                        callback.call(context);
                    }
                }, this);
            }
            else {
                console.warn("Can't Find Resource Group Path , Please Check Key or json！");
            }
        };
        /**
         * 根据资源配置中资源组的key值获取资源组路径
         * @private
         * @param {string} key
         * @returns {Array<string>}
         * @memberof ResourceLoader
         */
        ResourceLoader.prototype.getResItemsByGroupKey = function (key) {
            var items = this._scenes[key];
            if (items && items.length != 0) {
                return items;
            }
            return [];
        };
        /**
         * 单项资源加载进度
         * @private
         * @param {egret.Event} event
         * @memberof ResourceLoader
         */
        ResourceLoader.prototype.onItemProgress = function (event) {
            dragon.postNotice(dragon.Resource.ITEM_PRO, event);
        };
        /**
         * 多项资源加载
         * @private
         * @memberof ResourceLoader
         */
        ResourceLoader.prototype.loadItems = function (items, callback, context) {
            if (callback === void 0) { callback = null; }
            if (context === void 0) { context = null; }
            this._loaders = new frame.loading.LoaderList();
            for (var i = 0; i < items.length; i++) {
                var loader = new frame.loading.LoaderItem(items[i]);
                this._loaders.addChild(loader);
            }
            this._loaders.once(egret.Event.COMPLETE, function () {
                if (callback && context) {
                    callback.call(context);
                }
            }, this);
            this._loaders.addEventListener(egret.ProgressEvent.PROGRESS, this.onItemsProgress, this);
            this._loaders.load();
        };
        /**
         * 多项资源加载进度
         * @private
         * @param {egret.Event} event
         * @memberof ResourceLoader
         */
        ResourceLoader.prototype.onItemsProgress = function (event) {
            var isFinished = false;
            var target = event.target;
            var curNum = target.count;
            var totalNum = target.numChildren;
            if (curNum >= totalNum) {
                isFinished = true;
            }
            dragon.postNotice(dragon.Resource.ITEMS_PRO, curNum, totalNum, isFinished);
        };
        ResourceLoader.prototype.getRes = function (name) {
            return frame.loading.Resources.getRes(name);
        };
        /**
         * 根据场景key值加载对应的资源
         * @private
         * @param {(string | Function)} scene
         * @param {Function} [callback=null]
         * @param {Object} [context=null]
         * @memberof ResourceLoader
         */
        ResourceLoader.prototype.loadItemsByScene = function (scene, callback, context) {
            if (callback === void 0) { callback = null; }
            if (context === void 0) { context = null; }
            var name = '';
            if (typeof scene == 'function') {
                name = scene['name'];
            }
            else {
                console.warn("param 'scene' is not Function，Please check Param");
                return;
            }
            if (name) {
                dragon.singleton(dragon.ResourceLoader).loadItemsByGroupKey(name, callback, context);
            }
        };
        /**
         * 加载JSON资源，并用key值存储资源
         * @author Andrew_Huang
         * @private
         * @param {string} path
         * @param {string} key
         * @memberof ResourceLoader
         */
        ResourceLoader.prototype.loadJSONRes = function (path, key) {
            var _this = this;
            this.loadItem(path, function () {
                var res = _this.getRes(path);
                if (res) {
                    dragon.singleton(dragon.Config).addConfData(res, key);
                }
                else {
                    console.log("JSON resource is null,please check JSON_Path!");
                }
            }, this);
        };
        /**
         * 根据场景名获取资源组路径集合
         * @static
         * @param {string} scene
         * @returns {Array<string>}
         * @memberof ResourceLoader
         */
        ResourceLoader.getResItemsByScene = function (scene) {
            var name = '';
            if (typeof scene == 'function') {
                name = scene['name'];
            }
            else if (typeof scene == 'string') {
                name = scene;
            }
            if (name) {
                return dragon.singleton(dragon.ResourceLoader).getResItemsByGroupKey(name);
            }
            else {
                return [];
            }
        };
        /**
         * 根据资源路径获取资源
         * @static
         * @param {string} pathName
         * @returns {*}
         * @memberof ResourceLoader
         */
        ResourceLoader.getRes = function (pathName) {
            return dragon.singleton(dragon.ResourceLoader).getRes(pathName);
        };
        /**
         * 根据场景加载对应的资源
         * @static
         * @param {(string | Function)} scene
         * @param {Function} [callback=null]
         * @param {Object} [context=null]
         * @memberof ResourceLoader
         */
        ResourceLoader.loadItemsByScene = function (scene, callback, context) {
            if (callback === void 0) { callback = null; }
            if (context === void 0) { context = null; }
            dragon.singleton(dragon.ResourceLoader).loadItemsByScene(scene, callback, context);
        };
        /**
         * 根据资源组key值加载该组下的所有资源
         * @static
         * @param {string} key
         * @param {Function} [callback=null]
         * @param {Obj} [context=null]
         * @returns {boolean}
         * @memberof ResourceLoader
         */
        ResourceLoader.loadItemsByGroupKey = function (key, callback, context) {
            if (callback === void 0) { callback = null; }
            if (context === void 0) { context = null; }
            dragon.singleton(dragon.ResourceLoader).loadItemsByGroupKey(key, callback, context);
        };
        /**
         * 加载单项资源
         * @static
         * @param {string} path               资源路径
         * @param {Function} [callback=null]  资源加载成功回调
         * @param {Object} [context=null]     作用域
         * @memberof ResourceLoader
         */
        ResourceLoader.loadItem = function (path, callback, context, isResource) {
            if (callback === void 0) { callback = null; }
            if (context === void 0) { context = null; }
            if (isResource === void 0) { isResource = false; }
            dragon.singleton(dragon.ResourceLoader).loadItem(path, callback, context);
        };
        /**
         * 加载多项资源
         * @static
         * @param {Array<string>} items
         * @param {Function} [callback=null]
         * @param {Object} [context=null]
         * @memberof ResourceLoader
         */
        ResourceLoader.loadItems = function (items, callback, context) {
            if (callback === void 0) { callback = null; }
            if (context === void 0) { context = null; }
            dragon.singleton(dragon.ResourceLoader).loadItems(items, callback, context);
        };
        /**
         * 根据资源组key值，获取所有资源的路径
         * @static
         * @param {string} key
         * @param {Function} [callback=null]
         * @param {Object} [context=null]
         * @memberof ResourceLoader
         */
        ResourceLoader.getItemsPathByGroupKey = function (key, callback, context) {
            if (callback === void 0) { callback = null; }
            if (context === void 0) { context = null; }
            var items = dragon.singleton(dragon.ResourceLoader).getResItemsByGroupKey(key);
            if (items.length) {
                if (callback && context) {
                    callback.call(context, items);
                }
                return true;
            }
            return false;
        };
        /**
         * 加载JSON数据，并定义key存储
         * @author Andrew_Huang
         * @static
         * @param {string} path
         * @param {string} key
         * @memberof ResourceLoader
         */
        ResourceLoader.loadJSONRes = function (path, key) {
            dragon.singleton(dragon.ResourceLoader).loadJSONRes(path, key);
        };
        /**
         * 加载资源配置
         * @static
         * @param {string} path
         * @param {Function} [callback=null]
         * @param {Object} [context=null]
         * @memberof ResourceLoader
         */
        ResourceLoader.loadResource = function (path, callback, context) {
            if (callback === void 0) { callback = null; }
            if (context === void 0) { context = null; }
            this.loadItem(path, function () {
                var success = dragon.singleton(dragon.ResourceLoader).analysicsResource(path);
                callback.call(context, success);
            }, this, true);
        };
        return ResourceLoader;
    }());
    dragon.ResourceLoader = ResourceLoader;
})(dragon || (dragon = {}));
var dragon;
(function (dragon) {
    /**
     * Scoket状态行为
     * @author Andrew_Huang
     * @export
     * @class SocketAction
     */
    var SocketAction = /** @class */ (function () {
        function SocketAction() {
        }
        /**
         * 响应成功
         * @static
         * @type {string}
         * @memberof SocketAction
         */
        SocketAction.RESPONSE_SUCCESS = 'response_success';
        /**
         * 请求错误
         * @static
         * @type {string}
         * @memberof SocketAction
         */
        SocketAction.REQUEST_ERROR = 'request_error';
        /**
         * 未授权身份令牌
         * @static
         * @type {string}
         * @memberof SocketAction
         */
        SocketAction.NOT_AUTHOR_TOKEN = 'not_author_token';
        /**
         * 未找到请求接口
         * @static
         * @type {string}
         * @memberof SocketAction
         */
        SocketAction.NOT_REQUEST_API = 'not_request_api';
        /**
         * 请求超时
         * @static
         * @type {string}
         * @memberof SocketAction
         */
        SocketAction.REQUEST_TIMEOUT = 'request_timeout';
        /**
         * 服务器未知异常
         * @static
         * @type {string}
         * @memberof SocketAction
         */
        SocketAction.SERVER_UNKNOWN_ERROR = 'server_unknown_error';
        return SocketAction;
    }());
    dragon.SocketAction = SocketAction;
})(dragon || (dragon = {}));
/*
 * @Author: Andrew_Huang
 * @Date: 2018-04-28 11:45:36
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-04-28 11:49:24
 */
var dragon;
(function (dragon) {
    /**
     * Socket状态码
     * @author Andrew_Huang
     * @export
     * @class ScoketCode
     */
    var ScoketCode = /** @class */ (function () {
        function ScoketCode() {
        }
        /**
         * 响应成功
         * @static
         * @type {number}
         * @memberof ScoketCode
         */
        ScoketCode.RESPONSE_SUCCESS = 200;
        /**
         * 请求错误
         * @static
         * @type {number}
         * @memberof ScoketCode
         */
        ScoketCode.REQUEST_ERROR = 400;
        /**
         * 未授权身份令牌
         * @static
         * @type {number}
         * @memberof ScoketCode
         */
        ScoketCode.NOT_AUTHOR_TOKEN = 401;
        /**
         * 未找到请求接口
         * @static
         * @type {number}
         * @memberof ScoketCode
         */
        ScoketCode.NOT_REQUEST_API = 404;
        /**
         * 请求超时
         * @static
         * @type {number}
         * @memberof ScoketCode
         */
        ScoketCode.REQUEST_TIMEOUT = 408;
        /**
         * 服务器未知异常
         * @static
         * @type {number}
         * @memberof ScoketCode
         */
        ScoketCode.SERVER_UNKNOWN_ERROR = 500;
        return ScoketCode;
    }());
    dragon.ScoketCode = ScoketCode;
})(dragon || (dragon = {}));
var dragon;
(function (dragon) {
    var GameWebSocket = /** @class */ (function () {
        function GameWebSocket() {
            this._heart = 0;
            this.needReconnect = false; //是否需要重连
            this.isConnecting = false; //正在连接
            this.enable = true;
        }
        GameWebSocket.prototype.tick = function () {
            if (this.needReconnect) {
                this._heart = 0;
                return;
            }
            if (this.connected) {
                this._heart++;
                if (this._heart % 30 == 0) {
                    this.request('');
                }
            }
        };
        Object.defineProperty(GameWebSocket.prototype, "connected", {
            /**
             * socket是否连接
             * @readonly
             * @memberof GameWebSocket
             */
            get: function () {
                return this._pomelo && this._pomelo['socket'];
            },
            enumerable: true,
            configurable: true
        });
        GameWebSocket.prototype.runTick = function () {
            if (!this._tickId) {
                this._tickId = dragon.setInterval(this.tick, this, 1000);
            }
        };
        /**
         * 设置socket管理类
         * @param {*} callback
         * @memberof GameWebSocket
         */
        GameWebSocket.prototype.initSocketCallback = function (callback) {
            if (!this._socketCallback) {
                var inst = dragon.singleton(callback);
                this._socketCallback = inst;
            }
        };
        /**
         * 初始化socket的IP和端口，连接服务器
         * @param {*} [config=this._config]
         * @memberof GameWebSocket
         */
        GameWebSocket.prototype.init = function (config) {
            if (config === void 0) { config = this._config; }
            var that = this;
            this._config = config;
            // if (egret.MainContext.runtimeType == egret.MainContext.RUNTIME_HTML5)
            // {
            //     if (window["WebSocket"])
            //     {
            //         this.enable = true;
            //     }
            //     else
            //     {
            //         this.enable = false;
            //         return;
            //     }
            // }
            this._pomelo = new Pomelo();
            //错误处理
            this._pomelo.on('io-error', function (data) {
                if (that._socketCallback && that._socketCallback.onError) {
                    that._socketCallback.onError(data, 'io-error');
                }
                console.log('io-error');
            });
            //连接关闭
            this._pomelo.on('close', function (data) {
                that.close();
                console.log('close');
            });
            // 接收服务端推送的消息
            this._pomelo.on('onChat', function (data) {
                if (that._socketCallback && that._socketCallback.onError) {
                    this.receiveServerData(data, function (info) {
                        that._socketCallback.onAnalysis(info);
                    });
                }
                console.log('onChat:' + data);
            });
            this._pomelo.init(config, this.initCallback.bind(this));
            // if (!this._tickId)
            // {
            //     this.runTick();
            // }
        };
        GameWebSocket.prototype.initCallback = function (data) {
            var that = this;
            //连接完成
            if (that._socketCallback && that._socketCallback.onEnter) {
                that._socketCallback.onEnter(data);
            }
        };
        /**
         * 重连
         * @memberof GameWebSocket
         */
        GameWebSocket.prototype.reconnect = function () {
            this.needReconnect = false;
            this.init();
            if (this._socketCallback && this._socketCallback.onConnect) {
                this._socketCallback.onConnect();
            }
        };
        /**
         * 关闭
         * @memberof GameWebSocket
         */
        GameWebSocket.prototype.close = function () {
            if (this._socketCallback && this._socketCallback.onClose) {
                this._socketCallback.onClose();
            }
        };
        GameWebSocket.prototype.setDisconnect = function () {
            this.needReconnect = true;
        };
        GameWebSocket.prototype.receiveServerData = function (data, callback, context) {
            if (callback === void 0) { callback = null; }
            if (context === void 0) { context = null; }
            var code = data.code;
            var msg = data.msg;
            if (code) {
                if (code == dragon.ScoketCode.RESPONSE_SUCCESS) {
                    if (callback && context) {
                        callback.call(context, data);
                    }
                    dragon.getServerData(data);
                }
                else if (code == dragon.ScoketCode.REQUEST_ERROR) {
                    dragon.postNotice(dragon.SocketAction.REQUEST_ERROR, data);
                    console.warn('code:' + code + "；msg:" + msg);
                }
                else if (code == dragon.ScoketCode.NOT_AUTHOR_TOKEN) {
                    dragon.postNotice(dragon.SocketAction.NOT_AUTHOR_TOKEN, data);
                    console.warn('code:' + code + "；msg:" + msg);
                }
                else if (code == dragon.ScoketCode.NOT_REQUEST_API) {
                    dragon.postNotice(dragon.SocketAction.NOT_REQUEST_API, data);
                    console.warn('code:' + code + "；msg:" + msg);
                }
                else if (code == dragon.ScoketCode.REQUEST_TIMEOUT) {
                    dragon.postNotice(dragon.SocketAction.REQUEST_TIMEOUT, data);
                    console.warn('code:' + code + "；msg:" + msg);
                }
                else if (code == dragon.ScoketCode.SERVER_UNKNOWN_ERROR) {
                    dragon.postNotice(dragon.SocketAction.SERVER_UNKNOWN_ERROR, data);
                    console.warn('code:' + code + "；msg:" + msg);
                }
            }
        };
        /**
         * 断开连接
         * @param {boolean} [remove=false] 是否从列表中移除socket
         * @memberof GameWebSocket
         */
        GameWebSocket.prototype.disconnect = function (remove) {
            if (remove === void 0) { remove = false; }
            if (remove) {
                this.removeSocket();
            }
            this._pomelo.disconnect();
        };
        GameWebSocket.prototype.removeSocket = function () {
            for (var i = 0; i < GameWebSocket.socketList.length; i++) {
                var name_1 = GameWebSocket.socketList[i];
                if (name_1 == this.name) {
                    dragon.removeTypeSingleton(name_1, GameWebSocket);
                    GameWebSocket.socketList.splice(i, 0);
                }
            }
        };
        /**
         * 首次初始化（断线）
         * @private
         * @static
         * @memberof GameSocket
         */
        GameWebSocket.initialize = function () {
            if (!this._initialized) {
                this._initialized = true;
                dragon.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                    if (egret.Capabilities.runtimeType == egret.RuntimeType.WEB) {
                        if (!navigator.onLine) {
                            console.log('网络已断开，请重新连接');
                            return;
                        }
                    }
                    for (var i = 0; i < GameWebSocket.socketList.length; i++) {
                        var socket = GameWebSocket.get(GameWebSocket.socketList[i]);
                        if (socket.needReconnect) {
                            socket.reconnect();
                        }
                    }
                }, this);
            }
        };
        /**
         * 发送数据
         * @param {string} route
         * @param {any} [msg=null]
         * @param {any} [callback=null]
         * @param {any} [context=null]
         * @memberof GameWebSocket
         */
        GameWebSocket.prototype.request = function (route, msg, callback, context) {
            var _this = this;
            if (msg === void 0) { msg = null; }
            if (callback === void 0) { callback = null; }
            if (context === void 0) { context = null; }
            if (this.connected) {
                this._pomelo.request(route, msg, function (response) {
                    _this.receiveServerData(response);
                    if (callback && context) {
                        callback.call(context, response);
                    }
                });
            }
        };
        /**
         * 向服务器发送不需要反馈的通知
         * @param {string} route
         * @param {*} msg
         * @memberof GameWebSocket
         */
        GameWebSocket.prototype.notice = function (route, msg) {
            if (this.connected) {
                this._pomelo.notify(route, msg);
            }
        };
        /**
         * 获取socket
         * @static
         * @param {*} [type=null]
         * @returns {GameWebSocket}
         * @memberof GameWebSocket
         */
        GameWebSocket.get = function (type) {
            if (type === void 0) { type = null; }
            type = type || 'COMMON';
            if (this.socketList.indexOf(type) == -1) {
                this.initialize();
                this.socketList.push(type);
            }
            var ret = dragon.typeSingleton(type, GameWebSocket);
            ret.name = type;
            return ret;
        };
        /**
         * 启动socket
         * @static
         * @param {*} config
         * @param {*} socketCallbak
         * @param {*} [type=null]
         * @memberof GameWebSocket
         */
        GameWebSocket.run = function (config, socketCallbak, type) {
            if (type === void 0) { type = null; }
            var socket = this.get(type);
            socket.initSocketCallback(socketCallbak);
            socket.init(config);
        };
        GameWebSocket.socketList = [];
        GameWebSocket._initialized = false;
        return GameWebSocket;
    }());
    dragon.GameWebSocket = GameWebSocket;
    /**
     * 向服务器发送通知，不接收反馈
     * @export
     * @param {string} route
     * @param {*} msg
     * @param {string} [type=null]
     */
    function sendRequestNotice(route, msg, type) {
        if (type === void 0) { type = null; }
        dragon.GameWebSocket.get(type).notice(route, msg);
    }
    dragon.sendRequestNotice = sendRequestNotice;
    /**
     * 向服务器发送数据，接收结果
     * @export
     * @param {string} route
     * @param {any} [msg=null]
     * @param {any} [callback=null]
     * @param {any} [context=null]
     * @param {string} [type=null]
     */
    function request(route, msg, callback, context, type) {
        if (msg === void 0) { msg = null; }
        if (callback === void 0) { callback = null; }
        if (context === void 0) { context = null; }
        if (type === void 0) { type = null; }
        dragon.GameWebSocket.get(type).request(route, msg, callback, context);
    }
    dragon.request = request;
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
            if (!dragon.hasTypeId(context)) {
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
            for (var key_13 in observers) {
                var obs = observers[key_13];
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
            for (var key_14 in this._nameObs) {
                var obsMap = this._nameObs[key_14];
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
        Notice.prototype.postNotice = function (name, args) {
            this._postNotice(name, args);
            this._postNotice('ALL', [name].concat(args));
        };
        Notice.prototype._postNotice = function (name, args) {
            var observers = this._nameObs[name];
            if (observers) {
                var arr = [];
                for (var key_15 in observers) {
                    var obsArr = observers[key_15];
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
     * 移除指定作用域的所有事件通知
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
            for (var key_16 in observers) {
                var obsArr = observers[key_16];
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
    function removeTypeSingleton(name, type) {
        var typeId = name + getTypeId(type);
        if (_singletonMap.hasOwnProperty(typeId)) {
            _singletonMap[typeId] = null;
            delete _singletonMap[typeId];
            return true;
        }
        return false;
    }
    dragon.removeTypeSingleton = removeTypeSingleton;
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
    /**
     * 获取Gui的instance
     * @author Andrew_Huang
     * @export
     * @template T
     * @param {string} name
     * @returns {T}
     */
    function getGuiCreateInstance(name) {
        var inst = egret.getDefinitionByName(name);
        if (inst) {
            return inst.createInstance();
        }
        return null;
    }
    dragon.getGuiCreateInstance = getGuiCreateInstance;
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
    var display = /** @class */ (function () {
        function display() {
        }
        Object.defineProperty(display, "stageH", {
            /**
             * 舞台高
             * @readonly
             * @static
             * @type {number}
             * @memberof Display
             */
            get: function () {
                //dragon.GRootStage.stageH
                return dragon.stage.stageHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(display, "stageW", {
            /**
             * 舞台宽
             * @readonly
             * @static
             * @type {number}
             * @memberof Display
             */
            get: function () {
                // dragon.GRootStage.stageW
                return dragon.stage.stageWidth;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 设置显示对象的相对锚点
         * @static
         * @param {fairygui.GComponent} display
         * @param {number} anchorX
         * @param {number} [anchorY=anchorX]
         * @memberof display
         */
        display.setAnchor = function (display, anchorX, anchorY) {
            if (anchorY === void 0) { anchorY = anchorX; }
            display.pivotX = anchorX;
            display.pivotY = anchorY;
            display.displayObject.anchorOffsetX = display.width * anchorX;
            display.displayObject.anchorOffsetY = display.height * anchorY;
        };
        /**
         * 销毁 container 所有的子元素
         * @static
         * @param {*} container
         * @memberof Display
         */
        display.destroyChildren = function (container) {
        };
        /**
         * 设置 display 的尺寸，满屏显示
         * @static
         * @param {egret.DisplayObject} display
         * @memberof Display
         */
        display.setFullDisplay = function (display) {
            if (display instanceof fairygui.GComponent) {
                display.width = this.stageW;
                display.height = this.stageH;
                // display.displayObject.width = this.stageW;
                // display.displayObject.height = this.stageH;
            }
            else {
                display.width = this.stageW;
                display.height = this.stageH;
            }
        };
        /**
         * 从父级移除 child
         * @param {(egret.DisplayObject | dragon.BaseComponent)} child
         * @param {boolean} [forceRemove=false]
         * @memberof Display
         */
        display.removeFromParent = function (child, forceRemove) {
            if (forceRemove === void 0) { forceRemove = false; }
            // if (!forceRemove && egret.getQualifiedSuperclassName(child) == 'BaseComponent')
            // {
            //     dragon.UI.remove(child);
            // }
            if (is.truthy(child) && child.parent) {
                child.parent.removeChild(child);
                //(<fairygui.GComponent>child.display.parent).removeChild(child.display, forceRemove);
            }
        };
        display.clickBlankCloseSelf = function (context) {
            var _this = this;
            dragon.setTimeout(function () {
                if (context) {
                    var typeId = dragon.getTypeId(context);
                    var eventPhase = 0;
                    _this._displayMap[typeId] = { context: context, eventPhase: eventPhase };
                    if (context.display) {
                        context.display.addClickListener(display.targetEvent, context);
                        if (!display._grootListen) {
                            display._grootListen = true;
                            fairygui.GRoot.inst.addClickListener(display.close, display);
                        }
                    }
                }
            }, this, 100);
        };
        display.targetEvent = function (event) {
            var typeId = dragon.getTypeId(event.currentTarget.$_class);
            var obj = display._displayMap[typeId];
            if (obj) {
                obj.eventPhase = event.eventPhase;
            }
        };
        display.close = function (event) {
            var close = true;
            var target = event.target;
            var phase = event.eventPhase;
            if (target) {
                for (var typeId in display._displayMap) {
                    var obj = display._displayMap[typeId];
                    var context = obj.context;
                    var eventPhase = obj.eventPhase;
                    if (context && context.display) {
                        if (eventPhase == 2 || eventPhase == 3) {
                            //点击到目标自身，不关闭
                            obj.eventPhase = 0;
                            close = false;
                            break;
                        }
                    }
                }
                if (close) {
                    // 遍历弹框层
                    var removeBox = display.removeBaseComponent(dragon.UIType.BOX);
                    if (removeBox) {
                        display.removeGRootListener();
                        return;
                    }
                    // 遍历面板层
                    var removePanel = display.removeBaseComponent(dragon.UIType.PANEL);
                    if (removePanel) {
                        display.removeGRootListener();
                        return;
                    }
                    // 遍历公共层
                    var removeCommon = display.removeBaseComponent(dragon.UIType.COMMON);
                    if (removeCommon) {
                        display.removeGRootListener();
                        return;
                    }
                }
            }
        };
        display.removeBaseComponent = function (type) {
            var layer = dragon.UI.getContainerByType(type);
            var num = layer.numChildren;
            var child = layer.getChildAt(num - 1);
            if (child) {
                var id = dragon.getTypeId(child);
                if (display._displayMap[id]) {
                    display.removeFromParent(child);
                    child.display.removeClickListener(display.targetEvent, child);
                    delete display._displayMap[id];
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        };
        display.removeGRootListener = function () {
            var len = dragon.Obj.keys(display._displayMap).length;
            if (len == 0) {
                display._grootListen = false;
                fairygui.GRoot.inst.removeClickListener(display.close, display);
            }
        };
        display._displayMap = {};
        display._grootListen = false;
        return display;
    }());
    dragon.display = display;
})(dragon || (dragon = {}));
/**
 * 初始化定义部分数据
 * @author Andrew_Huang
 */
var dragon;
(function (dragon) {
    /**
     * 定义对象（包括修改对象属性数据）
     * configurable：属性是否可以更改；enumerable：是否可以用for..in遍历；
     * @export
     * @param {*} object        目标对象
     * @param {string} property 需要定义的属性或方法的名字
     * @param {*} getter
     * @param {*} [setter]
     */
    function def(object, property, getter, setter) {
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
    dragon.def = def;
    var __game_callback = null;
    def(dragon, 'stage', function () {
        return egret.MainContext.instance.stage;
    });
    def(dragon, 'GRootStage', function () {
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
            for (var key_17 in obj) {
                keys.push(key_17);
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
                var key_18 = keys[i];
                if (attrs[key_18] !== obj[key_18] || !(key_18 in obj)) {
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
                var key_19 = keyArr[i];
                if (is.array(curObj)) {
                    curObj = curObj[parseInt(key_19)];
                }
                else {
                    if (key_19 == '') {
                        curObj = curObj;
                    }
                    else {
                        curObj = curObj[key_19];
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
     * 游戏常用的平台、运行环境参数
     * @export
     * @class ExtraInfo
     */
    var PlatExtraInfo = /** @class */ (function () {
        function PlatExtraInfo() {
            this._spid = egret.getOption('egret.runtime.spid');
            this._version = egret.getOption('fv');
            this._platform = egret.getOption('pf') || 'ND';
            this._bench = egret.getOption('gv') || 'local';
            this._oplayerId = egret.getOption("oplayerId");
            this._channel = egret.getOption("channelTag");
            this._runtime = egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE;
        }
        Object.defineProperty(PlatExtraInfo.prototype, "spid", {
            get: function () {
                return this._spid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlatExtraInfo.prototype, "platform", {
            get: function () {
                return this._platform;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlatExtraInfo.prototype, "version", {
            get: function () {
                return this._version;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlatExtraInfo.prototype, "bench", {
            get: function () {
                return this._bench;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlatExtraInfo.prototype, "oplayerId", {
            get: function () {
                return this._oplayerId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlatExtraInfo.prototype, "channel", {
            get: function () {
                return this._channel;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlatExtraInfo.prototype, "runtime", {
            get: function () {
                return this._runtime;
            },
            enumerable: true,
            configurable: true
        });
        return PlatExtraInfo;
    }());
    dragon.PlatExtraInfo = PlatExtraInfo;
    var __extra = null;
    dragon.def(dragon, 'extra', function () {
        if (!__extra) {
            __extra = new PlatExtraInfo();
        }
        return __extra;
    });
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
                for (var key_20 in args) {
                    var search = '{' + key_20 + '}';
                    var replace = '' + args[key_20];
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
/*
 * @Author: Andrew_Huang
 * @Date: 2018-04-28 10:28:45
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-04-28 10:55:04
 */
var dragon;
(function (dragon) {
    /**
     * 服务端源数据
     * @author Andrew_Huang
     * @export
     * @class DataServer
     */
    var DataServer = /** @class */ (function () {
        function DataServer() {
        }
        return DataServer;
    }());
    dragon.DataServer = DataServer;
})(dragon || (dragon = {}));

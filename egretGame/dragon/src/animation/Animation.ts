/**
 * @author Andrew_Huang
 */
module dragon
{
    /**
     * 动画基类
     * @export
     * @class BaseAnimation
     * @implements {dragon.IAnimation}
     */
    export class Animation implements dragon.IAnimation
    {
        private _target: any;                       //执行动画的目标
        private _timeLine: TimelineMax;             //时间轴管理动画
        private _aniInfoArr: Array<AnimationInfo>;  //动画信息列表
        private _isRunning: boolean = false;        //动画是否正在播放
        private static _aniMap: {} = [];            //存储动画目标与动画对象
        private static _aniId: number = 1;          //动画Id

        public constructor()
        {
            this._timeLine = new TimelineMax({
                onComplete: this.onComplete.bind(this)
            });
            this._aniInfoArr = [];
        }

        public get target(): any
        {
            return this._target;
        }

        public set target(value: any)
        {
            this._target = value;
        }

        public get isRunning(): boolean
        {
            return this._isRunning;
        }

        private onComplete(): void
        {
            Animation.removeAnimation(this.target, this);
        }

        /**
         * 设置动画目标，并返回动画实例
         * @param {*} obj 
         * @returns {dragon.IAnimation} 
         * @memberof BaseAnimation
         */
        public setTarget(obj: any): dragon.IAnimation
        {
            this.target = obj;
            return this;
        }

        /**
         * 设置动画：移动到目标点
         * @param {number} duration 时间
         * @param {*} prop          动画参数
         * @param {*} [ease]        动画展示方式
         * @returns {dragon.IAnimation} 
         * @memberof BaseAnimation
         */
        public to(duration: number, props: any, ease?: any): dragon.IAnimation
        {
            this.mergeEase(props, ease);
            this._aniInfoArr.push({ duration: duration / 1000, props: props });
            return this;
        }

        /**
         * 设置动画展示方式
         * @private
         * @param {*} props 
         * @param {*} [ease] 
         * @memberof BaseAnimation
         */
        private mergeEase(props: any, ease?: any): void
        {
            props['ease'] = ease ? ease : Linear.easeNone;
        }

        /**
         * 设置坐标点为参数点
         * @private
         * @param {*} props 
         * @param {string} [type='by'] 
         * @returns {*} 
         * @memberof BaseAnimation
         */
        private toProps(props: any, type: string = 'by'): any
        {
            let obj = {};
            for (let key in props)
            {
                let num = props[key];
                if (type == 'by' || key == 'x' || key == 'y')
                {
                    obj[key] = num > 0 ? '+=' + num : '-=' + Math.abs(num);
                } else
                {
                    obj[key] = '' + num;
                }
            }
            return obj;
        }

        /**
         * 初始化参数坐标点为0
         * @private
         * @param {*} props 
         * @param {string} [type='by'] 
         * @returns {*} 
         * @memberof BaseAnimation
         */
        private fromProps(props: any, type: string = 'by'): any
        {
            let obj = {};
            for (let key in props)
            {
                obj[key] = '+=0';
            }
            return obj;
        }

        /**
         * 设置动画信息：设置参数
         * @param {*} props 
         * @returns {dragon.IAnimation} 
         * @memberof BaseAnimation
         */
        public setProps(props: any): dragon.IAnimation
        {
            this._aniInfoArr.push({ duration: 0, props: props, type: AniPropsType.SET });
            return this;
        }

        /**
         * 设置动画信息：移除
         * @returns {dragon.IAnimation} 
         * @memberof BaseAnimation
         */
        public remove(): dragon.IAnimation
        {
            this._aniInfoArr.push({ duration: 0, props: [], type: AniPropsType.REMOVE });
            return this;
        }

        /**
         * 缩放动画
         * @param {number} duration 
         * @param {number} scale 
         * @param {number} [delay]  延迟时间或者动画播放方式
         * @param {*} [ease] 
         * @returns {dragon.IAnimation} 
         * @memberof BaseAnimation
         */
        public zoom(duration: number, scale: number, delay?: any, ease?: any): dragon.IAnimation
        {
            if (is.fun(delay))
            {
                ease = delay;
                delay = 0;
            } else if (is.falsy(delay))
            {
                delay = 0;
            }
            let delayNum = (duration - delay) / 2;
            this.by(delayNum, { scaleX: scale, scaleY: scale }, ease);
            if (delay > 0)
            {
                this.delay(delay);
            }
            this.by(delayNum, { scaleX: -scale, scaleY: -scale }, ease);
            return this;
        }

        /**
         * 动画播放方式：by
         * @param {number} duration 
         * @param {*} props
         * @param {*} [ease] 
         * @returns {dragon.IAnimation} 
         * @memberof BaseAnimation
         */
        public by(duration: number, props: any, ease?: any): dragon.IAnimation
        {
            this.mergeEase(props, ease);
            this._aniInfoArr.push({ duration: duration / 1000, props: props, type: AniPropsType.BY });
            return this;
        }

        /**
         * 动画播放类型：延迟 delay
         * @param {number} time 
         * @returns {dragon.IAnimation} 
         * @memberof BaseAnimation
         */
        public delay(duration: number): dragon.IAnimation
        {
            this._aniInfoArr.push({ duration: duration / 1000, props: {}, type: AniPropsType.DELAY });
            return this;
        }

        /**
         * 动画回调
         * @param {Function} callback 
         * @param {Object} [context] 
         * @param {any} args 
         * @returns {dragon.IAnimation} 
         * @memberof BaseAnimation
         */
        public call(callback: Function, context?: Object, ...args): dragon.IAnimation
        {
            this._aniInfoArr.push({ duration: 0, props: { callback, context }, type: AniPropsType.CALL });
            return this;
        }

        /**
         * 闪烁动画
         * @param {number} duration 动画时间
         * @param {number} blinks   闪烁的次数
         * @param {*} [ease] 
         * @returns {dragon.IAnimation} 
         * @memberof BaseAnimation
         */
        public blink(duration: number, blinks: number, ease?: any): dragon.IAnimation
        {
            let delayStep = duration / blinks;
            let vis: boolean = true;
            for (let i: number = 0; i < blinks; i++)
            {
                this.delay(delayStep);
                this.setProps({ visible: vis });
                vis = !vis;
            }
            return this;
        }

        /**
         * 淡入淡出动画
         * @param {number} duration 
         * @param {*} [ease] 
         * @returns {dragon.IAnimation} 
         * @memberof BaseAnimation
         */
        public fadeInOut(duration: number, ease?: any): dragon.IAnimation
        {
            this.to(duration / 2, { alpha: 0 }, ease);
            this.to(duration / 2, { alpha: 1 }, ease);
            return this;
        }

        /**
         * 播放动画
         * @param {*} [target=this._target] 
         * @param {boolean} [isLoop] 
         * @returns {dragon.IAnimation} 
         * @memberof BaseAnimation
         */
        public run(target: any = this._target, isLoop?: boolean): dragon.IAnimation
        {
            Animation.addAnimation(target, this);
            if (isLoop)
            {
                this._timeLine.repeat(-1);
            }
            for (let i: number = 0; i < this._aniInfoArr.length; i++)
            {
                let info: AnimationInfo = this._aniInfoArr[i];
                let type: AniPropsType = info.type;
                switch (type)
                {
                    case AniPropsType.DELAY://延迟动画
                        this._timeLine.to(target, info.duration, {});
                        break;
                    case AniPropsType.SET://参数设置
                        this._timeLine.set(target, info.props);
                        break;
                    case AniPropsType.BY://运动
                        this._timeLine.fromTo(target, info.duration, this.fromProps(info.props), this.toProps(info.props));
                        break;
                    case AniPropsType.REMOVE://移除
                        this._timeLine.call(() =>
                        {
                            if (target && target.parent)
                            {
                                target.parent.remove(target);
                            }
                        });
                        break;
                    case AniPropsType.CALL://回调
                        let callback: Function = info.props['callback'];
                        let context: Object = info.props['context'];
                        if (callback)
                        {
                            this._timeLine.call(callback.bind(context));
                        }
                        break;
                    default:
                        this._timeLine.to(target, info.duration, info.props);
                        break;
                }
            }
            if (!isLoop)
            {
                this._timeLine.call(() =>
                {
                    Animation.removeAnimation(target, this);
                });
            }
            this._isRunning = true;
            return this;
        }

        public shake(duration: number, offsetX: any, offestY?: any, ease?: any): dragon.IAnimation
        {
            return null;
        }

        public score(duration: number, beginScore: any, endScore?: any, ease?: any): dragon.IAnimation
        {
            return null;
        }

        /**
         * 停止动画（进度设置为1表示完成）
         * @memberof BaseAnimation
         */
        public stop(): void
        {
            this._timeLine.totalProgress(1);
            Animation.removeAnimation(this.target, this);
        }

        public pause(): void
        {
            this._timeLine.pause();
        }

        public resume(): void
        {
            this._timeLine.resume();
        }

        public destroy(): void
        {
            this._timeLine.kill();
            this._timeLine = null;
            this._target = null;
        }

        /**
         * 给目标添加动画
         * @static
         * @param {*} target 
         * @param {dragon.IAnimation} animation 
         * @memberof BaseAnimation
         */
        public static addAnimation(target: any, animation: dragon.IAnimation): void
        {
            if (!target.$__aniId_)
            {
                target.$__aniId_ = Animation._aniId++;
            }
            if (!Animation._aniMap.hasOwnProperty(target.$__aniId_))
            {
                Animation._aniMap[target.$__aniId_] = [];
            }
            Animation._aniMap[target.$__aniId_].push(animation);
        }

        /**
         * 移除动画目标
         * @static
         * @param {*} target 
         * @param {dragon.IAnimation} animation 
         * @memberof BaseAnimation
         */
        public static removeAnimation(target: any, animation: dragon.IAnimation): void
        {
            if (target && target.$__aniId_)
            {
                let arr = Animation._aniMap[target.$__aniId_];
                if (arr && arr.length > 0)
                {
                    let idx: number = arr.indexOf(animation);
                    if (idx > -1)
                    {
                        animation.destroy();
                        arr.splice(idx, 1);
                    }
                    if (!arr.length)
                    {
                        delete Animation._aniMap[target.$__aniId_];
                    }
                }
            }
        }

        /**
         * 停止目标动画
         * @static
         * @param {*} target 
         * @param {boolean} [remove=true] 是否移除动画
         * @memberof BaseAnimation
         */
        public static stopAnimationByTarget(target: any, remove: boolean = true): void
        {
            if (target && target.$__aniId_)
            {
                let arr = Animation._aniMap[target.$__aniId_];
                if (arr && arr.length)
                {
                    if (remove)
                    {
                        while (arr.length)
                        {
                            arr.shift().stop();
                        }
                        delete Animation._aniMap[target.$__aniId_];
                    } else
                    {
                        Animation.pauseAnimationByTarget(target);
                    }

                }
            }
        }

        /**
         * 暂停目标动画
         * @static
         * @param {*} target 
         * @memberof BaseAnimation
         */
        public static pauseAnimationByTarget(target: any): void
        {
            if (target && target.$__aniId_)
            {
                let arr = Animation._aniMap[target.$__aniId_];
                if (arr && arr.length)
                {
                    for (let i: number = 0; i < arr.length; i++)
                    {
                        let item: dragon.IAnimation = arr[i];
                        item.pause();
                    }
                }
            }
        }

        /**
         * 重启目标动画
         * @static
         * @param {*} target 
         * @memberof BaseAnimation
         */
        public static resumeAnimationByTarget(target: any): void
        {
            if (target && target.$__aniId_)
            {
                let arr = Animation._aniMap[target.$__aniId_];
                if (arr && arr.length)
                {
                    for (let i: number = 0; i < arr.length; i++)
                    {
                        let item: dragon.IAnimation = arr[i];
                        item.resume();
                    }
                }
            }
        }

        /**
         * 移除目标动画
         * @static
         * @param {*} target 
         * @memberof BaseAnimation
         */
        public static removeAnimationByTarget(target: any): void
        {
            if (target && target.$__aniId_)
            {
                let arr = Animation._aniMap[target.$__aniId_];
                if (arr && arr.length)
                {
                    while (arr.length)
                    {
                        arr.shift().destroy();
                    }
                    delete Animation._aniMap[target.$__aniId_];
                }
            }
        }

        public static by(duration: number, props: any, ease?: any): IAnimation
        {
            return new Animation().by(duration, props, ease);
        }

        public static to(duration: number, props: any, ease?: any): IAnimation
        {
            return new Animation().to(duration, props, ease);
        }

        public static call(callback: Function, context: any): IAnimation
        {
            return new Animation().call(callback, context);
        }

        public static delay(delay: number): IAnimation
        {
            return new Animation().delay(delay);
        }
    }
}
/**
 * @author Andrew_Huang
 */
declare module dragon {
    /**
     * 动画基类
     * @export
     * @class BaseAnimation
     * @implements {dragon.IAnimation}
     */
    class BaseAnimation implements dragon.IAnimation {
        private _target;
        private _timeLine;
        private _aniInfoArr;
        private _isRunning;
        private static _aniMap;
        private static _aniId;
        constructor();
        target: any;
        readonly isRunning: boolean;
        private onComplete();
        /**
         * 设置动画目标，并返回动画实例
         * @param {*} obj
         * @returns {dragon.IAnimation}
         * @memberof BaseAnimation
         */
        setTarget(obj: any): dragon.IAnimation;
        /**
         * 设置动画：移动到目标点
         * @param {number} duration 时间
         * @param {*} prop          动画参数
         * @param {*} [ease]        动画展示方式
         * @returns {dragon.IAnimation}
         * @memberof BaseAnimation
         */
        to(duration: number, props: any, ease?: any): dragon.IAnimation;
        /**
         * 设置动画展示方式
         * @private
         * @param {*} props
         * @param {*} [ease]
         * @memberof BaseAnimation
         */
        private mergeEase(props, ease?);
        /**
         * 设置坐标点为参数点
         * @private
         * @param {*} props
         * @param {string} [type='by']
         * @returns {*}
         * @memberof BaseAnimation
         */
        private toProps(props, type?);
        /**
         * 初始化参数坐标点为0
         * @private
         * @param {*} props
         * @param {string} [type='by']
         * @returns {*}
         * @memberof BaseAnimation
         */
        private fromProps(props, type?);
        /**
         * 设置动画信息：设置参数
         * @param {*} props
         * @returns {dragon.IAnimation}
         * @memberof BaseAnimation
         */
        setProps(props: any): dragon.IAnimation;
        /**
         * 设置动画信息：移除
         * @returns {dragon.IAnimation}
         * @memberof BaseAnimation
         */
        remove(): dragon.IAnimation;
        /**
         * 缩放动画
         * @param {number} duration
         * @param {number} scale
         * @param {number} [delay]  延迟时间或者动画播放方式
         * @param {*} [ease]
         * @returns {dragon.IAnimation}
         * @memberof BaseAnimation
         */
        zoom(duration: number, scale: number, delay?: any, ease?: any): dragon.IAnimation;
        /**
         * 动画播放方式：by
         * @param {number} duration
         * @param {*} props
         * @param {*} [ease]
         * @returns {dragon.IAnimation}
         * @memberof BaseAnimation
         */
        by(duration: number, props: any, ease?: any): dragon.IAnimation;
        /**
         * 动画播放类型：延迟 delay
         * @param {number} time
         * @returns {dragon.IAnimation}
         * @memberof BaseAnimation
         */
        delay(duration: number): dragon.IAnimation;
        /**
         * 动画回调
         * @param {Function} callback
         * @param {Object} [context]
         * @param {any} args
         * @returns {dragon.IAnimation}
         * @memberof BaseAnimation
         */
        call(callback: Function, context?: Object, ...args: any[]): dragon.IAnimation;
        /**
         * 闪烁动画
         * @param {number} duration 动画时间
         * @param {number} blinks   闪烁的次数
         * @param {*} [ease]
         * @returns {dragon.IAnimation}
         * @memberof BaseAnimation
         */
        blink(duration: number, blinks: number, ease?: any): dragon.IAnimation;
        /**
         * 淡入淡出动画
         * @param {number} duration
         * @param {*} [ease]
         * @returns {dragon.IAnimation}
         * @memberof BaseAnimation
         */
        fadeInOut(duration: number, ease?: any): dragon.IAnimation;
        /**
         * 播放动画
         * @param {*} [target=this._target]
         * @param {boolean} [isLoop]
         * @returns {dragon.IAnimation}
         * @memberof BaseAnimation
         */
        run(target?: any, isLoop?: boolean): dragon.IAnimation;
        shake(duration: number, offsetX: any, offestY?: any, ease?: any): dragon.IAnimation;
        score(duration: number, beginScore: any, endScore?: any, ease?: any): dragon.IAnimation;
        /**
         * 停止动画（进度设置为1表示完成）
         * @memberof BaseAnimation
         */
        stop(): void;
        pause(): void;
        resume(): void;
        destroy(): void;
        /**
         * 给目标添加动画
         * @static
         * @param {*} target
         * @param {dragon.IAnimation} animation
         * @memberof BaseAnimation
         */
        static addAnimation(target: any, animation: dragon.IAnimation): void;
        /**
         * 移除动画目标
         * @static
         * @param {*} target
         * @param {dragon.IAnimation} animation
         * @memberof BaseAnimation
         */
        static removeAnimation(target: any, animation: dragon.IAnimation): void;
        /**
         * 停止目标动画
         * @static
         * @param {*} target
         * @param {boolean} [remove=true] 是否移除动画
         * @memberof BaseAnimation
         */
        static stopAnimationByTarget(target: any, remove?: boolean): void;
        /**
         * 暂停目标动画
         * @static
         * @param {*} target
         * @memberof BaseAnimation
         */
        static pauseAnimationByTarget(target: any): void;
        /**
         * 重启目标动画
         * @static
         * @param {*} target
         * @memberof BaseAnimation
         */
        static resumeAnimationByTarget(target: any): void;
        /**
         * 移除目标动画
         * @static
         * @param {*} target
         * @memberof BaseAnimation
         */
        static removeAnimationByTarget(target: any): void;
        static by(duration: number, props: any, ease?: any): IAnimation;
        static to(duration: number, props: any, ease?: any): IAnimation;
        static call(callback: Function, context: any): IAnimation;
    }
}
/**
 * @author Andrew_Huang
 */
declare module dragon {
    /**
     * 动画信息类型
     * @export
     * @enum {number}
     */
    enum AniPropsType {
        DELAY = 1,
        SET = 2,
        BY = 3,
        REMOVE = 4,
        CALL = 5,
    }
    /**
     * 动画信息
     * @export
     * @interface AnimationInfo
     */
    interface AnimationInfo {
        duration: number;
        props: any;
        type?: number;
    }
    /**
     * 基础动画接口
     * @export
     * @interface IAnimation
     */
    interface IAnimation {
        target: any;
        score(duration: number, beginScore: any, endScore?: any, ease?: any): IAnimation;
        shake(duration: number, offsetX: any, offestY?: any, ease?: any): IAnimation;
        to(duration: number, props: any, ease?: any): IAnimation;
        by(duration: number, props: any, ease?: any): IAnimation;
        zoom(duration: number, scale: number, delay?: any, ease?: any): IAnimation;
        delay(duration: number): IAnimation;
        blink(duration: number, blinks: number, ease?: any): IAnimation;
        call(callback: () => void, context?: Object, ...args: any[]): IAnimation;
        setProps(props: any): IAnimation;
        remove(): IAnimation;
        fadeInOut(duration: number, ease?: any): IAnimation;
        destroy(): void;
        stop(): void;
        pause(): void;
        setTarget(obj: any): IAnimation;
        resume(): void;
        run(target?: any, isLoop?: boolean): IAnimation;
    }
}
declare module dragon {
    /**
     * A星寻路入口
     * @author 黄灿滨
     * @export
     * @class Start
     */
    class AStartMain {
        array: any;
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
        getPathPointList(mapArray: any, startX: number, startY: number, endX: number, endY: number): Array<egret.Point>;
    }
    /**
     * A星寻路
     * @author 黄灿滨
     * @export
     * @class AStart
     */
    class AStart {
        private OBLIQUE;
        private STEP;
        private mapArray;
        private OpenList;
        private CloseList;
        constructor(array: any, oblique?: number, step?: number);
        /**
         * 初始化数据
         * @private
         * @memberof AStart
         */
        private initList();
        /**
         * 路径寻找
         * @param {Point} startPoint        开始点
         * @param {Point} endPoint          结束点
         * @param {boolean} IsIngnoreCorner 是否忽略在角落的
         * @returns {Point}
         * @memberof AStart
         */
        findPath(startPoint: Point, endPoint: Point, IsIngnoreCorner?: boolean): Point;
        /**
         * 找出与 point 点相邻的8个节点
         * @private
         * @param {Point} point
         * @param {boolean} IsIngnoreCorner
         * @returns {Array<Point>}
         * @memberof AStart
         */
        private SurroundPoints(point, IsIngnoreCorner);
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
        private canReach(start, x, y, IsIngnoreCorner);
        /**
         * 是否为障碍物（0：不是障碍物；1：障碍物）
         * @private
         * @param {number} x
         * @param {number} y
         * @returns {boolean}
         * @memberof AStart
         */
        private notObstacles(x, y);
        /**
         * 在开启列表中找到点，更新 G 和 F 的值，如果计算出来的 G 值比原来小，则更新父节点，并重新计算 G 值和 F 值
         * @private
         * @param {Point} tempStart 父节点
         * @param {Point} point     子节点（周围的8个可以到达节点之一）
         * @memberof AStart
         */
        private findPointInOpenList(tempStart, point);
        /**
         * 在开启列表中没找到点，加入到开启列表中，并计算该子节点的 G、H 和 F 的值
         * @private
         * @param {Point} tempStart 父节点
         * @param {Point} end       目标点（终点）
         * @param {Point} point     子节点（周围的8个可以到达的节点之一）
         * @memberof AStart
         */
        private notFindPointInOpenList(tempStart, end, point);
        /**
         * 计算 G：从起点 A 移动到网格上指定方格的移动耗费 (可沿斜方向移动)
         * @private
         * @param {Point} start 父节点
         * @param {Point} point 子节点
         * @returns {number}
         * @memberof AStart
         */
        private calcG(start, point);
        /**
         * 计算 H：从指定的方格移动到终点 B 的预计耗费 (H 有很多计算方法, 这里我们设定只可以上下左右移动)
         * @private
         * @param {Point} end   终点
         * @param {Point} point 子节点
         * @returns {number}
         * @memberof AStart
         */
        private calcH(end, point);
    }
}
declare module dragon {
    /**
     * 寻路节点
     * @author 黄灿滨
     * @export
     * @class Point
     */
    class Point {
        private _parentPoint;
        private _X;
        private _Y;
        private _F;
        private _G;
        private _H;
        constructor(x: number, y: number);
        parentPoint: Point;
        X: number;
        Y: number;
        F: number;
        G: number;
        H: number;
        /**
         * 计算总长
         * @memberof Point
         */
        calcF(): void;
    }
}
declare module dragon {
    /**
     * 寻路点辅助工具
     * @author 黄灿滨
     * @export
     * @class PointListHelp
     */
    class PointListHelp {
        /**
         * 点是否在开启列表中
         * @param list
         * @param point
         */
        static pointIsExistInList(list: Array<Point>, point: Point): boolean;
        /**
         * 根据 X 和 Y 坐标，判断是否存在列表中
         * @param {Array<Point>} list
         * @param {number} x
         * @param {number} y
         * @returns {boolean}
         * @memberof PointListHelp
         */
        static xyIsExistInList(list: Array<Point>, x: number, y: number): boolean;
        /**
         * 获取 F 值最小的点，作为下一次检查的父节点
         * @param {Array<Point>} list
         * @returns {Point}
         * @memberof PointListHelp
         */
        static MinPoint(list: Array<Point>): Point;
        /**
         * 添加新的坐标点
         * @param {Array<Point>} list
         * @param {number} x
         * @param {number} y
         * @returns {Point}
         * @memberof PointListHelp
         */
        static addPoint(list: Array<Point>, x: number, y: number): void;
        /**
         * 点列表中是否存在该坐标点
         * @param {Array<Point>} list
         * @param {Point} point
         * @returns {Point}
         * @memberof PointListHelp
         */
        static getPoint(list: Array<Point>, point: Point): Point;
        /**
         * 从列表中移除坐标点
         * @param {Array<Point>} list
         * @param {number} x
         * @param {number} y
         * @memberof PointListHelp
         */
        static removePointFromList(list: Array<Point>, x: number, y: number): void;
    }
}
declare module dragon {
    class BaseComponent {
    }
}
/**
 * 配置数据操作
 * @author Andrew_Huang
 */
declare module dragon {
    class Config {
        private _configMap;
        /**
         * 获取配置数据
         * @template T
         * @param {string} name
         * @param {string} key
         * @param {T} defaultValue
         * @returns {T}
         * @memberof Config
         */
        private getConfig<T>(name, key, defaultValue);
        /**
         * 判断key值的数据是否存在name的配置数据中
         * @param {string} name
         * @param {string} key
         * @returns {boolean}
         * @memberof Config
         */
        private exists(name, key);
        private addConfData();
        static exists(name: string, key: string): boolean;
        /**
         * 获取配置数据
         * @static
         * @param {string} name
         * @param {string} [key=null]
         * @param {*} [defaultValue=null]
         * @returns {*}
         * @memberof Config
         */
        static get(name: string, key?: string, defaultValue?: any): any;
    }
}
/**
 * @author Andrew_Huang
 */
declare module dragon {
    /**
     * 游戏常用的平台、运行环境参数
     * @export
     * @class ExtraInfo
     */
    class ExtraInfo {
        private _spid;
        private _platform;
        private _version;
        private _bench;
        private _oplayerId;
        private _channel;
        private _runtime;
        constructor();
        readonly spid: any;
        readonly platform: string;
        readonly version: string;
        readonly bench: string;
        readonly oplayerId: string;
        readonly channel: string;
        readonly runtime: boolean;
    }
    /**
     * 游戏常用的平台、运行环境参数
     */
    var extra: ExtraInfo;
}
/**
 * 游戏框架的基础配置设置
 * @author Andrew_Huang
 */
declare module dragon {
    interface ISetting {
        ProjectName: string;
        BoxAnimation: string;
        PanelAnimation: string;
        SceneAnimation: string;
        TooltipClass: string;
        SimpleLoadingClass: string;
        BoxClass: string;
        ProgressLoadingClass: string;
        ConfirmClass: string;
        ItemModelClass: string;
        GameCallbackClass: string;
        AnimationBlueprint: string;
        LoadSceneClass: string;
    }
    /**
     * 数据配置设置（项目）
     * @export
     * @class Setting
     * @implements {ISetting}
     */
    class Setting implements ISetting {
        private _setting;
        private getAnimation(animation);
        readonly SimpleLoadingClass: string;
        readonly LoadSceneClass: string;
        readonly TooltipClass: string;
        readonly AnimationBlueprint: string;
        readonly ProgressLoadingClass: string;
        readonly GameCallbackClass: string;
        readonly BoxClass: string;
        readonly ConfirmClass: string;
        readonly SceneAnimation: string;
        readonly PanelAnimation: string;
        readonly ItemModelClass: string;
        readonly BoxAnimation: string;
        readonly ProjectName: string;
        init(setting: ISetting): void;
        /**
         * 初始化游戏在项目层级上的配置数据
         * @static
         * @param {*} config
         * @memberof Setting
         */
        static init(config: any): void;
    }
    function getSetting(): ISetting;
}
/**
 * @author Andrew_Huang
 */
declare module dragon {
    /**
     * 事件通知信息
     * @export
     * @interface NoticeInfo
     */
    interface NoticeInfo {
        name: string;
        callback: (...args) => any;
        context: any;
        priority: number;
    }
    /**
     * 基础事件通知
     * 存储流程：事件名 -> 作用域 -> 事件
     * @export
     * @class BaseNotice
     */
    class BaseNotice {
        protected _nameObs: any;
        /**
         * 添加事件通知
         * @param {string} name
         * @param {(...args) => any} callback
         * @param {Object} context
         * @param {number} [priority=0]
         * @returns {*}
         * @memberof BaseNotice
         */
        addObserver(name: string, callback: (...args) => any, context: Object, priority?: number): NoticeInfo;
        /**
         * 事件只执行一次后自动删除
         * @param {string} name
         * @param {Function} callback
         * @param {Object} context
         * @param {number} [priority=0]
         * @returns {*}
         * @memberof BaseNotice
         */
        onceObserver(name: string, callback: Function, context: Object, priority?: number): NoticeInfo;
        /**
         * 根据事件名，移除某个作用域下的该事件
         * @param {Object} context
         * @param {NoticeInfo} info
         * @returns {void}
         * @memberof BaseNotice
         */
        removeObserverByInfo(context: Object, info: NoticeInfo): void;
        /**
         * 移除事件
         * @param {string} name
         * @param {(...args) => any} callback
         * @param {Object} context
         * @memberof BaseNotice
         */
        removeObserver(name: string, callback: (...args) => any, context: Object): void;
        /**
         * 根据作用域移除事件（移除作用域下的所有的事件）
         * @param {Object} context
         * @memberof BaseNotice
         */
        removeObserverByObject(context: Object): void;
        /**
         * 根据事件名，移除所有的事件
         * @param {string} name
         * @memberof BaseNotice
         */
        removeObserverByName(name: string): void;
    }
}
/**
 * @author Andrew_Huang
 */
declare module dragon {
    /**
     * 事件通知监听，全局方法
     * @export
     * @class Notice
     * @extends {BaseNotice}
     */
    class Notice extends BaseNotice {
        /**
         * 发送通知
         * @param {string} name
         * @param {any} args
         * @memberof Notice
         */
        postNotice(name: string, ...args: any[]): void;
        private _postNotice(name, args);
    }
    /**
     * 注册事件通知
     * @export
     * @template T
     * @param {string} name
     * @param {(...args) => any} callback
     * @param {Object} context
     * @param {number} [priority=0]
     */
    function addNotice(name: string, callback: (...args) => any, context: Object, priority?: number): void;
    /**
     * 注册事件通知（通知完后即刻自动移除）
     * @export
     * @param {string} name
     * @param {Function} callback
     * @param {Object} context
     * @param {number} [priority=0]
     */
    function addOnceNotice(name: string, callback: Function, context: Object, priority?: number): void;
    /**
     * 移除通知
     * @export
     * @param {string} name
     * @param {(...args) => any} callback
     * @param {Object} context
     */
    function removeNotice(name: string, callback: (...args) => any, context: Object): void;
    /**
     * 发送通知
     * @export
     * @param {string} name
     * @param {any} args
     */
    function postNotice(name: string, ...args: any[]): void;
    /**
     * 移除指定回调函数的所有事件通知
     * @export
     * @template T
     * @param {T} obj
     */
    function removeNoticeByObject<T>(obj: T): void;
    /**
     * 移除指定事件名的所有事件通知
     * @export
     * @param {string} name
     */
    function removeNoticeByName(name: string): void;
    /**
     * 移除指定回调函数或者对象的所有事件监听
     * @export
     * @template T
     * @param {T} obj
     */
    function removeNoticeAndPullByObject<T>(obj: T): void;
}
/**
 * @author Andrew_Huang
 */
declare module dragon {
    /**
     * 对象拉取监听
     * @export
     * @class PullObject
     * @extends {BaseNotice}
     */
    class PullObject extends BaseNotice {
        /**
         * 对象事件拉取监听回调
         * @param {string} name
         * @param {any} args
         * @returns {*}
         * @memberof PullObject
         */
        pullObject(name: string, ...args: any[]): any;
        private _pullObject(name, args, idx?);
    }
    /**
     * 添加对象拉取监听
     * @export
     * @template T
     * @param {string} name 拉取的对象名
     * @param {(...args) => any} callback
     * @param {T} context
     * @param {number} [private=0]
     */
    function addPullObject<T>(name: string, callback: (...args) => any, context: T, priority?: number): void;
    /**
     * 移除对象拉取监听
     * @export
     * @template T
     * @param {string} name
     * @param {(...args) => any} callback
     * @param {T} context
     */
    function removePullObject<T>(name: string, callback: (...args) => any, context: T): void;
    /**
     * 拉取对象
     * @export
     * @template T
     * @param {string} name
     * @param {any} args
     * @returns {T}
     */
    function pullObject<T>(name: string, ...args: any[]): T;
    /**
     * 移除指定对象所有的拉取对象监听
     * @export
     * @template T
     * @param {T} context
     */
    function removePullObjectByObject<T>(context: T): void;
    /**
     * 移除指定侦听名的所有拉取对象侦听
     * @param name 待移除侦听的名称
     */
    function removePullObjectByName(name: string): void;
}
/**
 * @author Andrew_Huang
 */
declare module dragon {
    /**
     * 工具类：数组操作
     * @export
     * @class Array
     */
    class array {
        /**
         * 从数组中移除某些Items
         * @static
         * @template T
         * @param {T[]} arr
         * @param {(((item: any) => boolean | T | T[]))} removeItems
         * @returns {boolean}
         * @memberof Array
         */
        static remove<T>(arr: T[], removeItems: ((item: any) => boolean | T | T[])): boolean;
        /**
         * 打乱数组顺序
         * @static
         * @template T
         * @param {T[]} arr
         * @returns {T[]}
         * @memberof Array
         */
        static shuffle<T>(arr: T[]): T[];
        /**
         * 获取数组中指定prop的值
         * @static
         * @template T
         * @param {T[]} arr
         * @param {string} propName
         * @returns {any[]}
         * @memberof Array
         */
        static pluck<T>(arr: T[], propName: string): any[];
        /**
         * 生成一段数字数组
         * @static
         * @param {number} start
         * @param {number} [stop=0]
         * @param {number} [step=1]
         * @returns {number[]}
         * @memberof Array
         */
        static range(start: number, stop?: number, step?: number): number[];
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
        static find<T>(arr: T[], pre: Function, context?: Object): T;
        /**
         * 从arr中找到所有obj的数据组成新的数组
         * @static
         * @template T
         * @param {T[]} arr
         * @param {*} obj
         * @returns {T[]}
         * @memberof array
         */
        static where<T>(arr: T[], obj: any): T[];
        /**
         * 获取列表中匹配正确的第一项
         * @static
         * @template T
         * @param {T[]} arr
         * @param {*} obj
         * @returns {T}
         * @memberof array
         */
        static findWhere<T>(arr: T[], obj: any): T;
        /**
         * arr是否包含满足条件的数据或者包含数据
         * @static
         * @template T
         * @param {T[]} arr
         * @param {((value: T, index: number, array: T[]) => boolean|T)} obj
         * @returns {boolean}
         * @memberof array
         */
        static contains<T>(arr: T[], obj: (value: T, index: number, array: T[]) => boolean | T): boolean;
    }
}
/**
 * @author Andrew_Huang
 */
declare module dragon {
    /**
     * 类工厂
     * @export
     * @class ClassFactory
     */
    class ClassFactory {
        private _classList;
        /**
         * 注入类信息到类型工厂中
         * @param {string} types
         * @param {*} classType
         * @param {number} priority
         * @memberof ClassFactory
         */
        injection(types: string, classType: any, priority: number): void;
        /**
         * 检查key中的值是否在item中
         * @private
         * @param {*} item
         * @param {*} key
         * @returns {boolean}
         * @memberof ClassFactory
         */
        private checkValue(item, key);
        /**
         * 通过给定的数据对象，获取类型
         * @param {*} obj
         * @returns {*}
         * @memberof ClassFactory
         */
        getClass(obj: any): any;
        /**
         * 通过给定的数据对象，获取类型
         * @static
         * @param {string} name 类型工厂名称
         * @param {*} obj       数据对象
         * @returns {*}
         * @memberof ClassFactory
         */
        static get(name: string, obj: any): any;
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
        static instance<T>(name: string, obj: any, ...args: any[]): T;
        /**
         * 注入类型到类型工厂
         * @static
         * @param {string} name 类型工厂名称
         * @param {string} types 类型关键字
         * @param {*} classTypes 类型
         * @param {number} [priority=1]
         * @memberof ClassFactory
         */
        static injection(name: string, types: string, classTypes: any, priority?: number): void;
    }
}
/**
 * 定义单例、类型编号、分类的类型单例、指定类的实例、指定类的类型
 * @author Andrew_Huang
 */
declare module dragon {
    /**
     * 返回指定类型的类型编号，作为全局的唯一识别id
     * @export
     * @param {*} type   指定类型
     * @returns {number} 类型标号
     */
    function getTypeId(type: any): number;
    /**
     * 指定类型是否存在类型编号
     * @export
     * @param {*} type    指定类型
     * @returns {boolean} 是否存在类型编号
     */
    function hasTypeId(type: any): boolean;
    /**
     * 返回指定类型的单例
     * @export
     * @template T
     * @param {{ new(): T; }} type
     * @returns {T}
     */
    function singleton<T>(type: {
        new (): T;
    }): T;
    /**
     * 返回指定分类的类型单例
     * @export
     * @template T
     * @param {string} name         分类名称
     * @param {{ new(): T; }} type  单例化的类型
     * @returns {T}
     */
    function typeSingleton<T>(name: string, type: {
        new (): T;
    }): T;
    /**
     * 获取指定类的类型
     * @export
     * @template T
     * @param {string} name    类型名称
     * @param {T} defaultType  默认类型
     * @returns {T}
     */
    function getDefinitionType<T>(name: string, defaultType: T): T;
    /**
     * 获取指定类的实例
     * @export
     * @template T
     * @param {string} name          类型名称
     * @param {*} [defaultType=null] 默认类型
     * @param {any} args             构造函数参数列表
     * @returns {T}
     */
    function getDefinitionInstance<T>(name: string, defaultType?: any, ...args: any[]): T;
}
/**
 * @author Andrew_Huang
 */
declare module dragon {
    /**
     * 显示相关控制实现类
     * @export
     * @class Display
     */
    class Display {
    }
}
/**
 * 初始化定义部分数据
 * @author Andrew_Huang
 */
declare module dragon {
    var stage: egret.Stage;
    var GRootStage: any;
    interface IGameCallback {
        on(type: string, ...args: any[]): void;
    }
    function $getCallback(): IGameCallback;
    /**
     * 定义对象（包括修改对象属性数据）
     * configurable：属性是否可以更改；enumerable：是否可以用for..in遍历；
     * @export
     * @param {*} object        目标对象
     * @param {string} property 需要定义的属性或方法的名字
     * @param {*} getter
     * @param {*} [setter]
     */
    function define(object: any, property: string, getter?: any, setter?: any): void;
    /**
     * 获取常量数据
     * @export
     * @param {string} name
     * @param {*} [defValue=null]
     * @returns {*}
     */
    function getConst(name: string, defValue?: any): any;
}
declare module dragon {
    class md5 {
        constructor();
        private hexcase;
        private b64pad;
        hex_md5(s: any): string;
        private b64_md5(s);
        private any_md5(s, e);
        private hex_hmac_md5(k, d);
        private b64_hmac_md5(k, d);
        private any_hmac_md5(k, d, e);
        private md5_vm_test();
        private rstr_md5(s);
        private rstr_hmac_md5(key, data);
        private rstr2hex(input);
        private rstr2b64(input);
        private rstr2any(input, encoding);
        private str2rstr_utf8(input);
        private str2rstr_utf16le(input);
        private str2rstr_utf16be(input);
        private rstr2binl(input);
        private binl2rstr(input);
        private binl_md5(x, len);
        private md5_cmn(q, a, b, x, s, t);
        private md5_ff(a, b, c, d, x, s, t);
        private md5_gg(a, b, c, d, x, s, t);
        private md5_hh(a, b, c, d, x, s, t);
        private md5_ii(a, b, c, d, x, s, t);
        private safe_add(x, y);
        private bit_rol(num, cnt);
    }
}
/**
 * @author Andrew_Huang
 */
declare module dragon {
    /**
     * 数字操作类
     * @export
     * @class Num
     */
    class Num {
        /**
         * 在指定数字范围内随机一个整数
         * @static
         * @param {number} min
         * @param {number} max
         * @returns {number}
         * @memberof Num
         */
        static randInt(min: number, max: number): number;
        /**
         * 在指定范围内随机一个浮点数
         * @static
         * @param {number} min
         * @param {number} max
         * @returns {number}
         * @memberof Num
         */
        static randFloat(min: number, max: number): number;
        /**
         * 格式化时间数字
         * 如：1，传入DD或者HH，则返回01，传入D或者H，则返回1
         * @static
         * @param {number} num    时间
         * @param {string} format 时间格式：如DD、HH、MM、SS
         * @returns {*}
         * @memberof Num
         */
        static padNum(num: number, format: string): any;
        /**
         * 格式化倒计时时间
         * @param time 倒计时时间(秒)
         * @param format 格式化时间格式（[DD:HH:MM:SS];[D:H:M:S]）
         * @returns {string}
         */
        static toCountdown(time: number, format: string): string;
    }
}
/**
 * 对象数据操作
 * @author Andrew_Huang
 */
declare module dragon {
    class Obj {
        /**
         * clone数据对象
         * @static
         * @param {*} obj
         * @returns {*}
         * @memberof ObjectData
         */
        static clone(obj: any): any;
        /**
         * 获取所有对象的所有 key 值
         * @static
         * @param {*} obj
         * @returns {string[]}
         * @memberof ObjectData
         */
        static keys(obj: any): string[];
        /**
         * 获取对象的所有 value 值
         * @static
         * @param {*} obj
         * @returns {any[]}
         * @memberof Obj
         */
        static values(obj: any): any[];
        /**
         * 属性是否完全跟对象一样
         * @static
         * @param {*} object
         * @param {*} attrs
         * @returns {boolean}
         * @memberof Obj
         */
        static isMatch(object: any, attrs: any): boolean;
        static matches(props: any): (obj: any) => boolean;
        /**
         * 判断对象数据中是否存在对应key的数据
         * @static
         * @param {*} data
         * @param {*} key
         * @returns {boolean}
         * @memberof Obj
         */
        static hasValue(data: any, key: any): boolean;
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
        static setValue(data: any, key: any, val: any, forceSet?: boolean): void;
        /**
         * 获取对象数据
         * @static
         * @param {*} data
         * @param {*} key
         * @param {*} [defaultValue=null]
         * @returns {*}
         * @memberof Obj
         */
        static getValue(data: any, key: any, defaultValue?: any): any;
        /**
         * 深层clone
         * @static
         * @param {*} obj
         * @returns {*}
         * @memberof Obj
         */
        static deepClone(obj: any): any;
        /**
         * 判断两个对象数据是否完全相同
         * @static
         * @param {*} one
         * @param {*} other
         * @returns {boolean}
         * @memberof Obj
         */
        static equals(one: any, other: any): boolean;
    }
    function v(obj: any, paths: string, defVal?: any): any;
}
/**
 * @author Andrew_Huang
 */
declare module dragon {
    /**
     * 平台的功能支持类型
     * @export
     * @enum {number}
     */
    enum PlatformFunType {
        SendToDesktop = 1,
        TencentLogin = 2,
        InvitationFriend = 3,
        OpenBBS = 4,
        Share = 5,
    }
    /**
     * 基础平台接口（基础信息、通用方法）
     * @export
     * @interface IPlatform
     */
    interface IPlatform {
        name: string;
        contact: any;
        supportInfo: any;
        HasSubscribe: boolean;
        doLogin(): void;
        init(): void;
        login(args?: any): void;
        logout(callback?: (...args) => void, context?: Object): void;
        payment(data: any, callback?: (...args) => void, context?: Object): void;
        share(data: any, callback?: (...args) => void, context?: Object): void;
        openBBS(callback?: (...args) => void, context?: Object): void;
        isSupport(type: PlatformFunType, callback?: (...args) => void, context?: Object): void;
        userIsSupport(data: any, callback?: (...args) => void, context?: Object): void;
        sendToDesktop(callback?: (...args) => void, context?: Object): void;
        setShareInfo(info?: any, callback?: (...args) => void, context?: Object): void;
        doAttention(callback?: Function, context?: Object): void;
    }
    /**
     * 返回当前运行环境的平台对象
     * @export
     * @returns {IPlatform}
     */
    function getPlatform(): IPlatform;
}
/**
 * @author Andrew_Huang
 */
declare module dragon {
    /**
     * 本地数据存储器
     * @export
     * @class LocalStorage
     */
    class LocalStorage {
        private static _prefix;
        private static _enable;
        private static _localStorage;
        static setPrefix(prefix: string): void;
        static isSetPrefix(): boolean;
        private static checkPrefix();
        static getItemKey(key: string): any;
        /**
         * 设置Item数据
         * @static
         * @param {string} key
         * @param {*} value
         * @memberof LocalStorage
         */
        static setItem(key: string, value: any): void;
        /**
         * 获取Item数据
         * @static
         * @param {string} key
         * @param {*} [defaultValue=null]
         * @returns {*}
         * @memberof LocalStorage
         */
        static getItem(key: string, defaultValue?: any): any;
        /**
         * 移除Item数据
         * @static
         * @param {string} key
         * @memberof LocalStorage
         */
        static removeItem(key: string): void;
    }
}
/**
 * @author Andrew_Huang
 */
declare module dragon {
    /**
     * 填补方向
     * @export
     * @enum {number}
     */
    enum PadDirection {
        LEFT = 0,
        MIDDLE = 1,
        RIGHT = 2,
    }
    /**
     * 字符相关操作类
     * @export
     * @class Str
     */
    class Str {
        /**
         * 匹配格式：如{num},num为数字组合
         * \d:匹配一个数字字符，相当于[0-9]
         * +:匹配1或多个正好在它之前的那个字符
         */
        private static _formatRegexp;
        /**
         * 匹配{}格式的字符
         */
        private static _formatObjRegexp;
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
        static pad(str: string, len?: number, pad?: string, dir?: PadDirection): string;
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
        static replaceAll(str: string, search: string, replace: string): string;
        /**
         * 使用对象数据替换文本中的标记位置
         * 示例：str="AAA{a}BBB",arg={a:1} => 结果：str="AAA1BBB"
         * @static
         * @param {string} str
         * @param {*} args
         * @returns {string}
         * @memberof Str
         */
        static replaceFromObject(str: string, args: any): string;
        /**
         * 数组数据替换：格式化形如str格式的字符，并用args替换里面的数据
         * 举例：value="{02}",args=[1,2,3] => match:{02},group:02,结果为3
         * @static
         * @param {string} str
         * @param {...any[]} args
         * @returns {string}
         * @memberof Str
         */
        static format(str: string, ...args: any[]): string;
        /**
         * 对象数据替换：格式化形如str格式的字符，并用args替换里面的数据
         * @static
         * @param {string} str
         * @param {*} args
         * @returns {string}
         * @memberof Str
         */
        static formatFromObject(str: string, args: any): string;
        /**
         * 重复字符串输出
         * @static
         * @param {string} str
         * @param {number} count
         * @returns {string}
         * @memberof Str
         */
        static repeat(str: string, count: number): string;
        /**
         * 去除str中的space字符，并格式化
         * @static
         * @param {string} [str]
         * @param {string} [space]
         * @returns {string}
         * @memberof Str
         */
        static trim(str?: string, space?: string): string;
        /**
         * 去除左边的space字符
         * @static
         * @param {string} [str]
         * @param {string} [space]
         * @returns {string}
         * @memberof Str
         */
        static lTrim(str?: string, space?: string): string;
        /**
         * 去除右边的space字符
         * @static
         * @param {string} [str]
         * @param {string} [space]
         * @returns {string}
         * @memberof Str
         */
        static rTrim(str?: string, space?: string): string;
        /**
         * 判断space是否存在于str的头部
         * @static
         * @param {string} str
         * @param {string} space
         * @returns {boolean}
         * @memberof Str
         */
        static startWith(str: string, space: string): boolean;
        /**
         * 判断space是否存在于str的尾部
         * @static
         * @param {string} str
         * @param {string} space
         * @returns {boolean}
         * @memberof Str
         */
        static endWith(str: string, space: string): boolean;
    }
}
/**
 * @author Andrew_Huang
 * 时间操作类：延迟、判断时间戳
 */
declare module dragon {
    /**
     * 指定的时间数值是否是时间戳
     * @export
     * @param {number} time
     * @returns {boolean}
     */
    function isTimestamp(time: number): boolean;
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
    function setInterval<T>(callback: (context: T, ...args) => void, context: T, time: number, ...args: any[]): number;
    /**
     * 清除指定延迟后运行的函数
     * @export
     * @param {number} timeId egret.setInterval所返回的索引
     */
    function clearInterval(timeId: number): void;
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
    function setTimeout<T>(callback: (context: T, ...args) => void, context: T, time: number, ...args: any[]): number;
    /**
     * 清除指定延迟后运行的函数
     * @export
     * @param {number} timeId egret.setTimeout所返回的索引
     */
    function clearTimeout(timeId: number): void;
}
/**
 * @author Andrew_Huang
 */
declare module dragon {
    /**
     * 时间计时器（单位时间记录）
     * @export
     * @class TimeRecorder
     */
    class TimeRecorder {
        private _data;
        private _lastDate;
        private _offsetTime;
        private _tickNum;
        private _seconds;
        readonly tickNum: number;
        readonly seconds: number;
        /**
         * 每次计时返回的时间长度
         * @returns {number}
         * @memberof TimeRecorder
         */
        tick(): number;
    }
}

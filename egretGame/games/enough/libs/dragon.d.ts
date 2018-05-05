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
/**
 * @author Andrew_Huang
 * UI动画相关接口
 */
declare module dragon {
    /**
     * UI类型
     * @export
     * @enum {number}
     */
    enum UI_TYPE {
        BOX = "box",
        MASK = "mask",
    }
    /**
     * UI 动画进入方向
     * @export
     * @enum {number}
     */
    enum ANI_UI_DIRECTION {
        FROM_RIGT = 1,
        FROM_LEFT = 2,
        FROM_TOP = 3,
        FROM_BOTTOM = 4,
    }
    /**
     * 获取UI动画对象
     * @export
     * @interface IUIAnimationDisplay
     */
    interface IUIAnimationDisplay {
        getAnimationDisplay(type?: UI_TYPE): any;
    }
    /**
     * UI动画回调（自定义）
     * @export
     * @interface IUIAnimationCallback
     */
    interface IUIAnimationCallback {
        (): void;
    }
    /**
     * UI动画接口
     * @export
     * @interface IUIAnimation
     */
    interface IUIAnimation {
        displayObject: IUIAnimationDisplay;
        show(callback: IUIAnimationCallback): void;
        close(callback: IUIAnimationCallback): void;
    }
}
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
    class Animation implements dragon.IAnimation {
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
        static delay(delay: number): IAnimation;
    }
}
/**
 * @author Andrew_Huang
 */
declare module dragon {
    /**
     * 弹框动画基类（可以继承该类自行实现自定义动画）
     * @export
     * @class BoxAnimation
     * @implements {dragon.IUIAnimation}
     */
    class BaseBoxAnimation implements dragon.IUIAnimation {
        private _displayObject;
        constructor();
        displayObject: IUIAnimationDisplay;
        /**
         * 指定弹框动画
         * @private
         * @param {IUIAnimationCallback} callback 回调函数
         * @param {Function} boxAnimation         弹框动画
         * @param {Function} maskAnimation        遮罩动画
         * @memberof BoxAnimation
         */
        private runAnimation(callback, boxAnimation, maskAnimation);
        show(callback: IUIAnimationCallback): void;
        close(callback: IUIAnimationCallback): void;
        /**
         * 弹框显示动画
         * @param {*} box
         * @returns {dragon.IAnimation}
         * @memberof BoxAnimation
         */
        getShowBoxAnimation(box: any): dragon.IAnimation;
        /**
         * 遮罩显示动画
         * @param {*} mask
         * @returns {dragon.IAnimation}
         * @memberof BoxAnimation
         */
        getShowMaskAnimation(mask: any): dragon.IAnimation;
        /**
         * 弹框关闭动画
         * @param {*} box
         * @returns {dragon.IAnimation}
         * @memberof BoxAnimation
         */
        getCloseBoxAnimation(box: any): dragon.IAnimation;
        /**
         * 遮罩关闭动画
         * @param {*} mask
         * @returns {dragon.IAnimation}
         * @memberof BoxAnimation
         */
        getCloseMaskAnimation(mask: any): dragon.IAnimation;
    }
}
/**
 * @author Andrew_Huang
 */
declare module dragon {
    /**
     * 普通UI动画（关闭和开启自定义）
     * @export
     * @class NoneAnimation
     * @implements {dragon.IUIAnimation}
     */
    class NoneAnimation implements dragon.IUIAnimation {
        private _displayObject;
        constructor();
        displayObject: IUIAnimationDisplay;
        show(callback: IUIAnimationCallback): void;
        close(callback: IUIAnimationCallback): void;
    }
}
/**
 * @author Andrew_Huang
 */
declare module dragon {
    /**
     * 弹框动画2：缩放式
     * @export
     * @class BoxBounceAnimation
     * @extends {dragon.BaseBoxAnimation}
     */
    class BoxBounceAnimation extends dragon.BaseBoxAnimation {
        getShowBoxAnimation(box: any): dragon.IAnimation;
        getShowMaskAnimation(mask: any): dragon.IAnimation;
        getCloseBoxAnimation(box: any): dragon.IAnimation;
        getCloseMaskAnimation(mask: any): dragon.IAnimation;
    }
}
/**
 * @author Andrew_Huang
 */
declare module dragon {
    /**
     * 弹框动画1：透明度变化，从中间放大显示
     * @export
     * @class BoxNormalAnimation
     * @extends {dragon.BaseBoxAnimation}
     */
    class BoxNormalAnimation extends dragon.BaseBoxAnimation {
        getShowBoxAnimation(box: any): dragon.IAnimation;
        getShowMaskAnimation(mask: any): dragon.IAnimation;
    }
}
/**
 * @author Andrew_Huang
 */
declare module dragon {
    /**
     * UI 动画：左右切换
     * @export
     * @class UILeftRightAnimation
     * @implements {dragon.IUIAnimation}
     */
    class UILeftRightAnimation implements dragon.IUIAnimation {
        private _displayObject;
        private _width;
        private _direct;
        private _callback;
        constructor(callback?: any, context?: Object);
        displayObject: dragon.IUIAnimationDisplay;
        direct: dragon.ANI_UI_DIRECTION;
        show(callback: IUIAnimationCallback): void;
        close(callback: IUIAnimationCallback): void;
        private getOffsetByDirect();
    }
}
/**
 * @author Andrew_Huang
 */
declare module dragon {
    /**
     * UI 动画：上下切换
     * @export
     * @class UILeftRightAnimation
     * @implements {dragon.IUIAnimation}
     */
    class UITopBottomAnimation implements dragon.IUIAnimation {
        private _displayObject;
        private _height;
        private _direct;
        private _callback;
        constructor(callback?: any, context?: Object);
        displayObject: dragon.IUIAnimationDisplay;
        direct: dragon.ANI_UI_DIRECTION;
        show(callback: IUIAnimationCallback): void;
        close(callback: IUIAnimationCallback): void;
        private getOffsetByDirect();
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
    /**
     * 组件通用接口
     * @export
     * @interface IComponent
     */
    interface IComponent {
        onOpen(...args: any[]): void;
        onClose(): void;
        setData(data: any, type?: any): IComponent;
        setComName(): IComponent;
        autoId: any;
    }
    /**
     * 组件操作状态（进入和退出）
     * @export
     * @enum {number}
     */
    enum OperateState {
        enter = 0,
        exit = 1,
    }
    /**
     * 组件钩子
     * @export
     * @interface IComponentHook
     */
    interface IComponentHook {
        setData(data: any, type?: any): void;
        addOperate(operate: IComponentOperate<any>): void;
    }
    /**
     * 基础UI组件
     * @export
     * @class BaseComponent
     * @extends {egret.EventDispatcher}
     * @implements {IComponent}
     * @implements {dragon.IUIAnimationDisplay}
     */
    class BaseComponent extends frame.layout.Window implements IComponent, dragon.IUIAnimationDisplay {
        private $_anim;
        private $_data;
        private $_componentState;
        private _componentName;
        private _dataMapArr;
        private _hook;
        private _type;
        private _isHistoryComponent;
        private _args;
        private _sprite;
        constructor(...args: any[]);
        readonly displayObject: egret.DisplayObject;
        protected onDisplay(value: fairygui.GComponent): void;
        readonly Sprite: egret.Sprite;
        /**
         * 获取参数数据
         * @readonly
         * @type {*}
         * @memberof BaseComponent
         */
        readonly args: any;
        /**
         * 设置参数
         * @param {*} args
         * @memberof BaseComponent
         */
        setArgs(args: any): void;
        /**
         * 进入
         * @param {any} args
         * @memberof BaseComponent
         */
        onOpen(...args: any[]): void;
        /**
         * 退出
         * @memberof BaseComponent
         */
        onClose(): void;
        /**
         * 设置数据
         * @param {*} data
         * @param {*} [type]
         * @returns {IComponent}
         * @memberof BaseComponent
         */
        setData(data: any, type?: any): IComponent;
        setComName(): IComponent;
        private pullData();
        /**
         * 获取动画的显示容器
         * @param {UI_TYPE} [type]
         * @memberof BaseComponent
         */
        getAnimationDisplay(type?: UI_TYPE): egret.DisplayObject | fairygui.GObject;
        data: any;
        private addDataMap(name);
        protected dataChanged(): void;
        /**
         * 销毁数据
         * @memberof BaseComponent
         */
        destroyData(): void;
        /**
         * 为组件设置动画类
         * @memberof BaseComponent
         */
        animation: dragon.IUIAnimation;
        setHistoryComponent(isHistory: boolean): void;
        setType(type: dragon.UIType): void;
        isType(type: dragon.UIType): boolean;
        isHistoryComponent(): boolean;
        readonly autoId: any;
        readonly componentState: OperateState;
        componentName: string;
        hook: IComponentHook;
    }
}
/**
 * @author Andrew_Huang
 */
declare module dragon {
    /**
     *
     * @export
     * @interface IComponentOperate
     * @template T
     */
    interface IComponentOperate<T> {
        type: string;
        state: OperateState;
        isComplete: boolean;
        setComplete(): void;
        getName(): string;
        setName(val: string): T;
        serialize(): any;
        unserialize(data: any): void;
        enter(component: BaseComponent): void;
        exit(component: BaseComponent): void;
    }
    /**
     *
     * @export
     * @class BaseOperate
     * @extends {egret.HashObject}
     * @implements {IComponentOperate<T>}
     * @template T
     */
    class BaseOperate<T> extends egret.HashObject implements IComponentOperate<T> {
        private _name;
        private _state;
        private _complete;
        state: OperateState;
        protected getType(): string;
        readonly type: string;
        setComplete(): void;
        protected getIsComplete(): boolean;
        readonly isComplete: boolean;
        getName(): string;
        setName(val: string): T;
        serialize(): any;
        unserialize(data: any): void;
        enter(component: BaseComponent): void;
        exit(component: BaseComponent): void;
    }
}
declare module dragon {
    /**
     * 弹框基类
     * @export
     * @class Box
     * @extends {dragon.BaseComponent}
     */
    class CommonBox extends dragon.BaseComponent {
        private _maskClick;
        constructor(...args: any[]);
        maskClick: boolean;
        private closeView();
        private removeMaskEvent();
        setCenter(): void;
        onClose(): void;
    }
}
declare module dragon {
    /**
     * 场景底层绘图区（在这可以添加原生Sprite）
     * @export
     * @class BaseCanvas
     * @extends {frame.scene.Canvas}
     */
    class BaseCanvas extends frame.scene.Canvas {
        constructor(display: egret.Sprite);
        /**
         * 退出
         */
        onExit(): void;
    }
}
declare module dragon {
    /**
     * 场景加载界面
     * @export
     * @abstract
     * @class LoadingScene
     * @extends {frame.scene.Scene}
     */
    abstract class BaseLoadingScene extends frame.scene.Scene {
        private _urls;
        private loaders;
        private _display;
        constructor();
        /**
         * 添加资源路径
         * @param {string} url
         * @memberof BaseLoadingScene
         */
        push(url: string): void;
        onOpen(): void;
        onClose(): void;
        load(): void;
        private _onComplete(event);
        private _onProgress(event);
        /**
         * 场景资源加载完成后回调
         * @protected
         * @abstract
         * @memberof BaseLoadingScene
         */
        protected abstract onComplete(): void;
        /**
         * 资源加载进度（0-1）
         * @protected
         * @abstract
         * @param {number} progress
         * @memberof BaseLoadingScene
         */
        protected abstract onProgress(progress: number): void;
        /**
         * 资源路径集合
         * @protected
         * @abstract
         * @returns {Array<string>}
         * @memberof BaseLoadingScene
         */
        protected abstract urls(): Array<string>;
        protected newCanvas(root: egret.Sprite): dragon.BaseCanvas;
    }
}
declare module dragon {
    /**
     * 基础场景类（实际场景类）
     * @export
     * @class BaseScene
     * @extends {frame.scene.Scene}
     */
    class BaseScene extends frame.scene.Scene {
        /**
         * 进入场景
         * @memberof BaseScene
         */
        onOpen(): void;
        /**
         * 退出场景
         * @memberof BaseScene
         */
        onClose(): void;
        /**
         * 设置场景绘图区
         * @protected
         * @param {egret.Sprite} root
         * @returns {frame.scene.Canvas}
         * @memberof BaseScene
         */
        protected newCanvas(root: egret.Sprite): dragon.BaseCanvas;
    }
}
declare module dragon {
    /**
     * 场景管理器
     * @export
     * @class SceneManager
     * @extends {frame.scene.SceneManager}
     */
    class SceneManager extends frame.scene.SceneManager {
        private static INSTANCE;
        static getInstance(): frame.scene.SceneManager;
        constructor(root: egret.Sprite);
        /**
         * 表明场景要使用的窗口管理器
         */
        protected newWindows(root: fairygui.GRoot): frame.layout.WindowManager;
    }
    /**
     * 获取全局场景管理器
     * @export
     * @param {egret.Sprite} root
     * @returns {dragon.SceneManager}
     */
    function getSceneManager(root: egret.Sprite): dragon.SceneManager;
}
declare module dragon {
    /**
      * 有loading界面的场景
      */
    abstract class SceneMerger extends frame.scene.SceneSet {
        private loading;
        private studio;
        constructor();
        /**
         * 开始加载资源
         */
        private load();
        onOpen(): void;
        onClose(): void;
        private _onComplete(event);
        /**
         * 要加载的资源
         */
        protected abstract urls(): Array<string>;
        /**
         * 加载场景
         */
        protected abstract newLoading(): BaseLoadingScene;
        /**
         * 主场景
         */
        protected abstract newStudio(): frame.scene.IScene;
    }
}
declare module dragon {
    /**
     * tip 信息
     * @export
     * @interface TooltipInfo
     */
    interface ITooltipInfo {
        text: string;
        size?: number;
        color?: number;
        delay?: number;
    }
    /**
     * 确认框按钮类型
     * @export
     * @enum {number}
     */
    enum ConfirmButton {
        close = 0,
        yes = 1,
        no = 2,
    }
    /**
     * 确认框信息
     * @export
     * @interface ConfirmInfo
     */
    interface ConfirmInfo {
        text: string;
        title?: string;
        size?: number;
        close?: boolean;
        subConfirmView?: string;
        confirView?: string;
        yes?: string;
        no?: string;
        args?: any;
    }
    /**
     * tooltip 实现接口
     * @export
     * @interface ITooltip
     */
    interface ITooltip {
        show(info: ITooltipInfo | string, display?: fairygui.GComponent): void;
        customView(display: fairygui.GComponent, data: any, delay?: number): void;
        display: fairygui.GComponent;
    }
    /**
     * 简易加载条的显示与关闭接口方法
     * @export
     * @interface ISimpleLoading
     */
    interface ISimpleLoading {
        show(): void;
        hide(): void;
    }
    /**
     * 更新加载进度
     * @export
     * @interface ILoadUpdate
     */
    interface ILoadUpdate {
        update(current: number, total: number): void;
        onComplete(): void;
    }
    /**
     * 加载接口
     * @export
     * @interface ILoad
     */
    interface ILoad {
        loadUpdate: ILoadUpdate;
        load(): void;
    }
    interface IProgressLoading extends ISimpleLoading, ILoadUpdate {
        load: ILoad;
        setComplete(sel: () => void, context?: any): void;
    }
    /**
     * 弹框实现接口
     * @export
     * @interface IConfirm
     */
    interface IConfirm {
        show(callback: (btn: ConfirmButton) => void, context: any): void;
    }
}
/**
 * @author Andrew_Huang
 */
declare module dragon {
    /**
     * 显示简单加载条
     * @export
     */
    function showSimpleLoading(): void;
    /**
     * 隐藏简单加载条
     * @export
     */
    function hideSimpleLoading(): void;
    /**
     * 显示浮动 tip 提示
     * @export
     * @param {(dragon.TooltipInfo | string)} info
     * @param {string} [display]
     */
    function tooltip(info: dragon.ITooltipInfo | string, display?: fairygui.GComponent): void;
    function customTooltip(display: fairygui.GComponent, data: any, delay?: number): void;
    enum BoxType {
        Box = 0,
        HistoryBox = 1,
        SequnceBox = 2,
        GroupSequnceBox = 3,
    }
    /**
     * 弹出提示框
     * @export
     * @param {(ConfirmInfo | string)} info
     * @param {BoxType} [boxType=BoxType.Box]
     * @param {any} args
     * @returns {*}
     */
    function confirm(info: ConfirmInfo | string, boxType?: BoxType, ...args: any[]): any;
}
/**
 * @author Andrew_Huang
 */
declare module dragon {
    enum HookAction {
        SET_DATA = 0,
        ADD_OPERATE = 1,
    }
    interface IHookItemInfo {
        action: HookAction;
        data: any;
        type?: any;
        operate?: IComponentOperate<any>;
    }
    /**
     * UI 记录Item
     * @export
     * @interface UIHistoryItem
     */
    interface UIHistoryItem {
        type: any;
        isUnder?: boolean;
        args: any[];
        hookList: any[];
    }
    /**
     * UI 面板信息
     * @export
     * @interface UIPanelInfo
     */
    interface UIPanelInfo {
        name: string;
        type: any;
        args: any[];
    }
    /**
     * UI 层级类型
     * @export
     * @enum {number}
     */
    enum UIType {
        MIN = 0,
        TOOLTIP = 1,
        GUIDE = 2,
        BOX = 3,
        TOPSCENE = 4,
        MENU = 5,
        PANEL = 6,
        COMMON = 7,
        SCENE = 8,
        ANY = 9,
    }
    /**
     * UI 事件
     * @export
     * @class UIEvent
     * @extends {egret.Event}
     */
    class UIEvent extends egret.Event {
        static SHOW_PANEL: string;
        static HIDE_PANEL: string;
        static ADD_BOX: string;
        static CLEAR_SEQUENCE_BOX: string;
        static REMOVE_BOX: string;
        static RUN_SCENE: string;
        static REMOVE_SCENE: string;
        static SET_MENU: string;
        static REMOVE_MENU: string;
        static ADD_TOOLTIP: string;
        static REMOVE_TOOLTIP: string;
        static ADD_GUIDE: string;
        static REMOVE_GUIDE: string;
        static ADD_COMPONENT: string;
        static REMOVE_COMPONENT: string;
        static ADD_COMMON: string;
        static REMOVE_COMMON: string;
        private _component;
        private _group;
        readonly component: BaseComponent;
        readonly group: string;
        constructor(type: string, component: BaseComponent, group?: string);
    }
    /**
     * UI 记录
     * @export
     * @class UIHistory
     */
    class UIHistory {
        private _history;
        constructor();
        pushHistory(type: any, args: any[], isUnder: boolean, hookList?: any[]): void;
        getLastItem(): UIHistoryItem;
        count(): number;
        hasHistory(): boolean;
        clear(): void;
        popHistory(): UIHistoryItem;
    }
    import Container = frame.layout.Container;
    /**
     * UI 控制器
     * 层级从下往上:场景层、公共UI层、面板层、菜单层、弹框层、新手引导层、浮动层
     * @export
     * @class UI
     * @extends {fairygui.UIContainer}
     */
    class UI extends frame.layout.WindowManager {
        private _common;
        private _panel;
        private _menu;
        private _topScene;
        private _box;
        private _guide;
        private _tooltip;
        private _containerArr;
        private _panelTypeMap;
        private _panelInstanceMap;
        private _currentPanel;
        private _sequenceBoxMap;
        private _sceneInst;
        private _menuInst;
        private constructor();
        /**
         * 注入面板到控制器中
         * @param {string} name 面板名称
         * @param {*} type      面板类型(类)
         * @param {*} args      参数列表
         * @memberof UI
         */
        private injectPanel(name, type, args);
        /**
         * 隐藏面板
         * @param {*} [panel]
         * @memberof UI
         */
        hidePanel(panel?: any): void;
        /**
         * 面板是否显示
         * @param {string} name
         * @returns {boolean}
         * @memberof UI
         */
        panelIsDisplay(name: string): boolean;
        /**
         * 设置面板隐藏
         * @private
         * @param {BaseComponent} panel
         * @memberof UI
         */
        private setPanelHide(panel);
        /**
         * 面板是否在实例映射表中
         * @private
         * @param {*} panel
         * @returns {boolean}
         * @memberof UI
         */
        private panelInInstanceMap(panel);
        /**
         * 退出，执行相关动画与移除操作
         * @private
         * @param {BaseComponent} component
         * @param {boolean} remove
         * @memberof UI
         */
        private onExit2(component, remove);
        /**
         * 进入，执行相关动画操作
         * @private
         * @param {BaseComponent} component
         * @memberof UI
         */
        private onEnter2(component);
        private showAnimation(component);
        /**
         * 清除所有的弹框
         * @memberof UI
         */
        clearBox(): void;
        /**
         * 设置实例的动画
         * @private
         * @param {string} animationName 动画名
         * @param {*} instance           实例
         * @memberof UI
         */
        private setAnimation(animationName, instance);
        /**
         * 显示面板（面板名为字符串）
         * @private
         * @param {string} name
         * @param {*} args
         * @returns {*}
         * @memberof UI
         */
        private _showPanel(name, args);
        /**
         * 添加面板层（面板名为非字符串）
         * @private
         * @param {*} panelType
         * @param {*} args
         * @returns {BaseComponent}
         * @memberof UI
         */
        private _addPanel(panelType, args);
        /**
         * 显示面板
         * @private
         * @param {*} panel
         * @param {*} args
         * @returns {BaseComponent}
         * @memberof UI
         */
        private showPanel(panel, args);
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
        private getTypeInst(type, animation, args, uiType);
        /**
         * 设置主菜单栏
         * @private
         * @param {*} menuTtype
         * @param {*} args
         * @memberof UI
         */
        private setMenu(menuTtype, args);
        /**
         * 添加引导层
         * @private
         * @param {*} guideType
         * @param {*} args
         * @returns {BaseComponent}
         * @memberof UI
         */
        private addGuide(guideType, args);
        /**
         * 添加弹框
         * @private
         * @param {*} boxType
         * @param {*} args
         * @returns {BaseComponent}
         * @memberof UI
         */
        private _boxMask;
        private addBox(boxType, args);
        private isFindBox(boxType, args);
        private addBoxMask();
        private clearBoxMask();
        private getBoxMask();
        /**
         * 添加通用普通界面
         * @private
         * @param {*} commonType
         * @param {*} args
         * @memberof UI
         */
        private addCommon(commonType, args);
        /**
         * 添加tips
         * @private
         * @param {*} tooltipType
         * @param {*} args
         * @memberof UI
         */
        private addTooltip(tooltipType, args);
        /**
         * 添加定级场景
         * @private
         * @param {*} sceneType
         * @param {*} args
         * @returns {BaseComponent}
         * @memberof UI
         */
        private addTopScene(sceneType, args);
        /**
         * 移除
         * @private
         * @param {*} instance
         * @param {boolean} [isHistory=null]
         * @param {boolean} [checkHistory=true]
         * @memberof UI
         */
        private remove(instance, isHistory?, checkHistory?);
        /**
         * 显示记录面板
         * @private
         * @param {*} type
         * @param {*} args
         * @returns {BaseComponent}
         * @memberof UI
         */
        private showHistoryPanel(type, args);
        /**
         * 显示记录弹框
         * @private
         * @param {*} boxType
         * @param {*} args
         * @memberof UI
         */
        private addHistoryBox(boxType, args);
        /**
         * 记录检查
         * @private
         * @param {boolean} gotoHistory
         * @param {UIHistory} history
         * @param {Function} gotoBackFun
         * @returns {void}
         * @memberof UI
         */
        private checkHistory(gotoHistory, history, gotoBackFun);
        /**
         * 重置面板的钩子列表
         * @private
         * @param {BaseComponent} panel
         * @param {any[]} hookList
         * @memberof UI
         */
        private resetHookList(panel, hookList);
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
        private addSequnceBox(boxType, group, priority, args, type?);
        private getSequnceCount(group);
        private runSequnceBox(group);
        private runSeqBox(arr, group, top);
        private onRemoveBox(box);
        /**
         * 根据名称获取组件
         * @private
         * @param {string} name
         * @param {egret.DisplayObjectContainer} container
         * @returns {BaseComponent}
         * @memberof UI
         */
        private getComponentByName(name, container);
        /**
         * 获取组件
         * @param {string} name
         * @returns {IComponent}
         * @memberof UI
         */
        private getComponent(name);
        /**
         * 根据组件名，移除组件
         * @param {string} name
         * @memberof UI
         */
        removeComponent(name: string): void;
        /**
         * 根据 UI 类型获取对应的层级的显示容器
         * @param {UIType} type
         * @returns {fairygui.UIContainer}
         * @memberof UI
         */
        getContainerByType(type: UIType): Container;
        /**
         * 是否存在面板显示着
         * @returns {boolean}
         * @memberof UI
         */
        hasPanel(): boolean;
        /**
         * 判断组件是否是场景容器或者菜单容器
         * @private
         * @param {*} component
         * @returns {boolean}
         * @memberof UI
         */
        private isSingleContainer(component);
        /**
         * 弹框记录列表
         * @readonly
         * @type {UIHistory}
         * @memberof UI
         */
        readonly boxHistory: UIHistory;
        /**
         * 面板记录列表
         * @readonly
         * @type {UIHistory}
         * @memberof UI
         */
        readonly panelHistory: UIHistory;
        /**
         * 场景记录列表
         * @readonly
         * @type {UIHistory}
         * @memberof UI
         */
        readonly sceneHistory: UIHistory;
        /**
         * 设置根容器
         * @private
         * @param {fairygui.GComponent} container
         * @memberof UI
         */
        private setRoot(container);
        private static INSTANCE;
        static getInstance(): UI;
        static getComponent(name: string): dragon.IComponent;
        static panelIsDisplay(name: string): boolean;
        static hasPanel(): boolean;
        static removeComponentByName(name: string): void;
        static setMenu(type: any, ...args: any[]): void;
        static addGuide(type: any, ...args: any[]): BaseComponent;
        static addBox(type: any, ...args: any[]): BaseComponent;
        static showPanel(type: any, ...args: any[]): BaseComponent;
        static addCommon(type: any, ...args: any[]): void;
        static addTooltip(type: any, ...args: any[]): void;
        static addTopScene(sceneType: any, ...args: any[]): BaseComponent;
        static addSequenceBox(type: any, ...args: any[]): void;
        static getSequenceCount(group: string): number;
        static addHistoryBox(type: any, ...args: any[]): void;
        static getBoxMask(): fairygui.GGraph;
        static clearBoxMask(): void;
        static showHistoryPanel(type: any, ...args: any[]): BaseComponent;
        static runGroupSequenceBox(group: string): void;
        static injectPanel(name: string, type: any, ...args: any[]): void;
        static remove(instance: any, gotoHistory?: boolean): void;
        static addGroupSequenceBox(type: any, group: string, priority: number, ...args: any[]): void;
        static addGroupSequenceFun(fun: (callback: () => void) => void, group: string, priority: number): void;
        static clearBox(): void;
        static getMenu(): any;
        static getScene(): any;
        static getContainerByType(type: UIType): Container;
        static hidePanel(panel?: any): void;
        static readonly panelHistory: UIHistory;
        static setBoxVisible(visible: boolean, without?: fairygui.GObject): void;
        static setRoot(container: egret.DisplayObjectContainer): void;
    }
}
declare module dragon {
    interface IMovie {
        play(name: string, playTimes?: number): void;
        destroy(): void;
    }
    /**
     * 龙骨播放器
     * @author Andrew_Huang
     * @export
     * @interface IMoviePlay
     */
    interface IMoviePlay {
        play(animation: dragonBones.Animation): void;
        name: string;
    }
    /**
     * 龙骨插槽数据
     * @author Andrew_Huang
     * @export
     * @interface MovieSlotDisplayInfo
     */
    interface MovieSlotDisplayInfo {
        name: string;
        display: egret.DisplayObject | string;
        offsetX?: number;
        offsetY?: number;
    }
}
declare module dragon {
    /**
     * 龙骨骨架基础工厂
     * @author Andrew_Huang
     * @export
     * @class MovieBaseFactory
     * @extends {dragonBones.BaseFactory}
     */
    class MovieBaseFactory extends dragonBones.BaseFactory {
        constructor(dataParser?: dragonBones.DataParser | null);
        protected _buildTextureAtlasData(textureAtlasData: dragonBones.TextureAtlasData, textureAtlas: any): dragonBones.TextureAtlasData;
        protected _buildArmature(dataPackage: dragonBones.BuildArmaturePackage): dragonBones.Armature;
        protected _buildSlot(dataPackage: dragonBones.BuildArmaturePackage, slotData: dragonBones.SlotData, displays: dragonBones.DisplayData[], armature: dragonBones.Armature): dragonBones.Slot;
        /**
         * 将原始数据解析为 DragonBonesData 实例，并缓存到工厂中
         * @author Andrew_Huang
         * @param {*} rawData                 原始数据
         * @param {(string | null)} [name]    为该实例指定一个缓存名称，以便可以通过此名称获取该实例。 （如果未设置，则使用该实例中的名称）
         * @param {number} [scale]            为所有的骨架指定一个缩放值。 （默认: 1.0）
         * @returns {(dragonBones.DragonBonesData | null)}
         * @memberof MovieBaseFactory
         */
        parseDragonBonesData(rawData: any, name?: string | null, scale?: number): dragonBones.DragonBonesData | null;
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
        parseTextureAtlasData(rawData: any, textureAtlas: any, name?: string | null, scale?: number): dragonBones.TextureAtlasData;
    }
    /**
     * 创建一个龙骨工厂实例。 （通常只需要一个全局工厂实例）
     * @author Andrew_Huang
     * @export
     * @returns {dragon.MovieBaseFactory}
     */
    function BaseFactory(): dragon.MovieBaseFactory;
}
declare module dragon {
    /**
     * 龙骨动画事件
     * @author Andrew_Huang
     * @export
     * @class MovieEvent
     * @extends {egret.Event}
     */
    class MovieEvent extends egret.Event {
        static START: string;
        static FRAME_LABEL: string;
        static LOOP_COMPLETE: string;
        static COMPLETE: string;
        private _frameLabel;
        constructor(name: string, label?: string);
        readonly frameLabel: string;
    }
}
declare module dragon {
    /**
     * 播放器（一次龙骨播放创建一个播放器）
     * @author Andrew_Huang
     * @export
     * @class MoviePlay
     * @implements {dragon.IMoviePlay}
     */
    class MoviePlay implements dragon.IMoviePlay {
        private _name;
        private _playTimes;
        constructor(name: string, playTimes?: number);
        /**
         * 动画播放
         * @author Andrew_Huang
         * @param {dragonBones.Animation} animation
         * @memberof MoviePlay
         */
        play(animation: dragonBones.Animation): void;
        readonly name: string;
    }
}
declare module dragon {
    /**
     * 龙骨动画
     * @author Andrew_Huang
     * @export
     * @class DragonMovie
     * @extends {frame.animation.DragonBone}
     */
    class DragonMovie extends egret.Sprite implements dragon.IMovie {
        private _factory;
        private _armature;
        private _bones;
        private _images;
        private _moviePlay;
        private _armatureName;
        private _frameRate;
        private _replaceDisplayArr;
        private _intialized;
        private _skeleton;
        private _format;
        private _texture;
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
        constructor(skeleton: Object, format: Object, texture: egret.Texture, armatureName: string, frameRate?: number);
        private init();
        private onAddToStage();
        private onRemoveFromStage();
        private _play();
        /**
         * 插槽数据替换
         * @author Andrew_Huang
         * @public
         * @param {string} slotName
         * @param {egret.DisplayObject} display
         * @memberof DragonMovie
         */
        replaceDisplay(slotName: string, display: egret.DisplayObject): void;
        /**
         * 动画开始
         * @author Andrew_Huang
         * @private
         * @param {dragonBones.EventObject} event
         * @memberof DragonMovie
         */
        private onStart(event);
        /**
         * 每一帧监听，动画帧事件
         * @author Andrew_Huang
         * @private
         * @param {dragonBones.EgretEvent} event
         * @memberof DragonMovie
         */
        private onFrame(event);
        /**
         * 动画播放完成（循环一次）
         * @author Andrew_Huang
         * @private
         * @param {dragonBones.EgretEvent} event
         * @memberof DragonMovie
         */
        private onComplete(event);
        /**
         * 动画播放
         * @author Andrew_Huang
         * @param {string} name
         * @param {number} [playTimes] 循环播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次] （默认: -1）
         * @memberof DragonMovie
         */
        play(name: string, playTimes?: number): void;
        /**
         * 骨架数据名称
         */
        /**
         * 骨架数据名称
         */
        armatureName: string;
        /**
         * 播放速度，用于控制动画变速播放
         * @memberof DragonMovie
         */
        frameRate: number;
        /**
         * 获取动画名称
         * @readonly
         * @type {string}
         * @memberof DragonMovie
         */
        readonly animationName: string;
        destroy(): void;
    }
}
declare module dragon {
    /**
     * 基于TexturePacker的动画
     * @author Andrew_Huang
     * @export
     * @class Movie
     * @extends {frame.animation.TexturePacker}
     */
    class Movie extends frame.animation.TexturePacker {
        static EACH_FRAME: string;
        /**
         * 初始化
         * @author Andrew_Huang
         * @param {Object} format            Texture导出的Json数据
         * @param {egret.Texture} texture    Texture导出的纹理图集
         * @memberof Movie
         */
        constructor(format: Object, texture: egret.Texture);
        play(label: string): void;
        enterFrame(data: any): void;
        stop(): void;
        destroy(): void;
    }
}
declare module dragon {
    /**
     * 配置数据
     * @author Andrew_Huang
     * @export
     * @class Config
     */
    class Config {
        private _configMap;
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
        private getConfig<T>(name, key, defaultValue);
        /**
         * 判断key值的数据是否存在name的配置数据中
         * @param {string} name
         * @param {string} key
         * @returns {boolean}
         * @memberof Config
         */
        private exists(name, key);
        /**
         * 添加JSON数据到map中
         * @author Andrew_Huang
         * @private
         * @param {*} data
         * @param {string} key
         * @memberof Config
         */
        addConfData(data: any, name: string): void;
        /**
         * 判断name值的数据上是否存在key值的数据
         * @author Andrew_Huang
         * @static
         * @param {string} name
         * @param {string} key
         * @returns {boolean}
         * @memberof Config
         */
        static exists(name: string, key: string): boolean;
        /**
         * 获取配置数据
         * @static
         * @param {string} name            配置名
         * @param {string} [key=null]      数据的key值
         * @param {*} [defaultValue=null]
         * @returns {*}
         * @memberof Config
         */
        static get(name: string, key?: string, defaultValue?: any): any;
    }
}
declare module dragon {
    /**
     * 全局事件名 Key 值
     * @export
     * @class NoticeNameKey
     */
    class NoticeKey {
        static GetComponent: string;
        /**
         * 服务端数据模块变化
         * @author Andrew_Huang
         * @static
         * @param {string} mod
         * @returns {string}
         * @memberof NoticeNameKey
         */
        static SERVER_DATA_CHANGE(mod: string): string;
        /**
         * 数据模块变更
         * @author Andrew_Huang
         * @static
         * @param {string} mod
         * @returns {string}
         * @memberof NoticeNameKey
         */
        static CHANGE_MODEL(mod: string): string;
        /**
         * 数据变更通知
         * @author Andrew_Huang
         * @static
         * @param {string} mod
         * @returns {string}
         * @memberof NoticeNameKey
         */
        static POSTCHANGE(mod: string): string;
    }
    var key: typeof NoticeKey;
}
declare module dragon {
    /**
     * 基础数据
     * @author Andrew_Huang
     * @export
     * @class BaseData
     * @extends {egret.EventDispatcher}
     */
    class BaseData extends egret.EventDispatcher {
        private _mod;
        private _changeData;
        constructor(mod: string);
        /**
         * 服务端数据变更
         * @author Andrew_Huang
         * @protected
         * @param {*} data
         * @memberof BaseData
         */
        protected onChangeData(data: any): void;
        /**
         * 发送数据变更通知
         * @author Andrew_Huang
         * @param {*} data
         * @memberof BaseData
         */
        postNotice(data?: any): void;
        readonly changeData: any;
        readonly mod: string;
        destroy(): void;
    }
}
declare module dragon {
    /**
     * 数据模型信息
     * @author Andrew_Huang
     * @export
     * @class ModelInfo
     */
    class ModelInfo {
        private _mod;
        private _factory;
        private _subCoreFactory;
        private _autoKey;
        private _confKey;
        private _otherKey;
        private _type;
        private _isMultiple;
        constructor(mod: string, autokey: string, confKey: string, otherKeys: string[], factory: IDataPartFactory, subCoreFactory?: IDataPartFactory, isMultiple?: boolean);
        readonly isMultiple: boolean;
        type: any;
        readonly mod: string;
        readonly autoKey: string;
        readonly confKey: string;
        readonly otherKey: string[];
        readonly factory: IDataPartFactory;
        readonly subCoreFactory: IDataPartFactory;
    }
}
declare module dragon {
    /**
     * 二级数据模型（类似BaseModel结构）
     * @author Andrew_Huang
     * @export
     * @class SubModelCore
     * @extends {egret.EventDispatcher}
     */
    class SubModelCore extends egret.EventDispatcher {
        private _c;
        private _s;
        private _host;
        constructor();
        c: any;
        s: any;
        host: BaseSubModel;
        getProperty(name: string, format?: boolean): any;
        update(): void;
        destroy(): void;
    }
    /**
     * 数据模型(存在二级数据模型时使用)
     * @author Andrew_Huang
     * @export
     * @class BaseSubModel
     * @extends {egret.EventDispatcher}
     */
    class BaseSubModel extends egret.EventDispatcher {
        static info: ModelInfo;
        private _core;
        constructor();
        c: any;
        s: any;
        core: SubModelCore;
        protected initConfig(): void;
        protected initServer(): void;
        /**
         * 根据name值从服务端/客户端获取数据
         * @author Andrew_Huang
         * @param {string} name
         * @param {*} [defaultValue=null]
         * @returns {*}
         * @memberof BaseModel
         */
        getValue(name: string, defaultValue?: any): any;
        destroy(): void;
    }
    /**
     * 基础数据模型（客户端+服务端，通过key值连接）
     * @author Andrew_Huang
     * @export
     * @class BaseModel
     * @extends {egret.EventDispatcher}
     */
    class BaseModel extends egret.EventDispatcher {
        private _configData;
        private _serverData;
        constructor();
        c: any;
        s: any;
        /**
         * 根据name值从服务端/客户端获取数据
         * @author Andrew_Huang
         * @param {string} name
         * @param {*} [defaultValue=null]
         * @returns {*}
         * @memberof BaseModel
         */
        getValue(name: string, defaultValue?: any): any;
        /**
         * 初始化配置数据
         * @author Andrew_Huang
         * @protected
         * @memberof BaseModel
         */
        protected initConfig(): void;
        /**
         * 初始化服务端数据
         * @author Andrew_Huang
         * @protected
         * @memberof BaseModel
         */
        protected initServer(): void;
        destroy(): void;
    }
}
declare module dragon {
    /**
     * 数据缓存库基础
     * @author Andrew_Huang
     * @export
     * @interface IDataStore
     */
    interface IDataStore {
        propertyName: string;
        onAdd(model: any): void;
        onDelete(model: any): void;
        getModel(type: string, ...args: any[]): any;
    }
    /**
     * 数据缓存库（一个key值存在catchMap中存在一个数据缓存的）
     * @author Andrew_Huang
     * @export
     * @class DatsStore
     * @implements {IDataStore}
     */
    class DataStore implements IDataStore {
        private _catchMap;
        private _instMap;
        private _propertyName;
        constructor(propertyName: string);
        readonly propertyName: string;
        /**
         * 是否存key值的数据对象
         * @author Andrew_Huang
         * @param {string} value
         * @returns {boolean}
         * @memberof DataStore
         */
        has(key: string): boolean;
        /**
         * 根据key值获取数据对象
         * @author Andrew_Huang
         * @param {*} model
         * @returns {*}
         * @memberof DataStore
         */
        getValue(model: any): any;
        /**
         * 添加数据对象
         * @author Andrew_Huang
         * @param {*} model
         * @memberof DataStore
         */
        onAdd(model: any): void;
        /**
         * 删除数据
         * @author Andrew_Huang
         * @param {*} model
         * @memberof DataStore
         */
        onDelete(model: any): void;
        /**
         * 更新数据
         * @author Andrew_Huang
         * @param {*} model
         * @memberof DataStore
         */
        update(model: any, newModel: any): void;
        /**
         * 根据key值获取数据模型
         * @author Andrew_Huang
         * @param {string} type
         * @param {...any[]} args
         * @memberof DataStore
         */
        getModel(type: string, ...args: any[]): any[];
        getNewModel(type: string, arg: any): any;
    }
}
declare module dragon.data {
    /**
     * 设置客户端配置与服务端配置的key值结构
     * @author Andrew_Huang
     * @export
     * @interface AliaseKey
     */
    interface AliaseKey {
        serverKey: string;
        configKey: string;
    }
    /**
     * 数据格式化工具
     * @author Andrew_Huang
     * @export
     * @class DateUtils
     */
    class DateUtils {
        /**
         * 格式化别名格式的字符串，获取客户端配置key值与服务端key
         * @author Andrew_Huang
         * @static
         * @param {string} key
         * @returns {AliaseKey}
         * @memberof DateUtils
         */
        static formatAliaseKey(key: string): AliaseKey;
    }
}
declare module dragon {
    /**
     * 配置数据缓存库
     * @author Andrew_Huang
     * @export
     * @class ConfigDataStore
     */
    class ConfigDataStore extends DataStore {
        private _info;
        constructor(type: string, info: ModelInfo);
        /**
         * 根据类型获取数据模型（单个）
         * @author Andrew_Huang
         * @param {string} type
         * @param {any} arg
         * @returns {*}
         * @memberof ConfigDataStore
         */
        getNewModel(type: string, propertyValue: any): any;
        /**
         * 根据类型获取数据模型(多个proertyValue值)
         * @author Andrew_Huang
         * @param {string} type
         * @param {any} args
         * @returns {*}
         * @memberof ConfigDataStore
         */
        getModel(type: string, ...args: any[]): any;
    }
}
declare module dragon {
    /**
     * 主数据缓存库（properName来自服务端的autoKey）
     * @author Andrew_Huang
     * @export
     * @class MainDataStore
     * @extends {DataStore}
     */
    class MainDataStore extends DataStore {
        private _list;
        /**
         * 添加
         * @author Andrew_Huang
         * @param {*} obj
         * @memberof MainDataStore
         */
        onAdd(obj: any): void;
        /**
         * 删除
         * @author Andrew_Huang
         * @param {*} obj
         * @memberof MainDataStore
         */
        onDelete(obj: any): void;
        /**
         * 更新
         * @author Andrew_Huang
         * @param {*} model
         * @param {*} newModel
         * @memberof MainDataStore
         */
        update(model: any, newModel: any): void;
        /**
         * 获取所有的数据列表
         * @author Andrew_Huang
         * @returns {any[]}
         * @memberof MainDataStore
         */
        getList(): any[];
    }
}
declare module dragon {
    /**
     * 子数据工厂，返回子数据
     * @author Andrew_Huang
     * @export
     * @interface IDataPartFactory
     */
    interface IDataPartFactory {
        (obj: any): any;
    }
    /**
     * 数据
     * @author Andrew_Huang
     * @export
     * @class Data
     */
    class Data {
        private _mod;
        private _type;
        private _info;
        private _aliaseKey;
        private _dataStoreMap;
        private _mainStore;
        private _deleteModels;
        private _addModels;
        constructor(type: any);
        /**
         * 接收到服务端的数据（增删改查）
         * @author Andrew_Huang
         * @private
         * @memberof Data
         */
        private changeModel(list);
        /**
         * 删除数据对象
         * @author Andrew_Huang
         * @private
         * @param {string} autoKey 服务端key值
         * @param {number} id      服务端value值
         * @memberof Data
         */
        private delete(data);
        /**
         * 添加数据对象
         * @author Andrew_Huang
         * @private
         * @param {*} data
         * @memberof Data
         */
        private add(data);
        /**
         * 更新数据对象
         * @author Andrew_Huang
         * @private
         * @param {*} data
         * @memberof Data
         */
        private update(data);
        /**
         * 删除数据对象（配置数据仓库不删除，如果是关联二级服务端和配置数据，则删除）
         * @author Andrew_Huang
         * @private
         * @param {*} model
         * @memberof Data
         */
        private deleteModel(model);
        /**
         * 添加数据模块
         * @author Andrew_Huang
         * @private
         * @param {*} item
         * @memberof Data
         */
        private addModule(item);
        /**
         * 服务端数据是否已经存在于主缓存库中
         * @author Andrew_Huang
         * @private
         * @param {*} data
         * @returns {boolean}
         * @memberof Data
         */
        private isExist(data);
        /**
         * 获取数据模型对象（相当于新建一个数据模型Item）
         * @author Andrew_Huang
         * @private
         * @param {*} item
         * @returns {*}
         * @memberof Data
         */
        private getModel(item);
        /**
         * 获取一个参数key值多个value值的数据模型
         * @author Andrew_Huang
         * @param {string} propertyName
         * @param {any} values
         * @returns {any[]}
         * @memberof Data
         */
        getMultiple(propertyName: string, ...values: any[]): any[];
        /**
         * 获取数据模型
         * @author Andrew_Huang
         * @param {string} propertyName key值参数（获取对应的数据仓库）
         * @param {*} propertyValue     value值
         * @returns {any[]}
         * @memberof Data
         */
        get(propertyName: string, propertyValue: any): any[];
        /**
         * 根据key值获取对应的数据缓存库
         * @author Andrew_Huang
         * @param {string} propertyName
         * @returns {DataStore}
         * @memberof Data
         */
        getDataStore(propertyName: string): DataStore;
        /**
         * 获取服务端所有的数据Item
         * @author Andrew_Huang
         * @returns {any[]}
         * @memberof Data
         */
        getList(): any[];
        readonly mod: string;
    }
}
declare module dragon {
    /**
     * 数据中心
     * @author Andrew_Huang
     * @export
     * @class DataCenter
     */
    class DataCenter {
        private _modelDataMap;
        private _baseDataMap;
        private _modDataMap;
        /**
         * 获取服务端数据
         * @author Andrew_Huang
         * @private
         * @param {*} data
         * @memberof DataCenter
         */
        getServerData(data: any): void;
        /**
         * 解析服务端body数据
         * @author Andrew_Huang
         * @private
         * @param {*} data
         * @memberof DataCenter
         */
        private analyiseData(data);
        /**
         * 基础数据模块注入
         * @author Andrew_Huang
         * @static
         * @template T
         * @param {string} modName
         * @param {T} data
         * @memberof DataCenter
         */
        injectBaseData<T>(modName: string, data: T): void;
        /**
         * 注入数据模型
         * @author Andrew_Huang
         * @private
         * @template T
         * @param {T} type
         * @memberof DataCenter
         */
        injectDataModel<T>(type: T): void;
        /**
         * 获取基础数据模块
         * @author Andrew_Huang
         * @private
         * @param {string} modName
         * @returns {BaseData}
         * @memberof DataCenter
         */
        getBaseData(modName: string): BaseData;
        /**
         * 根据数据模型类获取数据模型
         * @author Andrew_Huang
         * @private
         * @template T
         * @param {T} type
         * @returns {Data}
         * @memberof DataCenter
         */
        getDataModel<T>(type: T): Data;
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
        getModel<T>(type: T, propertyName: string, propertyValue: any): any;
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
        getMultiple<T>(type: T, propertyName: string, ...vals: any[]): any[];
        /**
         * 获取某个数据模型类的所有数据对象model
         * @author Andrew_Huang
         * @private
         * @template T
         * @param {T} type
         * @returns {any[]}
         * @memberof DataCenter
         */
        getDataModelList<T>(type: T): any[];
        getWhereValue(where: string, defaultValue?: number): number;
    }
    /**
     * 基础数据注入
     * @author Andrew_Huang
     * @export
     * @template T
     * @param {string} modName
     * @param {T} data
     */
    function injectBaseData<T>(modName: string, data: T): void;
    /**
     * 数据模型注入
     * @author Andrew_Huang
     * @export
     * @param {*} type
     */
    function injectDataModel(type: any): void;
    /**
     * 获取服务器数据解析
     * @author Andrew_Huang
     * @export
     * @param {*} data
     */
    function getServerData(data: any): void;
    /**
     * 根据模块名获取基础数据模块
     * @author Andrew_Huang
     * @export
     * @param {string} modName
     * @returns {BaseData}
     */
    function getBaseData(modName: string): BaseData;
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
    function getDataModel<T>(type: {
        new (): T;
    }, propertyName: string, propertyVal: any): T;
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
    function getMultipleModel<T>(type: {
        new (): T;
    }, propertyName: string, ...valueArr: any[]): T[];
    function getDataModelList<T>(type: {
        new (): T;
    }): T[];
    /**
     * 获取指定点的数据值
     * @author Andrew_Huang
     * @export
     * @param {string} where
     * @param {number} [defaultValue=0]
     * @returns {number}
     */
    function getWhereValue(where: string, defaultValue?: number): number;
}
declare module dragon {
    class Item {
        /**
         * 获取道具模型实例
         * @author Andrew_Huang
         * @static
         * @returns {*}
         * @memberof Item
         */
        static getItemInst(): any;
        /**
         * 获取指定道具的名称
         * 道具模型需要存在 NameKey 的属性值作为道具名的key值（关联配置表），默认name
         * @author Andrew_Huang
         * @static
         * @param {number} configId 道具配置Id
         * @returns {string}
         * @memberof Item
         */
        static getName(configId: number): string;
        /**
         * 获取指定道具的拥有数量
         * 道具模型需要存在 NumKey 的属性名作为道具数量key值（关联服务端数据）。默认num
         * @author Andrew_Huang
         * @static
         * @param {number} configId 道具配置Id
         * @returns {number}
         * @memberof Item
         */
        static getNum(configId: number): number;
        /**
         * 获取指定道具配置Id的道具模型实例
         * @author Andrew_Huang
         * @static
         * @param {number} configId 道具配置Id
         * @returns {*}
         * @memberof Item
         */
        static getItemByConfigId(configId: number): any;
        /**
         * 获取指定服务器Id的道具模型实例
         * @author Andrew_Huang
         * @static
         * @param {number} serverId 服务器Id
         * @returns {*}
         * @memberof Item
         */
        static getItemByServerId(serverId: number): any;
        /**
         * 获取所有道具的模型实例列表
         * @author Andrew_Huang
         * @returns {any[]}
         * @memberof Item
         */
        static getItems(): any[];
        /**
         * 获取指定属性名和属性值的所有模型实例
         * @author Andrew_Huang
         * @static
         * @param {string} key 属性名
         * @param {*} value    属性值
         * @returns {any[]}
         * @memberof Item
         */
        static getItemByKey(key: string, value: any): any[];
    }
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
     * 对象的一个属性发生更改时传递到事件侦听器的事件
     * @export
     * @class PropertyEvent
     * @extends {egret.Event}
     */
    class PropertyEvent extends egret.Event {
        static PROPERTY_CHANGE: string;
        property: string;
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, property?: string);
        static dispatchPropertyEvent(target: egret.IEventDispatcher, eventType: string, property?: string): boolean;
    }
}
declare namespace dragon {
    /**
     * 资源事件
     * @export
     * @enum {number}
     */
    enum Resource {
        ITEM_COM = "item_com",
        ITEM_PRO = "item _pro",
        ITEMS_COM = "items_com",
        ITEMS_PRO = "items_pro",
    }
    /**
     * 资源加载
     * @author Andrew_Huang
     * @export
     * @class ResourceLoader
     */
    class ResourceLoader {
        private _scenes;
        private _resourcePath;
        private _isResource;
        private _loader;
        private _loaders;
        constructor();
        /**
         * 单项资源加载
         * @private
         * @param {string} path
         * @param {Function} [callback=null]
         * @param {Object} [context=null]
         * @memberof ResourceLoader
         */
        private loadItem(path, callback?, context?, isResource?);
        /**
         * 解析资源配置
         * @private
         * @memberof ResourceLoader
         */
        private analysicsResource(path);
        /**
         * 根据组的key值获取该组下所有的资源路径
         * @private
         * @param {string} key
         * @returns {Array<string>}
         * @memberof ResourceLoader
         */
        private getItemsPath(key);
        /**
         * 根据资源组的key值加载资源该组资源
         * @private
         * @param {string} key
         * @memberof ResourceLoader
         */
        private loadItemsByGroupKey(key, callback?, context?);
        /**
         * 根据资源配置中资源组的key值获取资源组路径
         * @private
         * @param {string} key
         * @returns {Array<string>}
         * @memberof ResourceLoader
         */
        private getResItemsByGroupKey(key);
        /**
         * 单项资源加载进度
         * @private
         * @param {egret.Event} event
         * @memberof ResourceLoader
         */
        private onItemProgress(event);
        /**
         * 多项资源加载
         * @private
         * @memberof ResourceLoader
         */
        private loadItems(items, callback?, context?);
        /**
         * 多项资源加载进度
         * @private
         * @param {egret.Event} event
         * @memberof ResourceLoader
         */
        private onItemsProgress(event);
        private getRes(name);
        /**
         * 根据场景key值加载对应的资源
         * @private
         * @param {(string | Function)} scene
         * @param {Function} [callback=null]
         * @param {Object} [context=null]
         * @memberof ResourceLoader
         */
        private loadItemsByScene(scene, callback?, context?);
        /**
         * 加载JSON资源，并用key值存储资源
         * @author Andrew_Huang
         * @private
         * @param {string} path
         * @param {string} key
         * @memberof ResourceLoader
         */
        private loadJSONRes(path, key);
        /**
         * 根据场景名获取资源组路径集合
         * @static
         * @param {string} scene
         * @returns {Array<string>}
         * @memberof ResourceLoader
         */
        static getResItemsByScene(scene: string | Function): Array<string>;
        /**
         * 根据资源路径获取资源
         * @static
         * @param {string} pathName
         * @returns {*}
         * @memberof ResourceLoader
         */
        static getRes(pathName: string): any;
        /**
         * 根据场景加载对应的资源
         * @static
         * @param {(string | Function)} scene
         * @param {Function} [callback=null]
         * @param {Object} [context=null]
         * @memberof ResourceLoader
         */
        static loadItemsByScene(scene: Function, callback?: Function, context?: Object): void;
        /**
         * 根据资源组key值加载该组下的所有资源
         * @static
         * @param {string} key
         * @param {Function} [callback=null]
         * @param {Obj} [context=null]
         * @returns {boolean}
         * @memberof ResourceLoader
         */
        static loadItemsByGroupKey(key: string, callback?: Function, context?: Obj): void;
        /**
         * 加载单项资源
         * @static
         * @param {string} path               资源路径
         * @param {Function} [callback=null]  资源加载成功回调
         * @param {Object} [context=null]     作用域
         * @memberof ResourceLoader
         */
        static loadItem(path: string, callback?: Function, context?: Object, isResource?: boolean): void;
        /**
         * 加载多项资源
         * @static
         * @param {Array<string>} items
         * @param {Function} [callback=null]
         * @param {Object} [context=null]
         * @memberof ResourceLoader
         */
        static loadItems(items: Array<string>, callback?: Function, context?: Object): void;
        /**
         * 根据资源组key值，获取所有资源的路径
         * @static
         * @param {string} key
         * @param {Function} [callback=null]
         * @param {Object} [context=null]
         * @memberof ResourceLoader
         */
        static getItemsPathByGroupKey(key: string, callback?: Function, context?: Object): boolean;
        /**
         * 加载JSON数据，并定义key存储
         * @author Andrew_Huang
         * @static
         * @param {string} path
         * @param {string} key
         * @memberof ResourceLoader
         */
        static loadJSONRes(path: string, key: string): void;
        /**
         * 加载资源配置
         * @static
         * @param {string} path
         * @param {Function} [callback=null]
         * @param {Object} [context=null]
         * @memberof ResourceLoader
         */
        static loadResource(path: string, callback?: Function, context?: Object): void;
    }
}
declare module dragon {
    /**
     * Scoket状态行为
     * @author Andrew_Huang
     * @export
     * @class SocketAction
     */
    class SocketAction {
        /**
         * 响应成功
         * @static
         * @type {string}
         * @memberof SocketAction
         */
        static RESPONSE_SUCCESS: string;
        /**
         * 请求错误
         * @static
         * @type {string}
         * @memberof SocketAction
         */
        static REQUEST_ERROR: string;
        /**
         * 未授权身份令牌
         * @static
         * @type {string}
         * @memberof SocketAction
         */
        static NOT_AUTHOR_TOKEN: string;
        /**
         * 未找到请求接口
         * @static
         * @type {string}
         * @memberof SocketAction
         */
        static NOT_REQUEST_API: string;
        /**
         * 请求超时
         * @static
         * @type {string}
         * @memberof SocketAction
         */
        static REQUEST_TIMEOUT: string;
        /**
         * 服务器未知异常
         * @static
         * @type {string}
         * @memberof SocketAction
         */
        static SERVER_UNKNOWN_ERROR: string;
    }
}
declare module dragon {
    /**
     * Socket状态码
     * @author Andrew_Huang
     * @export
     * @class ScoketCode
     */
    class ScoketCode {
        /**
         * 响应成功
         * @static
         * @type {number}
         * @memberof ScoketCode
         */
        static RESPONSE_SUCCESS: number;
        /**
         * 请求错误
         * @static
         * @type {number}
         * @memberof ScoketCode
         */
        static REQUEST_ERROR: number;
        /**
         * 未授权身份令牌
         * @static
         * @type {number}
         * @memberof ScoketCode
         */
        static NOT_AUTHOR_TOKEN: number;
        /**
         * 未找到请求接口
         * @static
         * @type {number}
         * @memberof ScoketCode
         */
        static NOT_REQUEST_API: number;
        /**
         * 请求超时
         * @static
         * @type {number}
         * @memberof ScoketCode
         */
        static REQUEST_TIMEOUT: number;
        /**
         * 服务器未知异常
         * @static
         * @type {number}
         * @memberof ScoketCode
         */
        static SERVER_UNKNOWN_ERROR: number;
    }
}
declare module dragon {
    interface ISocketCallback {
        onAnalysis?(data: any): void;
        onClose?(): void;
        onConnect?(): void;
        onEnter?(data: any): void;
        onError?(errData: any, t?: any): void;
        onEnterError?(errData: any): void;
        onHeartBeat?(data: any): void;
    }
    class GameWebSocket {
        private _pomelo;
        private _config;
        private _socketCallback;
        private _tickId;
        private _heart;
        name: string;
        needReconnect: boolean;
        isConnecting: boolean;
        enable: boolean;
        private static socketList;
        private static _initialized;
        tick(): void;
        /**
         * socket是否连接
         * @readonly
         * @memberof GameWebSocket
         */
        readonly connected: any;
        private runTick();
        /**
         * 设置socket管理类
         * @param {*} callback
         * @memberof GameWebSocket
         */
        initSocketCallback(callback: any): void;
        /**
         * 初始化socket的IP和端口，连接服务器
         * @param {*} [config=this._config]
         * @memberof GameWebSocket
         */
        private init(config?);
        private initCallback(data);
        /**
         * 重连
         * @memberof GameWebSocket
         */
        reconnect(): void;
        /**
         * 关闭
         * @memberof GameWebSocket
         */
        private close();
        private setDisconnect();
        private receiveServerData(data, callback?, context?);
        /**
         * 断开连接
         * @param {boolean} [remove=false] 是否从列表中移除socket
         * @memberof GameWebSocket
         */
        disconnect(remove?: boolean): void;
        private removeSocket();
        /**
         * 首次初始化（断线）
         * @private
         * @static
         * @memberof GameSocket
         */
        private static initialize();
        /**
         * 发送数据
         * @param {string} route
         * @param {any} [msg=null]
         * @param {any} [callback=null]
         * @param {any} [context=null]
         * @memberof GameWebSocket
         */
        request(route: string, msg?: any, callback?: any, context?: any): void;
        /**
         * 向服务器发送不需要反馈的通知
         * @param {string} route
         * @param {*} msg
         * @memberof GameWebSocket
         */
        notice(route: string, msg: any): void;
        /**
         * 获取socket
         * @static
         * @param {*} [type=null]
         * @returns {GameWebSocket}
         * @memberof GameWebSocket
         */
        static get(type?: any): GameWebSocket;
        /**
         * 启动socket
         * @static
         * @param {*} config
         * @param {*} socketCallbak
         * @param {*} [type=null]
         * @memberof GameWebSocket
         */
        static run(config: any, socketCallbak: any, type?: any): void;
    }
    /**
     * 向服务器发送通知，不接收反馈
     * @export
     * @param {string} route
     * @param {*} msg
     * @param {string} [type=null]
     */
    function sendRequestNotice(route: string, msg: any, type?: string): void;
    /**
     * 向服务器发送数据，接收结果
     * @export
     * @param {string} route
     * @param {any} [msg=null]
     * @param {any} [callback=null]
     * @param {any} [context=null]
     * @param {string} [type=null]
     */
    function request(route: string, msg?: any, callback?: any, context?: any, type?: string): void;
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
        postNotice(name: string, args: any): void;
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
     * 移除指定作用域的所有事件通知
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
     * 对象池
     * @export
     * @class Pool
     * @template T
     */
    class Pool<T> {
        private _totalArr;
        private _useArr;
        private _leftArr;
        private _type;
        private static _poolMap;
        constructor(type: any);
        /**
         * 回收对象，当不需要使用对象池创建的对象时，使用该方法回收
         * @param {T} inst
         * @memberof Pool
         */
        push(inst: T): void;
        /**
         * 拉取对象，如果对象池不存在任何可供使用的对象，则会创建出新的对象
         * @param {any} args
         * @returns {T}
         * @memberof Pool
         */
        pop(...args: any[]): T;
        /**
         * 获取指定类型的对象池
         * @static
         * @template T
         * @param {T} type    指定的类型
         * @returns {Pool<T>} 类型对象池
         * @memberof Pool
         */
        static getPool<T>(type: T): Pool<T>;
        /**
         * 获取指定分组的类型对象池
         * @static
         * @template T
         * @param {string} name 组名
         * @param {T} type      指定类型
         * @returns {Pool<T>}   类型对象池
         * @memberof Pool
         */
        static getTypePool<T>(name: string, type: T): Pool<T>;
    }
    function getPool<T>(type: {
        new (): T;
    }): Pool<T>;
    function getTypePool<T>(name: string, type: {
        new (): T;
    }): Pool<T>;
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
    function removeTypeSingleton<T>(name: string, type: {
        new (): T;
    }): boolean;
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
    /**
     * 获取Gui的instance
     * @author Andrew_Huang
     * @export
     * @template T
     * @param {string} name
     * @returns {T}
     */
    function getGuiCreateInstance<T>(name: string): T;
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
    class display {
        /**
         * 舞台高
         * @readonly
         * @static
         * @type {number}
         * @memberof Display
         */
        static readonly stageH: number;
        /**
         * 舞台宽
         * @readonly
         * @static
         * @type {number}
         * @memberof Display
         */
        static readonly stageW: number;
        /**
         * 设置显示对象的相对锚点
         * @static
         * @param {fairygui.GComponent} display
         * @param {number} anchorX
         * @param {number} [anchorY=anchorX]
         * @memberof display
         */
        static setAnchor(display: fairygui.GComponent, anchorX: number, anchorY?: number): void;
        /**
         * 销毁 container 所有的子元素
         * @static
         * @param {*} container
         * @memberof Display
         */
        static destroyChildren(container: any): void;
        /**
         * 设置 display 的尺寸，满屏显示
         * @static
         * @param {egret.DisplayObject} display
         * @memberof Display
         */
        static setFullDisplay(display: egret.DisplayObject | fairygui.GComponent): void;
        /**
         * 从父级移除 child
         * @param {(egret.DisplayObject | dragon.BaseComponent)} child
         * @param {boolean} [forceRemove=false]
         * @memberof Display
         */
        static removeFromParent(child: dragon.BaseComponent, forceRemove?: boolean): void;
        private static _displayMap;
        private static _grootListen;
        static clickBlankCloseSelf(context: dragon.BaseComponent): void;
        private static targetEvent(event);
        private static close(event);
        private static removeBaseComponent(type);
        private static removeGRootListener();
    }
}
/**
 * 初始化定义部分数据
 * @author Andrew_Huang
 */
declare module dragon {
    /**
     * 定义对象（包括修改对象属性数据）
     * configurable：属性是否可以更改；enumerable：是否可以用for..in遍历；
     * @export
     * @param {*} object        目标对象
     * @param {string} property 需要定义的属性或方法的名字
     * @param {*} getter
     * @param {*} [setter]
     */
    function def(object: any, property: string, getter?: any, setter?: any): void;
    var stage: egret.Stage;
    var GRootStage: any;
    interface IGameCallback {
        on(type: string, ...args: any[]): void;
    }
    function $getCallback(): IGameCallback;
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
     * 游戏常用的平台、运行环境参数
     * @export
     * @class ExtraInfo
     */
    class PlatExtraInfo {
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
    var extra: PlatExtraInfo;
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
declare module dragon {
    /**
     * 服务端源数据
     * @author Andrew_Huang
     * @export
     * @class DataServer
     */
    class DataServer {
    }
}

module dragon
{

    /**
     * 组件通用接口
     * @export
     * @interface IComponent
     */
    export interface IComponent
    {
        onEnter(...args): void;
        onExit(): void;
        listener(component: BaseComponent, callback: (e: egret.Event) => void): void;
        setData(data: any, type?: any): IComponent;
        setComName(): IComponent;
        autoId: any;
    }

    /**
     * 组件操作状态（进入和退出）
     * @export
     * @enum {number}
     */
    export enum OperateState
    {
        enter,
        exit
    }

    /**
     * 组件钩子
     * @export
     * @interface IComponentHook
     */
    export interface IComponentHook
    {
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
    export class BaseComponent extends egret.DisplayObjectContainer implements IComponent, dragon.IUIAnimationDisplay
    {
        private _displayObject: fairygui.GComponent;
        private $_anim: dragon.IUIAnimation;
        private $_data: any;
        private $_state: ComponentState;
        private $_componentState: OperateState = OperateState.exit;
        private _operates: IComponentOperate<any>[] = [];
        private _componentName: string;
        private _dataMapArr: any = [];
        private _hook: IComponentHook;
        private _type: dragon.UIType;
        private _isHistoryComponent: boolean = false;

        public constructor(...args)
        {
            super();
            this.$_state = new ComponentState(this);
            this.setArgs(args);
        }

        public get displayObject(): egret.DisplayObject
        {
            return this._displayObject.displayObject;
        }

        public get display(): fairygui.GComponent
        {
            return this._displayObject;
        }

        public set skinName(name: string)
        {
            if (name)
            {
                let keys: Array<string> = name.split('.');
                let pkgName: string = keys[0];
                let resName: string = keys[1];
                let userClass: string = keys[2] ? keys[2] : null;
                this._displayObject = fairygui.UIPackage.createObject(pkgName, resName, userClass).asCom;
                this.display.name = 'UI_CONTAINER';
                this.addChild(this.displayObject);
                this.width = this.displayObject.width;
                this.height = this.displayObject.height;
            }
        }

        public ckearListeners(): void
        {
            this.$_state.clearListeners();
        }

        /**
         * 设置参数
         * @param {*} args 
         * @memberof BaseComponent
         */
        public setArgs(args: any): void
        {
            this.$_state.setArgs(args);
            this.pullData();
        }

        /**
         * 进入
         * @param {any} args 
         * @memberof BaseComponent
         */
        public onEnter(...args): void
        {

        }

        /**
         * 退出
         * @memberof BaseComponent
         */
        public onExit(): void
        {
            if (this._displayObject)
            {
                this._displayObject.removeChildren();
                this._displayObject.dispose();
            }
            this.removeChildren();
        }

        public listener(component: BaseComponent, callback: (e: egret.Event) => void): void
        {
            this.$_state.listener(component, callback);
        }

        /**
         * 设置数据
         * @param {*} data 
         * @param {*} [type] 
         * @returns {IComponent} 
         * @memberof BaseComponent
         */
        public setData(data: any, type?: any): IComponent
        {
            if (type == 'data')
            {
                this.data = data;
                if (data)
                {
                    this.addDataMap('data');
                }
            } else
            {
                this[type] = data;
                if (data)
                {
                    this.addDataMap(type);
                    dragon.PropertyEvent.dispatchPropertyEvent(this, dragon.PropertyEvent.PROPERTY_CHANGE, type);
                }
            }
            if (this._hook && data)
            {
                this._hook.setData(data, type);
            }
            return this;
        }

        public setComName(): IComponent
        {
            this.componentName = name;
            return this;
        }

        private pullData(): void
        {
            console.log("下拉数据");
        }

        /**
         * 获取动画的显示容器
         * @param {UI_TYPE} [type] 
         * @memberof BaseComponent
         */
        public getAnimationDisplay(type?: UI_TYPE): egret.DisplayObject
        {
            if (!type || is.falsy(type))
            {
                return this;
            }
            if (type == dragon.UI_TYPE.BOX)
            {
                return this.getSubView('box')
            } else if (type == dragon.UI_TYPE.MASK)
            {
                return this.getSubView('mask');
            } else
            {
                return this.getSubView(type);
            }
        }

        /**
         * 获取子显示层
         * @private
         * @param {string} name 
         * @returns {*} 
         * @memberof BaseComponent
         */
        private getSubView(name: string): egret.DisplayObject
        {
            if (this[name])
            {
                return this[name];
            }
            return (this.display.getChild(name).asCom).displayObject;
        }

        public set data(value: any)
        {
            this.$_data = value;
            if (value != null)
            {
                this.addDataMap('data');
                PropertyEvent.dispatchPropertyEvent(this, dragon.PropertyEvent.PROPERTY_CHANGE, 'data');
            }
            this.dataChanged();
        }

        private addDataMap(name: string): void
        {
            if (this._dataMapArr.indexOf(name) == -1)
            {
                this._dataMapArr.push(name);
            }
        }

        protected dataChanged(): void
        {

        }

        /**
         * 添加操作
         * @param {IComponentOperate<any>} operate 
         * @returns {BaseComponent} 
         * @memberof BaseComponent
         */
        public addOperate(operate: IComponentOperate<any>): BaseComponent
        {
            if (this.$_componentState == OperateState.enter)
            {
                operate.state = OperateState.enter;
                operate.enter(this);
            } else
            {
                operate.state = OperateState.exit;
            }
            if (this._hook)
            {
                this._hook.addOperate(operate);
            }
            this._operates.push(operate);
            return this;
        }

        /**
         * 移除操作
         * @param {IComponentOperate<any>} operate 
         * @memberof BaseComponent
         */
        public removeOperate(operate: IComponentOperate<any>): void
        {
            let idx: number = this._operates.indexOf(operate);
            if (idx > -1)
            {
                operate.state = OperateState.exit;
                operate.exit(this);
                this._operates.splice(idx, 1);
            }
        }

        /**
         * 根据操作名删除操作
         * @param {string} name 
         * @memberof BaseComponent
         */
        public removeOperateByName(name: string): void
        {
            for (let i: number = this._operates.length - 1; i >= 0; i--)
            {
                if (this._operates[i].getName() == name)
                {
                    this.removeOperate(this._operates[i]);
                }
            }
        }

        /**
         * 根据操作名获取操作列表
         * @param {string} name 
         * @returns {IComponentOperate<any>[]} 
         * @memberof BaseComponent
         */
        public getOperateByName(name: string): IComponentOperate<any>[]
        {
            let result = [];
            for (let i: number = 0; i < this._operates.length; i++)
            {
                if (this._operates[i].getName() == name)
                {
                    result.push(this._operates[i]);
                }
            }
            return result;
        }

        /**
         * 根据类型名获取操作列表
         * @param {string} type 
         * @returns {IComponentOperate<any>[]} 
         * @memberof BaseComponent
         */
        public getOperateByType(type: string): IComponentOperate<any>[]
        {
            let result = [];
            for (let i: number = 0; i < this._operates.length; i++)
            {
                if (this._operates[i].type == type)
                {
                    result.push(this._operates[i]);
                }
            }
            return result;
        }

        public operatesIsComplete(): boolean
        {
            return this._operates.every(operate => operate.isComplete);
        }

        public setOperatesComplete(): void
        {
            this._operates.forEach(operate => operate.setComplete());
        }

        /**
         * 清理所有操作
         * @memberof BaseComponent
         */
        public clearOperate(): void
        {
            while (this._operates.length > 0)
            {
                this.removeOperate(this._operates[0]);
            }
        }

        /**
         * 销毁数据
         * @memberof BaseComponent
         */
        public destroyData(): void
        {
            while (this._dataMapArr.length)
            {
                this[this._dataMapArr.shift()] = null;
            }
            dragon.Display.destroyChildren(this.displayObject);
        }

        /**
         * 为组件设置动画类
         * @memberof BaseComponent
         */
        public set animation(value: dragon.IUIAnimation)
        {
            this.$_anim = value;
            if (value)
            {
                this.$_anim.displayObject = this;
            }
        }

        public setHistoryComponent(isHistory: boolean): void
        {
            this._isHistoryComponent = isHistory;
        }

        public setType(type: dragon.UIType): void
        {
            this._type = type;
        }

        public isType(type: dragon.UIType): boolean
        {
            if (type == dragon.UIType.ANY)
            {
                return this._type > UIType.MIN && this._type < UIType.ANY;
            }
            return this._type == type;
        }

        public isHistoryComponent(): boolean
        {
            return this._isHistoryComponent;
        }

        public get animation(): dragon.IUIAnimation
        {
            return this.$_anim;
        }

        public get autoId(): any
        {
            return this.$_data ? this.$_data.autoId : '';
        }

        public get componentState(): OperateState
        {
            return this.$_componentState;
        }

        public get data(): any
        {
            return this.$_data;
        }

        public get componentName(): string
        {
            return this._componentName;
        }

        public set componentName(value: string)
        {
            this._componentName = value;
        }

        public set hook(value: IComponentHook)
        {
            this._hook = value;
        }

        public get hook(): IComponentHook
        {
            return this._hook;
        }
    }
}
module dragon
{

	/**
	 * 组件通用接口
	 * @export
	 * @interface IComponent
	 */
    export interface IComponent
    {
        onOpen(...args): void;
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
    export class BaseComponent extends frame.layout.Window implements IComponent, dragon.IUIAnimationDisplay
    {
        private $_anim: dragon.IUIAnimation;
        private $_data: any;
        private $_componentState: OperateState = OperateState.exit;
        private _componentName: string;
        private _dataMapArr: any = [];
        private _hook: IComponentHook;
        private _type: dragon.UIType;
        private _isHistoryComponent: boolean = false;
        private _args: any[] = [];
        private _sprite: egret.Sprite;

        public constructor(...args)
        {
            super();
            if (args[0] && (egret.getQualifiedSuperclassName(args[0]) == 'fairygui.GComponent'))
            {
                let ui = args.splice(0, 1)[0];
                this._args = args;
                this.display = ui;
            } else
            {
                this._args = args;
            }
        }

        public get displayObject(): egret.DisplayObject
        {
            return this.display.displayObject;
        }

        protected onDisplay(value: fairygui.GComponent): void
        {
            this.clean = true;
            this.display['$_class'] = this;
            this.setArgs(this._args);
        }

        public get Sprite(): egret.Sprite
        {
            return this._sprite;
        }

        /**
         * 获取参数数据
         * @readonly
         * @type {*}
         * @memberof BaseComponent
         */
        public get args(): any
        {
            return this._args;
        }

		/**
		 * 设置参数
		 * @param {*} args 
		 * @memberof BaseComponent
		 */
        public setArgs(args: any): void
        {
            this._args = args;
            this.pullData();
        }

		/**
		 * 进入
		 * @param {any} args 
		 * @memberof BaseComponent
		 */
        public onOpen(...args): void
        {
            this.setCenter();
        }

		/**
		 * 退出
		 * @memberof BaseComponent
		 */
        public onClose(): void
        {
            // if (this.display)
            // {
            // 	this.display.removeChildren();
            // 	this.display.dispose();
            // }
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
                    dragon.PropertyEvent.dispatchPropertyEvent(this.display, dragon.PropertyEvent.PROPERTY_CHANGE, type);
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
        public getAnimationDisplay(type?: UI_TYPE): egret.DisplayObject | fairygui.GObject
        {
            if (!type || is.falsy(type))
            {
                return this.display;
            }
            if (type == dragon.UI_TYPE.BOX)
            {
                return this.display;
            } else if (type == dragon.UI_TYPE.MASK)
            {
                return dragon.UI.getBoxMask();
            }
        }

        public set data(value: any)
        {
            this.$_data = value;
            if (value != null)
            {
                this.addDataMap('data');
                PropertyEvent.dispatchPropertyEvent(this.display, dragon.PropertyEvent.PROPERTY_CHANGE, 'data');
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
		 * 销毁数据
		 * @memberof BaseComponent
		 */
        public destroyData(): void
        {
            while (this._dataMapArr.length)
            {
                this[this._dataMapArr.shift()] = null;
            }
            dragon.display.destroyChildren(this.displayObject);
        }

		/**
		 * 为组件设置动画类
		 * @memberof BaseComponent
		 */
        public set animation(value: dragon.IUIAnimation)
        {
            if (value)
            {
                this.$_anim = value;
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
            if (this._componentName)
            {
                return this._componentName;
            }
            return '';
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
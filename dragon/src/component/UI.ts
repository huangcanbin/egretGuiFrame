/**
 * @author Andrew_Huang
 */
module dragon
{
    /**
     * UI 记录Item
     * @export
     * @interface UIHistoryItem
     */
    export interface UIHistoryItem
    {
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
    export interface UIPanelInfo
    {
        name: string;
        type: any;
        args: any[];
    }

    /**
     * UI 层级类型
     * @export
     * @enum {number}
     */
    export enum UIType
    {
        MIN = 0,
        TOOLTIP = 1,
        GUIDE = 2,
        BOX = 3,
        TOPSCENE = 4,
        MENU = 5,
        PANEL = 6,
        COMMON = 7,
        SCENE = 8,
        ANY = 9
    }

    /**
     * UI 事件
     * @export
     * @class UIEvent
     * @extends {egret.Event}
     */
    export class UIEvent extends egret.Event
    {
        static SHOW_PANEL: string = "showpanel";
        static HIDE_PANEL: string = "hidepanel";
        static ADD_BOX: string = "addbox";
        static CLEAR_SEQUENCE_BOX: string = "clear_sequence";
        static REMOVE_BOX: string = "removebox";
        static RUN_SCENE: string = "runscene";
        static REMOVE_SCENE: string = "removescene";
        static SET_MENU: string = "setmenu";
        static REMOVE_MENU: string = "removemenu";
        static ADD_TOOLTIP: string = "addtooltip";
        static REMOVE_TOOLTIP: string = "removetooltip";
        static ADD_GUIDE: string = "addguide";
        static REMOVE_GUIDE: string = "remove_guide";
        static ADD_COMPONENT: string = "add_component";
        static REMOVE_COMPONENT: string = "remove_component";
        static ADD_COMMON: string = "add_common";
        static REMOVE_COMMON: string = "remove_common";
        private _component: dragon.BaseComponent;
        private _group: string;

        public get component(): dragon.BaseComponent
        {
            return this._component;
        }

        public get group(): string
        {
            return this._group;
        }

        constructor(type: string, component: dragon.BaseComponent, group: string = null)
        {
            super(type);
            this._component = component;
            this._group = group;
        }
    }

    /**
     * UI 记录
     * @export
     * @class UIHistory
     */
    export class UIHistory
    {
        private _history: UIHistoryItem[] = [];

        public constructor() { }

        public pushHistory(type: any, args: any[], isUnder: boolean, hookList: any[] = []): void
        {
            this._history.push({ type, args, isUnder, hookList });
        }

        public count(): number
        {
            return this._history.length;
        }

        public hasHistory(): boolean
        {
            return this._history.length > 0;
        }

        public clear(): void
        {
            this._history.length = 0;
        }

        public popHistory(): UIHistoryItem
        {
            return this._history.pop();
        }
    }

    /**
     * UI 控制器
     * 层级从下往上:场景层、公共UI层、面板层、菜单层、弹框层、新手引导层、浮动层
     * @export
     * @class UI
     * @extends {fairygui.UIContainer}
     */
    export class UI extends fairygui.UIContainer
    {
        private _scene: fairygui.UIContainer;    //场景层
        private _common: fairygui.UIContainer;   // 公共UI层
        private _panel: fairygui.UIContainer;    //面板层
        private _menu: fairygui.UIContainer;     //菜单层
        private _topScene: fairygui.UIContainer; //顶层场景（如加载界面）
        private _box: fairygui.UIContainer;      //弹框层
        private _guide: fairygui.UIContainer;    //新手引导层
        private _tooltip: fairygui.UIContainer;  //浮动层
        private _containerArr: fairygui.UIContainer[];  //容器层次列表
        private _panelTypeMap: { [key: string]: UIPanelInfo } = {}; //面板信息映射表
        private _panelInstanceMap: any = {};     //面板实例映射
        private _currentPanel: any = null;       //当前面板
        private _sequenceBoxMap: any = {};       //弹框序列映射
        private _sceneInst: dragon.BaseComponent;//场景实例
        private _menuInst: any;                  //菜单实例

        public constructor()
        {
            super();
            this.touchEnabled = false;
            this._scene = new fairygui.UIContainer();
            this._scene.touchEnabled = false;
            this.addChild(this._scene);
            this._common = new fairygui.UIContainer();
            this._common.touchEnabled = false;
            this.addChild(this._common);
            this._panel = new fairygui.UIContainer();
            this._panel.touchEnabled = false;
            this.addChild(this._panel);
            this._menu = new fairygui.UIContainer();
            this._menu.touchEnabled = false;
            this.addChild(this._menu);
            this._topScene = new fairygui.UIContainer();
            this._topScene.touchEnabled = false;
            this.addChild(this._topScene);
            this._box = new fairygui.UIContainer();
            this._box.touchEnabled = false;
            this.addChild(this._box);
            this._guide = new fairygui.UIContainer();
            this._guide.touchEnabled = false;
            this.addChild(this._guide);
            this._tooltip = new fairygui.UIContainer();
            this._tooltip.touchEnabled = false;
            this.addChild(this._tooltip);
            this._containerArr = [this._scene, this._common, this._panel, this._menu, this._topScene, this._box, this._guide, this._tooltip];
        }

        /**
         * 注入面板到控制器中
         * @param {string} name 面板名称
         * @param {*} type      面板类型
         * @param {*} args      参数列表
         * @memberof UI
         */
        public injectPanel(name: string, type: any, args: any): void
        {
            this._panelTypeMap[name] = { name, type, args };
        }

        /**
         * 隐藏面板
         * @param {*} [panel] 
         * @memberof UI
         */
        public hidePanel(panel?: any): void
        {
            if (!panel)
            {
                this.setPanelHide(this._currentPanel);
            } else
            {
                if (is.string(panel))
                {
                    this.setPanelHide(this._panelInstanceMap[panel]);
                } else
                {
                    this.setPanelHide(panel);
                }
            }
        }

        /**
         * 面板是否显示
         * @param {string} name 
         * @returns {boolean} 
         * @memberof UI
         */
        public panelIsDisplay(name: string): boolean
        {
            if (this._currentPanel && this._currentPanel.getComponentName() == name)
            {
                return this._currentPanel.visible;
            }
            return false;
        }

        /**
         * 设置面板隐藏
         * @private
         * @param {dragon.BaseComponent} panel 
         * @memberof UI
         */
        private setPanelHide(panel: dragon.BaseComponent): void
        {
            if (this._currentPanel && this._currentPanel == panel)
            {
                this.onExit(this._currentPanel, !this.panelInInstanceMap(panel));
                this.dispatchEvent(new UIEvent(UIEvent.HIDE_PANEL, this._currentPanel));
            }
        }

        /**
         * 面板是否在实例映射表中
         * @private
         * @param {*} panel 
         * @returns {boolean} 
         * @memberof UI
         */
        private panelInInstanceMap(panel: any): boolean
        {
            for (let key in this._panelInstanceMap)
            {
                if (this._panelInstanceMap[key] == panel)
                {
                    return true;
                }
            }
            return false;
        }

        /**
         * 退出，执行相关动画与移除操作
         * @private
         * @param {dragon.BaseComponent} component 
         * @param {boolean} remove 
         * @memberof UI
         */
        private onExit(component: dragon.BaseComponent, remove: boolean): void
        {
            if (component.animation)
            {
                component.animation.close(() =>
                {
                    component.visible = false;
                    if (remove)
                    {
                        component.destroyData();
                        dragon.Display.removeFromParent(component, true);
                    }
                });
            } else
            {
                if (remove)
                {
                    component.destroyData();
                    dragon.Display.removeFromParent(component, true);
                }
            }
        }

        /**
         * 进入，执行相关动画操作
         * @private
         * @param {dragon.BaseComponent} component 
         * @memberof UI
         */
        private onEnter(component: dragon.BaseComponent): void
        {
            if (component.animation)
            {
                component.visible = true;
                if (component.stage)
                {
                    this.showAnimation(component);
                } else
                {
                    component.once(egret.Event.ADDED_TO_STAGE, () =>
                    {
                        this.showAnimation(component);
                    }, this);
                }
            }
        }

        private showAnimation(component: dragon.BaseComponent): void
        {
            egret.callLater(() =>
            {
                component.animation.show(() => { });
            }, this);
        }

        /**
         * 清除所有的弹框
         * @memberof UI
         */
        public clearBox(): void
        {
            this.boxHistory.clear();
            for (let i: number = this._box.numChildren - 1; i >= 0; i--)
            {
                let box = this._box.getChildAt(i);
                dragon.UI.remove(box, false);
            }
        }

        /**
         * 设置实例的动画
         * @private
         * @param {string} animationName 动画名
         * @param {*} instance           实例
         * @memberof UI
         */
        private setAnimation(animationName: string, instance: any): void
        {
            if (!instance.animation && animationName)
            {
                let animType = egret.getDefinitionByName(animationName);
                if (animType)
                {
                    let animInstance = new animType();
                    instance.animation = animInstance;
                }
            }
        }

        /**
         * 显示面板
         * @private
         * @param {string} name 
         * @param {*} args 
         * @returns {*} 
         * @memberof UI
         */
        private showPanel(name: string, args: any): any
        {
            this.setPanelHide(this._currentPanel);
            if (!this._panelInstanceMap.hasOwnProperty(name))
            {
                let info: UIPanelInfo = this._panelTypeMap[name];
                let inst = new info.type(...info.args);
                this._panelInstanceMap[name] = inst;
                inst.componentName = name;
                dragon.Display.setFullDisplay(inst);
                this._panel.addChild(inst);
            }
            this._currentPanel = this._panelInstanceMap[name];
            this._currentPanel.setType(UIType.PANEL);
            if (this._currentPanel.setArgs)
            {
                this._currentPanel.setArgs(...args);
            }
            this.setAnimation(dragon.getSetting().PanelAnimation, this._currentPanel);
            this.dispatchEvent(new UIEvent(UIEvent.SHOW_PANEL, this._currentPanel));
            return this._currentPanel;
        }

        /**
         * 获取类型实例
         * @private
         * @param {*} type            类型
         * @param {string} animation  动画
         * @param {any[]} args        参数
         * @param {UIType} uiType     UI类型
         * @returns {dragon.BaseComponent} 
         * @memberof UI
         */
        private getTypeInst(type: any, animation: string, args: any[], uiType: UIType): dragon.BaseComponent
        {
            let inst: dragon.BaseComponent = null;
            if (typeof type == 'string')
            {
                if (uiType == UIType.BOX)
                {
                    type = dragon.getDefinitionType(dragon.getSetting().BoxClass, dragon.BaseComponent);
                } else
                {
                    type = dragon.BaseComponent;
                }
            }
            if (type.constructor.name == 'Function')
            {
                inst = new type(...args);
            } else
            {
                inst = type;
                if (inst.setArgs)
                {
                    inst.setArgs(args);
                }
            }
            if (egret.is(inst, 'dragon.BaseComponent'))
            {
                inst.setType(uiType);
            }
            this.setAnimation(animation, inst);
            this.onEnter(inst);
            return inst;
        }

        /**
         * 设置主菜单栏
         * @private
         * @param {*} menuTtype 
         * @param {*} args 
         * @memberof UI
         */
        private setMenu(menuTtype: any, args: any): void
        {
            if (this._menuInst)
            {
                this.remove(this._menuInst);
            }
            let menuInst = this.getTypeInst(menuTtype, null, args, dragon.UIType.MENU);
            dragon.Display.setFullDisplay(menuInst);
            this._menuInst = menuInst;
            this._menuInst.bottom = 0;
            this._menu.addChild(this._menuInst);
            this.dispatchEvent(new UIEvent(UIEvent.SET_MENU, menuInst));
            this.dispatchEvent(new UIEvent(UIEvent.ADD_COMPONENT, menuInst));
        }

        /**
         * 添加引导层
         * @private
         * @param {*} guideType 
         * @param {*} args 
         * @returns {dragon.BaseComponent} 
         * @memberof UI
         */
        private addGuide(guideType: any, args: any): dragon.BaseComponent
        {
            let guideInst = this.getTypeInst(guideType, null, args, dragon.UIType.GUIDE);
            dragon.Display.setFullDisplay(guideInst);
            this._guide.addChild(guideInst);
            this.dispatchEvent(new UIEvent(UIEvent.ADD_GUIDE, guideInst));
            this.dispatchEvent(new UIEvent(UIEvent.ADD_COMPONENT, guideInst));
            return guideInst;
        }

        /**
         * 添加弹框
         * @private
         * @param {*} boxType 
         * @param {*} args 
         * @returns {dragon.BaseComponent} 
         * @memberof UI
         */
        private addBox(boxType: any, args: any): dragon.BaseComponent
        {
            let boxInst = this.getTypeInst(boxType, dragon.getSetting().BoxAnimation, args, dragon.UIType.BOX);
            dragon.Display.setFullDisplay(boxInst);
            this._box.addChild(boxInst);
            this.dispatchEvent(new UIEvent(UIEvent.ADD_BOX, boxInst));
            this.dispatchEvent(new UIEvent(UIEvent.ADD_COMPONENT, boxInst));
            return boxInst;
        }

        /**
         * 移除
         * @private
         * @param {*} instance 
         * @param {boolean} [isHistory=null] 
         * @param {boolean} [checkHistory=true] 
         * @memberof UI
         */
        private remove(instance: any, isHistory: boolean = null, checkHistory: boolean = true): void
        {

        }

        /**
         * 根据名称获取组件
         * @private
         * @param {string} name 
         * @param {egret.DisplayObjectContainer} container 
         * @returns {dragon.BaseComponent} 
         * @memberof UI
         */
        private getComponentByName(name: string, container: egret.DisplayObjectContainer): dragon.BaseComponent
        {
            let num: number = container.numChildren;
            for (let i: number = 0; i < num; i++)
            {
                let child: dragon.BaseComponent = <dragon.BaseComponent>container.getChildAt(i);
                if (child.componentName == name)
                {
                    return child;
                }
            }
            return null;
        }

        /**
         * 获取组件
         * @param {string} name 
         * @returns {IComponent} 
         * @memberof UI
         */
        public getComponent(name: string): IComponent
        {
            let pullComponent = <any>dragon.pullObject(dragon.NoticeNameKey.GetComponent, name);
            if (pullComponent && pullComponent != name)
            {
                return pullComponent;
            }
            for (let i: number = 0; i < this._containerArr.length; i++)
            {
                let container = this._containerArr[i];
                let component = this.getComponentByName(name, container);
                if (component)
                {
                    return component;
                }
            }
            return null;
        }

        /**
         * 根据组件名，移除组件
         * @param {string} name 
         * @memberof UI
         */
        public removeComponent(name: string): void
        {
            let obj: any = this.getComponent(name);
            if (egret.is(obj, 'dragon.BaseComponent'))
            {
                if (!this.isSingleContainer(obj))
                {
                    this.remove(obj);
                }
            }
        }

        /**
         * 根据 UI 类型获取对应的层级的显示容器
         * @param {UIType} type 
         * @returns {fairygui.UIContainer} 
         * @memberof UI
         */
        public getContainerByType(type: UIType): fairygui.UIContainer
        {
            switch (type)
            {
                case UIType.SCENE: return this._scene;
                case UIType.COMMON: return this._common;
                case UIType.PANEL: return this._panel;
                case UIType.MENU: return this._menu;
                case UIType.TOPSCENE: return this._topScene;
                case UIType.BOX: return this._box;
                case UIType.GUIDE: return this._guide;
                case UIType.TOOLTIP: return this._tooltip;
            }
            return null;
        }

        /**
         * 是否存在面板显示着
         * @returns {boolean} 
         * @memberof UI
         */
        public hasPanel(): boolean
        {
            let panel = this._panel;
            let num: number = this._panel.numChildren;
            for (let i: number = 0; i < num; i++)
            {
                let child = panel.getChildAt(i);
                if (child.visible)
                {
                    return true;
                }
            }
            return false;
        }

        /**
         * 判断组件是否是场景容器或者菜单容器
         * @private
         * @param {*} component 
         * @returns {boolean} 
         * @memberof UI
         */
        private isSingleContainer(component: any): boolean
        {
            if (component.isType(UIType.SCENE) && component.isType(UIType.MENU))
            {
                return true;
            }
            return false;
        }

        /**
         * 弹框记录列表
         * @readonly
         * @type {UIHistory}
         * @memberof UI
         */
        public get boxHistory(): UIHistory
        {
            return dragon.typeSingleton('__UI_BOX__', UIHistory);
        }

        /**
         * 面板记录列表
         * @readonly
         * @type {UIHistory}
         * @memberof UI
         */
        public get panelHistory(): UIHistory
        {
            return dragon.typeSingleton('__UI_PANEL_', UIHistory);
        }

        /**
         * 场景记录列表
         * @readonly
         * @type {UIHistory}
         * @memberof UI
         */
        public get sceneHistory(): UIHistory
        {
            return typeSingleton('__UI_SCENE__', UIHistory);
        }

        /**
         * 设置根容器
         * @private
         * @param {egret.DisplayObjectContainer} container 
         * @memberof UI
         */
        private setRoot(container: egret.DisplayObjectContainer): void
        {
            if (container)
            {
                container.addChild(this);
            }
        }

        public static hasPanel(): boolean
        {
            return dragon.singleton(UI).hasPanel();
        }

        public static removeByName(name: string): void
        {
            dragon.singleton(UI).removeComponent(name);
        }

        public static setMenu(type: any, ...args): void
        {
            dragon.singleton(UI).setMenu(type, args);
        }

        public static addGuide(type: any, ...args): dragon.BaseComponent
        {
            return dragon.singleton(UI).addGuide(type, args);
        }

        public static addBox(type: any, ...args): dragon.BaseComponent
        {
            return dragon.singleton(UI).addBox(type, args);
        }

        public static remove(instance: any, gotoHistory: boolean = null): void
        {
            dragon.singleton(UI).remove(instance, gotoHistory);
        }

        public static setRoot(container: egret.DisplayObjectContainer): void
        {
            dragon.singleton(UI).setRoot(container);
        }
    }
}
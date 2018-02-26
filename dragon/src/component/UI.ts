/**
 * @author Andrew_Huang
 */
module dragon
{
    export enum HookAction
    {
        SET_DATA,
        ADD_OPERATE
    }
    export interface IHookItemInfo
    {
        action: HookAction,
        data: any,
        type?: any;
        operate?: IComponentOperate<any>,
    }

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
        private _component: BaseComponent;
        private _group: string;

        public get component(): BaseComponent
        {
            return this._component;
        }

        public get group(): string
        {
            return this._group;
        }

        constructor(type: string, component: BaseComponent, group: string = null)
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

        public getLastItem(): UIHistoryItem
        {
            if (this.count())
            {
                return this._history[this.count() - 1];
            }
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
        private _common: fairygui.UIContainer;   //公共UI层
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
        private _sceneInst: BaseComponent;       //场景实例
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
        private injectPanel(name: string, type: any, args: any): void
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
         * @param {BaseComponent} panel 
         * @memberof UI
         */
        private setPanelHide(panel: BaseComponent): void
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
         * @param {BaseComponent} component 
         * @param {boolean} remove 
         * @memberof UI
         */
        private onExit(component: BaseComponent, remove: boolean): void
        {
            if (component.animation)
            {
                component.animation.close(() =>
                {
                    component.visible = false;
                    if (remove)
                    {
                        component.destroyData();
                        Display.removeFromParent(component, true);
                    }
                });
            } else
            {
                if (remove)
                {
                    component.destroyData();
                    Display.removeFromParent(component, true);
                }
            }
        }

        /**
         * 进入，执行相关动画操作
         * @private
         * @param {BaseComponent} component 
         * @memberof UI
         */
        private onEnter(component: BaseComponent): void
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

        private showAnimation(component: BaseComponent): void
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
         * 显示面板（面板名为字符串）
         * @private
         * @param {string} name 
         * @param {*} args 
         * @returns {*} 
         * @memberof UI
         */
        private _showPanel(name: string, args: any): any
        {
            this.setPanelHide(this._currentPanel);
            if (!this._panelInstanceMap.hasOwnProperty(name))
            {
                let info: UIPanelInfo = this._panelTypeMap[name];
                let inst = new info.type(...info.args);
                this._panelInstanceMap[name] = inst;
                inst.componentName = name;
                Display.setFullDisplay(inst);
                this._panel.addChild(inst);
            }
            this._currentPanel = this._panelInstanceMap[name];
            this._currentPanel.setType(UIType.PANEL);
            if (this._currentPanel.setArgs)
            {
                this._currentPanel.setArgs(...args);
            }
            this.setAnimation(getSetting().PanelAnimation, this._currentPanel);
            this.dispatchEvent(new UIEvent(UIEvent.SHOW_PANEL, this._currentPanel));
            return this._currentPanel;
        }

        /**
         * 添加面板层（面板名为非字符串）
         * @private
         * @param {*} panelType 
         * @param {*} args 
         * @returns {BaseComponent} 
         * @memberof UI
         */
        private _addPanel(panelType: any, args: any): BaseComponent
        {
            this.hidePanel(this._currentPanel);
            let panelInst = this.getTypeInst(panelType, getSetting().PanelAnimation, args, UIType.PANEL);
            Display.setFullDisplay(panelInst);
            this._panel.addChild(panelInst);
            this._currentPanel = panelInst;
            this.dispatchEvent(new UIEvent(UIEvent.SHOW_PANEL, panelInst));
            this.dispatchEvent(new UIEvent(UIEvent.ADD_COMPONENT, panelInst));
            return panelInst;
        }

        /**
         * 显示面板
         * @private
         * @param {*} panel 
         * @param {*} args 
         * @returns {BaseComponent} 
         * @memberof UI
         */
        private showPanel(panel: any, args: any): BaseComponent
        {
            if (is.string(panel))
            {
                return this._showPanel(panel, args);
            } else
            {
                return this._addPanel(panel, args);
            }
        }

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
        private getTypeInst(type: any, animation: string, args: any[], uiType: UIType): BaseComponent
        {
            let inst: BaseComponent = null;
            if (typeof type == 'string')
            {
                if (uiType == UIType.BOX)
                {
                    type = dragon.getDefinitionType(getSetting().BoxClass, BaseComponent);
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
            if (egret.is(inst, 'BaseComponent'))
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
            Display.setFullDisplay(menuInst);
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
         * @returns {BaseComponent} 
         * @memberof UI
         */
        private addGuide(guideType: any, args: any): BaseComponent
        {
            let guideInst = this.getTypeInst(guideType, null, args, dragon.UIType.GUIDE);
            Display.setFullDisplay(guideInst);
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
         * @returns {BaseComponent} 
         * @memberof UI
         */
        private addBox(boxType: any, args: any): BaseComponent
        {
            let boxInst = this.getTypeInst(boxType, getSetting().BoxAnimation, args, UIType.BOX);
            Display.setFullDisplay(boxInst);
            this._box.addChild(boxInst);
            this.dispatchEvent(new UIEvent(UIEvent.ADD_BOX, boxInst));
            this.dispatchEvent(new UIEvent(UIEvent.ADD_COMPONENT, boxInst));
            return boxInst;
        }

        /**
         * 添加通用普通界面
         * @private
         * @param {*} commonType 
         * @param {*} args 
         * @memberof UI
         */
        private addCommon(commonType: any, args: any): void
        {
            let commonInst = this.getTypeInst(commonType, null, args, UIType.COMMON);
            Display.setFullDisplay(commonInst);
            this._common.addChild(commonInst);
            this.dispatchEvent(new UIEvent(UIEvent.ADD_COMMON, commonInst));
            this.dispatchEvent(new UIEvent(UIEvent.ADD_COMPONENT, commonInst));
        }

        /**
         * 添加tips
         * @private
         * @param {*} tooltipType 
         * @param {*} args 
         * @memberof UI
         */
        private addTooltip(tooltipType: any, args: any): void
        {
            let tooltipInst = this.getTypeInst(tooltipType, null, args, UIType.TOOLTIP);
            Display.setFullDisplay(tooltipInst);
            this._tooltip.addChild(tooltipInst);
            if (egret.is(tooltipInst, 'dragon.BaseComponent'))
            {
                this.dispatchEvent(new UIEvent(UIEvent.ADD_TOOLTIP, tooltipInst));
                this.dispatchEvent(new UIEvent(UIEvent.ADD_COMPONENT, tooltipInst));
            }
        }

        /**
         * 添加场景
         * @private
         * @param {*} sceneType 
         * @param {*} args 
         * @returns {BaseComponent} 
         * @memberof UI
         */
        private runScene(sceneType: any, args: any): BaseComponent
        {
            if (is.truthy(this._sceneInst))
            {
                this.remove(this._sceneInst, null, false);
            }
            let result = this.addScene(sceneType, true, args);
            return result;
        }

        /**
         * 添加定级场景
         * @private
         * @param {*} sceneType 
         * @param {*} args 
         * @returns {BaseComponent} 
         * @memberof UI
         */
        private runTopScene(sceneType: any, args: any): BaseComponent
        {
            if (is.truthy(this._sceneInst))
            {
                this.remove(this._sceneInst, null, false);
            }
            let result = this.addScene(sceneType, true, args);
            return result;
        }

        /**
         * 添加场景（普通场景和顶级场景）
         * @private
         * @param {*} sceneType 
         * @param {boolean} isUnderScene 
         * @param {*} args 
         * @returns {BaseComponent} 
         * @memberof UI
         */
        private addScene(sceneType: any, isUnderScene: boolean, args: any): BaseComponent
        {
            this.sceneHistory.pushHistory(this.sceneHistory, args, isUnderScene);
            let sceneInst = this.getTypeInst(sceneType, getSetting().SceneAnimation, args, UIType.SCENE);
            Display.setFullDisplay(sceneInst);
            if (isUnderScene)
            {
                this._scene.addChild(sceneInst);
            } else
            {
                this._topScene.addChild(sceneInst);
            }
            this._sceneInst.setHistoryComponent(true);
            this._menu.visible = isUnderScene;
            this.dispatchEvent(new UIEvent(UIEvent.RUN_SCENE, sceneInst));
            this.dispatchEvent(new UIEvent(UIEvent.ADD_COMPONENT, sceneInst));
            return sceneInst;
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
            let gotoHistory = isHistory;
            if (!isHistory && instance.isHistoryComponent())
            {
                gotoHistory = true;
            }
            if (instance.isType(UIType.BOX) === true)
            {
                this.onExit(instance, true);
                if (checkHistory)
                {
                    this.checkHistory(gotoHistory, this.boxHistory, (item) =>
                    {
                        this.addHistoryBox(item.type, item.args);
                    });
                }
            } else if (instance.isType(UIType.SCENE) === true)
            {
                this.onExit(instance, true);
                if (checkHistory)
                {
                    this.checkHistory(gotoHistory, this.sceneHistory, (item) =>
                        this.addScene(item.type, item.isUnder, item.args)
                    );
                }
            } else if (instance.isType(UIType.PANEL) === true)
            {
                this.hidePanel(instance);
                if (checkHistory)
                {
                    this.checkHistory(gotoHistory, this.panelHistory, (item) =>
                    {
                        this.resetHookList(this.showHistoryPanel(item.type, item.args), item.hookList);
                    });
                }
            } else
            {
                this.onExit(instance, true);
            }

            if (instance.isType(UIType.BOX) === true)
            {
                this.dispatchEvent(new UIEvent(UIEvent.REMOVE_BOX, instance));
                this.dispatchEvent(new UIEvent(UIEvent.REMOVE_COMPONENT, instance));
                this.onRemoveBox(instance);
            } else if (instance.isType(UIType.SCENE) === true)
            {
                this.dispatchEvent(new UIEvent(UIEvent.REMOVE_SCENE, instance));
                this.dispatchEvent(new UIEvent(UIEvent.REMOVE_COMPONENT, instance));
            } else if (instance.isType(UIType.MENU) === true)
            {
                this.dispatchEvent(new UIEvent(UIEvent.REMOVE_MENU, instance));
                this.dispatchEvent(new UIEvent(UIEvent.REMOVE_COMPONENT, instance));
            } else if (instance.isType(UIType.GUIDE) === true)
            {
                this.dispatchEvent(new UIEvent(UIEvent.REMOVE_GUIDE, instance));
                this.dispatchEvent(new UIEvent(UIEvent.REMOVE_COMPONENT, instance));
            } else if (instance.isType(UIType.TOOLTIP) === true)
            {
                this.dispatchEvent(new UIEvent(UIEvent.REMOVE_TOOLTIP, instance));
                this.dispatchEvent(new UIEvent(UIEvent.REMOVE_COMPONENT, instance));
            } else if (instance.isType(UIType.COMMON) === true)
            {
                this.dispatchEvent(new UIEvent(UIEvent.REMOVE_COMMON, instance));
                this.dispatchEvent(new UIEvent(UIEvent.REMOVE_COMPONENT, instance));
            }
        }

        /**
         * 显示记录面板
         * @private
         * @param {*} type 
         * @param {*} args 
         * @returns {BaseComponent} 
         * @memberof UI
         */
        private showHistoryPanel(type: any, args: any): BaseComponent
        {
            let hookList: any[] = [];
            let hook = {
                setData: (data, type?) =>
                {
                    hookList.push({ action: HookAction.SET_DATA, data: data, type: type });
                }, addOperate: (operate: IComponentOperate<any>) =>
                {
                    hookList.push({ action: HookAction.ADD_OPERATE, operate: operate, data: operate.serialize() });
                }
            };
            this.panelHistory.pushHistory(type, args, false, hookList);
            let panel = this.showPanel(type, args);
            panel.hook = hook;
            panel.setHistoryComponent(true);
            return panel;
        }

        /**
         * 显示记录弹框
         * @private
         * @param {*} boxType 
         * @param {*} args 
         * @memberof UI
         */
        private addHistoryBox(boxType: any, args: any): void
        {
            for (let i: number = this._box.numChildren - 1; i >= 0; i--)
            {
                let boxInst: any = this._box.getChildAt(i);
                if (boxInst.isHistoryComponent() === true)
                {
                    Display.removeFromParent(boxInst, true);
                }
            }
            this.boxHistory.pushHistory(boxType, args, false);
            let box = this.addBox(boxType, args);
            box.setHistoryComponent(true);
        }

        /**
         * 记录检查
         * @private
         * @param {boolean} gotoHistory 
         * @param {UIHistory} history 
         * @param {Function} gotoBackFun 
         * @returns {void} 
         * @memberof UI
         */
        private checkHistory(gotoHistory: boolean, history: UIHistory, gotoBackFun: Function): void
        {
            if (!history)
            {
                return;
            }
            if (gotoHistory && history.hasHistory())
            {
                history.popHistory();
                let item: UIHistoryItem = history.getLastItem();
                if (item)
                {
                    gotoBackFun(item);
                }
            } else
            {
                history.clear();
            }
        }

        /**
         * 重置面板的钩子列表
         * @private
         * @param {BaseComponent} panel 
         * @param {any[]} hookList 
         * @memberof UI
         */
        private resetHookList(panel: BaseComponent, hookList: any[]): void
        {
            for (let i: number = 0; i < hookList.length; i++)
            {
                let item: IHookItemInfo = hookList[i];
                if (item.action == HookAction.SET_DATA)
                {
                    panel.setData(item.data, item.type);
                } else if (item.action == HookAction.ADD_OPERATE)
                {
                    let data = item.data;
                    item.operate.unserialize(data);
                    panel.addOperate(item.operate);
                }
            }
        }

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
        private addSequnceBox(boxType: any, group: string, priority: number, args: any, type: string = null): void
        {
            if (!this._sequenceBoxMap.hasOwnProperty(group))
            {
                this._sequenceBoxMap[group] = [];
            }
            let arr = this._sequenceBoxMap[group];
            let obj = { boxType, group, args, priority, type };
            if (!arr.length && group == '__normal__')
            {
                this.runSeqBox(arr, group, obj);
            } else
            {
                arr.push(obj);
                if (priority != -9999)
                {
                    arr = arr.sort((a, b) =>
                    {
                        return b.priority - a.priority;
                    });
                }
            }
        }

        private getSequnceCount(group: string): number
        {
            let arr = this._sequenceBoxMap[group];
            if (arr && arr.length > 0)
            {
                return arr.length;
            }
            return 0;
        }

        private runSequnceBox(group: string): void
        {
            let arr = this._sequenceBoxMap[group];
            if (arr && arr.length > 0)
            {
                let top = arr.shift();
                this.runSeqBox(arr, group, top);
            }
        }

        private runSeqBox(arr: any, group: string, top: any): void
        {
            let box = null;
            if (top.type == 'fun')
            {
                box = top.args[0];
                egret.callLater(() =>
                {
                    box(() =>
                    {
                        this.onRemoveBox(box);
                    });
                }, this);
            } else
            {
                box = this.addBox(top.boxType, top.args);
            }
            box['__box_group__'] = group;
            arr.push(box);
        }

        private onRemoveBox(box: any): void
        {
            let group = box['__box_group__'];
            if (group)
            {
                let arr = this._sequenceBoxMap[group];
                if (arr)
                {
                    let idx: number = arr.indexOf(box);
                    if (idx > -1)
                    {
                        arr.splice(idx, 1);
                    }
                    if (!arr.length)
                    {
                        delete this._sequenceBoxMap[group];
                        this.dispatchEvent(new UIEvent(UIEvent.CLEAR_SEQUENCE_BOX, null, group));
                    } else
                    {
                        let top = arr.shift();
                        this.runSeqBox(arr, group, top);
                    }
                }
            }
        }

        /**
         * 根据名称获取组件
         * @private
         * @param {string} name 
         * @param {egret.DisplayObjectContainer} container 
         * @returns {BaseComponent} 
         * @memberof UI
         */
        private getComponentByName(name: string, container: egret.DisplayObjectContainer): BaseComponent
        {
            let num: number = container.numChildren;
            for (let i: number = 0; i < num; i++)
            {
                let child: BaseComponent = <BaseComponent>container.getChildAt(i);
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
        private getComponent(name: string): IComponent
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
            if (egret.is(obj, 'BaseComponent'))
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

        // public static getComponent<T extends IComponent>(name: string): T;
        public static getComponent(name: string): IComponent
        {
            return singleton(UI).getComponent(name);
        }

        public static panelIsDisplay(name: string): boolean
        {
            return singleton(UI).panelIsDisplay(name);
        }

        public static hasPanel(): boolean
        {
            return singleton(UI).hasPanel();
        }

        public static removeByName(name: string): void
        {
            singleton(UI).removeComponent(name);
        }

        public static setMenu(type: any, ...args): void
        {
            singleton(UI).setMenu(type, args);
        }

        public static addGuide(type: any, ...args): BaseComponent
        {
            return singleton(UI).addGuide(type, args);
        }

        public static addBox(type: any, ...args): BaseComponent
        {
            return singleton(UI).addBox(type, args);
        }

        public static showPanel(type: any, ...args): BaseComponent
        {
            return singleton(UI).showPanel(type, args);
        }

        public static addCommon(type: any, ...args): void
        {
            singleton(UI).addCommon(type, args);
        }

        public static addTooltip(type: any, ...args): void
        {
            singleton(UI).addTooltip(type, args);
        }

        public static runTopScene(sceneType: any, ...args): BaseComponent
        {
            return singleton(UI).runTopScene(sceneType, args);
        }

        public static runScene(sceneType: any, ...args): BaseComponent
        {
            return singleton(UI).runScene(sceneType, args);
        }

        public static addSequenceBox(type: any, ...args): void
        {
            singleton(UI).addSequnceBox(type, '_normal_', -99999, args);
        }

        public static getSequenceCount(group: string): number
        {
            return singleton(UI).getSequnceCount(group);
        }

        public static addHistoryBox(type: any, ...args): void
        {
            singleton(UI).addHistoryBox(type, args);
        }

        public static showHistoryPanel(type: any, ...args): BaseComponent
        {
            return singleton(UI).showHistoryPanel(type, args)
        }

        public static runGroupSequenceBox(group: string): void
        {
            singleton(UI).runSequnceBox(group);
        }

        public static injectPanel(name: string, type: any, ...args): void
        {
            args.unshift(name);
            singleton(UI).injectPanel(name, type, args);
        }

        public static addEventListener(type: string, func: (e: egret.Event) => void, context?: any): void
        {
            singleton(UI).addEventListener(type, func, context);
        }

        public static once(type: string, func: (e: egret.Event) => void, context?: any): void
        {
            singleton(UI).once(type, func, context);
        }

        public static removeEventListener(type: string, func: (e: egret.Event) => void, context?: any): void
        {
            singleton(UI).removeEventListener(type, func, context);
        }

        public static remove(instance: any, gotoHistory: boolean = null): void
        {
            singleton(UI).remove(instance, gotoHistory);
        }

        public static addGroupSequenceBox(type: any, group: string, priority: number, ...args): void
        {
            singleton(UI).addSequnceBox(type, group, priority, args);
        }

        public static addGroupSequenceFun(fun: (callback: () => void) => void, group: string, priority: number): void
        {
            singleton(UI).addSequnceBox(null, group, priority, [fun], 'fun');
        }

        public static clearBox(): void
        {
            singleton(UI).clearBox();
        }

        public static getMenu(): any
        {
            var ui = singleton(UI)._menuInst;
            return ui;
        }

        public static getScene(): any
        {
            var ui = singleton(UI)._sceneInst;
            return ui;
        }

        public static getContainerByType(type: UIType): egret.DisplayObjectContainer
        {
            return singleton(UI).getContainerByType(type);
        }

        public static hidePanel(panel?: any): void
        {
            singleton(UI).hidePanel(panel);
        }

        public static get panelHistory(): UIHistory
        {
            return singleton(UI).panelHistory;
        }

        public static setBoxVisible(visible: boolean, without: BaseComponent = null): void
        {
            var u = singleton(UI);
            for (var i = 0, len = u._box.numChildren; i < len; i++)
            {
                if (u._box.getChildAt(i) != without)
                {
                    u._box.getChildAt(i).visible = visible;
                }
            }
        }

        public static setRoot(container: egret.DisplayObjectContainer): void
        {
            singleton(UI).setRoot(container);
        }
    }
}
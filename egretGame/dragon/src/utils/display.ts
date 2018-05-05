/**
 * @author Andrew_Huang
 */
module dragon
{
    /**
     * 显示相关控制实现类
     * @export
     * @class Display
     */
    export class display 
    {
        /**
         * 舞台高
         * @readonly
         * @static
         * @type {number}
         * @memberof Display
         */
        public static get stageH(): number
        {
            //dragon.GRootStage.stageH
            return dragon.stage.stageHeight;
        }

        /**
         * 舞台宽
         * @readonly
         * @static
         * @type {number}
         * @memberof Display
         */
        public static get stageW(): number
        {
            // dragon.GRootStage.stageW
            return dragon.stage.stageWidth;
        }

        /**
         * 设置显示对象的相对锚点
         * @static
         * @param {fairygui.GComponent} display 
         * @param {number} anchorX 
         * @param {number} [anchorY=anchorX] 
         * @memberof display
         */
        public static setAnchor(display: fairygui.GComponent, anchorX: number, anchorY: number = anchorX): void
        {
            display.pivotX = anchorX;
            display.pivotY = anchorY;
            display.displayObject.anchorOffsetX = display.width * anchorX;
            display.displayObject.anchorOffsetY = display.height * anchorY;
        }

        /**
         * 销毁 container 所有的子元素
         * @static
         * @param {*} container 
         * @memberof Display
         */
        public static destroyChildren(container: any): void
        {

        }

        /**
         * 设置 display 的尺寸，满屏显示
         * @static
         * @param {egret.DisplayObject} display 
         * @memberof Display
         */
        public static setFullDisplay(display: egret.DisplayObject | fairygui.GComponent): void
        {
            if (display instanceof fairygui.GComponent)
            {
                display.width = this.stageW;
                display.height = this.stageH;
                // display.displayObject.width = this.stageW;
                // display.displayObject.height = this.stageH;
            } else
            {
                display.width = this.stageW;
                display.height = this.stageH;
            }
        }

        /**
         * 从父级移除 child
         * @param {(egret.DisplayObject | dragon.BaseComponent)} child 
         * @param {boolean} [forceRemove=false] 
         * @memberof Display
         */
        public static removeFromParent(child: dragon.BaseComponent, forceRemove: boolean = false): void
        {
            // if (!forceRemove && egret.getQualifiedSuperclassName(child) == 'BaseComponent')
            // {
            //     dragon.UI.remove(child);
            // }
            if (is.truthy(child) && child.parent)
            {
                child.parent.removeChild(child);
                //(<fairygui.GComponent>child.display.parent).removeChild(child.display, forceRemove);
            }
        }

        private static _displayMap: any = {};
        private static _grootListen: boolean = false;
        public static clickBlankCloseSelf(context: dragon.BaseComponent): void
        {
            dragon.setTimeout(() =>
            {
                if (context)
                {
                    let typeId: number = getTypeId(context);
                    let eventPhase: number = 0;
                    this._displayMap[typeId] = { context, eventPhase };
                    if (context.display)
                    {
                        context.display.addClickListener(display.targetEvent, context);
                        if (!display._grootListen)
                        {
                            display._grootListen = true;
                            fairygui.GRoot.inst.addClickListener(display.close, display);
                        }
                    }
                }
            }, this, 100);
        }

        private static targetEvent(event: egret.TouchEvent): void
        {
            let typeId: number = dragon.getTypeId(event.currentTarget.$_class);
            let obj = display._displayMap[typeId];
            if (obj)
            {
                obj.eventPhase = event.eventPhase;
            }
        }

        private static close(event: egret.TouchEvent): void
        {
            let close: boolean = true;
            let target = event.target;
            let phase: number = event.eventPhase;
            if (target)
            {
                for (let typeId in display._displayMap)
                {
                    let obj = display._displayMap[typeId];
                    let context = obj.context;
                    let eventPhase = obj.eventPhase;
                    if (context && context.display)
                    {
                        if (eventPhase == 2 || eventPhase == 3)
                        {
                            //点击到目标自身，不关闭
                            obj.eventPhase = 0;
                            close = false;
                            break;
                        }
                    }
                }
                if (close)
                {
                    // 遍历弹框层
                    let removeBox: boolean = display.removeBaseComponent(UIType.BOX);
                    if (removeBox)
                    {
                        display.removeGRootListener();
                        return;
                    }
                    // 遍历面板层
                    let removePanel: boolean = display.removeBaseComponent(UIType.PANEL);
                    if (removePanel)
                    {
                        display.removeGRootListener();
                        return;
                    }
                    // 遍历公共层
                    let removeCommon: boolean = display.removeBaseComponent(UIType.COMMON);
                    if (removeCommon)
                    {
                        display.removeGRootListener();
                        return;
                    }

                }
            }
        }

        private static removeBaseComponent(type: UIType): boolean
        {
            let layer = dragon.UI.getContainerByType(type);
            let num: number = layer.numChildren;
            let child: BaseComponent = <BaseComponent>layer.getChildAt(num - 1);
            if (child)
            {
                let id = dragon.getTypeId(child);
                if (display._displayMap[id])
                {
                    display.removeFromParent(child);
                    child.display.removeClickListener(display.targetEvent, child);
                    delete display._displayMap[id];
                    return true;
                } else
                {
                    return false
                }
            } else
            {
                return false;
            }
        }

        private static removeGRootListener(): void
        {
            let len: number = dragon.Obj.keys(display._displayMap).length;
            if (len == 0)
            {
                display._grootListen = false;
                fairygui.GRoot.inst.removeClickListener(display.close, display);
            }
        }
    }
}
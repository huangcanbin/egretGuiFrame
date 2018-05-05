/*
 * @Author: Andrew_Huang 
 * @Date: 2018-04-23 10:13:05 
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-04-24 19:12:52
 */
module games
{
    /**
     * Tooltip提示
     * @author Andrew_Huang
     */
    export module components
    {
        export interface ITooltipLayout
        {
            layout(items: dragon.BaseComponent[]): void;
        }

        /**
         * tip动画布局(从下往上叠加)
         * @author Andrew_Huang
         * @class TooltipLayout
         * @implements {ITooltipLayout}
         */
        class TooltipLayout implements ITooltipLayout
        {
            public getTotalHeight(items: dragon.BaseComponent[], offsetY: number = 0): number
            {
                return items.reduce((a, b) =>
                {
                    return a + b.display.height;
                }, 0) + items.length + offsetY;
            }

            public layout(items: dragon.BaseComponent[]): void
            {
                if (items.length == 0)
                {
                    return;
                }
                let offsetY: number = 5;
                let len: number = items.length;
                let w: number = dragon.display.stageW;
                let h: number = dragon.display.stageH;
                let minY = h / 2;
                let maxY = h * 0.8;
                let y = this.getTotalHeight(items, offsetY);
                if (y < minY)
                {
                    y = minY;
                } else if (y > maxY)
                {
                    y = maxY;
                }
                let totalH: number = 0;
                for (let i: number = len - 1; i >= 0; i--)
                {
                    let display: fairygui.GComponent = items[i].display;
                    //dragon.display.setAnchor(display, 0.5);
                    display.y = y - totalH;
                    totalH += display.height + offsetY;
                    display.x = w / 2;
                }
            }
        }

        /**
         * tip展示动画
         * @author Andrew_Huang
         * @class TooltipAnimation
         * @implements {dragon.IUIAnimation}
         */
        class TooltipAnimation implements dragon.IUIAnimation
        {
            private _display: dragon.IUIAnimationDisplay;

            public get displayObject(): dragon.IUIAnimationDisplay
            {
                return this._display;
            }

            public set displayObject(value: dragon.IUIAnimationDisplay)
            {
                this._display = value;
            }

            public show(callback: dragon.IUIAnimationCallback): void
            {
                let display = this.displayObject.getAnimationDisplay();
                dragon.Animation.removeAnimationByTarget(display);
                display.visible = true;
                display.scaleX = display.scaleY = 2;
                display.alpha = 1;
                dragon.Animation.to(300, { scaleX: 1, scaleY: 1 }).call(callback).run(display);
            }

            public close(callback: dragon.IUIAnimationCallback): void
            {
                let display = this.displayObject.getAnimationDisplay();
                dragon.Animation.removeAnimationByTarget(display);
                dragon.Animation.to(200, { alpha: 0 }).call(callback).run(display);
            }
        }

        /**
         * tip Item 组件
         * @author Andrew_Huang
         * @class TooltipItem
         * @extends {dragon.BaseComponent}
         */
        class TooltipItem extends dragon.BaseComponent
        {
            //tip信息
            public data: dragon.ITooltipInfo;
            //tip文本组件使用富文本，命名为label
            private label: fairygui.GRichTextField;

            public constructor()
            {
                super();
            }

            /**
             * 使用对象池获取tipItem后设置数据
             * @param {*} info 
             * @param {fairygui.GComponent} display 
             * @memberof TooltipItem
             */
            public init(info: any, display: fairygui.GComponent): void
            {
                this.animation = dragon.getDefinitionInstance<dragon.IUIAnimation>(getSetting().TooltipAnimation, TooltipAnimation);
                if (display)
                {
                    this.display = display;
                } else if (getSetting().TooltipDisplay)
                {
                    this.display = dragon.getGuiCreateInstance(getSetting().TooltipDisplay);
                }
                this.data = info;
            }

            public onOpen(): void
            {
                if (this.display)
                {
                    this.label = this.display.getChild('label').asRichTextField;
                    if (this.label && this.label instanceof fairygui.GRichTextField)
                    {
                        if (this.data.text.indexOf('<font') > -1)
                        {
                            this.label.text = this.data.text;
                        } else
                        {
                            let str: string = '<font color=' + this.data.color + ' size=' + this.data.size + '>' + this.data.text + '</font>';
                            this.label.text = str
                        }
                    }
                }
            }
        }

        /**
         * tip提示
         * @author Andrew_Huang
         * @export
         * @class Tooltip
         * @extends {dragon.BaseComponent}
         * @implements {dragon.ITooltip}
         */
        export class Tooltip extends dragon.BaseComponent implements dragon.ITooltip
        {
            private _items: TooltipItem[];
            private _layout: ITooltipLayout;

            public constructor()
            {
                super();
                this.display = new fairygui.GComponent();
                this._items = [];
                dragon.display.setFullDisplay(this.display);
                this.display.touchable = false;
            }

            public get layout(): ITooltipLayout
            {
                if (!this._layout)
                {
                    this._layout = dragon.getDefinitionInstance<ITooltipLayout>(getSetting().TooltipLayout, TooltipLayout);
                }
                return this._layout;
            }

            public show(args: string | dragon.ITooltipInfo, display?: fairygui.GComponent): void
            {
                let info: dragon.ITooltipInfo;
                if (is.string(args))
                {
                    let a = <any>args;
                    info = { text: a };
                } else
                {
                    info = <any>args;
                }
                if (!dragon.Obj.hasValue(info, 'color'))
                {
                    info.color = getSetting().TooltipColor;
                }
                if (!dragon.Obj.hasValue(info, 'size'))
                {
                    info.size = getSetting().TooltipSize;
                }
                if (!dragon.Obj.hasValue(info, "delay"))
                {
                    info.delay = getSetting().TooltipDelay;
                }
                //let item: TooltipItem = dragon.getPool(TooltipItem).pop(info, display);
                let item: TooltipItem = new TooltipItem();
                item.init(info, display);
                this.createItem(item, info.delay);
            }

            public customView(display: fairygui.GComponent, data: any, delay: number = getSetting().TooltipDelay): void
            {
                //let item: TooltipItem = dragon.getPool(TooltipItem).pop(data, display);
                let item: TooltipItem = new TooltipItem();
                item.init(data, display);
                this.createItem(item, delay);
            }

            /**
             * 添加tipItem
             * @private
             * @param {TooltipItem} item 
             * @param {number} delay 
             * @memberof Tooltip
             */
            private createItem(item: TooltipItem, delay: number): void
            {
                item.clean = true;
                this.addChild(item);
                this._items.push(item);
                item.animation.show(() =>
                {
                    dragon.Animation.delay(delay).call(() =>
                    {
                        item.animation.close(() =>
                        {
                            this.removeItem(item);
                        });
                    }).run(item);
                });
                egret.callLater(() =>
                {
                    this.layout.layout(this._items);
                }, this);
            }

            /**
             * tip动画播放结束，移除tipItem
             * @private
             * @param {*} item 
             * @memberof Tooltip
             */
            private removeItem(item: any): void
            {
                let idx: number = this._items.indexOf(item);
                if (idx >= 0)
                {
                    this._items.splice(idx, 1);
                    dragon.getPool(TooltipItem).push(item);
                    dragon.display.removeFromParent(item);
                }
            }
        }
    }
}
/*
 * @Author: Andrew_Huang 
 * @Date: 2018-04-24 17:30:23 
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-04-24 20:05:20
 * ——————————————— GUI通用提示框命名规则 ——————————————
 * 标题命名：title         fairygui.GTextField
 * 文本命名：text          fairygui.GTextField
 * 关闭按钮命名：closeBtn  fairygui.GButton
 * 确定按钮命名：yesBtn    fairygui.GButton
 * 取消按钮命名：noBtn     fairygui.GButton
 */
module games
{
    /**
     * 提示框
     */
    export module components
    {
        export interface ConfirmInfo extends dragon.ConfirmInfo
        {
            showYes?: boolean;
            showNo?: boolean;
        }

        /**
         * 设置按钮显示和位置控制器
         * @export
         * @enum {number}
         */
        export enum ConfirmBtnVis
        {
            both = 0,    //确认+取消
            sure = 1,    //确认
            cancel = 2,  //取消
            close = 3,   //关闭
            none = 4
        }

        /**
         * 提示框
         * @author Andrew_Huang
         * @export
         * @class Confirm
         * @extends {dragon.BaseComponent}
         * @implements {dragon.IConfirm}
         */
        export class Confirm extends dragon.BaseComponent implements dragon.IConfirm
        {
            private _info: ConfirmInfo;
            private _callback: Function;
            private _context: Object;
            private _data: any;
            private _confirmView: fairygui.GComponent; //内部组件
            private _closeBtn: fairygui.GButton; //关闭
            private _yesBtn: fairygui.GButton;   //确认
            private _noBtn: fairygui.GButton;    //取消
            private _title: fairygui.GTextField; //标题
            private _text: fairygui.GTextField;  //文本内容
            private _posController: fairygui.Controller;

            public constructor(info: dragon.ConfirmInfo | string)
            {
                super();
                this._info = this.formatInfo(info);
                this._data = this._info;
                this.setArgs(this._info);
                this.display = dragon.getGuiCreateInstance(this._info.confirView);
            }

            /**
             * 格式化弹框数据
             * @author Andrew_Huang
             * @private
             * @param {(dragon.ConfirmInfo | string)} info 
             * @returns {dragon.compoments.ConfirmInfo} 
             * @memberof Confirm
             */
            private formatInfo(info: dragon.ConfirmInfo | string): games.components.ConfirmInfo
            {
                let ret: any = <any>info;
                if (is.string(info))
                {
                    ret = { text: <string>info };
                }
                if (!ret.hasOwnProperty("close"))
                {
                    ret.close = games.components.getSetting().ConfirmClose;
                }
                if (!ret.hasOwnProperty('size'))
                {
                    ret.size = games.components.getSetting().ConfirmSize;
                }
                if (!ret.hasOwnProperty("yes"))
                {
                    ret.yes = games.components.getSetting().ConfirmYes;
                }
                ret.showYes = is.truthy(ret.yes);
                if (!ret.hasOwnProperty("no"))
                {
                    ret.no = games.components.getSetting().ConfirmNo;
                }
                ret.showNo = is.truthy(ret.no);
                if (!ret.hasOwnProperty('confirView'))
                {
                    ret.confirView = games.components.getSetting().ConfirmDisplay;
                }
                if (!ret.hasOwnProperty("subConfirmVioew"))
                {
                    ret.subConfirmVioew = games.components.getSetting().SubConfirmView;
                }
                if (!ret.hasOwnProperty("title"))
                {
                    ret.title = games.components.getSetting().ConfirmTitle;
                }
                if (ret.arg)
                {
                    ret.title = this.formatText(ret.title, ret.arg);
                    ret.text = this.formatText(ret.text, ret.arg);
                }
                return ret;
            }

            /**
             * 格式化文本，替换{0}的value值
             * @author Andrew_Huang
             * @private
             * @param {string} text 
             * @param {*} args 
             * @returns {string} 
             * @memberof Confirm
             */
            private formatText(text: string, args: any): string
            {
                if (is.object(args))
                {
                    for (let key in args)
                    {
                        text = dragon.Str.replaceAll(text, "{" + key + "}", args[key])
                    }
                }
                return text;
            }

            public show(callback: Function, context: any): void
            {
                this._callback = callback;
                this._context = context;
                // if (this._confirmView)
                // {
                //     this._confirmView = dragon.getGuiCreateInstance(this._info.subConfirmView);
                // }
            }

            public onOpen(): void
            {
                super.onOpen();
                dragon.display.clickBlankCloseSelf(this);
                this.init();
            }

            private onTouchHandler(btn: dragon.ConfirmButton): void
            {
                if (this._callback && this._context)
                {
                    this._callback.call(this._context, btn);
                }
                dragon.display.removeFromParent(this);
            }

            private onCloseHandler(): void
            {
                this.onTouchHandler(dragon.ConfirmButton.close);
            }

            private onYesHandler(): void
            {
                this.onTouchHandler(dragon.ConfirmButton.yes);
            }

            private onNoHandler(): void
            {
                this.onTouchHandler(dragon.ConfirmButton.no);
            }

            private init(): void
            {
                if (this.display)
                {
                    if (this.display.getChild('closeBtn'))
                    {
                        this._closeBtn = this.display.getChild('closeBtn').asButton;
                        this._closeBtn.visible = this._info.close;
                        if (this._closeBtn.visible)
                        {
                            this._closeBtn.addClickListener(this.onCloseHandler, this);
                        }
                    }
                    if (this.display.getChild('yesBtn'))
                    {
                        this._yesBtn = this.display.getChild('yesBtn').asButton;
                        this._yesBtn.visible = this._info.showYes;
                        if (this._info.showYes)
                        {
                            this._yesBtn.title = this._info.yes;
                            this._yesBtn.addClickListener(this.onYesHandler, this);
                        }
                    }
                    if (this.display.getChild('noBtn'))
                    {
                        this._noBtn = this.display.getChild('noBtn').asButton;
                        this._noBtn.visible = this._info.showNo;
                        if (this._info.showNo)
                        {
                            this._noBtn.title = this._info.no;
                            this._noBtn.addClickListener(this.onNoHandler, this);
                        }
                    }
                    if (this.display.getChild('title'))
                    {
                        this._title = this.display.getChild("title").asTextField;
                        if (this._info.title)
                        {
                            this._title.visible = true;
                            this._title.text = this._info.title;
                        } else
                        {
                            this._title.visible = false;
                        }
                    }
                    if (this.display.getChild("text"))
                    {
                        this._text = this.display.getChild('text').asTextField;
                        if (this._info.text)
                        {
                            this._text.visible = true;
                            this._text.text = this._info.text;
                            this._text.fontSize = this._info.size;
                        } else
                        {
                            this._text.visible = false;
                        }
                    }
                    this.setBtnPosition();
                }
            }

            private setBtnPosition(): void
            {
                if (this.display.getChild("btnPos"))
                {
                    this._posController = this.display.getController('btnPos');
                    if (this._info.close)
                    {
                        this._posController.setSelectedIndex(ConfirmBtnVis.close)
                    } else if (this._info.showYes && this._info.showNo)
                    {
                        this._posController.setSelectedIndex(ConfirmBtnVis.both);
                    } else if (this._info.showYes && !this._info.showNo)
                    {
                        this._posController.setSelectedIndex(ConfirmBtnVis.sure);
                    } else if (!this._info.showYes && this._info.showNo)
                    {
                        this._posController.setSelectedIndex(ConfirmBtnVis.cancel);
                    } else
                    {
                        this._posController.setSelectedIndex(ConfirmBtnVis.none);
                    }
                }
            }

            public onClose(): void
            {
                super.onClose();
                if (this._closeBtn)
                {
                    this._closeBtn.removeClickListener(this.onCloseHandler, this);
                }
                if (this._yesBtn)
                {
                    this._yesBtn.removeClickListener(this.onYesHandler, this);
                }
                if (this._noBtn)
                {
                    this._noBtn.removeClickListener(this.onNoHandler, this);
                }
            }
        }
    }
}
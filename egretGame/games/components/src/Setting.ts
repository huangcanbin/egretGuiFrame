/*
 * @Author: Andrew_Huang 
 * @Date: 2018-04-23 10:14:41 
 * @Last Modified by:   Andrew_Huang 
 * @Last Modified time: 2018-04-23 10:14:41 
 */
module games
{
    /**
     * @author Andrew_Huang
     * 通用组件
     */
    export module components
    {
        export interface ISetting
        {
            TooltipDisplay: string;     //tip组件
            TooltipAnimation: string;   //tip动画
            TooltipLayout: string;      //tip布局类

            TooltipDelay: number;   //tip文字显示时间
            TooltipColor: number;   //tip文字颜色
            TooltipSize: number;    //tip文字大小

            ConfirmDisplay: string;  //确认框组件
            SubConfirmView: string;  //确认框嵌套组件
            ConfirmYes: string;    //确认框确定按钮标题
            ConfirmNo: string;     //确认框关闭按钮标题
            ConfirmClose: boolean; //是否显示确认框关闭按钮
            ConfirmTitle: string;  //确认框标题
            ConfirmSize: number;   //确认框内容文字大小

            SimpleLoadingDisplay: string;   //普通加载显示UI
            SimpleLoadingAnimation: string; //普通加载动画

            ProgressLoadingDisplay: string; //进度加载显示UI
            ProgressLoadingAnimation: string;            //进度加载动画

            LoadSceneDisplay: string;  //场景加载显示UI
        }

        /**
         * 通用组件配置解析
         * @author Andrew_Huang
         * @export
         * @class Setting
         * @implements {ISetting}
         */
        export class Setting implements ISetting
        {
            private _setting: ISetting;

            public init(setting: ISetting): void
            {
                this._setting = setting;
            }

            public get ConfirmTitle(): string
            {
                return this._setting.ConfirmTitle || '提 示';
            }

            public get ConfirmYes(): string
            {
                return this._setting.ConfirmYes || '确定';
            }

            public get ConfirmNo(): string
            {
                return this._setting.ConfirmNo || '取消';
            }

            public get ConfirmSize(): number
            {
                return this._setting.ConfirmSize || 20;
            }

            public get ConfirmClose(): boolean
            {
                let close = this._setting.ConfirmClose;
                if (typeof (close) == 'boolean')
                {
                    return close;
                }
                return true;
            }

            public get LoadSceneDisplay(): string
            {
                return this._setting.LoadSceneDisplay || 'LoadSceneDisplay';
            }

            public get ProgressLoadingDisplay(): string
            {
                return this._setting.ProgressLoadingDisplay;
            }

            public get ProgressLoadingAnimation(): string
            {
                return this._setting.ProgressLoadingAnimation;
            }

            /**
             * 获取配置中的tip播放时间，默认1s
             * @readonly
             * @type {number}
             * @memberof Setting
             */
            public get TooltipDelay(): number
            {
                return this._setting.TooltipDelay || 1000;
            }

            public get TooltipColor(): number
            {
                return this._setting.TooltipColor || 0;
            }

            public get TooltipSize(): number
            {
                return this._setting.TooltipSize || 20;
            }

            /**
             * 获取配置中的tip动画类（可自定义）
             * @readonly
             * @type {string}
             * @memberof Setting
             */
            public get TooltipAnimation(): string
            {
                return this._setting.TooltipAnimation;
            }

            /**
             * 获取配置中tip多条显示的布局类（可自定义）
             * PS：实现games.components.ITooltipLayout
             * @readonly
             * @type {string}
             * @memberof Setting
             */
            public get TooltipLayout(): string
            {
                return this._setting.TooltipLayout;
            }

            /**
             * 获取配置中的tipItem的组件类（可自定义）
             * @readonly
             * @type {string}
             * @memberof Setting
             */
            public get TooltipDisplay(): string
            {
                return this._setting.TooltipDisplay;
            }

            public get SimpleLoadingAnimation(): string
            {
                return this._setting.SimpleLoadingAnimation;
            }

            public get ConfirmDisplay(): string
            {
                return this._setting.ConfirmDisplay;
            }

            public get SubConfirmView(): string
            {
                return this._setting.SubConfirmView;
            }

            public get SimpleLoadingDisplay(): string
            {
                return this._setting.SimpleLoadingDisplay;
            }

            public static init(setting: ISetting): void
            {
                dragon.singleton(Setting).init(setting);
            }
        }

        export function getSetting(): ISetting
        {
            return dragon.singleton(Setting);
        }
    }
}
declare module games {
    /**
     * 提示框
     */
    module components {
        interface ConfirmInfo extends dragon.ConfirmInfo {
            showYes?: boolean;
            showNo?: boolean;
        }
        /**
         * 设置按钮显示和位置控制器
         * @export
         * @enum {number}
         */
        enum ConfirmBtnVis {
            both = 0,
            sure = 1,
            cancel = 2,
            close = 3,
            none = 4,
        }
        /**
         * 提示框
         * @author Andrew_Huang
         * @export
         * @class Confirm
         * @extends {dragon.BaseComponent}
         * @implements {dragon.IConfirm}
         */
        class Confirm extends dragon.BaseComponent implements dragon.IConfirm {
            private _info;
            private _callback;
            private _context;
            private _data;
            private _confirmView;
            private _closeBtn;
            private _yesBtn;
            private _noBtn;
            private _title;
            private _text;
            private _posController;
            constructor(info: dragon.ConfirmInfo | string);
            /**
             * 格式化弹框数据
             * @author Andrew_Huang
             * @private
             * @param {(dragon.ConfirmInfo | string)} info
             * @returns {dragon.compoments.ConfirmInfo}
             * @memberof Confirm
             */
            private formatInfo(info);
            /**
             * 格式化文本，替换{0}的value值
             * @author Andrew_Huang
             * @private
             * @param {string} text
             * @param {*} args
             * @returns {string}
             * @memberof Confirm
             */
            private formatText(text, args);
            show(callback: Function, context: any): void;
            onOpen(): void;
            private onTouchHandler(btn);
            private onCloseHandler();
            private onYesHandler();
            private onNoHandler();
            private init();
            private setBtnPosition();
            onClose(): void;
        }
    }
}
declare module games {
    /**
     * @author Andrew_Huang
     * 通用组件
     */
    module components {
        interface ISetting {
            TooltipDisplay: string;
            TooltipAnimation: string;
            TooltipLayout: string;
            TooltipDelay: number;
            TooltipColor: number;
            TooltipSize: number;
            ConfirmDisplay: string;
            SubConfirmView: string;
            ConfirmYes: string;
            ConfirmNo: string;
            ConfirmClose: boolean;
            ConfirmTitle: string;
            ConfirmSize: number;
            SimpleLoadingDisplay: string;
            SimpleLoadingAnimation: string;
            ProgressLoadingDisplay: string;
            ProgressLoadingAnimation: string;
            LoadSceneDisplay: string;
        }
        /**
         * 通用组件配置解析
         * @author Andrew_Huang
         * @export
         * @class Setting
         * @implements {ISetting}
         */
        class Setting implements ISetting {
            private _setting;
            init(setting: ISetting): void;
            readonly ConfirmTitle: string;
            readonly ConfirmYes: string;
            readonly ConfirmNo: string;
            readonly ConfirmSize: number;
            readonly ConfirmClose: boolean;
            readonly LoadSceneDisplay: string;
            readonly ProgressLoadingDisplay: string;
            readonly ProgressLoadingAnimation: string;
            /**
             * 获取配置中的tip播放时间，默认1s
             * @readonly
             * @type {number}
             * @memberof Setting
             */
            readonly TooltipDelay: number;
            readonly TooltipColor: number;
            readonly TooltipSize: number;
            /**
             * 获取配置中的tip动画类（可自定义）
             * @readonly
             * @type {string}
             * @memberof Setting
             */
            readonly TooltipAnimation: string;
            /**
             * 获取配置中tip多条显示的布局类（可自定义）
             * PS：实现games.components.ITooltipLayout
             * @readonly
             * @type {string}
             * @memberof Setting
             */
            readonly TooltipLayout: string;
            /**
             * 获取配置中的tipItem的组件类（可自定义）
             * @readonly
             * @type {string}
             * @memberof Setting
             */
            readonly TooltipDisplay: string;
            readonly SimpleLoadingAnimation: string;
            readonly ConfirmDisplay: string;
            readonly SubConfirmView: string;
            readonly SimpleLoadingDisplay: string;
            static init(setting: ISetting): void;
        }
        function getSetting(): ISetting;
    }
}
declare module games {
    /**
     * Tooltip提示
     * @author Andrew_Huang
     */
    module components {
        interface ITooltipLayout {
            layout(items: dragon.BaseComponent[]): void;
        }
        /**
         * tip提示
         * @author Andrew_Huang
         * @export
         * @class Tooltip
         * @extends {dragon.BaseComponent}
         * @implements {dragon.ITooltip}
         */
        class Tooltip extends dragon.BaseComponent implements dragon.ITooltip {
            private _items;
            private _layout;
            constructor();
            readonly layout: ITooltipLayout;
            show(args: string | dragon.ITooltipInfo, display?: fairygui.GComponent): void;
            customView(display: fairygui.GComponent, data: any, delay?: number): void;
            /**
             * 添加tipItem
             * @private
             * @param {TooltipItem} item
             * @param {number} delay
             * @memberof Tooltip
             */
            private createItem(item, delay);
            /**
             * tip动画播放结束，移除tipItem
             * @private
             * @param {*} item
             * @memberof Tooltip
             */
            private removeItem(item);
        }
    }
}

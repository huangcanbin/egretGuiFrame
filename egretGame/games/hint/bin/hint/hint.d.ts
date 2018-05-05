declare module games {
    module hint {
        import ConfirmInfo = games.components.ConfirmInfo;
        /**
         * 根据key值获取对应的提示框数据对象
         * @author Andrew_Huang
         * @export
         * @param {(string | ConfirmInfo)} name
         * @returns {*}
         */
        function getMessage(name: string | ConfirmInfo): any;
        /**
         * 通用提示框
         * @author Andrew_Huang
         * @export
         * @class Hint
         */
        class Hint {
            constructor();
            showConfirm(item: string, param: any, boxType: dragon.BoxType, args: any[]): any;
            static promise: any;
            showTooltip(item: any, arg: any): Promise<{}>;
            has(name: string): boolean;
            show(name: string, param: any, boxType: dragon.BoxType, args?: any[]): any;
            text(name: string, arg: any): string;
        }
        /**
         * 判断是否存在该key值的提示数据对象
         * @author Andrew_Huang
         * @export
         * @param {string} name
         * @returns {boolean}
         */
        function has(name: string): boolean;
        /**
         * 显示指定key值的提示内容
         * @author Andrew_Huang
         * @export
         * @param {(string | ConfirmInfo)} info
         * @param {*} [param=null]
         * @returns
         */
        function show(info: string, param?: any): any;
        /**
         * 返回指定提示内容的文字
         * @author Andrew_Huang
         * @export
         * @param {string} name
         * @param {*} [param=null]
         * @returns {string}
         */
        function text(name: string, param?: any): string;
    }
}
declare module games {
    module hint {
        interface ISetting {
            HintFile: string;
        }
        class Setting implements ISetting {
            private _setting;
            readonly HintFile: string;
            init(setting: ISetting): void;
            static init(setting: ISetting): void;
        }
        function getSetting(): ISetting;
    }
}

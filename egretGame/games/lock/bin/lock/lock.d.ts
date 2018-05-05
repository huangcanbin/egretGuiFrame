declare module games {
    module lock {
        class Lock {
            private _lockObj;
            constructor();
            /**
             * 获取文本提示信息
             * @author Andrew_Huang
             * @private
             * @param {Item} item
             * @returns {string}
             * @memberof Lcok
             */
            private getLvMessage(item);
            /**
             * 等级是否满足功能开启条件
             * @author Andrew_Huang
             * @private
             * @param {Item} item
             * @param {boolean} showTip
             * @returns {boolean}
             * @memberof Lcok
             */
            private lv(item, showTip);
            /**
             * 获取条件状态
             * @author Andrew_Huang
             * @private
             * @param {Item} item
             * @param {boolean} showTip
             * @returns {boolean}
             * @memberof Lcok
             */
            private condition(item, showTip);
            is(type: string, showTip: boolean): boolean;
        }
        /**
         * 指定功能是否开启
         * @author Andrew_Huang
         * @export
         * @param {string} type
         * @param {boolean} [showTip=false]
         * @returns {boolean}
         */
        function is(type: string, showTip?: boolean): boolean;
        /**
         * 指定功能未开启
         * @author Andrew_Huang
         * @export
         * @param {string} type
         * @param {boolean} [showTip=false]
         * @returns {boolean}
         */
        function not(type: string, showTip?: boolean): boolean;
    }
}
declare module games {
    module lock {
        interface ISetting {
            LockFile: string;
            Level: string;
            LevelDefaultMessage: string;
        }
        interface Item {
            Level?: number;
            Name?: string;
            Notice?: string;
            Condition?: string;
            Text?: string;
        }
        class Setting implements ISetting {
            private _setting;
            readonly Level: string;
            readonly LockFile: string;
            readonly LevelDefaultMessage: string;
            init(setting: ISetting): void;
            static init(setting: ISetting): void;
        }
        function getSetting(): ISetting;
    }
}

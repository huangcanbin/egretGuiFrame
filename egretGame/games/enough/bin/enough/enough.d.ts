declare module games {
    module enough {
        function getConfig(name: string): Item;
        /**
         * 检查指定的道具数量是否足够
         * @author Andrew_Huang
         * @export
         * @param {number} configId                 道具配置Id
         * @param {number} need                     需要的道具数量
         * @param {boolean} [enterSupplement=false] 是否进入自定义的提示类操作
         * @param {string} [className=null]         扩展
         * @returns {boolean}
         */
        function hasItem(configId: number, need: number, enterSupplement?: boolean, className?: string): boolean;
        function noItem(configId: number, need: number, enterSupplement?: boolean, className?: string): boolean;
        /**
         * 检查指定的后端数据是否足够（如：金币、VIP等级等）
         * @author Andrew_Huang
         * @export
         * @param {string} type                     数据类型
         * @param {number} need                     需要的数量
         * @param {boolean} [enterSupplement=false] 是否进入自定义的提示类操作
         * @param {string} [className=null]         扩展
         * @returns {boolean}
         */
        function has(type: string, need: number, enterSupplement?: boolean, className?: string): boolean;
        function not(type: string, need: number, enterSupplement?: boolean, className?: string): boolean;
    }
}
declare module games {
    module enough {
        interface ISupplement {
            supplement(type: any, has: number, need: number, extra: any, className: string): void;
        }
        interface Item {
            Type: string;
            Where?: string;
            Confirm?: string;
            CanSupplement?: boolean;
            Key?: any;
        }
        interface ISetting {
            Items: {
                string: Item;
            };
            SupplementClass: string;
        }
        class Setting {
            private _setting;
            readonly Items: {
                string: Item;
            };
            readonly SupplementClass: string;
            init(setting: ISetting): void;
            static init(setting: ISetting): void;
        }
        function getSetting(): ISetting;
    }
}

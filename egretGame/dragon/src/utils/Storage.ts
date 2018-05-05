/**
 * @author Andrew_Huang
 */
module dragon
{
    /**
     * 本地数据存储器
     * @export
     * @class LocalStorage
     */
    export class LocalStorage
    {
        private static _prefix: string = null;   //项目前缀
        private static _enable: boolean = true;  //是否可以保存在egret.localStorage中
        private static _localStorage: any = {};

        public static setPrefix(prefix: string): void
        {
            this._prefix = prefix;
            this._enable = egret.localStorage.setItem('enabled', '1');
        }

        public static isSetPrefix(): boolean
        {
            return this._prefix != null;
        }

        private static checkPrefix(): void
        {
            if (is.nul(this._prefix))
            {
                throw new Error("请设置 localStorage.setPrefix");
            }
        }

        public static getItemKey(key: string): any
        {
            key = this._prefix + '-' + key;
            return key;
        }

        /**
         * 设置Item数据
         * @static
         * @param {string} key 
         * @param {*} value 
         * @memberof LocalStorage
         */
        public static setItem(key: string, value: any): void
        {
            this.checkPrefix();
            if (this._enable)
            {
                egret.localStorage.setItem(this.getItemKey(key), value);
            } else
            {
                this._localStorage[this.getItemKey(key)] = value;
            }
        }

        /**
         * 获取Item数据
         * @static
         * @param {string} key 
         * @param {*} [defaultValue=null] 
         * @returns {*} 
         * @memberof LocalStorage
         */
        public static getItem(key: string, defaultValue: any = null): any
        {
            this.checkPrefix();
            if (this._enable)
            {
                return egret.localStorage.getItem(this.getItemKey(key)) || defaultValue;
            } else
            {
                return this._localStorage[this.getItemKey(key)] || defaultValue;
            }
        }

        /**
         * 移除Item数据
         * @static
         * @param {string} key 
         * @memberof LocalStorage
         */
        public static removeItem(key: string): void
        {
            this.checkPrefix();
            if (this._enable)
            {
                egret.localStorage.removeItem(this.getItemKey(key));
            } else
            {
                delete this._localStorage[this.getItemKey(key)];
            }
        }
    }
}
/*
 * @Author: Andrew_Huang 
 * @Date: 2018-04-23 13:37:04 
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-04-23 17:17:05
 */
module dragon
{
    /**
     * 配置数据
     * @author Andrew_Huang
     * @export
     * @class Config
     */
    export class Config
    {
        private _configMap: any = {};

        /**
         * 获取配置数据
         * @author Andrew_Huang
         * @private
         * @template T 
         * @param {string} name 
         * @param {T} defaultValue 
         * @returns {T} 
         * @memberof Config
         */
        private getConfig<T>(name: string, key: string, defaultValue: T): T
        {
            if (is.nul(key))
            {
                return this._configMap[name] || defaultValue;
            }
            let ret = defaultValue;
            if (this._configMap.hasOwnProperty(name) && !is.nul(key))
            {
                ret = Obj.getValue(this._configMap[name], key, defaultValue);
            }
            return ret;
        }

        /**
         * 判断key值的数据是否存在name的配置数据中
         * @param {string} name 
         * @param {string} key 
         * @returns {boolean} 
         * @memberof Config
         */
        private exists(name: string, key: string): boolean
        {
            if (this._configMap.hasOwnProperty(name))
            {
                if (Obj.hasValue(this._configMap[name], key))
                {
                    return true;
                }
            }
            return false;
        }

        /**
         * 添加JSON数据到map中
         * @author Andrew_Huang
         * @private
         * @param {*} data 
         * @param {string} key 
         * @memberof Config
         */
        public addConfData(data: any, name: string): void
        {
            if (!this._configMap.hasOwnProperty(name))
            {
                this._configMap[name] = data;
            }
        }

        /**
         * 判断name值的数据上是否存在key值的数据
         * @author Andrew_Huang
         * @static
         * @param {string} name 
         * @param {string} key 
         * @returns {boolean} 
         * @memberof Config
         */
        public static exists(name: string, key: string): boolean
        {
            return dragon.singleton(Config).exists(name, key);
        }

        /**
         * 获取配置数据
         * @static
         * @param {string} name            配置名    
         * @param {string} [key=null]      数据的key值
         * @param {*} [defaultValue=null] 
         * @returns {*} 
         * @memberof Config
         */
        public static get(name: string, key: string = null, defaultValue: any = null): any
        {
            return dragon.singleton(Config).getConfig(name, key, defaultValue);
        }
    }
}
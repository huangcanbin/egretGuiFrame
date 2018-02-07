/**
 * 配置数据操作
 * @author Andrew_Huang
 */
module dragon
{
    export class Config
    {
        private _configMap: any = {};

        /**
         * 获取配置数据
         * @template T 
         * @param {string} name 
         * @param {string} key 
         * @param {T} defaultValue 
         * @returns {T} 
         * @memberof Config
         */
        private getConfig<T>(name: string, key: string, defaultValue: T): T
        {
            this.addConfData();
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
            this.addConfData();
            if (this._configMap.hasOwnProperty(name))
            {
                if (Obj.hasValue(this._configMap[name], key))
                {
                    return true;
                }
            }
            return false;
        }

        private addConfData(): void
        {
            if (!this._configMap.hasOwnProperty(name))
            {
                let data = RES.getRes(name);
                if (data)
                {
                    this._configMap[name] = data;
                }
            }
        }

        public static exists(name: string, key: string): boolean
        {
            return dragon.singleton(Config).exists(name, key);
        }

        /**
         * 获取配置数据
         * @static
         * @param {string} name 
         * @param {string} [key=null] 
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
/*
 * @Author: Andrew_Huang 
 * @Date: 2018-04-26 19:17:03 
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-04-26 20:08:02
 */
module dragon
{
    /**
     * 配置数据缓存库
     * @author Andrew_Huang
     * @export
     * @class ConfigDataStore
     */
    export class ConfigDataStore extends DataStore
    {
        private _info: ModelInfo;  //数据模型信息

        public constructor(type: string, info: ModelInfo)
        {
            super(type);
            this._info = info;
        }

        /**
         * 根据类型获取数据模型（单个）
         * @author Andrew_Huang
         * @param {string} type 
         * @param {any} arg 
         * @returns {*} 
         * @memberof ConfigDataStore
         */
        public getNewModel(type: string, propertyValue): any
        {
            let conf = this._info.factory(propertyValue);
            let inst = new this._info.type();
            if (inst instanceof BaseSubModel && this._info.subCoreFactory)
            {
                inst.core = this._info.subCoreFactory(propertyValue);
            }
            inst.c = conf;
            return inst;
        }

        /**
         * 根据类型获取数据模型(多个proertyValue值)
         * @author Andrew_Huang
         * @param {string} type 
         * @param {any} args 
         * @returns {*} 
         * @memberof ConfigDataStore
         */
        public getModel(type: string, ...args): any
        {
            let ret = [];
            for (let i: number = 0; i < args.length; i++)
            {
                let arg = args[i];
                if (!this.has(arg))
                {
                    let config = this._info.factory(arg);
                    let inst = new this._info.type();
                    if (inst instanceof BaseSubModel && this._info.subCoreFactory)
                    {
                        inst.core = this._info.subCoreFactory(arg);
                    }
                    inst.c = config;
                    this.onAdd(inst);
                }
                ret = ret.concat(super.getModel(type, arg));
            }
            return ret;
        }
    }
}
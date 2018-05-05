/*
 * @Author: Andrew_Huang 
 * @Date: 2018-04-27 13:15:25 
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-05-02 11:31:45
 */
module dragon
{
    import DataUtils = dragon.data.DateUtils;

    /**
     * 数据中心
     * @author Andrew_Huang
     * @export
     * @class DataCenter
     */
    export class DataCenter
    {
        private _modelDataMap: any = {}; //数据模型
        private _baseDataMap: any = {};  //基础数据模块
        private _modDataMap: any = {};   //模块化数据映射表

        /**
         * 获取服务端数据
         * @author Andrew_Huang
         * @private
         * @param {*} data 
         * @memberof DataCenter
         */
        public getServerData(data: any): void
        {
            let seq: number = data.seq;
            let code: number = data.code;
            let msg: string = data.msg;
            if (data.data && code == 200)
            {
                this.analyiseData(data.data);
            }
        }

        /**
         * 解析服务端body数据
         * @author Andrew_Huang
         * @private
         * @param {*} data 
         * @memberof DataCenter
         */
        private analyiseData(data: any): void
        {
            for (let key in data)
            {
                let modName: string = key;
                let models: any = data[key];
                postNotice(NoticeKey.SERVER_DATA_CHANGE(modName), models);
            }
        }

        /**
         * 基础数据模块注入
         * @author Andrew_Huang
         * @static
         * @template T 
         * @param {string} modName 
         * @param {T} data 
         * @memberof DataCenter
         */
        public injectBaseData<T>(modName: string, data: T): void
        {
            if (!this._baseDataMap.hasOwnProperty(modName))
            {
                this._baseDataMap[modName] = new (<any>data)(modName);
            }
        }

        /**
         * 注入数据模型
         * @author Andrew_Huang
         * @private
         * @template T 
         * @param {T} type 
         * @memberof DataCenter
         */
        public injectDataModel<T>(type: T): void
        {
            let id = getTypeId(type);
            if (!this._modelDataMap.hasOwnProperty(id))
            {
                this._modelDataMap[id] = new Data(type);
            }
        }

        /**
         * 获取基础数据模块
         * @author Andrew_Huang
         * @private
         * @param {string} modName 
         * @returns {BaseData} 
         * @memberof DataCenter
         */
        public getBaseData(modName: string): BaseData
        {
            return this._baseDataMap[modName];
        }

        /**
         * 根据数据模型类获取数据模型
         * @author Andrew_Huang
         * @private
         * @template T 
         * @param {T} type 
         * @returns {Data} 
         * @memberof DataCenter
         */
        public getDataModel<T>(type: T): Data
        {
            let id = getTypeId(type);
            if (!this._modelDataMap.hasOwnProperty(id))
            {
                this._modelDataMap[id] = new Data(type);
            }
            return this._modelDataMap[id];
        }

        /**
         * 根据，数据模型类+key值参数+key值，获取具体的单个模型数据
         * @author Andrew_Huang
         * @private
         * @template T 
         * @param {T} type 
         * @param {string} propertyName 
         * @param {*} propertyValue 
         * @returns {*} 
         * @memberof DataCenter
         */
        public getModel<T>(type: T, propertyName: string, propertyValue: any): any
        {
            let ret = this.getDataModel(type).get(propertyName, propertyValue);
            if (ret && ret.length > 0)
            {
                return ret[0];
            }
            return null;
        }

        /**
         * 获取多个参数值的数据模型集合
         * @author Andrew_Huang
         * @private
         * @template T 
         * @param {T} type 
         * @param {string} propertyName 
         * @param {any} vals 
         * @returns {any[]} 
         * @memberof DataCenter
         */
        public getMultiple<T>(type: T, propertyName: string, ...vals): any[]
        {
            let ret = this.getDataModel(type).getMultiple(propertyName, ...vals);
            if (!ret)
            {
                return [];
            }
            return ret;
        }

        /**
         * 获取某个数据模型类的所有数据对象model
         * @author Andrew_Huang
         * @private
         * @template T 
         * @param {T} type 
         * @returns {any[]} 
         * @memberof DataCenter
         */
        public getDataModelList<T>(type: T): any[]
        {
            return this.getDataModel(type).getList();
        }

        public getWhereValue(where: string, defaultValue: number = 0): number
        {
            let str: Array<string> = where.split('.');
            let mod: string = str.splice(0, 1)[0];
            let data = this.getBaseData(mod);
            let key = str[0];
            if (data[key])
            {
                return data[key];
            }
            return defaultValue;
        }
    }

    /**
     * 基础数据注入
     * @author Andrew_Huang
     * @export
     * @template T 
     * @param {string} modName 
     * @param {T} data 
     */
    export function injectBaseData<T>(modName: string, data: T): void
    {
        singleton(DataCenter).injectBaseData(modName, data);
    }

    /**
     * 数据模型注入
     * @author Andrew_Huang
     * @export
     * @param {*} type 
     */
    export function injectDataModel(type: any): void
    {
        singleton(DataCenter).injectDataModel(type);
    }

    /**
     * 获取服务器数据解析
     * @author Andrew_Huang
     * @export
     * @param {*} data 
     */
    export function getServerData(data: any): void
    {
        singleton(DataCenter).getServerData(data);
    }

    /**
     * 根据模块名获取基础数据模块
     * @author Andrew_Huang
     * @export
     * @param {string} modName 
     * @returns {BaseData} 
     */
    export function getBaseData(modName: string): BaseData
    {
        return singleton(DataCenter).getBaseData(modName);
    }

    /**
     * 通过指定属性名和属性值来获取指定类型的模型对象
     * @author Andrew_Huang
     * @export
     * @template T 
     * @param {{ new(): T; }} type   对象模型类型
     * @param {string} propertyName  属性名
     * @param {*} propertyVal        属性值
     * @returns {T} 
     */
    export function getDataModel<T>(type: { new(): T; }, propertyName: string, propertyVal: any): T
    {
        return singleton(DataCenter).getModel(type, propertyName, propertyVal);
    }

    /**
     * 通过指定属性名和属性值来获取指定类型的多个模型对象
     * @author Andrew_Huang
     * @export
     * @template T 
     * @param {{ new(): T; }} type  对象模型类型
     * @param {string} propertyName 属性名
     * @param {any} valueArr        属性值
     * @returns {T[]} 
     */
    export function getMultipleModel<T>(type: { new(): T; }, propertyName: string, ...valueArr): T[]
    {
        return singleton(DataCenter).getMultiple(type, propertyName, ...valueArr);
    }

    export function getDataModelList<T>(type: { new(): T; }): T[]
    {
        return singleton(DataCenter).getDataModelList(type);
    }

    /**
     * 获取指定点的数据值 
     * @author Andrew_Huang
     * @export
     * @param {string} where 
     * @param {number} [defaultValue=0] 
     * @returns {number} 
     */
    export function getWhereValue(where: string, defaultValue: number = 0): number
    {
        return singleton(DataCenter).getWhereValue(where, defaultValue);
    }
}
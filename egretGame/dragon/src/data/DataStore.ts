/*
 * @Author: Andrew_Huang 
 * @Date: 2018-04-26 11:49:25 
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-04-28 15:14:06
 */
module dragon
{
    /**
     * 数据缓存库基础
     * @author Andrew_Huang
     * @export
     * @interface IDataStore
     */
    export interface IDataStore
    {
        propertyName: string;
        onAdd(model: any): void;
        onDelete(model: any): void;
        getModel(type: string, ...args): any;
    }

    /**
     * 数据缓存库（一个key值存在catchMap中存在一个数据缓存的）
     * @author Andrew_Huang
     * @export
     * @class DatsStore
     * @implements {IDataStore}
     */
    export class DataStore implements IDataStore
    {
        private _catchMap: any = {};    //数据缓存映射表
        private _instMap: any = {};     //数据实例映射表
        private _propertyName: string;  //key值参数名（来自ModeInfo的configKey、autoKey、otherKey）

        public constructor(propertyName: string)
        {
            this._propertyName = propertyName;
        }

        public get propertyName(): string
        {
            return this._propertyName;
        }

        /**
         * 是否存key值的数据对象
         * @author Andrew_Huang
         * @param {string} value 
         * @returns {boolean} 
         * @memberof DataStore
         */
        public has(key: string): boolean
        {
            return this._catchMap.hasOwnProperty(key) && this._catchMap[key].length > 0;
        }

        /**
         * 根据key值获取数据对象
         * @author Andrew_Huang
         * @param {*} model 
         * @returns {*} 
         * @memberof DataStore
         */
        public getValue(model: any): any
        {
            let ret = model.getValue(this._propertyName);
            if (is.truthy(ret))
            {
                return ret;
            }
            console.warn("Can't Find data by " + this._propertyName);
            return null;
        }

        /**
         * 添加数据对象
         * @author Andrew_Huang
         * @param {*} model 
         * @memberof DataStore
         */
        public onAdd(model: any): void
        {
            let value = this.getValue(model);
            if (is.truthy(value))
            {
                if (!this._catchMap.hasOwnProperty(value))
                {
                    this._catchMap[value] = [];
                }
                this._instMap[model.hashCode] = value;
                if (this._catchMap[value].indexOf(model) == -1)
                {
                    this._catchMap[value].push(model);
                }
            }
        }

        /**
         * 删除数据
         * @author Andrew_Huang
         * @param {*} model 
         * @memberof DataStore
         */
        public onDelete(model: any): void
        {
            let value = this.getValue(model);
            delete this._instMap[model.hashCode];
            if (this._catchMap.hasOwnProperty(value))
            {
                let arr = this._catchMap[value];
                array.remove(arr, model);
            }
        }

        /**
         * 更新数据
         * @author Andrew_Huang
         * @param {*} model 
         * @memberof DataStore
         */
        public update(model: any, newModel: any): void
        {
            //删除
            let value = this.getValue(model);
            delete this._instMap[model.hashCode];
            if (this._catchMap.hasOwnProperty(value))
            {
                let arr = this._catchMap[value];
                array.remove(arr, model);
            }
            //添加
            let newValue = this.getValue(newModel);
            if (is.truthy(newValue))
            {
                if (!this._catchMap.hasOwnProperty(newValue))
                {
                    this._catchMap[newValue] = [];
                }
                this._instMap[newModel.hashCode] = newValue;
                if (this._catchMap[newValue].indexOf(newModel) == -1)
                {
                    this._catchMap[newValue].push(newModel);
                }
            }
        }

        /**
         * 根据key值获取数据模型
         * @author Andrew_Huang
         * @param {string} type 
         * @param {...any[]} args 
         * @memberof DataStore
         */
        public getModel(type: string, ...args: any[])
        {
            if (type == this._propertyName)
            {
                let arr = [];
                for (let i: number = 0; i < args.length; i++)
                {
                    if (this._catchMap.hasOwnProperty(args[i]))
                    {
                        arr = arr.concat(this._catchMap[args[i]]);
                    }
                }
                return arr;
            }
        }

        public getNewModel(type: string, arg): any
        {
            return null;
        }
    }
}
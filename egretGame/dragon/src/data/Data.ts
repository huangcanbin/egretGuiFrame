/*
 * @Author: Andrew_Huang 
 * @Date: 2018-04-26 14:25:42 
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-04-28 15:14:29
 */
module dragon
{
    /**
     * 子数据工厂，返回子数据
     * @author Andrew_Huang
     * @export
     * @interface IDataPartFactory
     */
    export interface IDataPartFactory
    {
        (obj: any): any;
    }

    /**
     * 数据
     * @author Andrew_Huang
     * @export
     * @class Data
     */
    export class Data
    {
        private _mod: string;                                      //数据识别Key
        private _type: any;                                        //数据类
        private _info: ModelInfo;                                  //数据模型信息
        private _aliaseKey: dragon.data.AliaseKey;                 //服务端与客户端key值别名
        private _dataStoreMap: { [key: string]: DataStore } = {};  //其他数据存储类（如配置数据等）
        private _mainStore: MainDataStore;                         //主数据存储类（服务端key）
        private _deleteModels: any[] = [];                         //删除数据缓存库
        private _addModels: any[] = [];                            //添加数据缓存库

        public constructor(type: any)
        {
            this._type = type;
            this._info = type.info; //赋值数据模型info
            this._info.type = type;
            this._mod = this._info.mod; //数据识别Key
            this._mainStore = new MainDataStore(this._info.autoKey);
            if (this._info.confKey)
            {
                this._aliaseKey = data.DateUtils.formatAliaseKey(this._info.confKey);
                this._dataStoreMap[this._aliaseKey.configKey] = new ConfigDataStore(this._aliaseKey.configKey, this._info);
            }
            for (let i: number = 0; i < this._info.otherKey.length; i++)
            {
                let otherKey = this._info.otherKey[i];
                this._dataStoreMap[otherKey] = new DataStore(otherKey);
            }
            //捕捉mod，添加数据变更监听
            //增删改查监听
            addNotice(NoticeKey.SERVER_DATA_CHANGE(this._mod), this.changeModel, this);
            // addNotice(NoticeNameKey.CHANGE_MODEL(this._mod), this.changeServerData, this);
        }

        /**
         * 接收到服务端的数据（增删改查）
         * @author Andrew_Huang
         * @private
         * @memberof Data
         */
        private changeModel(list: any): void
        {
            for (let i: number = 0; i < list.length; i++)
            {
                let data = list[i];   //数据对象
                if (this.isExist(data))
                {
                    if (data.rem)
                    {
                        this.delete(data);
                    } else
                    {
                        this.update(data);
                    }
                } else
                {
                    this.add(data);
                }
            }
            postNotice(NoticeKey.CHANGE_MODEL(this._mod), list);
        }

        /**
         * 删除数据对象
         * @author Andrew_Huang
         * @private
         * @param {string} autoKey 服务端key值
         * @param {number} id      服务端value值
         * @memberof Data
         */
        private delete(data: any): void
        {
            if (data.rem)
            {
                let id: number = Obj.getValue(data, this._info.autoKey, null);
                if (id)
                {
                    var modelArr: any[] = this._mainStore.getModel(this._info.autoKey, id);
                    for (var i = 0; i < modelArr.length; i++)
                    {
                        var model = modelArr[i];
                        this._deleteModels.push(model);
                        this.deleteModel(model);
                    }
                }
            }
        }

        /**
         * 添加数据对象
         * @author Andrew_Huang
         * @private
         * @param {*} data 
         * @memberof Data
         */
        private add(data: any): void
        {
            if (!this.isExist(data))
            {
                this.addModule(data);
            }
        }

        /**
         * 更新数据对象
         * @author Andrew_Huang
         * @private
         * @param {*} data 
         * @memberof Data
         */
        private update(data: any): void
        {
            if (data.rem)
            {
                return;
            }
            let id: number = Obj.getValue(data, this._info.autoKey, null);
            if (id)
            {
                let modelArr = this.get(this._info.autoKey, id);
                let newModel = this.getModel(data);
                if (is.not.nul(modelArr))
                {
                    for (let i: number = 0; i < modelArr.length; i++)
                    {
                        let model = modelArr[i];
                        this._mainStore.update(model, newModel);
                        for (let key in this._dataStoreMap)
                        {
                            if (this._dataStoreMap.hasOwnProperty(key))
                            {
                                this._dataStoreMap[key].update(model, newModel);
                            }
                        }
                    }
                } else
                {
                    return;
                }
            }
        }

        /**
         * 删除数据对象（配置数据仓库不删除，如果是关联二级服务端和配置数据，则删除）
         * @author Andrew_Huang
         * @private
         * @param {*} model 
         * @memberof Data
         */
        private deleteModel(model: any): void
        {
            this._mainStore.onDelete(model);
            for (let key in this._dataStoreMap)
            {
                if (key != this._aliaseKey.configKey || this._info.isMultiple)
                {
                    let store: DataStore = this._dataStoreMap[key];
                    store.onDelete(model);
                }
            }
        }

        /**
         * 添加数据模块
         * @author Andrew_Huang
         * @private
         * @param {*} item 
         * @memberof Data
         */
        private addModule(item: any): void
        {
            let model = this.getModel(item);
            this._addModels.push(model);
            this._mainStore.onAdd(model);
            for (let key in this._dataStoreMap)
            {
                let store = this._dataStoreMap[key];
                store.onAdd(model);
            }
        }

        /**
         * 服务端数据是否已经存在于主缓存库中
         * @author Andrew_Huang
         * @private
         * @param {*} data 
         * @returns {boolean} 
         * @memberof Data
         */
        private isExist(data: any): any
        {
            let id: number = Obj.getValue(data, this._info.autoKey, null);
            if (id)
            {
                let modelArr: any[] = this._mainStore.getModel(this._info.autoKey, id);
                if (modelArr && modelArr.length)
                {
                    return modelArr;
                }
                return null;
            }
            return null;
        }

        /**
         * 获取数据模型对象（相当于新建一个数据模型Item）
         * @author Andrew_Huang
         * @private
         * @param {*} item 
         * @returns {*} 
         * @memberof Data
         */
        private getModel(item: any): any
        {
            let configKey = this._info.confKey;
            let aliaseKey = data.DateUtils.formatAliaseKey(configKey);
            let value = Obj.getValue(item, aliaseKey.serverKey, null);
            let model = null;
            if (is.not.nul(value))
            {
                //存在服务端数据，设置对应的客户端配置数据
                if (this._info.isMultiple)
                {
                    model = this._dataStoreMap[aliaseKey.configKey].getNewModel(aliaseKey.configKey, value);
                } else
                {
                    let modelArr = this._dataStoreMap[aliaseKey.configKey].getModel(aliaseKey.configKey, value);
                    if (modelArr && modelArr.length)
                    {
                        model = modelArr[0]
                    }
                }
            }
            if (!model)
            {
                model = new this._info.type();
            }
            model.s = item;
            return model;
        }

        /**
         * 获取一个参数key值多个value值的数据模型
         * @author Andrew_Huang
         * @param {string} propertyName 
         * @param {any} values 
         * @returns {any[]} 
         * @memberof Data
         */
        public getMultiple(propertyName: string, ...values): any[]
        {
            let store = this.getDataStore(propertyName);
            if (store)
            {
                return store.getModel(propertyName, ...values);
            }
            return [];
        }

        /**
         * 获取数据模型
         * @author Andrew_Huang
         * @param {string} propertyName key值参数（获取对应的数据仓库）
         * @param {*} propertyValue     value值
         * @returns {any[]} 
         * @memberof Data
         */
        public get(propertyName: string, propertyValue: any): any[]
        {
            let store = this.getDataStore(propertyName);
            if (store)
            {
                return store.getModel(propertyName, propertyValue);
            }
            return [];
        }

        /**
         * 根据key值获取对应的数据缓存库
         * @author Andrew_Huang
         * @param {string} propertyName 
         * @returns {DataStore} 
         * @memberof Data
         */
        public getDataStore(propertyName: string): DataStore
        {
            if (propertyName == this._info.autoKey)
            {
                return this._mainStore;
            }
            if (this._dataStoreMap.hasOwnProperty(propertyName))
            {
                let store: DataStore = this._dataStoreMap[propertyName];
                return store;
            }
            return null;
        }

        /**
         * 获取服务端所有的数据Item
         * @author Andrew_Huang
         * @returns {any[]} 
         * @memberof Data
         */
        public getList(): any[]
        {
            return this._mainStore.getList();
        }

        public get mod(): string
        {
            return this._mod;
        }
    }
}
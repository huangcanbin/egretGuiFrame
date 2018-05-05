/*
 * @Author: Andrew_Huang 
 * @Date: 2018-05-02 09:48:13 
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-05-02 10:33:43
 */
module dragon
{
    export class Item
    {
        /**
         * 获取道具模型实例
         * @author Andrew_Huang
         * @static
         * @returns {*} 
         * @memberof Item
         */
        public static getItemInst(): any
        {
            let itemClass = getSetting().ItemModelClass;
            let itemInst = dragon.getDefinitionInstance(itemClass, null);
            if (itemInst)
            {
                return itemInst;
            }
            return null;
        }

        /**
         * 获取指定道具的名称
         * 道具模型需要存在 NameKey 的属性值作为道具名的key值（关联配置表），默认name
         * @author Andrew_Huang
         * @static
         * @param {number} configId 道具配置Id
         * @returns {string} 
         * @memberof Item
         */
        public static getName(configId: number): string
        {
            let itemInst = this.getItemInst();
            if (itemInst)
            {
                let nameKey: string = itemInst.NameKey ? itemInst.NameKey : 'name';
                let key = itemInst.info.configKey;
                let aliasInfo = data.DateUtils.formatAliaseKey(key);
                let model = <BaseModel>dragon.getDataModel(itemInst, aliasInfo.configKey, configId);
                if (model && model.c)
                {
                    return Obj.getValue(model.c, nameKey, null);
                }
                return null;
            }
        }

        /**
         * 获取指定道具的拥有数量
         * 道具模型需要存在 NumKey 的属性名作为道具数量key值（关联服务端数据）。默认num
         * @author Andrew_Huang
         * @static
         * @param {number} configId 道具配置Id
         * @returns {number} 
         * @memberof Item
         */
        public static getNum(configId: number): number
        {
            let itemInst = this.getItemInst();
            if (itemInst)
            {
                let numKey: string = itemInst.NumKey ? itemInst.NumKey : 'num';
                let key = itemInst.info.configKey;
                let aliasInfo = data.DateUtils.formatAliaseKey(key);
                let model = <BaseModel>dragon.getDataModel(itemInst, aliasInfo.configKey, configId);
                if (model && model.s)
                {
                    return Obj.getValue(model.s, numKey, 0);
                }
            }
            return 0;
        }

        /**
         * 获取指定道具配置Id的道具模型实例
         * @author Andrew_Huang
         * @static
         * @param {number} configId 道具配置Id
         * @returns {*} 
         * @memberof Item
         */
        public static getItemByConfigId(configId: number): any
        {
            let itemInst = this.getItemInst();
            if (itemInst)
            {
                let key = itemInst.info.configKey;
                let aliasInfo = data.DateUtils.formatAliaseKey(key);
                let model = <BaseModel>dragon.getDataModel(itemInst, aliasInfo.configKey, configId);
                return model;
            }
            return null;
        }

        /**
         * 获取指定服务器Id的道具模型实例
         * @author Andrew_Huang
         * @static
         * @param {number} serverId 服务器Id
         * @returns {*} 
         * @memberof Item
         */
        public static getItemByServerId(serverId: number): any
        {
            let itemInst = this.getItemInst();
            if (itemInst)
            {
                let key = itemInst.info.autoKey;
                let model = dragon.getDataModel(itemInst, key, serverId);
                return model;
            }
            return null;
        }

        /**
         * 获取所有道具的模型实例列表
         * @author Andrew_Huang
         * @returns {any[]} 
         * @memberof Item
         */
        public static getItems(): any[]
        {
            let itemInst = this.getItemInst();
            if (itemInst)
            {
                return dragon.getDataModelList(itemInst);
            }
            return [];
        }

        /**
         * 获取指定属性名和属性值的所有模型实例
         * @author Andrew_Huang
         * @static
         * @param {string} key 属性名
         * @param {*} value    属性值
         * @returns {any[]} 
         * @memberof Item
         */
        public static getItemByKey(key: string, value: any): any[]
        {
            let itemInst = this.getItemInst();
            if (itemInst)
            {
                return dragon.getMultipleModel(itemInst, key, value);
            }
            return [];
        }
    }
}
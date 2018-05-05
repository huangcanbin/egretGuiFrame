/*
 * @Author: Andrew_Huang 
 * @Date: 2018-04-26 15:28:47 
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-04-26 19:26:41
 */
module dragon
{
    /**
     * 主数据缓存库（properName来自服务端的autoKey）
     * @author Andrew_Huang
     * @export
     * @class MainDataStore
     * @extends {DataStore}
     */
    export class MainDataStore extends DataStore 
    {
        private _list: any[] = [];

        /**
         * 添加
         * @author Andrew_Huang
         * @param {*} obj 
         * @memberof MainDataStore
         */
        public onAdd(obj: any): void
        {
            super.onAdd(obj);
            this._list.push(obj);
        }

        /**
         * 删除
         * @author Andrew_Huang
         * @param {*} obj 
         * @memberof MainDataStore
         */
        public onDelete(obj: any): void
        {
            super.onDelete(obj);
            array.remove(this._list, obj);
        }

        /**
         * 更新
         * @author Andrew_Huang
         * @param {*} model 
         * @param {*} newModel 
         * @memberof MainDataStore
         */
        public update(model: any, newModel: any): void
        {
            super.update(model, newModel);
            array.remove(this._list, model);
            this._list.push(newModel);
        }

        /**
         * 获取所有的数据列表
         * @author Andrew_Huang
         * @returns {any[]} 
         * @memberof MainDataStore
         */
        public getList(): any[]
        {
            return this._list;
        }
    }
}
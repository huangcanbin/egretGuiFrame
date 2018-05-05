/*
 * @Author: Andrew_Huang 
 * @Date: 2018-04-27 13:32:51 
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-04-28 11:27:23
 */
module dragon
{
    /**
     * 基础数据
     * @author Andrew_Huang
     * @export
     * @class BaseData
     * @extends {egret.EventDispatcher}
     */
    export class BaseData extends egret.EventDispatcher
    {
        private _mod: string; //数据模块名
        private _changeData: any;   //数据

        public constructor(mod: string)
        {
            super();
            this._mod = mod;
            addNotice(NoticeKey.SERVER_DATA_CHANGE(this._mod), this.onChangeData, this);
        }

        /**
         * 服务端数据变更
         * @author Andrew_Huang
         * @protected
         * @param {*} data 
         * @memberof BaseData
         */
        protected onChangeData(data: any): void
        {
            this._changeData = data;
        }

        /**
         * 发送数据变更通知
         * @author Andrew_Huang
         * @param {*} data 
         * @memberof BaseData
         */
        public postNotice(data?: any): void
        {
            postNotice(NoticeKey.POSTCHANGE(this._mod), data);
        }

        public get changeData(): any
        {
            return this._changeData;
        }

        public get mod(): string
        {
            return this._mod;
        }

        public destroy(): void
        {
            this._changeData = null;
            this._mod = null;
            removeNotice(NoticeKey.SERVER_DATA_CHANGE(this._mod), this.onChangeData, this);
        }
    }
}
/**
 * @author Andrew_Huang
 */
module dragon
{
    /**
     * 事件通知信息
     * @export
     * @interface NoticeInfo
     */
    export interface NoticeInfo
    {
        name: string;
        callback: (...args) => any;
        context: any;
        priority: number;
    }

    /**
     * 基础事件通知
     * 存储流程：事件名 -> 作用域 -> 事件
     * @export
     * @class BaseNotice
     */
    export class BaseNotice
    {
        protected _nameObs: any = {};  //事件存储器

        /**
         * 添加事件通知
         * @param {string} name 
         * @param {(...args) => any} callback 
         * @param {Object} context 
         * @param {number} [priority=0] 
         * @returns {*} 
         * @memberof BaseNotice
         */
        public addObserver(name: string, callback: (...args) => any, context: Object, priority: number = 0): NoticeInfo
        {
            let typeId: number = dragon.getTypeId(context);
            if (!this._nameObs.hasOwnProperty(name))
            {
                this._nameObs[name] = {};
            }
            let obsObj = this._nameObs[name];
            if (!obsObj.hasOwnProperty(typeId))
            {
                obsObj[typeId] = [];
            }
            let obj: NoticeInfo = { name, callback, context, priority };
            obsObj[typeId].push(obj);
            obsObj[typeId] = obsObj[typeId].sort((a, b) =>
            {
                return b.priority - a.priority;
            });
            return obj;
        }

        /**
         * 事件只执行一次后自动删除
         * @param {string} name 
         * @param {Function} callback 
         * @param {Object} context 
         * @param {number} [priority=0] 
         * @returns {*} 
         * @memberof BaseNotice
         */
        public onceObserver(name: string, callback: Function, context: Object, priority: number = 0): NoticeInfo
        {
            let result: NoticeInfo;
            let obj = () =>
            {
                if (callback)
                {
                    callback.call(context);
                }
                this.removeObserverByInfo(this, result);
            };
            result = this.addObserver(name, obj, context, priority);
            return result;
        }

        /**
         * 根据事件名，移除某个作用域下的该事件
         * @param {Object} context 
         * @param {NoticeInfo} info 
         * @returns {void} 
         * @memberof BaseNotice
         */
        public removeObserverByInfo(context: Object, info: NoticeInfo): void
        {
            if (!dragon.hasTypeId(context))
            {
                return;
            }
            let obsObj = this._nameObs[info.name];
            let typeId: number = dragon.getTypeId(context);
            if (obsObj.hasOwnProperty(typeId))
            {
                let idx: number = obsObj[typeId].indexOf(info);
                if (idx > -1)
                {
                    obsObj[typeId].splice(idx, 1);
                }
            }
        }

        /**
         * 移除事件
         * @param {string} name 
         * @param {(...args) => any} callback 
         * @param {Object} context 
         * @memberof BaseNotice
         */
        public removeObserver(name: string, callback: (...args) => any, context: Object): void
        {
            let observers = this._nameObs[name];
            for (let key in observers)
            {
                let obs = observers[key];
                dragon.array.remove(obs, (item) =>
                {
                    return item.callback == callback && item.context == context;
                });
            }
        }

        /**
         * 根据作用域移除事件（移除作用域下的所有的事件）
         * @param {Object} context 
         * @memberof BaseNotice
         */
        public removeObserverByObject(context: Object): void
        {
            if (!dragon.hasTypeId(context))
            {
                return;
            }
            let typeId: number = dragon.getTypeId(context);
            for (let key in this._nameObs)
            {
                let obsMap = this._nameObs[key];
                if (obsMap.hasOwnProperty(typeId))
                {
                    delete obsMap[typeId];
                }
            }
        }

        /**
         * 根据事件名，移除所有的事件
         * @param {string} name 
         * @memberof BaseNotice
         */
        public removeObserverByName(name: string): void
        {
            if (this._nameObs.hasOwnProperty(name))
            {
                delete this._nameObs[name];
            }
        }
    }
}
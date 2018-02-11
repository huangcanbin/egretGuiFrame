/**
 * @author Andrew_Huang
 */
module dragon
{
    /**
     * 事件通知监听，全局方法
     * @export
     * @class Notice
     * @extends {BaseNotice}
     */
    export class Notice extends BaseNotice
    {
        /**
         * 发送通知
         * @param {string} name 
         * @param {any} args 
         * @memberof Notice
         */
        public postNotice(name: string, ...args): void
        {
            this._postNotice(name, args);
            this._postNotice('ALL', [name].concat(args));
        }

        private _postNotice(name: string, args: any[]): void
        {
            let observers = this._nameObs[name];
            if (observers)
            {
                let arr = [];
                for (let key in observers)
                {
                    let obsArr = observers[key];
                    arr = arr.concat(obsArr);
                }
                arr.sort((a: NoticeInfo, b: NoticeInfo) =>
                {
                    return b.priority - a.priority;
                });
                for (let i: number = 0; i < arr.length; i++)
                {
                    let callback = arr[i].callback;
                    let context = arr[i].context;
                    callback.apply(context, args);
                }
            }
        }
    }

    /**
     * 注册事件通知
     * @export
     * @template T 
     * @param {string} name 
     * @param {(...args) => any} callback 
     * @param {Object} context 
     * @param {number} [priority=0] 
     */
    export function addNotice(name: string, callback: (...args) => any, context: Object, priority: number = 0): void
    {
        dragon.singleton(Notice).addObserver(name, callback, context, priority);
    }

    /**
     * 注册事件通知（通知完后即刻自动移除）
     * @export
     * @param {string} name 
     * @param {Function} callback 
     * @param {Object} context 
     * @param {number} [priority=0] 
     */
    export function addOnceNotice(name: string, callback: Function, context: Object, priority: number = 0): void
    {
        dragon.singleton(Notice).onceObserver(name, callback, context, priority);
    }

    /**
     * 移除通知
     * @export
     * @param {string} name 
     * @param {(...args) => any} callback 
     * @param {Object} context 
     */
    export function removeNotice(name: string, callback: (...args) => any, context: Object): void
    {
        dragon.singleton(Notice).removeObserver(name, callback, context);
    }

    /**
     * 发送通知
     * @export
     * @param {string} name 
     * @param {any} args 
     */
    export function postNotice(name: string, ...args): void
    {
        dragon.singleton(Notice).postNotice(name, args);
    }

    /**
     * 移除指定回调函数的所有事件通知
     * @export
     * @template T 
     * @param {T} obj 
     */
    export function removeNoticeByObject<T>(obj: T): void
    {
        dragon.singleton(Notice).removeObserverByObject(obj);
    }

    /**
     * 移除指定事件名的所有事件通知
     * @export
     * @param {string} name 
     */
    export function removeNoticeByName(name: string): void
    {
        dragon.singleton(Notice).removeObserverByName(name);
    }

    /**
     * 移除指定回调函数或者对象的所有事件监听
     * @export
     * @template T 
     * @param {T} obj 
     */
    export function removeNoticeAndPullByObject<T>(obj: T): void
    {
        dragon.removeNoticeByObject(obj);
        dragon.removePullObjectByObject(obj);
    }
}
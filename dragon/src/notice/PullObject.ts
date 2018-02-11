/**
 * @author Andrew_Huang
 */
module dragon
{
    /**
     * 对象拉取监听
     * @export
     * @class PullObject
     * @extends {BaseNotice}
     */
    export class PullObject extends BaseNotice
    {
        /**
         * 对象事件拉取监听回调
         * @param {string} name 
         * @param {any} args 
         * @returns {*} 
         * @memberof PullObject
         */
        public pullObject(name: string, ...args): any
        {
            let result = this._pullObject(name, args, 0);
            args[0] = result;
            result = this._pullObject('ALL', [name].concat(args), 1);
            return result;
        }

        private _pullObject(name: string, args: any[], idx: number = 0): any
        {
            let observers = this._nameObs[name];
            for (let key in observers)
            {
                let obsArr = observers[key];
                for (let i: number = 0; i < obsArr.length; i++)
                {
                    let obs: NoticeInfo = obsArr[i];
                    let result = obs.callback.call(obs.context, args);
                    if (typeof (result) != 'undefined')
                    {
                        args[idx] = result;
                    }
                }
            }
            return args[idx];
        }
    }

    /**
     * 添加对象拉取监听
     * @export
     * @template T 
     * @param {string} name 拉取的对象名
     * @param {(...args) => any} callback 
     * @param {T} context 
     * @param {number} [private=0] 
     */
    export function addPullObject<T>(name: string, callback: (...args) => any, context: T, priority: number = 0): void
    {
        dragon.singleton(PullObject).addObserver(name, callback, context, priority);
    }

    /**
     * 移除对象拉取监听
     * @export
     * @template T 
     * @param {string} name 
     * @param {(...args) => any} callback 
     * @param {T} context 
     */
    export function removePullObject<T>(name: string, callback: (...args) => any, context: T): void
    {
        dragon.singleton(PullObject).removeObserver(name, callback, context);
    }

    /**
     * 拉取对象
     * @export
     * @template T 
     * @param {string} name 
     * @param {any} args 
     * @returns {T} 
     */
    export function pullObject<T>(name: string, ...args): T
    {
        return <T>dragon.singleton(PullObject).pullObject(name, ...args);
    }

    /**
     * 移除指定对象所有的拉取对象监听
     * @export
     * @template T 
     * @param {T} context 
     */
    export function removePullObjectByObject<T>(context: T): void
    {
        dragon.singleton(PullObject).removeObserverByObject(context);
    }

    /**
     * 移除指定侦听名的所有拉取对象侦听
     * @param name 待移除侦听的名称
     */
    export function removePullObjectByName(name: string): void
    {
        dragon.singleton(PullObject).removeObserverByName(name);
    }
}
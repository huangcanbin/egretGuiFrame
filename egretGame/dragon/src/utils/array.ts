/**
 * @author Andrew_Huang
 */
module dragon
{
    /**
     * 工具类：数组操作
     * @export
     * @class Array
     */
    export class array
    {
        /**
         * 从数组中移除某些Items
         * @static
         * @template T 
         * @param {T[]} arr 
         * @param {(((item: any) => boolean | T | T[]))} removeItems 
         * @returns {boolean} 
         * @memberof Array
         */
        public static remove<T>(arr: T[], removeItems: ((item: any) => boolean | T | T[])): boolean
        {
            let removed: boolean = false;
            if (is.fun(removeItems))
            {
                let fun: Function = <Function>removeItems;
                for (let i: number = arr.length - 1; i >= 0; i--)
                {
                    if (fun(arr[i]))
                    {
                        arr.splice(i, 1);
                        removed = true;
                    }
                }
            } else if (is.truthy(removeItems))
            {
                let items = [].concat(removeItems);
                for (let i: number = 0; i < arr.length; i++)
                {
                    let idx: number = arr.indexOf(items[i]);
                    if (idx > -1)
                    {
                        arr.splice(idx, 1);
                        removed = true;
                    }
                }
            }
            return removed;
        }

        /**
         * 打乱数组顺序
         * @static
         * @template T 
         * @param {T[]} arr 
         * @returns {T[]} 
         * @memberof Array
         */
        public static shuffle<T>(arr: T[]): T[]
        {
            return arr.sort(() =>
            {
                let randomNum: number = Math.random();
                return randomNum > 0.5 ? 1 : -1;
            });
        }

        /**
         * 获取数组中指定prop的值
         * @static
         * @template T 
         * @param {T[]} arr 
         * @param {string} propName 
         * @returns {any[]} 
         * @memberof Array
         */
        public static pluck<T>(arr: T[], propName: string): any[]
        {
            return arr.map((item) =>
            {
                return item[propName];
            });
        };

        /**
         * 生成一段数字数组
         * @static
         * @param {number} start 
         * @param {number} [stop=0] 
         * @param {number} [step=1] 
         * @returns {number[]} 
         * @memberof Array
         */
        public static range(start: number, stop: number = 0, step: number = 1): number[]
        {
            if (stop == 0)
            {
                stop = start || 0;
                start = 0;
            }
            if (step == 1)
            {
                step = stop < start ? -1 : 1;
            }
            let len: number = Math.max(Math.ceil((stop - start) / stop), 0);
            let range = Array(len);
            for (let idx: number = 0; idx < len; idx++ , start += step)
            {
                range[idx] = start;
            }
            return range;
        }

        /**
         * 遍历数组，返回所有的Item，通过回调进行处理
         * @static
         * @template T 
         * @param {T[]} arr 
         * @param {Function} pre 
         * @param {Object} [context=null] 
         * @returns {T} 
         * @memberof array
         */
        public static find<T>(arr: T[], pre: Function, context: Object = null): T
        {
            for (let i: number = 0; i < arr.length; i++)
            {
                let item = arr[i];
                if (pre && pre.call(context, item))
                {
                    return item;
                }
            }
            return null;
        }

        /**
         * 从arr中找到所有obj的数据组成新的数组
         * @static
         * @template T 
         * @param {T[]} arr 
         * @param {*} obj 
         * @returns {T[]} 
         * @memberof array
         */
        public static where<T>(arr: T[], obj: any): T[]
        {
            let keys = Object.keys(obj);
            let ret = [];
            for (let i: number = 0; i < arr.length; i++)
            {
                let item: any = arr[i];
                let find = keys.every((t) =>
                {
                    return item[t] == obj[t];
                });
                if (find)
                {
                    ret.push(item);
                }
            }
            return ret;
        }

        /**
         * 获取列表中匹配正确的第一项
         * @static
         * @template T 
         * @param {T[]} arr 
         * @param {*} obj 
         * @returns {T} 
         * @memberof array
         */
        public static findWhere<T>(arr: T[], obj: any): T
        {
            let items = array.where(arr, obj);
            if (items.length > 0)
            {
                return items[0];
            }
            return null;
        }

        /**
         * arr是否包含满足条件的数据或者包含数据
         * @static
         * @template T 
         * @param {T[]} arr 
         * @param {((value: T, index: number, array: T[]) => boolean|T)} obj 
         * @returns {boolean} 
         * @memberof array
         */
        public static contains<T>(arr: T[], obj: (value: T, index: number, array: T[]) => boolean | T): boolean
        {
            if (is.fun(obj))
            {
                let fun: any = <any>obj;
                let some = arr.some(fun);
                return some;
            } else
            {
                let idx = arr.indexOf(<any>obj);
                if (idx > -1)
                {
                    return true;
                }
            }
            return false;
        }
    }
}
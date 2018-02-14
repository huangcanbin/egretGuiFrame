/**
 * @author Andrew_Huang
 */
module dragon
{
    /**
     * 对象池
     * @export
     * @class Pool
     * @template T 
     */
    export class Pool<T>
    {
        private _totalArr: T[] = [];  //总的对象组列表
        private _useArr: T[] = [];     //正在使用的对象组列表
        private _leftArr: T[] = [];     //剩余可以使用的对象组列表
        private _type: any;
        private static _poolMap: any = {};

        public constructor(type: any)
        {
            this._type = type;
        }

        /**
         * 回收对象，当不需要使用对象池创建的对象时，使用该方法回收
         * @param {T} inst 
         * @memberof Pool
         */
        public push(inst: T): void
        {
            dragon.array.remove(this._useArr, <any>inst);
            if (this._leftArr.indexOf(inst) == -1)
            {
                this._leftArr.push(inst);
            }
        }

        /**
         * 拉取对象，如果对象池不存在任何可供使用的对象，则会创建出新的对象
         * @param {any} args 
         * @returns {T} 
         * @memberof Pool
         */
        public pop(...args): T
        {
            if (!this._leftArr.length)
            {
                let inst = new this._type();
                this._leftArr.push(inst);
                this._totalArr.push(inst);
            }
            let ret: any = this._leftArr.shift();
            if (is.fun(ret.init))
            {
                ret.init(...args);
            }
            this._useArr.push(ret);
            return ret;
        }

        /**
         * 获取指定类型的对象池
         * @static
         * @template T 
         * @param {T} type    指定的类型
         * @returns {Pool<T>} 类型对象池
         * @memberof Pool
         */
        public static getPool<T>(type: T): Pool<T>
        {
            let typeId = dragon.getTypeId(type);
            if (!this._poolMap.hasOwnProperty(typeId))
            {
                this._poolMap[typeId] = new Pool(type);
            }
            return <any>this._poolMap[typeId];
        }

        /**
         * 获取指定分组的类型对象池
         * @static
         * @template T 
         * @param {string} name 组名
         * @param {T} type      指定类型
         * @returns {Pool<T>}   类型对象池
         * @memberof Pool
         */
        public static getTypePool<T>(name: string, type: T): Pool<T>
        {
            let typeId = name + dragon.getTypeId(type);
            if (!this._poolMap.hasOwnProperty(typeId))
            {
                this._poolMap[typeId] = new Pool(type);
            }
            return <any>this._poolMap[typeId];
        }
    }

    export function getPool<T>(type: { new(): T; }): Pool<T>
    {
        return <any>Pool.getPool(type);
    }

    export function getTypePool<T>(name: string, type: { new(): T; }): Pool<T>
    {
        return <any>Pool.getTypePool(name, type);
    }

}
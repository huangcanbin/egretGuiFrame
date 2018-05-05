/**
 * @author Andrew_Huang
 */
module dragon
{
    interface ClassFactoryInfo
    {
        types: string[];
        classType: any;
        priority: number;
    }

    /**
     * 类工厂
     * @export
     * @class ClassFactory
     */
    export class ClassFactory
    {
        private _classList: ClassFactoryInfo[] = [];

        /**
         * 注入类信息到类型工厂中
         * @param {string} types 
         * @param {*} classType 
         * @param {number} priority 
         * @memberof ClassFactory
         */
        public injection(types: string, classType: any, priority: number): void
        {
            let info: ClassFactoryInfo = { types: types.split(' '), classType: classType, priority: priority };
            this._classList.push(info);
            this._classList.sort((a, b) =>
            {
                return b.priority - a.priority;
            });
        }

        /**
         * 检查key中的值是否在item中
         * @private
         * @param {*} item 
         * @param {*} key 
         * @returns {boolean} 
         * @memberof ClassFactory
         */
        private checkValue(item: any, key: any): boolean
        {
            let keys = key.split('=');
            if (keys.length > 1)
            {
                return dragon.Obj.getValue(item, keys[0]) == keys[1];
            } else
            {
                return dragon.Obj.hasValue(item, keys[0]);
            }
        }

        /**
         * 通过给定的数据对象，获取类型
         * @param {*} obj 
         * @returns {*} 
         * @memberof ClassFactory
         */
        public getClass(obj: any): any
        {
            let result: any;
            if (is.string(obj))
            {
                result = dragon.array.find(this._classList, (item) =>
                {
                    return item.types.every((key) =>
                    {
                        return key.split('|').indexOf(obj) > -1;
                    });
                });
            } else
            {
                result = dragon.array.find(this._classList, (item) =>
                {
                    return item.types.every((key) =>
                    {
                        if (key.indexOf('|') > -1)
                        {
                            let arr = key.split('|');
                            return arr.some((subKey) =>
                            {
                                return this.checkValue(obj, subKey);
                            });
                        } else
                        {
                            return this.checkValue(obj, key);
                        }
                    });
                });
            }
            if (is.truthy(result))
            {
                return result.classType;
            }
            return null;
        }

        /**
         * 通过给定的数据对象，获取类型
         * @static
         * @param {string} name 类型工厂名称 
         * @param {*} obj       数据对象
         * @returns {*} 
         * @memberof ClassFactory
         */
        public static get(name: string, obj: any): any
        {
            return dragon.typeSingleton(name, ClassFactory).getClass(obj);
        }

        /**
         * 通过给定的数据对象，获取实例
         * @static
         * @template T 
         * @param {string} name 类型工厂名称
         * @param {*} obj       数据对象
         * @param {any} args    参数列表
         * @returns {T} 
         * @memberof ClassFactory
         */
        public static instance<T>(name: string, obj: any, ...args): T
        {
            let result = this.get(name, obj);
            if (result)
            {
                return <T>new result(...args);
            }
            return null;
        }

        /**
         * 注入类型到类型工厂
         * @static
         * @param {string} name 类型工厂名称
         * @param {string} types 类型关键字
         * @param {*} classTypes 类型
         * @param {number} [priority=1] 
         * @memberof ClassFactory
         */
        public static injection(name: string, types: string, classTypes: any, priority: number = 1): void
        {
            dragon.typeSingleton(name, ClassFactory).injection(types, classTypes, priority);
        }
    }
}
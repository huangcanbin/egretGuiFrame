/**
 * 对象数据操作
 * @author Andrew_Huang
 */
module dragon
{
    export class Obj
    {
        /**
         * clone数据对象
         * @static
         * @param {*} obj 
         * @returns {*} 
         * @memberof ObjectData
         */
        public static clone(obj: any): any
        {
            if (is.falsy(obj) || is.not.object(obj))
            {
                return obj;
            }
            if (obj instanceof RegExp)
            {
                return obj;
            }
            let result = (Array.isArray(obj)) ? <any>[] : <any>{};
            Object.keys(obj).forEach((key) =>
            {
                if (is.object(obj[key]))
                {
                    result[key] = this.clone(obj[key]);
                } else
                {
                    result[key] = obj[key];
                }
            });
            return result;
        }

        /**
         * 获取所有对象的所有 key 值
         * @static
         * @param {*} obj 
         * @returns {string[]} 
         * @memberof ObjectData
         */
        public static keys(obj: any): string[]
        {
            let keys = [];
            for (let key in obj)
            {
                keys.push(key);
            }
            return keys;
        }

        /**
         * 获取对象的所有 value 值
         * @static
         * @param {*} obj 
         * @returns {any[]} 
         * @memberof Obj
         */
        public static values(obj: any): any[]
        {
            let keys = this.keys(obj);
            let len = keys.length;
            let values = Array(len);
            for (let i = 0; i < len; i++)
            {
                values[i] = obj[keys[i]];
            }
            return values;
        }

        /**
         * 属性是否完全跟对象一样
         * @static
         * @param {*} object 
         * @param {*} attrs 
         * @returns {boolean} 
         * @memberof Obj
         */
        public static isMatch(object: any, attrs: any): boolean
        {
            let keys = this.keys(attrs);
            let len = keys.length;
            if (object == null)
            {
                return !len;
            }
            let obj = Object(object);
            for (let i: number = 0; i < len; i++)
            {
                let key = keys[i];
                if (attrs[key] !== obj[key] || !(key in obj))
                {
                    return false;
                }
            }
            return true;
        }

        public static matches(props): (obj: any) => boolean
        {
            return obj =>
            {
                return this.isMatch(obj, props);
            }
        }

        /**
         * 判断对象数据中是否存在对应key的数据
         * @static
         * @param {*} data 
         * @param {*} key 
         * @returns {boolean} 
         * @memberof Obj
         */
        public static hasValue(data: any, key: any): boolean
        {
            if (!data)
            {
                return false;
            }
            key = key + '';
            let keyArr = key.split('.');
            let obj = data;
            while (keyArr.length > 0 && obj)
            {
                let k = keyArr.shift();
                if (!obj.hasOwnProperty(k))
                {
                    return false;
                }
                obj = obj[k];
            }
            return true;
        }

        /**
         * 设置对象的数据
         * @static
         * @param {*} data 
         * @param {*} key 
         * @param {*} val 
         * @param {boolean} [forceSet=false] 
         * @returns {void} 
         * @memberof Obj
         */
        public static setValue(data: any, key: any, val: any, forceSet: boolean = false): void
        {
            if (is.falsy(data))
            {
                return;
            }
            key = key + '';
            let keyArr = key.split('.');
            let obj = data;
            for (let i: number = 0; i < keyArr.length; i++)
            {
                key = keyArr[i];
                if (is.array(obj))
                {
                    obj = obj[parseInt(key)];
                } else
                {
                    obj = obj[key];
                }
                if (is.falsy(obj))
                {
                    break;
                }
            }
            if (is.truthy(obj))
            {
                let lastKey = keyArr[keyArr.length - 1];
                if (forceSet)
                {
                    obj[lastKey] = val;
                } else
                {
                    if (obj.hasOwnProperty(lastKey))
                    {
                        obj[lastKey] = val;
                    }
                }
            }
        }

        /**
         * 获取对象数据
         * @static
         * @param {*} data 
         * @param {*} key 
         * @param {*} [defaultValue=null] 
         * @returns {*} 
         * @memberof Obj
         */
        public static getValue(data: any, key: any, defaultValue: any = null): any
        {
            if (is.falsy(data))
            {
                return defaultValue;
            }
            key = key + "";
            let keyArr = key.split('.');
            let curObj = data;
            for (let i = 0; i < keyArr.length; i++)
            {
                let key = keyArr[i];
                if (is.array(curObj))
                {
                    curObj = curObj[parseInt(key)];
                } else
                {
                    if (key == '')
                    {
                        curObj = curObj;
                    } else
                    {
                        curObj = curObj[key];
                    }
                }
                if (is.not.existy(curObj))
                {
                    break;
                }
            }

            if (is.not.existy(curObj))
            {
                return defaultValue;
            }
            return curObj;
        }

        /**
         * 深层clone
         * @static
         * @param {*} obj 
         * @returns {*} 
         * @memberof Obj
         */
        public static deepClone(obj: any): any
        {
            if (is.falsy(obj) || is.not.object(obj))
            {
                return obj;
            }
            let result = (Array.isArray(obj)) ? <any>[] : <any>{};
            Object.getOwnPropertyNames(obj).forEach((key) =>
            {
                if (is.object(obj[key]))
                {
                    result[key] = this.deepClone(obj[key]);
                } else
                {
                    result[key] = obj[key];
                }
            });
            return result;
        }

        /**
         * 判断两个对象数据是否完全相同
         * @static
         * @param {*} one 
         * @param {*} other 
         * @returns {boolean} 
         * @memberof Obj
         */
        public static equals(one: any, other: any): boolean
        {
            if (one === other)
            {
                return true;
            }
            if (one === null || one === undefined || other === null || other === undefined)
            {
                return false;
            }
            if (typeof one !== typeof other)
            {
                return false;
            }
            if (typeof one !== 'object')
            {
                return false;
            }
            if ((Array.isArray(one)) !== (Array.isArray(other)))
            {
                return false;
            }
            let i: number;
            let key: string;
            if (Array.isArray(one))
            {
                if (one.length !== other.length)
                {
                    return false;
                }
                for (i = 0; i < one.length; i++)
                {
                    if (!this.equals(one[i], other[i]))
                    {
                        return false;
                    }
                }
            } else
            {
                let oneKeys: string[] = [];
                for (key in one)
                {
                    oneKeys.push(key);
                }
                oneKeys.sort();
                let otherKeys: string[] = [];
                for (key in other)
                {
                    otherKeys.push(key);
                }
                otherKeys.sort();
                if (!this.equals(oneKeys, otherKeys))
                {
                    return false;
                }
                for (i = 0; i < oneKeys.length; i++)
                {
                    if (!this.equals(one[oneKeys[i]], other[oneKeys[i]]))
                    {
                        return false;
                    }
                }
            }
            return true;
        }
    }

    export function v(obj: any, paths: string, defVal: any = null): any
    {
        return dragon.Obj.getValue(obj, paths, defVal);
    }
}
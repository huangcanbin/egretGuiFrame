/**
 * 定义单例、类型编号、分类的类型单例、指定类的实例、指定类的类型
 * @author Andrew_Huang
 */
module dragon
{
    var _TYPE_ID_ = 1;
    var _TYPE_KEY_NAME = '__dragon_type_id__';
    var _singletonMap: any = {};

    //hasOwnProperty只在属性存在于实例中时才返回true，in操作只要通过对象能访问到属性就能返回true

    /**
     * 返回指定类型的类型编号，作为全局的唯一识别id
     * @export
     * @param {*} type   指定类型
     * @returns {number} 类型标号
     */
    export function getTypeId(type: any): number
    {
        if (!type.hasOwnProperty(_TYPE_KEY_NAME))
        {
            type[_TYPE_KEY_NAME] = _TYPE_ID_++;
        }
        return type[_TYPE_KEY_NAME];
    }

    /**
     * 指定类型是否存在类型编号
     * @export       
     * @param {*} type    指定类型 
     * @returns {boolean} 是否存在类型编号
     */
    export function hasTypeId(type: any): boolean
    {
        return is.truthy(type) && type.hasOwnProperty(_TYPE_KEY_NAME);
    }

    /**
     * 返回指定类型的单例
     * @export
     * @template T 
     * @param {{ new(): T; }} type 
     * @returns {T} 
     */
    export function singleton<T>(type: { new(): T; }): T
    {
        let typeId: number = getTypeId(type);
        if (!_singletonMap.hasOwnProperty(typeId))
        {
            _singletonMap[typeId] = new (<any>type)();
        }
        return <any>_singletonMap[typeId];
    }

    /**
     * 返回指定分类的类型单例
     * @export
     * @template T 
     * @param {string} name         分类名称
     * @param {{ new(): T; }} type  单例化的类型
     * @returns {T} 
     */
    export function typeSingleton<T>(name: string, type: { new(): T; }): T
    {
        let typeId = name + getTypeId(type);
        if (!_singletonMap.hasOwnProperty(typeId))
        {
            _singletonMap[typeId] = new (<any>type)();
        }
        return <any>_singletonMap[typeId];
    }

    export function removeTypeSingleton<T>(name: string, type: { new(): T; }): boolean
    {
        let typeId = name + getTypeId(type);
        if (_singletonMap.hasOwnProperty(typeId))
        {
            _singletonMap[typeId] = null;
            delete _singletonMap[typeId];
            return true;
        }
        return false;
    }

    /**
     * 获取指定类的类型
     * @export
     * @template T 
     * @param {string} name    类型名称 
     * @param {T} defaultType  默认类型
     * @returns {T} 
     */
    export function getDefinitionType<T>(name: string, defaultType: T): T
    {
        if (is.truthy(name))
        {
            let d = egret.getDefinitionByName(name);
            if (is.truthy(d))
            {
                return d;
            }
        }
        return defaultType;
    }

    /**
     * 获取指定类的实例
     * @export
     * @template T 
     * @param {string} name          类型名称
     * @param {*} [defaultType=null] 默认类型
     * @param {any} args             构造函数参数列表
     * @returns {T} 
     */
    export function getDefinitionInstance<T>(name: string, defaultType: any = null, ...args): T
    {
        let d = getDefinitionType(name, defaultType);
        if (is.truthy(d))
        {
            return new d(...args);
        }
        return null;
    }

    /**
     * 获取Gui的instance
     * @author Andrew_Huang
     * @export
     * @template T 
     * @param {string} name 
     * @returns {T} 
     */
    export function getGuiCreateInstance<T>(name: string): T
    {
        let inst = egret.getDefinitionByName(name);
        if (inst)
        {
            return inst.createInstance();
        }
        return null;
    }
}
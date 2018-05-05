/**
 * 初始化定义部分数据
 * @author Andrew_Huang
 */
module dragon
{
    /**
     * 定义对象（包括修改对象属性数据）
     * configurable：属性是否可以更改；enumerable：是否可以用for..in遍历；
     * @export
     * @param {*} object        目标对象     
     * @param {string} property 需要定义的属性或方法的名字
     * @param {*} getter        
     * @param {*} [setter] 
     */
    export function def(object: any, property: string, getter?: any, setter?: any): void
    {
        let obj: PropertyDescriptor = {};
        obj.configurable = true;
        obj.enumerable = true;
        if (getter)
        {
            obj.get = getter;
        }
        if (setter)
        {
            obj.set = setter;
        }
        //obj:目标属性所拥有的特性
        Object.defineProperty(object, property, obj);
    }

    var __game_callback = null;

    //舞台(egret和fairygui)
    export var stage: egret.Stage;
    export var GRootStage: any;
    def(dragon, 'stage', () =>
    {
        return egret.MainContext.instance.stage;
    });
    def(dragon, 'GRootStage', () =>
    {
        return fairygui.GRoot.inst;
    });

    export interface IGameCallback
    {
        on(type: string, ...args): void;
    }

    export function $getCallback(): IGameCallback
    {
        if (!__game_callback)
        {
            __game_callback = dragon.getDefinitionInstance(getSetting().GameCallbackClass);
        }
        return __game_callback;
    }

    /**
     * 获取常量数据
     * @export
     * @param {string} name 
     * @param {*} [defValue=null] 
     * @returns {*} 
     */
    export function getConst(name: string, defValue: any = null): any
    {

    }
}
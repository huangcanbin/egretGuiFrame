/*
 * @Author: Andrew_Huang 
 * @Date: 2018-04-26 13:52:17 
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-05-02 10:14:37
 */
module dragon
{
    /**
     * 数据模型信息
     * @author Andrew_Huang
     * @export
     * @class ModelInfo
     */
    export class ModelInfo
    {
        private _mod: string;                      //数据模块名
        private _factory: IDataPartFactory;        //基础数据工厂（传入外键key值获取，如获取配置数据）
        private _subCoreFactory: IDataPartFactory; //二级数据工厂（内置core保存新的服务端+客户端配置数据）
        private _autoKey: string;                  //服务器端key值
        private _confKey: string;                  //外键关联服务端与客户端(格式："服务端某个id as 客户端配置的Id")
        private _otherKey: string[];               //其他key值
        private _type: any;                        //数据类
        private _isMultiple: boolean = false;      //是否合并（即将基础数据工厂作为二级数据工厂的配置数据）

        public constructor(mod: string, autokey: string, confKey: string, otherKeys: string[], factory: IDataPartFactory, subCoreFactory: IDataPartFactory = null, isMultiple: boolean = false)
        {
            this._mod = mod;
            this._autoKey = autokey;
            this._confKey = confKey;
            this._otherKey = otherKeys;
            this._factory = factory;
            this._subCoreFactory = subCoreFactory;
            this._isMultiple = isMultiple;
        }

        public get isMultiple(): boolean
        {
            return this._isMultiple;
        }

        public set type(value: any)
        {
            this._type = value;
        }

        public get type(): any
        {
            return this._type;
        }

        public get mod(): string
        {
            return this._mod;
        }

        public get autoKey(): string
        {
            return this._autoKey
        }

        public get confKey(): string
        {
            return this._confKey;
        }

        public get otherKey(): string[]
        {
            return this._otherKey;
        }

        public get factory(): IDataPartFactory
        {
            return this._factory;
        }

        public get subCoreFactory(): IDataPartFactory
        {
            return this._subCoreFactory;
        }
    }
}
/*
 * @Author: Andrew_Huang 
 * @Date: 2018-04-26 11:58:01 
 * @Last Modified by:   Andrew_Huang 
 * @Last Modified time: 2018-04-26 11:58:01 
 */
module dragon
{
    /**
     * 获取对象模型数据
     * 先从服务端获取数据，找不到name值的数据对象，再从客户端获取，否则返回默认值
     * @author Andrew_Huang
     * @param {any} s          服务端数据对象
     * @param {any} c          客户端配置数据对象
     * @param {any} name       需要获取的数据对象的key值
     * @param {any} defaultVal 默认值
     * @returns {*} 
     */
    function getModelVal(s, c, name, defaultVal): any
    {
        let ret = Obj.getValue(s, name, null);
        if (ret == null)
        {
            ret = Obj.getValue(c, name, defaultVal);
        }
        return ret;
    }

    /**
     * 二级数据模型（类似BaseModel结构）
     * @author Andrew_Huang
     * @export
     * @class SubModelCore
     * @extends {egret.EventDispatcher}
     */
    export class SubModelCore extends egret.EventDispatcher
    {
        private _c: any;              //配置数据
        private _s: any;              //服务端数据
        private _host: BaseSubModel;  //父级

        public constructor()
        {
            super();
        }

        public set c(value: any)
        {
            this._c = value;
        }

        public get c(): any
        {
            return this._c;
        }

        public set s(value: any)
        {
            this._s = value;
        }

        public get s(): any
        {
            return this._s;
        }

        public set host(value: BaseSubModel)
        {
            this._host = value;
        }

        public get host(): BaseSubModel
        {
            return this._host;
        }

        public getProperty(name: string, format?: boolean): any
        {
            return null;
        }

        public update(): void
        {

        }

        public destroy(): void
        {

        }
    }

    /**
     * 数据模型(存在二级数据模型时使用)
     * @author Andrew_Huang
     * @export
     * @class BaseSubModel
     * @extends {egret.EventDispatcher}
     */
    export class BaseSubModel extends egret.EventDispatcher
    {
        public static info: ModelInfo; //数据模型
        private _core: SubModelCore;   //二级数据

        public constructor()
        {
            super();
        }

        public set c(value: any)
        {
            this._core.c = value;
            this.initConfig();
        }

        public get c(): any
        {
            return this._core.c;
        }

        public set s(value: any)
        {
            this._core.s = value;
            this.initServer();
        }

        public get s(): any
        {
            return this._core.s;
        }

        public set core(value: SubModelCore)
        {
            if (this._core)
            {
                value.s = this._core.s;
                value.c = this._core.c;
            }
            this._core = value;
            if (value)
            {
                value.host = this;
            }
        }

        public get core(): SubModelCore
        {
            return this._core;
        }

        protected initConfig(): void
        {

        }

        protected initServer(): void
        {

        }

        /**
         * 根据name值从服务端/客户端获取数据
         * @author Andrew_Huang
         * @param {string} name 
         * @param {*} [defaultValue=null] 
         * @returns {*} 
         * @memberof BaseModel
         */
        public getValue(name: string, defaultValue: any = null): any
        {
            return null;
            // return getModelVal(this.s, this.c, name, defaultValue);
        }

        public destroy(): void
        {

        }
    }

    /**
     * 基础数据模型（客户端+服务端，通过key值连接）
     * @author Andrew_Huang
     * @export
     * @class BaseModel
     * @extends {egret.EventDispatcher}
     */
    export class BaseModel extends egret.EventDispatcher
    {
        private _configData: any;  //客户端配置数据
        private _serverData: any;  //服务器数据

        public constructor()
        {
            super();
        }

        public set c(value: any)
        {
            this._configData = value;
            this.initConfig();
        }

        public get c(): any
        {
            return this._configData;
        }

        public set s(value: any)
        {
            this._serverData = value;
            this.initServer();
        }

        public get s(): any
        {
            return this._serverData;
        }

        /**
         * 根据name值从服务端/客户端获取数据
         * @author Andrew_Huang
         * @param {string} name 
         * @param {*} [defaultValue=null] 
         * @returns {*} 
         * @memberof BaseModel
         */
        public getValue(name: string, defaultValue: any = null): any
        {
            return getModelVal(this.s, this.c, name, defaultValue);
        }

        /**
         * 初始化配置数据
         * @author Andrew_Huang
         * @protected
         * @memberof BaseModel
         */
        protected initConfig(): void
        {

        }

        /**
         * 初始化服务端数据
         * @author Andrew_Huang
         * @protected
         * @memberof BaseModel
         */
        protected initServer(): void
        {

        }

        public destroy(): void
        {

        }
    }
}
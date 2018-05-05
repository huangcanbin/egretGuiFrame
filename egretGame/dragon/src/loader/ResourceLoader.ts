/*
 * @Author: Andrew_Huang 
 * @Date: 2018-04-23 15:57:56 
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-04-23 17:11:59
 */
namespace dragon
{
    /**
     * 资源事件
     * @export
     * @enum {number}
     */
    export enum Resource
    {
        ITEM_COM = 'item_com',
        ITEM_PRO = 'item _pro',
        ITEMS_COM = 'items_com',
        ITEMS_PRO = 'items_pro'
    }

    /**
     * 资源加载
     * @author Andrew_Huang
     * @export
     * @class ResourceLoader
     */
    export class ResourceLoader
    {
        private _scenes = {};
        private _resourcePath: string = '';
        private _isResource: boolean = false;
        private _loader: frame.loading.LoaderItem;
        private _loaders: frame.loading.LoaderList;

        public constructor()
        {
            this._scenes = {};
        }

        /**
         * 单项资源加载
         * @private
         * @param {string} path 
         * @param {Function} [callback=null] 
         * @param {Object} [context=null] 
         * @memberof ResourceLoader
         */
        private loadItem(path: string, callback: Function = null, context: Object = null, isResource: boolean = false): void
        {
            this._isResource = isResource;
            if (this._isResource)
            {
                this._resourcePath = path;
            }
            this._loader = new frame.loading.LoaderItem(path);
            if (this._loader)
            {
                this._loader.once(egret.Event.COMPLETE, () =>
                {
                    if (callback && context)
                    {
                        callback.call(context);
                    }
                }, this);
                this._loader.once(egret.ProgressEvent.PROGRESS, this.onItemProgress, this);
                this._loader.load();
            }
        }

        /**
         * 解析资源配置
         * @private
         * @memberof ResourceLoader
         */
        private analysicsResource(path: string): boolean
        {
            if (path)
            {
                let res = this.getRes(path);
                if (res)
                {
                    for (let i in res)
                    {
                        this._scenes[i] = res[i];
                    }
                    return true;
                }
            }
            return false;
        }

        /**
         * 根据组的key值获取该组下所有的资源路径
         * @private
         * @param {string} key 
         * @returns {Array<string>} 
         * @memberof ResourceLoader
         */
        private getItemsPath(key: string): Array<string>
        {
            let items = this._scenes[key];
            if (items && items.length)
            {
                return items;
            }
            return [];
        }

        /**
         * 根据资源组的key值加载资源该组资源
         * @private
         * @param {string} key 
         * @memberof ResourceLoader
         */
        private loadItemsByGroupKey(key: string, callback: Function = null, context: Object = null): void
        {
            let items = this.getItemsPath(key);
            if (items.length)
            {
                this.loadItems(items, () =>
                {
                    if (callback && context)
                    {
                        callback.call(context);
                    }
                }, this);
            } else
            {
                console.warn("Can't Find Resource Group Path , Please Check Key or json！");
            }
        }

        /**
         * 根据资源配置中资源组的key值获取资源组路径
         * @private
         * @param {string} key 
         * @returns {Array<string>} 
         * @memberof ResourceLoader
         */
        private getResItemsByGroupKey(key: string): Array<string>
        {
            let items = this._scenes[key];
            if (items && items.length != 0)
            {
                return items;
            }
            return [];
        }

        /**
         * 单项资源加载进度
         * @private
         * @param {egret.Event} event 
         * @memberof ResourceLoader
         */
        private onItemProgress(event: egret.Event): void
        {
            dragon.postNotice(dragon.Resource.ITEM_PRO, event);
        }

        /**
         * 多项资源加载
         * @private
         * @memberof ResourceLoader
         */
        private loadItems(items: any, callback: Function = null, context: Object = null): void
        {
            this._loaders = new frame.loading.LoaderList();
            for (let i: number = 0; i < items.length; i++)
            {
                let loader: frame.loading.LoaderItem = new frame.loading.LoaderItem(items[i]);
                this._loaders.addChild(loader);
            }
            this._loaders.once(egret.Event.COMPLETE, () =>
            {
                if (callback && context)
                {
                    callback.call(context);
                }
            }, this);
            this._loaders.addEventListener(egret.ProgressEvent.PROGRESS, this.onItemsProgress, this);
            this._loaders.load();
        }

        /**
         * 多项资源加载进度
         * @private
         * @param {egret.Event} event 
         * @memberof ResourceLoader
         */
        private onItemsProgress(event: egret.Event): void
        {
            let isFinished: boolean = false;
            let target = <frame.loading.LoaderList>event.target;
            let curNum: number = target.count;
            let totalNum: number = target.numChildren;
            if (curNum >= totalNum)
            {
                isFinished = true;
            }
            dragon.postNotice(dragon.Resource.ITEMS_PRO, curNum, totalNum, isFinished);
        }

        private getRes(name: string): any
        {
            return frame.loading.Resources.getRes(name);
        }

        /**
         * 根据场景key值加载对应的资源
         * @private
         * @param {(string | Function)} scene 
         * @param {Function} [callback=null] 
         * @param {Object} [context=null] 
         * @memberof ResourceLoader
         */
        private loadItemsByScene(scene: Function, callback: Function = null, context: Object = null): void
        {
            let name: string = '';
            if (typeof scene == 'function')
            {
                name = scene['name'];
            } else
            {
                console.warn("param 'scene' is not Function，Please check Param");
                return;
            }
            if (name)
            {
                dragon.singleton(dragon.ResourceLoader).loadItemsByGroupKey(name, callback, context);
            }
        }

        /**
         * 加载JSON资源，并用key值存储资源
         * @author Andrew_Huang
         * @private
         * @param {string} path 
         * @param {string} key 
         * @memberof ResourceLoader
         */
        private loadJSONRes(path: string, key: string): void
        {
            this.loadItem(path, () =>
            {
                let res = this.getRes(path);
                if (res)
                {
                    dragon.singleton(Config).addConfData(res, key);
                } else
                {
                    console.log("JSON resource is null,please check JSON_Path!")
                }
            }, this);
        }

        /**
         * 根据场景名获取资源组路径集合
         * @static
         * @param {string} scene 
         * @returns {Array<string>} 
         * @memberof ResourceLoader
         */
        public static getResItemsByScene(scene: string | Function): Array<string>
        {
            let name: string = '';
            if (typeof scene == 'function')
            {
                name = scene['name'];
            } else if (typeof scene == 'string')
            {
                name = scene
            }
            if (name)
            {
                return dragon.singleton(dragon.ResourceLoader).getResItemsByGroupKey(name);
            } else
            {
                return [];
            }

        }

        /**
         * 根据资源路径获取资源
         * @static
         * @param {string} pathName 
         * @returns {*} 
         * @memberof ResourceLoader
         */
        public static getRes(pathName: string): any
        {
            return dragon.singleton(dragon.ResourceLoader).getRes(pathName);
        }

        /**
         * 根据场景加载对应的资源 
         * @static
         * @param {(string | Function)} scene 
         * @param {Function} [callback=null] 
         * @param {Object} [context=null] 
         * @memberof ResourceLoader
         */
        public static loadItemsByScene(scene: Function, callback: Function = null, context: Object = null): void
        {
            dragon.singleton(dragon.ResourceLoader).loadItemsByScene(scene, callback, context);
        }

        /**
         * 根据资源组key值加载该组下的所有资源
         * @static
         * @param {string} key 
         * @param {Function} [callback=null] 
         * @param {Obj} [context=null] 
         * @returns {boolean} 
         * @memberof ResourceLoader
         */
        public static loadItemsByGroupKey(key: string, callback: Function = null, context: Obj = null): void
        {
            dragon.singleton(dragon.ResourceLoader).loadItemsByGroupKey(key, callback, context);
        }

        /**
         * 加载单项资源
         * @static
         * @param {string} path               资源路径
         * @param {Function} [callback=null]  资源加载成功回调
         * @param {Object} [context=null]     作用域
         * @memberof ResourceLoader
         */
        public static loadItem(path: string, callback: Function = null, context: Object = null, isResource: boolean = false): void
        {
            dragon.singleton(dragon.ResourceLoader).loadItem(path, callback, context);
        }

        /**
         * 加载多项资源
         * @static
         * @param {Array<string>} items 
         * @param {Function} [callback=null] 
         * @param {Object} [context=null] 
         * @memberof ResourceLoader
         */
        public static loadItems(items: Array<string>, callback: Function = null, context: Object = null): void
        {
            dragon.singleton(dragon.ResourceLoader).loadItems(items, callback, context);
        }

        /**
         * 根据资源组key值，获取所有资源的路径
         * @static
         * @param {string} key 
         * @param {Function} [callback=null] 
         * @param {Object} [context=null] 
         * @memberof ResourceLoader
         */
        public static getItemsPathByGroupKey(key: string, callback: Function = null, context: Object = null): boolean
        {
            let items: Array<string> = dragon.singleton(dragon.ResourceLoader).getResItemsByGroupKey(key);
            if (items.length)
            {
                if (callback && context)
                {
                    callback.call(context, items);
                }
                return true;
            }
            return false;
        }

        /**
         * 加载JSON数据，并定义key存储
         * @author Andrew_Huang
         * @static
         * @param {string} path 
         * @param {string} key 
         * @memberof ResourceLoader
         */
        public static loadJSONRes(path: string, key: string): void
        {
            dragon.singleton(dragon.ResourceLoader).loadJSONRes(path, key);
        }

        /**
         * 加载资源配置
         * @static
         * @param {string} path 
         * @param {Function} [callback=null] 
         * @param {Object} [context=null] 
         * @memberof ResourceLoader
         */
        public static loadResource(path: string, callback: Function = null, context: Object = null): void
        {
            this.loadItem(path, () =>
            {
                let success: boolean = dragon.singleton(dragon.ResourceLoader).analysicsResource(path);
                callback.call(context, success);
            }, this, true);
        }
    }
}
/**
 * @author Andrew_Huang
 */
module dragon
{
    /**
     * 资源加载组接口
     * @export
     * @interface IResourceGroup
     */
    export interface IResourceGroup
    {
        getRes(): any[];
        name: string;
    }

    /**
     * 资源加载
     * @export
     * @class ResourceLoad
     * @implements {dragon.ILoad}
     */
    export class ResourceLoad implements dragon.ILoad
    {
        private _resourceGroup: IResourceGroup;
        private _loadUpdate: ILoadUpdate;

        public constructor(resource: IResourceGroup)
        {
            this._resourceGroup = resource;
        }

        public get loadUpdate(): ILoadUpdate
        {
            return this._loadUpdate;
        }

        public set loadUpdate(value: ILoadUpdate)
        {
            this._loadUpdate = value;
        }

        /**
         * 资源加载
         * @memberof ResourceLoad
         */
        public load(): void
        {
            let res = this._resourceGroup.getRes();
            let groupName = this._resourceGroup.name;
            if (res.length > 0)
            {
                RES.createGroup(groupName, res, true);
                RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onLoaded, this);
                RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onProgress, this);
            } else
            {
                if (this._loadUpdate)
                {
                    this._loadUpdate.update(0, 0);
                    this._loadUpdate.onComplete();
                }
            }
        }

        /**
         * 加载完成
         * @private
         * @param {RES.ResourceEvent} event 
         * @memberof ResourceLoad
         */
        private onLoaded(event: RES.ResourceEvent): void
        {
            if (event.groupName == this._resourceGroup.name)
            {
                RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onLoaded, this);
                RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onProgress, this);
                if (this._loadUpdate)
                {
                    this._loadUpdate.onComplete();
                }
            }
        }

        /**
         * 加载中
         * @private
         * @param {RES.ResourceEvent} event 
         * @memberof ResourceLoad
         */
        private onProgress(event: RES.ResourceEvent): void
        {
            if (this._loadUpdate)
            {
                this._loadUpdate.update(event.itemsLoaded, event.itemsTotal);
            }
        }
    }
}
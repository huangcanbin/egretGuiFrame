/**
 * @author Andrew_Huang
 */
module dragon
{
    var _proxyLoadingMap: any = {};  //请求时的加载界面实例映射
    var _loading: ISimpleLoading;    //场景加载时的实例映射
    var _tooltip: ITooltip;           //tip

    /**
     * 获取请求时的进度加载实例（打开进度加载）,可自定义加载皮肤
     * @param {string} skinName 
     * @returns {IProgressLoading} 
     */
    function getProgressLoading(skinName: string): IProgressLoading
    {
        if (!_proxyLoadingMap.hasOwnProperty(skinName))
        {
            let loading: any = getDefinitionInstance<IProgressLoading>(getSetting().ProgressLoadingClass, null, skinName);
            if (DEBUG && !loading)
            {
                console.error("请配置ProgressLoadingClass");
            }
            if (loading)
            {
                dragon.UI.addTooltip(loading);
                _proxyLoadingMap[skinName] = loading;
            }
        }
        return _proxyLoadingMap[skinName];
    }

    /**
     * 获取场景加载界面实例（打开场景加载）
     * @returns {IProgressLoading} 
     */
    function getLoadScene(): IProgressLoading
    {
        let loading: IProgressLoading = getDefinitionInstance<IProgressLoading>(getSetting().LoadSceneClass, null);
        if (loading)
        {
            dragon.UI.runScene(loading);
        }
        return loading;
    }

    /**
     * 获取通用加载界面实例（打开进度加载界面）
     * @returns {ISimpleLoading} 
     */
    function getSimpleLoading(): ISimpleLoading
    {
        if (!_loading)
        {
            _loading = getDefinitionInstance<ISimpleLoading>(getSetting().SimpleLoadingClass, null);
            if (DEBUG && !_loading)
            {
                console.error('请配置SimpleLoadingClass');
            }
            if (_loading)
            {
                dragon.UI.addTooltip(_loading);
            }
        }
        return _loading;
    }

    /**
     * 显示简单加载条
     * @export
     */
    export function showSimpleLoading(): void
    {
        let loading = getSimpleLoading();
        if (loading)
        {
            loading.show();
        }
    }

    /**
     * 隐藏简单加载条
     * @export
     */
    export function hideSimpleLoading(): void
    {
        let loading = getSimpleLoading();
        if (loading)
        {
            loading.hide();
        }
    }

    /**
     * 获取资源加载实例
     * @export
     * @param {(ILoad | IResourceGroup)} prepare 
     * @returns {ILoad} 
     */
    export function getResLoad(prepare: ILoad | IResourceGroup): ILoad
    {
        let result: ILoad;
        if (egret.is(prepare, 'dragon.ILoad'))
        {
            result = <ILoad>prepare;
        } else if (egret.is(prepare, 'dragon.IResourceGroup'))
        {
            result = new ResourceLoad(<IResourceGroup>prepare)
        }
        return result;
    }

    /**
     * 显示进度条
     * @export
     * @param {(ILoad | IResourceGroup)} prepare 加载器
     * @param {string} [skinName='']             加载条的皮肤名
     * @returns {*} 
     */
    export function showProgressLoading(prepare: ILoad | IResourceGroup, skinName: string = ''): any
    {
        let promise = new Promise((resolve, reject) =>
        {
            let loading = getProgressLoading(skinName);
            if (loading)
            {
                let load = getResLoad(prepare);
                loading.load = load;
                loading.setComplete(() =>
                {
                    resolve();
                });
                load.loadUpdate = loading;
                loading.show();
            } else
            {
                reject();
            }
        });
        return promise;
    }

    /**
     * 显示加载场景界面
     * @export
     * @param {(ILoad | IResourceGroup)} scene 
     * @returns {*} 
     */
    export function showLoadScene(scene: ILoad | IResourceGroup): any
    {
        let promise = new Promise((resolve, reject) =>
        {
            let loading = getLoadScene();
            if (loading)
            {
                let load = getResLoad(scene);
                loading.load = load;
                loading.setComplete(() =>
                {
                    resolve();
                });
                load.loadUpdate = loading;
                loading.show();
            }
        });
        return promise;
    }

    /**
     * 隐藏进度加载
     * @export
     * @param {string} skinName 
     */
    export function hideProgressLoading(skinName: string): void
    {
        let loading = getProgressLoading(skinName);
        if (loading)
        {
            loading.hide();
        }
    }

    /**
     * 获取 tip 实例
     * @returns {ITooltip} 
     */
    function getTooltip(): ITooltip
    {
        if (!_tooltip)
        {
            _tooltip = getDefinitionInstance<ITooltip>(getSetting().TooltipClass);
            if (_tooltip)
            {
                dragon.UI.addTooltip(_tooltip);
            }
            if (DEBUG && !_tooltip)
            {
                console.error("请配置TooltipClass");
            }
        }
        return _tooltip;
    }

    /**
     * 显示浮动 tip 提示
     * @export
     * @param {(dragon.TooltipInfo | string)} info 
     * @param {string} [skinName] 
     */
    export function tooltip(info: dragon.TooltipInfo | string, skinName?: string): void
    {
        let tip = getTooltip();
        if (tip)
        {
            tip.show(info, skinName);
        }
    }

    export function customTooltip(skinName: string, data: any, delay?: number): void
    {
        let tip = getTooltip();
        if (tip)
        {
            tip.customView(skinName, data, delay);
        }
    }

    export enum BoxType
    {
        Box,
        HistoryBox,
        SequnceBox,
        GroupSequnceBox
    }

    /**
     * 弹出提示框
     * @export
     * @param {(ConfirmInfo | string)} info 
     * @param {BoxType} [boxType=BoxType.Box] 
     * @param {any} args 
     * @returns {*} 
     */
    export function confirm(info: ConfirmInfo | string, boxType: BoxType = BoxType.Box, ...args): any
    {
        let promise = new Promise((resolve, reject) =>
        {
            let result: IConfirm = getDefinitionInstance<IConfirm>(getSetting().ConfirmClass, null, info);
            if (result)
            {
                if (boxType == BoxType.Box)
                {
                    dragon.UI.addBox(result);
                } else if (boxType == BoxType.HistoryBox)
                {
                    dragon.UI.addHistoryBox(result, ...args);
                } else if (boxType == BoxType.SequnceBox)
                {
                    dragon.UI.addSequenceBox(result, ...args);
                } else if (boxType == BoxType.GroupSequnceBox)
                {
                    dragon.UI.addGroupSequenceBox(result, args[0], args[1], args.slice(2));
                }
                result.show((button: ConfirmButton) =>
                {
                    if (button == ConfirmButton.yes)
                    {
                        resolve();
                    } else
                    {
                        reject(button);
                    }
                }, this);
            }
        });
        return promise;
    }
}
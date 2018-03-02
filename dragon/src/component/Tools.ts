/**
 * @author Andrew_Huang
 */
module dragon
{
    var _proxyLoadingMap: any = {};  //请求时的加载界面实例映射
    var _loading: ISimpleLoading;    //场景加载时的实例映射

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

}
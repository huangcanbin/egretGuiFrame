/*
 * @Author: Andrew_Huang 
 * @Date: 2018-04-28 13:44:02 
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-04-28 14:11:17
 */
module games
{
    export module listener
    {
        /**
         * 全局Socket相关错误监听扩展接口
         * @author Andrew_Huang
         * @export
         * @interface IListenerCallback
         */
        export interface IListenerCallback
        {
            onRequestError?(data: any): void;
            onNotAuthorToken?(data: any): void;
            onRequestAPIError?(data: any): void;
            onRequestTimeout?(data: any): void;
            onServerUnknownError?(data: any): void;
        }

        /**
         * 全局监听配置扩展接口
         * @author Andrew_Huang
         * @export
         * @interface ISetting
         */
        export interface ISetting
        {
            CallbackClass: string;
            ListenerCallback: IListenerCallback;
        }

        /**
         * 全局监听配置
         * @author Andrew_Huang
         * @export
         * @class Setting
         */
        export class Setting
        {
            private _setting: ISetting;
            private _listener: Listener;
            private _callbackListener: IListenerCallback;

            public init(setting: ISetting): void
            {
                this._setting = setting;
                this._listener = new Listener();
            }

            public get CallbackClass(): string
            {
                return this._setting.CallbackClass;
            }

            public get ListenerCallback(): IListenerCallback
            {
                if (!this._callbackListener)
                {
                    this._callbackListener = dragon.getDefinitionInstance<IListenerCallback>(this.CallbackClass, null);
                }
                return this._callbackListener;
            }

            public static init(setting: ISetting): void
            {
                dragon.singleton(Setting).init(setting);
            }
        }

        export function getSetting(): ISetting
        {
            return dragon.singleton(Setting);
        }
    }
}
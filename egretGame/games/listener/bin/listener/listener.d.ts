declare module games {
    module listener {
        /**
         * 全局监听
         * @author Andrew_Huang
         * @export
         * @class Listener
         */
        class Listener {
            constructor();
            /**
             * 请求错误
             * @author Andrew_Huang
             * @private
             * @param {*} data
             * @memberof Listener
             */
            private onRequestError(data);
            /**
             * 未授权身份令牌
             * @author Andrew_Huang
             * @private
             * @param {*} data
             * @memberof Listener
             */
            private onNotAuthorToken(data);
            /**
             * 未找到请求接口
             * @author Andrew_Huang
             * @private
             * @param {*} data
             * @memberof Listener
             */
            private onRequestAPIError(data);
            /**
             * 请求超时
             * @author Andrew_Huang
             * @private
             * @param {*} data
             * @memberof Listener
             */
            private onRequestTimeout(data);
            /**
             * 服务器未知错误
             * @author Andrew_Huang
             * @private
             * @param {*} data
             * @memberof Listener
             */
            private onServerUnknownError(data);
        }
    }
}
declare module games {
    module listener {
        /**
         * 全局Socket相关错误监听扩展接口
         * @author Andrew_Huang
         * @export
         * @interface IListenerCallback
         */
        interface IListenerCallback {
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
        interface ISetting {
            CallbackClass: string;
            ListenerCallback: IListenerCallback;
        }
        /**
         * 全局监听配置
         * @author Andrew_Huang
         * @export
         * @class Setting
         */
        class Setting {
            private _setting;
            private _listener;
            private _callbackListener;
            init(setting: ISetting): void;
            readonly CallbackClass: string;
            readonly ListenerCallback: IListenerCallback;
            static init(setting: ISetting): void;
        }
        function getSetting(): ISetting;
    }
}

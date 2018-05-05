/*
* @Author: Andrew_Huang 
* @Date: 2018-04-28 13:44:38 
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-04-28 14:27:40
*/
module games
{
    export module listener
    {
        import addNotice = dragon.addNotice;
        import SocketAction = dragon.SocketAction;

        /**
         * 全局监听
         * @author Andrew_Huang
         * @export
         * @class Listener
         */
        export class Listener
        {
            public constructor()
            {
                addNotice(SocketAction.REQUEST_ERROR, this.onRequestError, this);
                addNotice(SocketAction.NOT_AUTHOR_TOKEN, this.onNotAuthorToken, this);
                addNotice(SocketAction.NOT_REQUEST_API, this.onRequestAPIError, this);
                addNotice(SocketAction.REQUEST_TIMEOUT, this.onRequestTimeout, this);
                addNotice(SocketAction.SERVER_UNKNOWN_ERROR, this.onServerUnknownError, this);
            }

            /**
             * 请求错误
             * @author Andrew_Huang
             * @private
             * @param {*} data 
             * @memberof Listener
             */
            private onRequestError(data: any): void
            {
                let callback = getSetting().ListenerCallback;
                if (callback && callback.onRequestError)
                {
                    callback.onRequestError(data);
                }
            }

            /**
             * 未授权身份令牌
             * @author Andrew_Huang
             * @private
             * @param {*} data 
             * @memberof Listener
             */
            private onNotAuthorToken(data: any): void
            {
                let callback = getSetting().ListenerCallback;
                if (callback && callback.onNotAuthorToken)
                {
                    callback.onNotAuthorToken(data);
                }
            }

            /**
             * 未找到请求接口
             * @author Andrew_Huang
             * @private
             * @param {*} data 
             * @memberof Listener
             */
            private onRequestAPIError(data: any): void
            {
                let callback = getSetting().ListenerCallback;
                if (callback && callback.onRequestAPIError)
                {
                    callback.onRequestAPIError(data);
                }
            }

            /**
             * 请求超时
             * @author Andrew_Huang
             * @private
             * @param {*} data 
             * @memberof Listener
             */
            private onRequestTimeout(data: any): void
            {
                let callback = getSetting().ListenerCallback;
                if (callback && callback.onRequestTimeout)
                {
                    callback.onRequestTimeout(data);
                }
            }

            /**
             * 服务器未知错误
             * @author Andrew_Huang
             * @private
             * @param {*} data 
             * @memberof Listener
             */
            private onServerUnknownError(data: any): void
            {
                let callback = getSetting().ListenerCallback;
                if (callback && callback.onServerUnknownError)
                {
                    callback.onServerUnknownError(data);
                }
            }
        }
    }
}
module dragon
{
    /**
     * Scoket状态行为
     * @author Andrew_Huang
     * @export
     * @class SocketAction
     */
    export class SocketAction
    {
        /**
         * 响应成功
         * @static
         * @type {string}
         * @memberof SocketAction
         */
        public static RESPONSE_SUCCESS: string = 'response_success';

        /**
         * 请求错误
         * @static
         * @type {string}
         * @memberof SocketAction
         */
        public static REQUEST_ERROR: string = 'request_error';

        /**
         * 未授权身份令牌
         * @static
         * @type {string}
         * @memberof SocketAction
         */
        public static NOT_AUTHOR_TOKEN: string = 'not_author_token';

        /**
         * 未找到请求接口
         * @static
         * @type {string}
         * @memberof SocketAction
         */
        public static NOT_REQUEST_API: string = 'not_request_api';

        /**
         * 请求超时
         * @static
         * @type {string}
         * @memberof SocketAction
         */
        public static REQUEST_TIMEOUT: string = 'request_timeout';

        /**
         * 服务器未知异常
         * @static
         * @type {string}
         * @memberof SocketAction
         */
        public static SERVER_UNKNOWN_ERROR: string = 'server_unknown_error';
    }
}
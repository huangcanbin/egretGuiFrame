/*
 * @Author: Andrew_Huang 
 * @Date: 2018-04-28 11:45:36 
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-04-28 11:49:24
 */
module dragon
{
    /**
     * Socket状态码
     * @author Andrew_Huang
     * @export
     * @class ScoketCode
     */
    export class ScoketCode
    {
        /**
         * 响应成功
         * @static
         * @type {number}
         * @memberof ScoketCode
         */
        public static RESPONSE_SUCCESS: number = 200;

        /**
         * 请求错误
         * @static
         * @type {number}
         * @memberof ScoketCode
         */
        public static REQUEST_ERROR: number = 400;

        /**
         * 未授权身份令牌
         * @static
         * @type {number}
         * @memberof ScoketCode
         */
        public static NOT_AUTHOR_TOKEN: number = 401;

        /**
         * 未找到请求接口
         * @static
         * @type {number}
         * @memberof ScoketCode
         */
        public static NOT_REQUEST_API: number = 404;

        /**
         * 请求超时
         * @static
         * @type {number}
         * @memberof ScoketCode
         */
        public static REQUEST_TIMEOUT: number = 408;

        /**
         * 服务器未知异常
         * @static
         * @type {number}
         * @memberof ScoketCode
         */
        public static SERVER_UNKNOWN_ERROR: number = 500;
    }
}
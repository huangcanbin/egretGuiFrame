/*
 * @Author: Andrew_Huang 
 * @Date: 2018-04-28 11:28:07 
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-04-28 11:47:14
 */
module dragon
{
    /**
     * 全局事件名 Key 值
     * @export
     * @class NoticeNameKey
     */
    export class NoticeKey
    {
        public static GetComponent: string = "get_component";

        /**
         * 服务端数据模块变化
         * @author Andrew_Huang
         * @static
         * @param {string} mod 
         * @returns {string} 
         * @memberof NoticeNameKey
         */
        public static SERVER_DATA_CHANGE(mod: string): string
        {
            return 'SERVER_DATA_CHANGE.' + mod;
        }

        /**
         * 数据模块变更
         * @author Andrew_Huang
         * @static
         * @param {string} mod 
         * @returns {string} 
         * @memberof NoticeNameKey
         */
        public static CHANGE_MODEL(mod: string): string
        {
            return 'CHANGE_MODEL.' + mod;
        }

        /**
         * 数据变更通知
         * @author Andrew_Huang
         * @static
         * @param {string} mod 
         * @returns {string} 
         * @memberof NoticeNameKey
         */
        public static POSTCHANGE(mod: string): string
        {
            return 'CHANGE.' + mod;
        }
    }
    export var key = NoticeKey;
}
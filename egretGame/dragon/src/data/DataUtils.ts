/*
 * @Author: Andrew_Huang 
 * @Date: 2018-04-26 14:00:08 
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-04-27 18:18:04
 */
module dragon.data
{
    /**
     * 设置客户端配置与服务端配置的key值结构
     * @author Andrew_Huang
     * @export
     * @interface AliaseKey
     */
    export interface AliaseKey
    {
        serverKey: string;
        configKey: string;
    }

    /**
     * 数据格式化工具
     * @author Andrew_Huang
     * @export
     * @class DateUtils
     */
    export class DateUtils
    {
        /**
         * 格式化别名格式的字符串，获取客户端配置key值与服务端key
         * @author Andrew_Huang
         * @static
         * @param {string} key 
         * @returns {AliaseKey} 
         * @memberof DateUtils
         */
        public static formatAliaseKey(key: string): AliaseKey
        {
            //正则检测的key值格式："xx as xx"
            let reqStr = /([a-zA-Z_]+)\s*(as)\s*([a-zA-Z_]+)/gi;
            let obj: AliaseKey = <any>{};
            if (reqStr.test(key))
            {
                obj.serverKey = RegExp.$1;
                obj.configKey = RegExp.$3;
            } else
            {
                obj.serverKey = obj.configKey = key;
            }
            return obj;
        }
    }
}
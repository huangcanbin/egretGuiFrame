/**
 * @author Andrew_Huang
 */
module dragon
{
    /**
     * 数字操作类
     * @export
     * @class Num
     */
    export class Num
    {
        /**
         * 在指定数字范围内随机一个整数
         * @static
         * @param {number} min 
         * @param {number} max 
         * @returns {number} 
         * @memberof Num
         */
        public static randInt(min: number, max: number): number
        {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        /**
         * 在指定范围内随机一个浮点数
         * @static
         * @param {number} min 
         * @param {number} max 
         * @returns {number} 
         * @memberof Num
         */
        public static randFloat(min: number, max: number): number
        {
            return Math.random() * (max - min) + min;
        }

        /**
         * 格式化时间数字
         * 如：1，传入DD或者HH，则返回01，传入D或者H，则返回1
         * @static
         * @param {number} num    时间
         * @param {string} format 时间格式：如DD、HH、MM、SS
         * @returns {*} 
         * @memberof Num
         */
        public static padNum(num: number, format: string): any
        {
            let numStr = num.toString();
            let len = format.length - numStr.length;
            if (len > 0)
            {
                return '0' + numStr;
            }
            return numStr;
        }

        /**
         * 格式化倒计时时间
         * @param time 倒计时时间(秒)    
         * @param format 格式化时间格式（[DD:HH:MM:SS];[D:H:M:S]）
         * @returns {string}
         */
        public static toCountdown(time: number, format: string): string
        {
            let day = Math.floor(time / 86400);
            time = time % 86400;
            let hour = Math.floor(time / 3600);
            time = time % 3600;
            let minutes = Math.floor(time / 60);
            time = time % 60;
            let seconds = Math.floor(time);

            let str = format.replace(/((\[)(.*?))?(D{1,2})(([^\]]?)\])?/gi, (all, _, prefix, before, key, suffix, after) =>
            {
                if (prefix == '[' && day <= 0)
                {
                    return '';
                }
                return (before || "") + this.padNum(day, key) + (after || "");
            });

            str = str.replace(/((\[)(.*?))?(H{1,2})(([^\]]?)\])?/gi, (all, _, prefix, before, key, suffix, after) =>
            {
                if (prefix == '[' && hour <= 0)
                {
                    return '';
                }
                return (before || "") + this.padNum(hour, key) + (after || "");
            });
            str = str.replace(/((\[)(.*?))?(M{1,2})(([^\]]?)\])?/gi, (all, _, prefix, before, key, suffix, after) =>
            {
                if (prefix == '[' && hour <= 0 && minutes <= 0)
                {
                    return '';
                }
                return (before || "") + this.padNum(minutes, key) + (after || "");
            });
            str = str.replace(/((\[)(.*?))?(S{1,2})(([^\]]?)\])?/gi, (all, _, prefix, before, key, suffix, after) =>
            {
                if (prefix == '[' && hour > 0)
                {
                    return '';
                }
                return (before || '') + this.padNum(seconds, key) + (after || '');
            });
            return str;
        }
    }
}
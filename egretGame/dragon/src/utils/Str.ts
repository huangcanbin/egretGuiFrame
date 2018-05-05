/**
 * @author Andrew_Huang
 */
module dragon
{
    /**
     * 填补方向
     * @export
     * @enum {number}
     */
    export enum PadDirection
    {
        LEFT,
        MIDDLE,
        RIGHT
    }

    /**
     * 字符相关操作类
     * @export
     * @class Str
     */
    export class Str
    {
        /**
         * 匹配格式：如{num},num为数字组合
         * \d:匹配一个数字字符，相当于[0-9]
         * +:匹配1或多个正好在它之前的那个字符
         */
        private static _formatRegexp = /{(\d+)}/g;

        /**
         * 匹配{}格式的字符
         */
        private static _formatObjRegexp = /{([^\}]+)}/g;

        /**
         * 字符串填补
         * @static
         * @param {string} str       需要填补的原字符串
         * @param {number} [len=0]   填补的长度
         * @param {string} [pad=" "] 填补的类型（默认空格）
         * @param {PadDirection} [dir=PadDirection.MIDDLE] 填补的方向
         * @returns {string} 
         * @memberof Str
         */
        public static pad(str: string, len: number = 0, pad: string = " ", dir: PadDirection = PadDirection.MIDDLE): string
        {
            let padlen: number = 0;
            if (len >= 1)
            {
                len += str.length;
                switch (dir)
                {
                    case PadDirection.LEFT:
                        str = new Array(len + 1 - str.length).join(pad) + str;
                        break;
                    case PadDirection.MIDDLE:
                        let right = Math.ceil((padlen = len - str.length) / 2);
                        let left = padlen - right;
                        str = new Array(left + 1).join(pad) + str + new Array(right + 1).join(pad);
                        break;
                    default: {
                        str = str + new Array(len + 1 - str.length).join(pad);
                        break;
                    }
                }
            }
            return str;
        }

        /**
         * 替换字符串str中的所有search，替代内容为replace
         * new RegExp(search, 'g')：g表示gloabl，找到search字符的所有存在点
         * @static
         * @param {string} str     原始字符串
         * @param {string} search  需要替换的内容
         * @param {string} replace 替换内容
         * @returns {string} 
         * @memberof Str
         */
        public static replaceAll(str: string, search: string, replace: string): string
        {
            return str.replace(new RegExp(search, 'g'), replace);
        }

        /**
         * 使用对象数据替换文本中的标记位置
         * 示例：str="AAA{a}BBB",arg={a:1} => 结果：str="AAA1BBB"
         * @static
         * @param {string} str 
         * @param {*} args 
         * @returns {string} 
         * @memberof Str
         */
        public static replaceFromObject(str: string, args: any): string
        {
            if (is.object(args))
            {
                for (let key in args)
                {
                    let search: string = '{' + key + '}';
                    let replace: string = '' + args[key];
                    str = this.replaceAll(str, search, replace);
                }
            }
            return str;
        }

        /**
         * 数组数据替换：格式化形如str格式的字符，并用args替换里面的数据
         * 举例：value="{02}",args=[1,2,3] => match:{02},group:02,结果为3
         * @static
         * @param {string} str 
         * @param {...any[]} args 
         * @returns {string} 
         * @memberof Str
         */
        public static format(str: string, ...args: any[]): string
        {
            if (!args.length)
            {
                return str;
            }
            return str.replace(this._formatRegexp, (match, group) =>
            {
                let idx = parseInt(group, 10);
                return isNaN(idx) || idx < 0 || idx > args.length ? match : args[idx];
            });
        }

        /**
         * 对象数据替换：格式化形如str格式的字符，并用args替换里面的数据
         * @static
         * @param {string} str 
         * @param {*} args 
         * @returns {string} 
         * @memberof Str
         */
        public static formatFromObject(str: string, args: any): string
        {
            if (is.falsy(str) || is.empty(args))
            {
                return str;
            }
            return str.replace(this._formatObjRegexp, (match, group) =>
            {
                if (args.hasOwnProperty(group))
                {
                    return args[group];
                }
                return match;
            });
        }

        /**
         * 重复字符串输出
         * @static
         * @param {string} str 
         * @param {number} count 
         * @returns {string} 
         * @memberof Str
         */
        public static repeat(str: string, count: number): string
        {
            let arr = new Array(count);
            for (let i: number = 0; i < count; i++)
            {
                arr[i] = str;
            }
            return arr.join('');
        }

        /**
         * 去除str中的space字符，并格式化
         * @static
         * @param {string} [str] 
         * @param {string} [space] 
         * @returns {string} 
         * @memberof Str
         */
        public static trim(str?: string, space?: string): string
        {
            let trimmed = this.lTrim(str, space);
            return this.rTrim(trimmed, space);
        }

        /**
         * 去除左边的space字符
         * @static
         * @param {string} [str] 
         * @param {string} [space] 
         * @returns {string} 
         * @memberof Str
         */
        public static lTrim(str?: string, space?: string): string
        {
            if (!str || !space)
            {
                return str;
            }
            let needLen: number = space.length;
            if (needLen === 0 || str.length === 0)
            {
                return str;
            }
            let offset: number = 0;
            let idx: number = -1;
            while ((idx = str.indexOf(space, offset)) === offset)
            {
                offset += needLen;
            }
            return str.substr(offset);
        }

        /**
         * 去除右边的space字符
         * @static
         * @param {string} [str] 
         * @param {string} [space] 
         * @returns {string} 
         * @memberof Str
         */
        public static rTrim(str?: string, space?: string): string
        {
            if (!str || !space)
            {
                return str;
            }
            let needleLen: number = space.length;
            let strLen: number = str.length;
            if (needleLen === 0 || strLen === 0)
            {
                return str;
            }
            let offset: number = strLen;
            let idx: number = -1;
            while (true)
            {
                idx = str.lastIndexOf(space, offset - 1);
                if (idx === -1 || idx + needleLen !== offset)
                {
                    break;
                }
                if (idx === 0)
                {
                    return '';
                }
                offset = idx;
            }
            return str.substring(0, offset);
        }

        /**
         * 判断space是否存在于str的头部
         * @static
         * @param {string} str 
         * @param {string} space 
         * @returns {boolean} 
         * @memberof Str
         */
        public static startWith(str: string, space: string): boolean
        {
            if (str.length < space.length)
            {
                return false;
            }
            for (let i = 0; i < space.length; i++)
            {
                if (str[i] !== space[i])
                {
                    return false;
                }
            }

            return true;
        }

        /**
         * 判断space是否存在于str的尾部
         * @static
         * @param {string} str 
         * @param {string} space 
         * @returns {boolean} 
         * @memberof Str
         */
        public static endWith(str: string, space: string): boolean
        {
            let diff = str.length - space.length;
            if (diff > 0)
            {
                return str.lastIndexOf(space) === diff;
            } else if (diff === 0)
            {
                return str === space;
            } else
            {
                return false;
            }
        }
    }
}
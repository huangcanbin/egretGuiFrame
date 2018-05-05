/*
 * @Author: Andrew_Huang 
 * @Date: 2018-05-03 14:59:22 
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-05-03 16:00:09
 */
module games
{
    export module lock
    {
        export class Lock
        {
            private _lockObj: any;

            public constructor()
            {
                this._lockObj = dragon.Config.get(getSetting().LockFile);
            }

            /**
             * 获取文本提示信息
             * @author Andrew_Huang
             * @private
             * @param {Item} item 
             * @returns {string} 
             * @memberof Lcok
             */
            private getLvMessage(item: Item): string
            {
                if (item.hasOwnProperty('Text'))
                {
                    return item.Text;
                }
                return dragon.Str.replaceAll(getSetting().LevelDefaultMessage, '{level}', item.Level.toString());
            }

            /**
             * 等级是否满足功能开启条件
             * @author Andrew_Huang
             * @private
             * @param {Item} item 
             * @param {boolean} showTip 
             * @returns {boolean} 
             * @memberof Lcok
             */
            private lv(item: Item, showTip: boolean): boolean
            {
                let userLv = dragon.getWhereValue(getSetting().Level, 0);
                let needLv = item.Level;
                let ret: boolean = userLv >= needLv
                if (!ret)
                {
                    if (showTip)
                    {
                        dragon.tooltip(this.getLvMessage(item));
                    }
                }
                return ret;
            }

            /**
             * 获取条件状态
             * @author Andrew_Huang
             * @private
             * @param {Item} item 
             * @param {boolean} showTip 
             * @returns {boolean} 
             * @memberof Lcok
             */
            private condition(item: Item, showTip: boolean): boolean
            {
                let status: any = dragon.pullObject(item.Condition, false);
                if (!status)
                {
                    if (showTip)
                    {
                        dragon.tooltip(item.Text);
                    }
                }
                return status
            }

            public is(type: string, showTip: boolean): boolean
            {
                if (DEBUG && !this._lockObj.hasOwnProperty(type))
                {
                    console.warn(getSetting().LockFile + "配置中没有<" + type + ">项");
                }
                if (this._lockObj.hasOwnProperty(type))
                {
                    let item = this._lockObj[type];
                    if (item.hasOwnProperty('Level'))
                    {
                        return this.lv(item, showTip);
                    } else if (item.hasOwnProperty('Condition'))
                    {
                        return this.condition(item, showTip);
                    }
                }
                return false;
            }
        }

        /**
         * 指定功能是否开启
         * @author Andrew_Huang
         * @export
         * @param {string} type 
         * @param {boolean} [showTip=false] 
         * @returns {boolean} 
         */
        export function is(type: string, showTip: boolean = false): boolean
        {
            return dragon.singleton(Lock).is(type, showTip);
        }

        /**
         * 指定功能未开启
         * @author Andrew_Huang
         * @export
         * @param {string} type 
         * @param {boolean} [showTip=false] 
         * @returns {boolean} 
         */
        export function not(type: string, showTip: boolean = false): boolean
        {
            return !dragon.singleton(Lock).is(type, showTip);
        }
    }
}
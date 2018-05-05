/*
 * @Author: Andrew_Huang 
 * @Date: 2018-05-02 11:00:46 
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-05-02 12:01:55
 */
module games
{
    export module enough
    {
        var __enoughItemMap = {};

        function getEnoughItem(type: string): Item
        {
            if (!this.__enoughItemMap.hasOwnProperty(type))
            {
                let items = enough.getSetting().Items;
                for (let key in items)
                {
                    if (items[key].Type == type)
                    {
                        __enoughItemMap[type] = items[key];
                        __enoughItemMap[type].Key = key;
                    }
                }
            }
            return __enoughItemMap[type];
        }

        export function getConfig(name: string): Item
        {
            return getEnoughItem(name);
        }

        /**
         * 检查指定的道具数量是否足够
         * @author Andrew_Huang
         * @export
         * @param {number} configId                 道具配置Id
         * @param {number} need                     需要的道具数量
         * @param {boolean} [enterSupplement=false] 是否进入自定义的提示类操作
         * @param {string} [className=null]         扩展
         * @returns {boolean} 
         */
        export function hasItem(configId: number, need: number, enterSupplement: boolean = false, className: string = null): boolean
        {
            let has: number = dragon.Item.getNum(configId);
            if (has >= need)
            {
                return true;
            } else
            {
                if (enterSupplement)
                {
                    let item: Item = getEnoughItem('ITEM');
                    if (item)
                    {
                        let supplementClass = getSetting().SupplementClass;
                        let supplementInst = dragon.getDefinitionType(supplementClass, null);
                        if (supplementInst)
                        {
                            let supplement: ISupplement = <ISupplement>dragon.singleton(supplementInst);
                            supplement.supplement(item.Key, has, need, configId, className);
                        } else
                        {
                            console.warn("Can't Find SupplementClass");
                        }
                    }
                }
            }
        }

        export function noItem(configId: number, need: number, enterSupplement: boolean = false, className: string = null): boolean
        {
            return !hasItem(configId, need, enterSupplement, className);
        }

        var supplement = function (item: games.enough.Item, type: string, has: number, need: number, extra: any, className: string)
        {
            if (item.CanSupplement)
            {
                let supplementClass = getSetting().SupplementClass;
                let supplementInst = dragon.getDefinitionType(supplementClass, null);
                if (supplementInst)
                {
                    let supplement: ISupplement = <ISupplement>dragon.singleton(supplementInst);
                    supplement.supplement(type, has, need, extra, className);
                }
            }
        }

        /**
         * 检查指定的后端数据是否足够（如：金币、VIP等级等）
         * @author Andrew_Huang
         * @export
         * @param {string} type                     数据类型
         * @param {number} need                     需要的数量
         * @param {boolean} [enterSupplement=false] 是否进入自定义的提示类操作
         * @param {string} [className=null]         扩展
         * @returns {boolean} 
         */
        export function has(type: string, need: number, enterSupplement: boolean = false, className: string = null): boolean
        {
            let items = getSetting().Items;
            if (items && items.hasOwnProperty(type))
            {
                let item: Item = items[type];
                let has: number = dragon.getWhereValue(item.Where, 0);
                if (has >= need)
                {
                    return true;
                } else if (enterSupplement)
                {
                    supplement(item, type, has, need, item.Confirm, className);
                }
            }
        }

        export function not(type: string, need: number, enterSupplement: boolean = false, className: string = null): boolean
        {
            return !has(type, need, enterSupplement, className);
        }
    }
}
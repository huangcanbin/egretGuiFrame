/*
 * 通用提示框
 * @Author: Andrew_Huang 
 * @Date: 2018-04-24 20:27:10 
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-04-25 14:21:50
 */
module games
{
    export module hint
    {
        import ConfirmInfo = games.components.ConfirmInfo;

        var _hintObj = null;
        function getHintObject(): any
        {
            if (is.nul(_hintObj))
            {
                _hintObj = dragon.Config.get(getSetting().HintFile);
            }
            return _hintObj;
        }

        /**
         * 根据key值获取对应的提示框数据对象
         * @author Andrew_Huang
         * @export
         * @param {(string | ConfirmInfo)} name 
         * @returns {*} 
         */
        export function getMessage(name: string | ConfirmInfo): any
        {
            if (is.string(name))
            {
                return dragon.Obj.getValue(getHintObject(), name);
            }
            return <any>name;
        }

        /**
         * 通用提示框
         * @author Andrew_Huang
         * @export
         * @class Hint
         */
        export class Hint
        {
            public constructor()
            {

            }

            public showConfirm(item: string, param: any, boxType: dragon.BoxType, args: any[])
            {
                item = dragon.Obj.deepClone(item);
                item['arg'] = param;
                return dragon.confirm(item, boxType, ...args);
            }

            public static promise: any = <any>{
                then: () => { },
                catch: () => { }
            };

            public showTooltip(item: any, arg: any)
            {
                let str: string = '';
                let display = undefined;
                if (!is.string(item))
                {
                    if (item.hasOwnProperty('display'))
                    {
                        display = dragon.getGuiCreateInstance(item.display);
                    }
                    str = item.text;
                } else
                {
                    str = item;
                }
                dragon.tooltip(dragon.Str.replaceFromObject(str, arg), display);
                let promise = new Promise((resolve, reject) =>
                {
                    resolve();
                });
                return promise;
            }

            public has(name: string): boolean
            {
                return dragon.Obj.hasValue(getHintObject(), name);
            }

            public show(name: string, param: any, boxType: dragon.BoxType, args: any[] = [])
            {
                let item = getMessage(name);
                if (is.nul(item) || is.undefined(item))
                {
                    console.warn("Can't Find Message By " + name + " ,please check resource!");
                    return;
                }
                if (is.string(item) || item.type == 'tooltip')
                {
                    return this.showTooltip(item, param);
                } else
                {
                    return this.showConfirm(item, param, boxType, args);
                }
            }

            public text(name: string, arg: any): string
            {
                let item = getMessage(name);
                let str = undefined;
                if (is.array(item))
                {
                    str = item;
                } else
                {
                    str = item['text'];
                }
                return dragon.Str.replaceFromObject(str, arg);
            }
        }

        /**
         * 判断是否存在该key值的提示数据对象
         * @author Andrew_Huang
         * @export
         * @param {string} name 
         * @returns {boolean} 
         */
        export function has(name: string): boolean
        {
            return dragon.singleton(Hint).has(name);
        }

        /**
         * 显示指定key值的提示内容
         * @author Andrew_Huang
         * @export
         * @param {(string | ConfirmInfo)} info 
         * @param {*} [param=null] 
         * @returns 
         */
        export function show(info: string, param: any = null)
        {
            return dragon.singleton(Hint).show(info, param, dragon.BoxType.Box);
        }

        /**
         * 返回指定提示内容的文字
         * @author Andrew_Huang
         * @export
         * @param {string} name 
         * @param {*} [param=null] 
         * @returns {string} 
         */
        export function text(name: string, param: any = null): string
        {
            return dragon.singleton(Hint).text(name, param);
        }

        // export function seq(info: string | ConfirmInfo, param: any = null) {
        //     return dragon.singleton(Hint).show(info, param, dragon.BoxType.SequnceBox);
        // }

        // export function history(info: string | ConfirmInfo, param: any = null) {
        //     return dragon.singleton(Hint).show(info, param, dragon.BoxType.HistoryBox);
        // }

        // export function groupSeq(info: string | ConfirmInfo, group: string, priority: number, param: any = null, ...args) {
        //     return dragon.singleton(Hint).show(info, param, dragon.BoxType.GroupSequnceBox, [group, priority].concat(args));
        // }
    }
}
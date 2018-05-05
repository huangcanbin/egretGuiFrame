/*
 * @Author: Andrew_Huang 
 * @Date: 2018-05-02 11:00:36 
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-05-02 11:09:00
 */
module games
{
    export module enough
    {
        export interface ISupplement
        {
            supplement(type: any, has: number, need: number, extra: any, className: string): void;
        }

        export interface Item
        {
            Type: string;              //类型
            Where?: string;            //数据所在地
            Confirm?: string;          //提示
            CanSupplement?: boolean;   //是否支持数量不足提示的指定类操作
            Key?: any;                 //key值
        }

        export interface ISetting
        {
            Items: { string: Item };
            SupplementClass: string;
        }

        export class Setting
        {
            private _setting: ISetting;

            public get Items(): { string: Item }
            {
                return this._setting.Items;
            }

            public get SupplementClass(): string
            {
                return this._setting.SupplementClass;
            }

            public init(setting: ISetting): void
            {
                this._setting = setting;
            }

            public static init(setting: ISetting): void
            {
                dragon.singleton(Setting).init(setting);
            }
        }

        export function getSetting(): ISetting
        {
            return dragon.singleton(Setting);
        }
    }
}
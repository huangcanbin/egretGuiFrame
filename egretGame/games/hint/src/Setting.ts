/*
 * 弹框提示配置
 * @Author: Andrew_Huang 
 * @Date: 2018-04-24 20:23:25 
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-04-24 20:27:00
 */
module games
{
    export module hint
    {
        export interface ISetting
        {
            HintFile: string;
        }

        export class Setting implements ISetting
        {
            private _setting: ISetting;

            public get HintFile(): string
            {
                return this._setting.HintFile;
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
/*
 * @Author: Andrew_Huang 
 * @Date: 2018-05-03 14:50:56 
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-05-03 14:58:08
 */
module games
{
    export module lock
    {
        export interface ISetting
        {
            LockFile: string;
            Level: string;
            LevelDefaultMessage: string;
        }

        export interface Item
        {
            Level?: number;      //开锁等级
            Name?: string;       //类型名
            Notice?: string;     //事件通知
            Condition?: string;  //对象条件监听
            Text?: string;       //文本提示
        }

        export class Setting implements ISetting
        {
            private _setting: ISetting;

            public get Level(): string
            {
                return this._setting.Level;
            }

            public get LockFile(): string
            {
                return this._setting.LockFile
            }

            public get LevelDefaultMessage(): string
            {
                return this._setting.LevelDefaultMessage || "用户等级达到{level}级后开启";
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
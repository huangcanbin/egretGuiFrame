/**
 * @author Andrew_Huang
 * tip和confirm相关接口
 */
module dragon
{
    /**
     * tip 信息
     * @export
     * @interface TooltipInfo
     */
    export interface TooltipInfo
    {
        text: string,
        size?: number,
        color?: number,
        delay?: number
    }

    /**
     * 确认框按钮类型
     * @export
     * @enum {number}
     */
    export enum ConfirmButton
    {
        close,
        yes,
        no
    }

    /**
     * 确认框信息
     * @export
     * @interface ConfirmInfo
     */
    export interface ConfirmInfo
    {
        test: string,
        title?: string,
        size?: number,
        close?: boolean,
        subConfirmVioew?: string,
        confirView?: string,
        yes?: string,
        no?: string,
        args?: any
    }

    /**
     * tooltip 实现接口
     * @export
     * @interface ITooltip
     */
    export interface ITooltip
    {
        show(info: TooltipInfo | string, skinName?: string): void;
        customView(skinName: string, data: any, delay?: number): void;
        skinName: string;
    }

    /**
     * 简易加载条的显示与关闭接口方法
     * @export
     * @interface ISimpleLoading
     */
    export interface ISimpleLoading
    {
        show(): void;
        hide(): void;
    }

    /**
     * 更新加载进度
     * @export
     * @interface ILoadUpdate
     */
    export interface ILoadUpdate
    {
        update(current: number, total: number): void;
        onComplete(): void;
    }

    /**
     * 加载接口
     * @export
     * @interface ILoad
     */
    export interface ILoad
    {
        loadUpdate: ILoadUpdate;
        load(): void;
    }

    export interface IProgressLoading extends ISimpleLoading, ILoadUpdate
    {
        load: ILoad;
        setComplete(sel: () => void, contex?: any): void;
    }

    export interface IConfirm
    {
        show(callback: (btn: ConfirmButton) => void, contex: any): void;
    }
}
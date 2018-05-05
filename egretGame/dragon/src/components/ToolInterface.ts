/*
 * tip和confirm相关接口
 * @Author: Andrew_Huang 
 * @Date: 2018-04-24 13:48:42 
 * @Last Modified by:   Andrew_Huang 
 * @Last Modified time: 2018-04-24 13:48:42 
 */
module dragon
{
    /**
     * tip 信息
     * @export
     * @interface TooltipInfo
     */
    export interface ITooltipInfo
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
        text: string,
        title?: string,
        size?: number,
        close?: boolean,
        subConfirmView?: string,
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
        show(info: ITooltipInfo | string, display?: fairygui.GComponent): void;
        customView(display: fairygui.GComponent, data: any, delay?: number): void;
        display: fairygui.GComponent;
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
        setComplete(sel: () => void, context?: any): void;
    }

    /**
     * 弹框实现接口
     * @export
     * @interface IConfirm
     */
    export interface IConfirm
    {
        show(callback: (btn: ConfirmButton) => void, context: any): void;
    }
}
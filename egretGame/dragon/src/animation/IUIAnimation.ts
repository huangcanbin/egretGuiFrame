/**
 * @author Andrew_Huang
 * UI动画相关接口
 */
module dragon
{
    /**
     * UI类型
     * @export
     * @enum {number}
     */
    export enum UI_TYPE
    {
        BOX = 'box',    //弹框
        MASK = 'mask'   //遮罩
    }

    /**
     * UI 动画进入方向
     * @export
     * @enum {number}
     */
    export enum ANI_UI_DIRECTION
    {
        FROM_RIGT = 1,
        FROM_LEFT = 2,
        FROM_TOP = 3,
        FROM_BOTTOM = 4
    }

    /**
     * 获取UI动画对象
     * @export
     * @interface IUIAnimationDisplay
     */
    export interface IUIAnimationDisplay
    {
        getAnimationDisplay(type?: UI_TYPE): any;
    }

    /**
     * UI动画回调（自定义）
     * @export
     * @interface IUIAnimationCallback
     */
    export interface IUIAnimationCallback
    {
        (): void;
    }

    /**
     * UI动画接口
     * @export
     * @interface IUIAnimation
     */
    export interface IUIAnimation
    {
        displayObject: IUIAnimationDisplay;
        show(callback: IUIAnimationCallback): void;
        close(callback: IUIAnimationCallback): void;
    }
}
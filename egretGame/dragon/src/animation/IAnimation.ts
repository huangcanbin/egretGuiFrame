/**
 * @author Andrew_Huang
 */
module dragon
{
    /**
     * 动画信息类型
     * @export
     * @enum {number}
     */
    export enum AniPropsType
    {
        DELAY = 1,
        SET = 2,
        BY = 3,
        REMOVE = 4,
        CALL = 5
    }

    /**
     * 动画信息
     * @export
     * @interface AnimationInfo
     */
    export interface AnimationInfo
    {
        duration: number;  //时间（秒）
        props: any;        //动画执行参数
        type?: number;     //动画信息类型
    }

    /**
     * 基础动画接口
     * @export
     * @interface IAnimation
     */
    export interface IAnimation
    {
        target: any;
        score(duration: number, beginScore: any, endScore?: any, ease?: any): IAnimation;
        shake(duration: number, offsetX: any, offestY?: any, ease?: any): IAnimation;
        to(duration: number, props: any, ease?: any): IAnimation;
        by(duration: number, props: any, ease?: any): IAnimation;
        zoom(duration: number, scale: number, delay?: any, ease?: any): IAnimation;
        delay(duration: number): IAnimation;
        blink(duration: number, blinks: number, ease?: any): IAnimation;
        call(callback: () => void, context?: Object, ...args): IAnimation;
        setProps(props: any): IAnimation;
        remove(): IAnimation;
        fadeInOut(duration: number, ease?: any): IAnimation;
        destroy(): void;
        stop(): void;
        pause(): void;
        setTarget(obj: any): IAnimation;
        resume(): void;
        run(target?: any, isLoop?: boolean): IAnimation;
    }
}   
/*
 * @Author: Andrew_Huang 
 * @Date: 2018-05-04 12:30:08 
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-05-04 13:40:39
 */
module dragon
{
    export interface IMovie 
    {
        play(name: string, playTimes?: number): void;
        destroy(): void;
    }

    /**
     * 龙骨播放器
     * @author Andrew_Huang
     * @export
     * @interface IMoviePlay
     */
    export interface IMoviePlay
    {
        play(animation: dragonBones.Animation): void;
        name: string
    }

    /**
     * 龙骨插槽数据
     * @author Andrew_Huang
     * @export
     * @interface MovieSlotDisplayInfo
     */
    export interface MovieSlotDisplayInfo
    {
        name: string;
        display: egret.DisplayObject | string;
        offsetX?: number;
        offsetY?: number;
    }
}
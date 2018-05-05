/*
 * @Author: Andrew_Huang 
 * @Date: 2018-05-04 13:58:05 
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-05-04 14:09:15
 */
module dragon
{
    /**
     * 龙骨动画事件
     * @author Andrew_Huang
     * @export
     * @class MovieEvent
     * @extends {egret.Event}
     */
    export class MovieEvent extends egret.Event
    {
        public static START: string = 'start';                 //动画开始
        public static FRAME_LABEL: string = 'frame_label';     //帧捕捉
        public static LOOP_COMPLETE: string = 'loop_complete'; //循环一次完成
        public static COMPLETE: string = 'complete';           //完成
        private _frameLabel: string;    //关键帧

        public constructor(name: string, label: string = null)
        {
            super(name);
            this._frameLabel = label;
        }

        public get frameLabel(): string
        {
            return this._frameLabel;
        }
    }
}
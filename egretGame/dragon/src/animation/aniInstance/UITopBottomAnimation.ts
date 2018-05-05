/**
 * @author Andrew_Huang
 */
module dragon
{
    /**
     * UI 动画：上下切换
     * @export
     * @class UILeftRightAnimation
     * @implements {dragon.IUIAnimation}
     */
    export class UITopBottomAnimation implements dragon.IUIAnimation
    {
        private _displayObject: IUIAnimationDisplay;
        private _height: number = dragon.stage.height;                    //UI 宽度
        private _direct: ANI_UI_DIRECTION = ANI_UI_DIRECTION.FROM_TOP; //默认初始方向
        private _callback: any;

        public constructor(callback: any = null, context: Object = null)
        {
            this._height = dragon.stage.width;
            this._callback = callback;
        }

        public set displayObject(value: dragon.IUIAnimationDisplay)
        {
            this._displayObject = value;
        }

        public get displayObject(): dragon.IUIAnimationDisplay
        {
            return this._displayObject;
        }

        public set direct(value: dragon.ANI_UI_DIRECTION)
        {
            this._direct = value;
        }

        public show(callback: IUIAnimationCallback): void
        {
            let displayObject = this.displayObject.getAnimationDisplay();
            dragon.Animation.removeAnimationByTarget(displayObject);
            displayObject.x = this.getOffsetByDirect();
            if (this._callback)
            {
                callback = this._callback;
            }
            if (callback)
            {
                dragon.Animation.to(200, { y: 0 }, Back.easeOut).call(callback, this).run(displayObject);
            } else
            {
                dragon.Animation.to(200, { y: 0 }, Back.easeOut).run(displayObject);
            }
        }

        public close(callback: IUIAnimationCallback): void
        {
            let displayObject = this.displayObject.getAnimationDisplay();
            dragon.Animation.removeAnimationByTarget(displayObject);
            let aimY: number = -this.getOffsetByDirect();
            dragon.Animation.to(200, { y: aimY }, Back.easeOut).call(callback, this).run(displayObject);
        }

        private getOffsetByDirect(): number
        {
            if (this._direct == dragon.ANI_UI_DIRECTION.FROM_TOP)
            {
                return -this._height;
            } else if (this._direct == dragon.ANI_UI_DIRECTION.FROM_BOTTOM)
            {
                return this._height;
            }
        }
    }
}
/**
 * @author Andrew_Huang
 */
module dragon
{
    /**
     * UI 动画：左右切换
     * @export
     * @class UILeftRightAnimation
     * @implements {dragon.IUIAnimation}
     */
    export class UILeftRightAnimation implements dragon.IUIAnimation
    {
        private _displayObject: IUIAnimationDisplay;
        private _width: number = dragon.stage.width;                    //UI 高度
        private _direct: ANI_UI_DIRECTION = ANI_UI_DIRECTION.FROM_RIGT; //默认初始方向
        private _callback: any;

        public constructor(callback: any = null, context: Object = null)
        {
            this._width = dragon.stage.width;
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
            dragon.BaseAnimation.removeAnimationByTarget(displayObject);
            displayObject.x = this.getOffsetByDirect();
            if (this._callback)
            {
                callback = this._callback;
            }
            if (callback)
            {
                dragon.BaseAnimation.to(200, { x: 0 }, Back.easeOut).call(callback, this).run(displayObject);
            } else
            {
                dragon.BaseAnimation.to(200, { x: 0 }, Back.easeOut).run(displayObject);
            }
        }

        public close(callback: IUIAnimationCallback): void
        {
            let displayObject = this.displayObject.getAnimationDisplay();
            dragon.BaseAnimation.removeAnimationByTarget(displayObject);
            let aimX: number = -this.getOffsetByDirect();
            dragon.BaseAnimation.to(200, { x: aimX }, Back.easeOut).call(callback, this).run(displayObject);
        }

        private getOffsetByDirect(): number
        {
            if (this._direct == dragon.ANI_UI_DIRECTION.FROM_RIGT)
            {
                return this._width;
            } else if (this._direct == dragon.ANI_UI_DIRECTION.FROM_LEFT)
            {
                return -this._width;
            }
        }
    }
}
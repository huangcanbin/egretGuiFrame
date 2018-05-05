/**
 * @author Andrew_Huang
 */
module dragon
{
    /**
     * 普通UI动画（关闭和开启自定义）
     * @export
     * @class NoneAnimation
     * @implements {dragon.IUIAnimation}
     */
    export class NoneAnimation implements dragon.IUIAnimation
    {
        private _displayObject: IUIAnimationDisplay;

        public constructor() { }

        public set displayObject(value: IUIAnimationDisplay)
        {
            this._displayObject = value;
        }

        public get displayObject(): IUIAnimationDisplay
        {
            return this._displayObject;
        }

        public show(callback: IUIAnimationCallback): void
        {
            if (callback)
            {
                callback();
            }
        }

        public close(callback: IUIAnimationCallback): void
        {
            if (callback)
            {
                callback();
            }
        }
    }
}
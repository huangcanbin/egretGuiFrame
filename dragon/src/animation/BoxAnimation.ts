/**
 * @author Andrew_Huang
 */
module dragon
{
    /**
     * 弹框动画基类（可以继承该类自行实现自定义动画）
     * @export
     * @class BoxAnimation
     * @implements {dragon.IUIAnimation}
     */
    export class BoxAnimation implements dragon.IUIAnimation
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

        /**
         * 指定弹框动画
         * @private
         * @param {IUIAnimationCallback} callback 回调函数
         * @param {Function} boxAnimation         弹框动画
         * @param {Function} maskAnimation        遮罩动画
         * @memberof BoxAnimation
         */
        private runAnimation(callback: IUIAnimationCallback, boxAnimation: Function, maskAnimation: Function): void
        {
            let box = this._displayObject.getAnimationDisplay(UI_TYPE.BOX);
            let mask = this._displayObject.getAnimationDisplay(UI_TYPE.MASK);
            let aniArr = [];
            if (box)
            {
                let showBoxAnimation: dragon.IAnimation = boxAnimation.call(this, box);
                if (showBoxAnimation)
                {
                    aniArr.push(showBoxAnimation);
                }
            }
            if (mask)
            {
                let showMaskAnimation: dragon.IAnimation = maskAnimation.call(this, mask);
                if (showMaskAnimation)
                {
                    aniArr.push(showMaskAnimation);
                }
            }
            if (!aniArr.length)
            {
                if (callback)
                {
                    callback();
                }
            } else
            {
                for (let i: number = 0; i < aniArr.length; i++)
                {
                    if (i == 0)
                    {
                        aniArr[i].call(callback);
                    }
                    if (!aniArr[i].isRunning)
                    {
                        aniArr[i].run();
                    }
                }
            }
        }

        public show(callback: IUIAnimationCallback): void
        {
            this.runAnimation(callback, this.getShowBoxAnimation, this.getShowMaskAnimation);
        }

        public close(callback: IUIAnimationCallback): void
        {
            this.runAnimation(callback, this.getCloseBoxAnimation, this.getCloseMaskAnimation);
        }

        /**
         * 弹框显示动画
         * @param {*} box 
         * @returns {dragon.IAnimation} 
         * @memberof BoxAnimation
         */
        public getShowBoxAnimation(box: any): dragon.IAnimation
        {
            return null;
        }

        /**
         * 遮罩显示动画
         * @param {*} mask 
         * @returns {dragon.IAnimation} 
         * @memberof BoxAnimation
         */
        public getShowMaskAnimation(mask: any): dragon.IAnimation
        {
            return null;
        }

        /**
         * 弹框关闭动画
         * @param {*} box 
         * @returns {dragon.IAnimation} 
         * @memberof BoxAnimation
         */
        public getCloseBoxAnimation(box: any): dragon.IAnimation
        {
            return null;
        }

        /**
         * 遮罩关闭动画
         * @param {*} mask 
         * @returns {dragon.IAnimation} 
         * @memberof BoxAnimation
         */
        public getCloseMaskAnimation(mask: any): dragon.IAnimation
        {
            return null;
        }
    }
}
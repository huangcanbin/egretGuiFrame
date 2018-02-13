/**
 * @author Andrew_Huang
 */
module dragon
{
    /**
     * 弹框动画2：缩放式
     * @export
     * @class BoxBounceAnimation
     * @extends {dragon.BaseBoxAnimation}
     */
    export class BoxBounceAnimation extends dragon.BaseBoxAnimation
    {
        public getShowBoxAnimation(box: any): dragon.IAnimation
        {
            box.scaleX = box.scaleY = 0;
            box.alpha = 0;
            dragon.BaseAnimation.removeAnimationByTarget(box);
            return dragon.BaseAnimation.to(300, { scaleX: 1, scaleY: 1, alpha: 1 }, Back.easeInOut).run(box);
        }

        public getShowMaskAnimation(mask: any): dragon.IAnimation
        {
            let alpha: number = mask.alpha ? mask.alpha : 0.6;
            mask.alpha = 0;
            return dragon.BaseAnimation.to(300, { alpha: alpha }).run(mask);
        }

        public getCloseBoxAnimation(box: any): dragon.IAnimation
        {
            dragon.BaseAnimation.removeAnimationByTarget(box);
            return dragon.BaseAnimation.to(300, { scaleX: 0, scaleY: 0, alpha: 0 }, Back.easeIn).run(box);
        }

        public getCloseMaskAnimation(mask: any): dragon.IAnimation
        {
            return dragon.BaseAnimation.to(300, { alpha: 0 }).run(mask);
        }
    }

}
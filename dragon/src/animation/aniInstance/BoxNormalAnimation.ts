/**
 * @author Andrew_Huang
 */
module dragon
{
    /**
     * 弹框动画1：透明度变化，从中间放大显示
     * @export
     * @class BoxNormalAnimation
     * @extends {dragon.BaseBoxAnimation}
     */
    export class BoxNormalAnimation extends dragon.BaseBoxAnimation
    {
        public getShowBoxAnimation(box: any): dragon.IAnimation
        {
            box.scaleX = box.scaleY = 0;
            box.alpha = 0;
            dragon.BaseAnimation.removeAnimationByTarget(box);
            return dragon.BaseAnimation.to(150, { alpha: 1, scaleX: 1, scaleY: 1 }).run(box);
        }

        public getShowMaskAnimation(mask: any): dragon.IAnimation
        {
            let alpha: number = mask.alpha ? mask.alpha : 0.6;
            mask.alpha = 0;
            return dragon.BaseAnimation.to(150, { alpha: alpha }).run(mask);
        }
    }
}
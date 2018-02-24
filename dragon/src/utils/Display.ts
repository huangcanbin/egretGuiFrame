/**
 * @author Andrew_Huang
 */
module dragon
{
    /**
     * 显示相关控制实现类
     * @export
     * @class Display
     */
    export class Display
    {
        /**
         * 舞台高
         * @readonly
         * @static
         * @type {number}
         * @memberof Display
         */
        public static get stageH(): number
        {
            //dragon.stage.stageHeight
            return dragon.GRootStage.stageH;
        }

        /**
         * 舞台宽
         * @readonly
         * @static
         * @type {number}
         * @memberof Display
         */
        public static get stageW(): number
        {
            // dragon.stage.stageWidth
            return dragon.GRootStage.stageW;
        }

        /**
         * 销毁 container 所有的子元素
         * @static
         * @param {*} container 
         * @memberof Display
         */
        public static destroyChildren(container: any): void
        {

        }

        /**
         * 设置 display 的尺寸，满屏显示
         * @static
         * @param {egret.DisplayObject} display 
         * @memberof Display
         */
        public static setFullDisplay(display: egret.DisplayObject): void
        {
            display.width = this.stageW;
            display.height = this.stageH;
        }

        /**
         * 从父级移除 child
         * @param {(egret.DisplayObject | dragon.BaseComponent)} child 
         * @param {boolean} [forceRemove=false] 
         * @memberof Display
         */
        public static removeFromParent(child: egret.DisplayObject | dragon.BaseComponent, forceRemove: boolean = false): void
        {
            if (!forceRemove && egret.is(child, 'dragon.BaseComponent'))
            {
                dragon.UI.remove(child);
            } else
            {
                if (is.truthy(child) && child.parent)
                {
                    child.parent.removeChild(child);
                }
            }
        }
    }
}
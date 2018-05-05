module dragon
{
    /**
     * 基础场景类（实际场景类）
     * @export
     * @class BaseScene
     * @extends {frame.scene.Scene}
     */
    export class BaseScene extends frame.scene.Scene
    {
        /**
         * 进入场景
         * @memberof BaseScene
         */
        public onOpen(): void
        {

        }

        /**
         * 退出场景
         * @memberof BaseScene
         */
        public onClose(): void
        {

        }

        /**
         * 设置场景绘图区
         * @protected
         * @param {egret.Sprite} root 
         * @returns {frame.scene.Canvas} 
         * @memberof BaseScene
         */
        protected newCanvas(root: egret.Sprite): dragon.BaseCanvas
        {
            return null;
        }
    }
}
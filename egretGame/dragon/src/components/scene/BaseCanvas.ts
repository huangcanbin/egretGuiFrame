module dragon
{
    /**
     * 场景底层绘图区（在这可以添加原生Sprite）
     * @export
     * @class BaseCanvas
     * @extends {frame.scene.Canvas}
     */
    export class BaseCanvas extends frame.scene.Canvas
    {
        public constructor(display: egret.Sprite)
        {
            super(display);
        }

        /**
         * 退出
         */
        public onExit(): void
        {
            super.onExit();
        }
    }
}
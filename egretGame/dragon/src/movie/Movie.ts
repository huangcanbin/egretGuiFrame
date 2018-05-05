/*
 * @Author: Andrew_Huang 
 * @Date: 2018-05-04 10:08:37 
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-05-04 10:14:38
 */
module dragon
{
    /**
     * 基于TexturePacker的动画
     * @author Andrew_Huang
     * @export
     * @class Movie
     * @extends {frame.animation.TexturePacker}
     */
    export class Movie extends frame.animation.TexturePacker
    {
        public static EACH_FRAME: string = 'frame';
        /**
         * 初始化
         * @author Andrew_Huang
         * @param {Object} format            Texture导出的Json数据
         * @param {egret.Texture} texture    Texture导出的纹理图集
         * @memberof Movie
         */
        public constructor(format: Object, texture: egret.Texture)
        {
            super(format, texture);
            this.addEventListener(dragon.Movie.EACH_FRAME, this.enterFrame, this);
        }

        public play(label: string): void
        {
            super.play(label);
        }

        public enterFrame(data: any): void
        {

        }

        public stop(): void
        {
            super.stop();
            this.removeEventListener(dragon.Movie.EACH_FRAME, this.enterFrame, this);
        }

        public destroy(): void
        {
            this.stop();
        }
    }
}
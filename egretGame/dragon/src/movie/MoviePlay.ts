/*
 * @Author: Andrew_Huang 
 * @Date: 2018-05-04 11:40:42 
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-05-04 11:43:26
 */
module dragon
{
    /**
     * 播放器（一次龙骨播放创建一个播放器）
     * @author Andrew_Huang
     * @export
     * @class MoviePlay
     * @implements {dragon.IMoviePlay}
     */
    export class MoviePlay implements dragon.IMoviePlay
    {
        private _name: string;      //动画数据名称。 （如果未设置，则播放默认动画，或将暂停状态切换为播放状态，或重新播放之前播放的动画）
        private _playTimes: number; //循环播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次] （默认: -1）

        public constructor(name: string, playTimes?: number)
        {
            this._name = name;
            this._playTimes = playTimes;
        }

        /**
         * 动画播放
         * @author Andrew_Huang
         * @param {dragonBones.Animation} animation 
         * @memberof MoviePlay
         */
        public play(animation: dragonBones.Animation): void
        {
            animation.play(this._name, this._playTimes);
        }

        public get name(): string
        {
            return this._name;
        }
    }
}
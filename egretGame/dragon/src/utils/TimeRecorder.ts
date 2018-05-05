/**
 * @author Andrew_Huang
 */
module dragon
{
    /**
     * 时间计时器（单位时间记录）
     * @export
     * @class TimeRecorder
     */
    export class TimeRecorder
    {
        private _data: Date;
        private _lastDate: any = -1;      //最新的时间戳（毫秒）
        private _offsetTime: number = 0;  //向下取整后的时间差之和
        private _tickNum: number = 0;     //心跳数
        private _seconds: number;         //每次心跳的时间数

        public get tickNum(): number
        {
            return this._tickNum;
        }

        public get seconds(): number
        {
            return this._seconds;
        }

        /**
         * 每次计时返回的时间长度
         * @returns {number} 
         * @memberof TimeRecorder
         */
        public tick(): number
        {
            let seconds = 1;
            this._data = new Date();
            let time = this._data.getTime();
            if (this._lastDate != -1)
            {
                let sec = (time - this._lastDate) / 1000;
                seconds = Math.floor(sec);
                if (seconds < 1)
                {
                    seconds = 1;
                }
                this._offsetTime += (sec - seconds);
                //当时间差累计超过1秒时，累加到seconds中
                if (this._offsetTime >= 1)
                {
                    sec = Math.floor(this._offsetTime);
                    seconds += sec;
                    this._offsetTime -= sec;
                }
            }
            this._lastDate = time;
            this._tickNum += seconds;
            this._seconds = seconds;
            return seconds;
        }
    }
}
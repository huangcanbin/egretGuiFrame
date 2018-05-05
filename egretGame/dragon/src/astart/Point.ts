module dragon {

    /**
     * 寻路节点
     * @author 黄灿滨
     * @export
     * @class Point
     */
    export class Point {

        private _parentPoint: Point;   //父节点
        private _X: number;            //X坐标
        private _Y: number;            //Y坐标
        private _F: number;            //最短距离（G+H）
        private _G: number;            //从起点移动到网格上指定方格的单位移动耗费（可沿斜线方向运动）
        private _H: number;            //从指定的方格点移动到终点的预计耗费

        public constructor(x: number, y: number) {
            this.X = x;
            this.Y = y;
        }

        public get parentPoint(): Point {
            return this._parentPoint;
        }

        public get X(): number {
            return this._X;
        }

        public get Y(): number {
            return this._Y;
        }

        public get F(): number {
            return this._F;
        }

        public get G(): number {
            return this._G;
        }

        public get H(): number {
            return this._H;
        }

        public set parentPoint(value: Point) {
            this._parentPoint = value;
        }

        public set X(value: number) {
            this._X = value;
        }

        public set Y(value: number) {
            this._Y = value;
        }


        public set F(value: number) {
            this._F = value;
        }

        public set G(value: number) {
            this._G = value;
        }

        public set H(value: number) {
            this._H = value;
        }

        /**
         * 计算总长
         * @memberof Point
         */
        public calcF(): void {
            this.F = this.G + this.H;
        }
    }

}
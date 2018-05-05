module dragon {

    /**
     * A星寻路入口
     * @author 黄灿滨
     * @export
     * @class Start
     */
    export class AStartMain {

        //测试地图数据
        public array: any = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1],
            [1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1],
            [1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1],
            [1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];

        /**
         * 根据地图数据、起始坐标和终点坐标获取寻路路径点列表
         * @param {*} mapArray 
         * @param {number} startX 
         * @param {number} startY 
         * @param {number} endX 
         * @param {number} endY 
         * @returns {Array<egret.Point>} 
         * @memberof AStartMain
         */
        public getPathPointList(mapArray: any, startX: number, startY: number, endX: number, endY: number): Array<egret.Point> {
            let pointList: Array<egret.Point> = [];
            let aStart: AStart = new AStart(mapArray);
            let start: Point = new Point(startX, startY);
            let end: Point = new Point(endX, endY);
            let parent: Point = aStart.findPath(start, end);
            while (parent) {
                let point: egret.Point = new egret.Point(parent.X, parent.Y);
                pointList.push(point);
                parent = parent.parentPoint;
            }
            return pointList.reverse();
        }
    }

    /**
     * A星寻路
     * @author 黄灿滨
     * @export
     * @class AStart
     */
    export class AStart {

        private OBLIQUE: number;          //水平与垂直方向上的单位距离
        private STEP: number;             //斜方向上的单位距离
        private mapArray: any;            //地图数据
        private OpenList: Array<Point>;   //开启列表
        private CloseList: Array<Point>;  //关闭列表

        public constructor(array: any, oblique: number = 14, step: number = 10) {
            this.mapArray = array;
            this.OBLIQUE = oblique;
            this.STEP = step;
            this.initList();
        }

        /**
         * 初始化数据
         * @private
         * @memberof AStart
         */
        private initList(): void {
            this.OpenList = [];
            this.CloseList = [];
        }

        /**
         * 路径寻找
         * @param {Point} startPoint        开始点
         * @param {Point} endPoint          结束点
         * @param {boolean} IsIngnoreCorner 是否忽略在角落的
         * @returns {Point} 
         * @memberof AStart
         */
        public findPath(startPoint: Point, endPoint: Point, IsIngnoreCorner: boolean = false): Point {
            this.OpenList.push(startPoint);
            while (this.OpenList.length) {
                //找出 F 值最小的店tempStart（作为下面所有相邻点的父节点）
                let tempStart = PointListHelp.MinPoint(this.OpenList);
                this.CloseList.push(tempStart);
                //找出它的相邻节点（8个点）
                let surroundPoints = this.SurroundPoints(tempStart, IsIngnoreCorner);
                for (let i in surroundPoints) {
                    let item: Point = surroundPoints[i];
                    if (PointListHelp.pointIsExistInList(this.OpenList, item)) {
                        //在开启列表中
                        //计算G值，如果比原来的大，就什么都不做，否则设置它的父节点为当前点，并更新 G 和 F 的值
                        this.findPointInOpenList(tempStart, item);
                    } else {
                        //如果它们不在开启列表里，就加入，并设置父节点，并计算G、H 和 F 的值
                        this.notFindPointInOpenList(tempStart, endPoint, item);
                    }
                }
                if (PointListHelp.getPoint(this.OpenList, endPoint)) {
                    return PointListHelp.getPoint(this.OpenList, endPoint);
                }
            }
            return PointListHelp.getPoint(this.OpenList, endPoint);
        }

        /**
         * 找出与 point 点相邻的8个节点
         * @private
         * @param {Point} point             
         * @param {boolean} IsIngnoreCorner 
         * @returns {Array<Point>} 
         * @memberof AStart
         */
        private SurroundPoints(point: Point, IsIngnoreCorner: boolean): Array<Point> {
            let surroundPoint = [];
            for (let x: number = point.X - 1; x <= point.X + 1; x++) {
                for (let y: number = point.Y - 1; y <= point.Y + 1; y++) {
                    if (this.canReach(point, x, y, IsIngnoreCorner)) {
                        let targetPoint: Point = new Point(x, y);
                        surroundPoint.push(targetPoint);
                    }
                }
            }
            return surroundPoint;
        }

        /**
         * (x,y)点是否可以到达
         * @private
         * @param {Point} start 
         * @param {number} x 
         * @param {number} y 
         * @param {Boolean} IsIngnoreCorner 
         * @returns {boolean} 
         * @memberof AStart
         */
        private canReach(start: Point, x: number, y: number, IsIngnoreCorner: boolean): boolean {
            if (!this.notObstacles(x, y) || PointListHelp.xyIsExistInList(this.CloseList, x, y)) {
                //是障碍物，或者在关闭列表中，为不能到达的点
                return false;
            }
            //不是障碍物，也不在关闭列表中（关闭列表中的点不再进行检查），属于正常需要检查的点
            if (Math.abs(x - start.X) + Math.abs(y - start.Y) == 1) {//上下左右相邻的点（X+Y的间隔之和为1个单位）
                return true;
            } else {
                //如果是斜方向，判断是否是'绊脚'
                //(方法：判断当前点横坐标的后一个点和纵坐标的后一个点不是障碍物，则该斜方向即可行走)
                if (this.notObstacles(Math.abs(x - 1), y) && this.notObstacles(x, Math.abs(y - 1))) {
                    return true;
                }
                return IsIngnoreCorner;
            }
        }

        /**
         * 是否为障碍物（0：不是障碍物；1：障碍物）
         * @private
         * @param {number} x 
         * @param {number} y 
         * @returns {boolean} 
         * @memberof AStart
         */
        private notObstacles(x: number, y: number): boolean {
            return this.mapArray[y][x] == 0;
        }

        /**
         * 在开启列表中找到点，更新 G 和 F 的值，如果计算出来的 G 值比原来小，则更新父节点，并重新计算 G 值和 F 值
         * @private
         * @param {Point} tempStart 父节点
         * @param {Point} point     子节点（周围的8个可以到达节点之一）
         * @memberof AStart
         */
        private findPointInOpenList(tempStart: Point, point: Point): void {
            let G: number = this.calcG(tempStart, point);
            if (G < point.G) {
                point.parentPoint = tempStart;
                point.G = G;
                point.calcF();
            }
        }

        /**
         * 在开启列表中没找到点，加入到开启列表中，并计算该子节点的 G、H 和 F 的值
         * @private
         * @param {Point} tempStart 父节点
         * @param {Point} end       目标点（终点）
         * @param {Point} point     子节点（周围的8个可以到达的节点之一）
         * @memberof AStart
         */
        private notFindPointInOpenList(tempStart: Point, end: Point, point: Point): void {
            point.parentPoint = tempStart;
            point.G = this.calcG(tempStart, point);
            point.H = this.calcH(tempStart, point);
            point.calcF();
            this.OpenList.push(point);
        }

        /**
         * 计算 G：从起点 A 移动到网格上指定方格的移动耗费 (可沿斜方向移动)
         * @private
         * @param {Point} start 父节点
         * @param {Point} point 子节点
         * @returns {number} 
         * @memberof AStart
         */
        private calcG(start: Point, point: Point): number {
            let G = (Math.abs(point.X - start.X) + Math.abs(point.Y - start.Y)) == 2 ? this.OBLIQUE : this.STEP;
            let parentG: number = point.parentPoint != null ? point.parentPoint.G : 0;
            return G + parentG;
        }

        /**
         * 计算 H：从指定的方格移动到终点 B 的预计耗费 (H 有很多计算方法, 这里我们设定只可以上下左右移动)
         * @private
         * @param {Point} end   终点
         * @param {Point} point 子节点
         * @returns {number} 
         * @memberof AStart
         */
        private calcH(end: Point, point: Point): number {
            let step: number = Math.abs(point.X - end.X) + Math.abs(point.X + end.Y);
            return step * this.STEP;
        }
    }

}
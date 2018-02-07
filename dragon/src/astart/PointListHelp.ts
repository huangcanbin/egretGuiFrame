module dragon {

    /**
     * 寻路点辅助工具
     * @author 黄灿滨
     * @export
     * @class PointListHelp
     */
    export class PointListHelp {

        /**
         * 点是否在开启列表中
         * @param list 
         * @param point 
         */
        public static pointIsExistInList(list: Array<Point>, point: Point): boolean {
            for (let i in list) {
                let item: Point = list[i];
                if (item.X == point.X && item.Y == point.Y) {
                    return true;
                }
            }
            return false;
        }

        /**
         * 根据 X 和 Y 坐标，判断是否存在列表中
         * @param {Array<Point>} list 
         * @param {number} x 
         * @param {number} y 
         * @returns {boolean} 
         * @memberof PointListHelp
         */
        public static xyIsExistInList(list: Array<Point>, x: number, y: number): boolean {
            for (let i in list) {
                let item: Point = list[i];
                if (item.X == x && item.Y == y) {
                    return true;
                }
            }
            return false;
        }

        /**
         * 获取 F 值最小的点，作为下一次检查的父节点
         * @param {Array<Point>} list 
         * @returns {Point} 
         * @memberof PointListHelp
         */
        public static MinPoint(list: Array<Point>): Point {
            let pointList: Array<Point> = list;
            pointList.sort((a, b) => {
                return a.F - b.F;
            });
            return pointList.pop();
        }

        /**
         * 添加新的坐标点
         * @param {Array<Point>} list 
         * @param {number} x 
         * @param {number} y 
         * @returns {Point} 
         * @memberof PointListHelp
         */
        public static addPoint(list: Array<Point>, x: number, y: number): void {
            let point: Point = new Point(x, y);
            list.push(point);
        }

        /**
         * 点列表中是否存在该坐标点
         * @param {Array<Point>} list 
         * @param {Point} point 
         * @returns {Point} 
         * @memberof PointListHelp
         */
        public static getPoint(list: Array<Point>, point: Point): Point {
            for (let i in list) {
                let item: Point = list[i];
                if (item.X == point.X && point.Y == point.Y) {
                    return item;
                }
            }
            return null;
        }

        /**
         * 从列表中移除坐标点
         * @param {Array<Point>} list 
         * @param {number} x 
         * @param {number} y 
         * @memberof PointListHelp
         */
        public static removePointFromList(list: Array<Point>, x: number, y: number): void {
            for (let i in list) {
                let point: Point = list[i];
                if (point.X == x && point.Y == y) {
                    list.splice(parseInt(i), 1);
                }
            }
        }
    }

}
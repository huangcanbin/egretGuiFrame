namespace frame.physics
{
	/**
	 * @author 陈小军
	 */
	export class Orientation
	{
		/**
		 * 正交到等距
		 */
		public static toIso(x: number, y: number): egret.Point
		{
			return new egret.Point(0.707106781 * (x - y), 0.35355338 * (x + y));
		}

		/**
		 * 等距到正交(鼠标点击场景的位置是等距)
		 */
		public static toOrt(x: number, y: number): egret.Point
		{
			return new egret.Point(0.707106781 * x + 1.414213562 * y, 1.414213562 * y - 0.707106781 * x);
		}

		/**
		 * 等距大小到正交大小
		 * @param width 
		 */
		public static toWidth(width: number): number
		{
			return Math.sqrt(width * width * 0.5);
		}
	}
}
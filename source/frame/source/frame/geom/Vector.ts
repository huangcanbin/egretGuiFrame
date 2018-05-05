namespace frame.physics
{
	/**
	 * @author 陈小军
	 */
	export class Vector
	{
		public static angle(v1: egret.Point, v2: egret.Point): number
		{
			let sin: number = v1.x * v2.y - v2.x * v1.y;
			let cos: number = v1.x * v2.x + v1.y * v2.y;
			return Math.atan2(sin, cos) * (180 / Math.PI);
		}

		public static dot(v1: egret.Point, v2: egret.Point): number
		{
			return v1.x * v2.x + v1.y * v2.y;
		}
	}
}
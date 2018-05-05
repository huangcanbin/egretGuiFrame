namespace frame.physics
{
	/**
	 * @author 陈小军
	 */
	export class PhysicsEditorTool extends egret.Sprite
	{
		public constructor()
		{
			super();
			let radius: number = 24;
			let numVertices: number = 6;
			let radian: number = -90 * Math.PI / 180 / numVertices;
			let matrix: egret.Matrix = new egret.Matrix();
			let points: egret.Point[] = [];
			let point: egret.Point = new egret.Point(radius, 0);
			for (let i: number = 0; i < numVertices + 1; ++i)
			{
				matrix.identity();
				matrix.rotate(radian * i);
				let position: egret.Point = matrix.transformPoint(point.x, point.y);
				points.push(position);
			}

			for (let i: number = 0; i < numVertices + 1; ++i)
				console.log(i + "," + Math.round(points[i].x) + "," + -Math.round(points[i].y));

			let circle: egret.Sprite = new egret.Sprite();

			circle.graphics.lineStyle(1, 0xff0000);
			circle.graphics.moveTo(0, 0);
			for (let i: number = 0; i < numVertices + 1; ++i)
			{
				circle.graphics.lineTo(points[i].x, points[i].y);
			}
			circle.graphics.lineTo(0, 0);

			circle.x = circle.y = 100;
			this.addChild(circle);
		}
	}
}
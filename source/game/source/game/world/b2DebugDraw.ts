namespace game.world
{
	/**
	 * @author 陈小军
	 */
	export class b2DebugDraw extends box2d.b2Draw
	{
		private m_drawScale: number = 1.0;
		private m_lineThickness: number = 1.0;
		private m_alpha: number = 1.0;
		private m_fillAlpha: number = 1.0;
		private m_ctx: egret.Sprite = null;
		private m_transform: box2d.b2Transform;

		public SetSprite(sprite: egret.Sprite): void
		{
			this.m_ctx = sprite;
		}

		public GetSprite(): egret.Sprite
		{
			return this.m_ctx;
		}

		public SetDrawScale(drawScale: number): void
		{
			this.m_drawScale = drawScale;
		}

		public GetDrawScale(): number
		{
			return this.m_drawScale;
		}

		public SetLineThickness(lineThickness: number): void
		{
			this.m_lineThickness = lineThickness;
		}

		public GetLineThickness(): number
		{
			return this.m_lineThickness;
		}

		public SetAlpha(alpha: number): void
		{
			this.m_alpha = alpha;
		}

		public GetAlpha(): number
		{
			return this.m_alpha;
		}

		public SetFillAlpha(alpha: number): void
		{
			this.m_fillAlpha = alpha;
		}

		public GetFillAlpha(): number
		{
			return this.m_fillAlpha;
		}

		public PushTransform(xf: box2d.b2Transform): void
		{
			this.m_transform = xf;
		}

		public PopTransform(xf: box2d.b2Transform): void
		{
			this.m_transform = null;
		}

		public DrawPolygon(vertices: box2d.b2Vec2[], vertexCount: number, color: box2d.b2Color): void
		{
			let rgb: number = this.RGB(color);
			vertices = this.TranformPoints(vertices, vertexCount);

			this.m_ctx.graphics.lineStyle(this.m_lineThickness, rgb, this.m_alpha);
			this.m_ctx.graphics.moveTo(vertices[0].x * this.m_drawScale, vertices[0].y * this.m_drawScale);
			for (let i: number = 1; i < vertexCount; i++)
				this.m_ctx.graphics.lineTo(vertices[i].x * this.m_drawScale, vertices[i].y * this.m_drawScale);
			this.m_ctx.graphics.lineTo(vertices[0].x * this.m_drawScale, vertices[0].y * this.m_drawScale);
		}

		public DrawSolidPolygon(vertices: box2d.b2Vec2[], vertexCount: number, color: box2d.b2Color): void
		{
			let rgb: number = this.RGB(color);
			vertices = this.TranformPoints(vertices, vertexCount);

			this.m_ctx.graphics.lineStyle(this.m_lineThickness, rgb, this.m_alpha);
			this.m_ctx.graphics.beginFill(rgb, this.m_fillAlpha);
			this.m_ctx.graphics.moveTo(vertices[0].x * this.m_drawScale, vertices[0].y * this.m_drawScale);
			for (let i: number = 1; i < vertexCount; i++)
				this.m_ctx.graphics.lineTo(vertices[i].x * this.m_drawScale, vertices[i].y * this.m_drawScale);
			this.m_ctx.graphics.lineTo(vertices[0].x * this.m_drawScale, vertices[0].y * this.m_drawScale);
			this.m_ctx.graphics.endFill();
		}

		public DrawCircle(center: box2d.b2Vec2, radius: number, color: box2d.b2Color): void
		{
			let rgb: number = this.RGB(color);
			center = this.TranformPoint(center);

			this.m_ctx.graphics.lineStyle(this.m_lineThickness, rgb, this.m_alpha);
			this.m_ctx.graphics.drawCircle(center.x * this.m_drawScale, center.y * this.m_drawScale, radius * this.m_drawScale);
			this.m_ctx.graphics.endFill();
		}

		public DrawSolidCircle(center: box2d.b2Vec2, radius: number, axis: box2d.b2Vec2, color: box2d.b2Color): void
		{
			let rgb: number = this.RGB(color);
			axis = this.TranformPoint(new box2d.b2Vec2(center.x + axis.x * radius, center.y + axis.y * radius));
			center = this.TranformPoint(center);

			this.m_ctx.graphics.lineStyle(this.m_lineThickness, rgb, this.m_alpha);
			this.m_ctx.graphics.beginFill(rgb, this.m_fillAlpha);
			this.m_ctx.graphics.drawCircle(center.x * this.m_drawScale, center.y * this.m_drawScale, radius * this.m_drawScale);
			this.m_ctx.graphics.endFill();
			this.m_ctx.graphics.moveTo(center.x * this.m_drawScale, center.y * this.m_drawScale);
			this.m_ctx.graphics.lineTo(axis.x * this.m_drawScale, axis.y * this.m_drawScale);
		}

		public DrawSegment(p1: box2d.b2Vec2, p2: box2d.b2Vec2, color: box2d.b2Color): void
		{
			p1 = this.TranformPoint(p1);
			p2 = this.TranformPoint(p2);
			let rgb: number = this.RGB(color);

			this.m_ctx.graphics.lineStyle(this.m_lineThickness, rgb, this.m_alpha);
			this.m_ctx.graphics.moveTo(p1.x * this.m_drawScale, p1.y * this.m_drawScale);
			this.m_ctx.graphics.lineTo(p2.x * this.m_drawScale, p2.y * this.m_drawScale);
		}

		public DrawTransform(xf: box2d.b2Transform): void
		{
			let from: box2d.b2Vec2 = box2d.b2Transform.MulXV(xf, new box2d.b2Vec2(), new box2d.b2Vec2());
			let to: box2d.b2Vec2 = box2d.b2Transform.MulXV(xf, new box2d.b2Vec2(0.25, 0), new box2d.b2Vec2());
			this.m_ctx.graphics.lineStyle(this.m_lineThickness, 0xff0000, this.m_alpha);
			this.m_ctx.graphics.moveTo(from.x * this.m_drawScale, from.y * this.m_drawScale);
			this.m_ctx.graphics.lineTo(to.x * this.m_drawScale, to.y * this.m_drawScale);

			this.m_ctx.graphics.lineStyle(this.m_lineThickness, 0xff00, this.m_alpha);
			to = box2d.b2Transform.MulXV(xf, new box2d.b2Vec2(0, 0.25), new box2d.b2Vec2());
			this.m_ctx.graphics.moveTo(from.x * this.m_drawScale, from.y * this.m_drawScale);
			this.m_ctx.graphics.lineTo(to.x * this.m_drawScale, to.y * this.m_drawScale);
		}

		public DrawParticles(centers: box2d.b2Vec2[], radius: number, colors: box2d.b2Color[], count: number): void
		{
			console.error("DrawParticles");
		}

		public Clear(): void
		{
			this.m_ctx.graphics.clear();
		}

		private RGB(color: box2d.b2Color): number
		{
			let r: number = Math.round(255 * color.r);
			let g: number = Math.round(255 * color.g);
			let b: number = Math.round(255 * color.b);
			return r << 16 | g << 8 | b;
		}

		private TranformPoints(vertices: box2d.b2Vec2[], vertexCount: number): box2d.b2Vec2[]
		{
			let points: box2d.b2Vec2[] = [];
			for (let i: number = 0; i < vertexCount; ++i)
				points.push(box2d.b2Transform.MulXV(this.m_transform, vertices[i], new box2d.b2Vec2()));
			return points;
		}

		private TranformPoint(vector: box2d.b2Vec2): box2d.b2Vec2
		{
			return box2d.b2Transform.MulXV(this.m_transform, vector, new box2d.b2Vec2());
		}
	}
}
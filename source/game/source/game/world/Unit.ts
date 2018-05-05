namespace game.world
{
	/**
	 * @author 陈小军
	 */
	export class Unit extends IUnit
	{
		private _body: box2d.b2Body;
		private _display: egret.Sprite;
		private body: box2d.b2BodyDef;
		private fixtures: box2d.b2FixtureDef[];
		private shapes: box2d.b2PolygonShape[][];

		public constructor()
		{
			super();
			this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
			this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
		}

		public setBody(body: frame.physics.Body): void
		{
			this.shapes = [];
			this.fixtures = [];
			this.body = new box2d.b2BodyDef();
			this.body.type = box2d.b2BodyType.b2_staticBody;
			this.body.position = new box2d.b2Vec2(0, 0);
			let fixtures: frame.physics.Fixture[] = body.fixtures;
			for (let i: number = 0; i < fixtures.length; ++i)
			{
				let fixture: frame.physics.Fixture = fixtures[i];
				let fixtured: box2d.b2FixtureDef = new box2d.b2FixtureDef();
				fixtured.density = fixture.density;
				fixtured.restitution = fixture.restitution;
				fixtured.friction = fixture.friction;
				this.fixtures.push(fixtured);
				let shapes: box2d.b2PolygonShape[] = [];
				let polygons: box2d.b2Vec2[][] = fixture.polygons;
				for (let j: number = 0; j < polygons.length; ++j)
				{
					let shape: box2d.b2PolygonShape = new box2d.b2PolygonShape();
					shape.SetAsArray(polygons[j]);
					shapes.push(shape);
				}
				this.shapes.push(shapes);
			}

			if (this.added)
				this.addBody(this.world);
		}

		public setDisplay(display: egret.Sprite): void
		{
			this._display = display;
			if (this.added)
				this.addDisplay(this.world);
		}

		private onAddedToStage(event: egret.Event): void
		{
			this.addDisplay(this.world);
			this.addBody(this.world);
		}

		private onRemovedFromStage(event: egret.Event): void
		{
		}

		private addDisplay(world: game.world.World): void
		{
			world.canvas.addChild(this._display);
			this._display.x = this.x;
			this._display.y = this.y;
		}

		private addBody(world: game.world.World): void
		{
			this.newBody(world);
			let x: number = this.x / world.pixelToMeter;
			let y: number = this.y / world.pixelToMeter;
			let position: box2d.b2Vec2 = new box2d.b2Vec2(x, y);
			this._body.SetPosition(position);
		}

		private newBody(world: game.world.World): void
		{
			this._body = world.world.CreateBody(this.body);
			for (let i: number = 0; i < this.fixtures.length; ++i)
			{
				let shapes: box2d.b2PolygonShape[] = this.shapes[i];
				for (let j: number = 0; j < shapes.length; ++j)
				{
					this.fixtures[i].shape = shapes[j];
					this._body.CreateFixture(this.fixtures[i]);
				}
			}
		}
	}
}
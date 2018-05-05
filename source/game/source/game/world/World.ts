namespace game.world
{
	/**
	 * @author 陈小军
	 */
	export class World
	{
		private time: number;
		private children: Unit[];
		private _display: egret.Sprite;
		private _canvas: egret.Sprite;
		private debugging: egret.Sprite;
		private _pixelToMeter: number = 32;
		private _world: box2d.b2World;
		private debugger: b2DebugDraw;

		public constructor()
		{
			this.newDisplay();
			this.newWorld();
			this.newDebugger();
			this.children = [];
		}

		public get display(): egret.Sprite
		{
			return this._display;
		}

		public get canvas(): egret.Sprite
		{
			return this._canvas;
		}

		public get world(): box2d.b2World
		{
			return this._world;
		}

		public get pixelToMeter(): number
		{
			return this._pixelToMeter;
		}

		public addChild(unit: Unit): void
		{
			this.children.push(unit);
			unit.world = this;
		}

		private newDisplay(): void
		{
			this._display = new egret.Sprite();
			this._canvas = new egret.Sprite();
			this._display.addChild(this._canvas);
			this.debugging = new egret.Sprite();
			this._display.addChild(this.debugging);
			this.time = egret.getTimer();
			this._display.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
		}

		private newWorld(): void
		{
			let gravity: box2d.b2Vec2 = new box2d.b2Vec2(0, 9.81);
			this._world = new box2d.b2World(gravity);
			let feedback: Feedback = new Feedback(this);
			this.world.SetContactListener(feedback);
		}

		private newDebugger(): void
		{
			this.debugger = new b2DebugDraw();
			this.debugger.SetSprite(this.debugging);
			this.debugger.SetDrawScale(this.pixelToMeter);
			this.debugger.SetLineThickness(1);
			this.debugger.SetAlpha(0.8);
			this.debugger.SetFillAlpha(0.0);
			this.debugger.SetFlags(box2d.b2DrawFlags.e_shapeBit);
			this.world.SetDebugDraw(this.debugger);
		}

		private onEnterFrame(event: egret.Event): void
		{
			let time: number = egret.getTimer();
			let step: number = (time - this.time) / 1000;
			this.world.Step(step, 10, 10);
			this.debugger.Clear();
			this.world.DrawDebugData();
			this.time = time;
			// 清除力和扭矩
			this.world.ClearForces();
		}
	}
}
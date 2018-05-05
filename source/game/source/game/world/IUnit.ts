namespace game.world
{
	/**
	 * @author 陈小军
	 */
	export class IUnit extends egret.EventDispatcher
	{
		private _x: number;
		private _y: number;
		private _world: World;
		private _type: box2d.b2BodyType;

		public constructor()
		{
			super();
			this._x = 0;
			this._y = 0;
			this._world = null;
		}

		public get x(): number
		{
			return this._x;
		}

		public set x(value: number)
		{
			this._x = value;
		}

		public get y(): number
		{
			return this._y;
		}

		public set y(value: number)
		{
			this._y = value;
		}

		public get world(): World
		{
			return this._world;
		}

		public set world(value: World)
		{
			if (this._world == null && value)
			{
				this._world = value;
				this.dispatchEventWith(egret.Event.ADDED_TO_STAGE);
			}
			else if (this._world && value == null)
			{
				this.dispatchEventWith(egret.Event.REMOVED_FROM_STAGE);
				this._world = value;
			}
		}

		public get added(): boolean
		{
			return this._world != null;
		}
	}
}
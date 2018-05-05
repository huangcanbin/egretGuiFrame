namespace frame.physics
{
	/**
	 * @author 陈小军
	 */
	export class Body
	{
		private _name: string;
		private _anchorpoint: egret.Point;
		private _fixtures: Fixture[];

		public constructor()
		{
			this._name = "";
			this._fixtures = [];
			this._anchorpoint = new egret.Point();
		}

		public get name(): string
		{
			return this._name;
		}

		public set name(value: string)
		{
			this._name = value;
		}

		public get anchorpoint(): egret.Point
		{
			return this._anchorpoint;
		}

		public set anchorpoint(value: egret.Point)
		{
			this._anchorpoint = value;
		}

		public get fixtures(): Fixture[]
		{
			return this._fixtures;
		}

		public set fixtures(value: Fixture[])
		{
			this._fixtures = value;
		}
	}
}
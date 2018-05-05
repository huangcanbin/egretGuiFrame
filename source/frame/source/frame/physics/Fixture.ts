namespace frame.physics
{
	/**
	 * @author 陈小军
	 */
	export class Fixture
	{
		private _density: number;
		private _friction: number;
		private _restitution: number;
		private _filter_categoryBits: number;
		private _filter_groupIndex: number;
		private _filter_maskBits: number;
		private _fixture_type: string;
		private _polygons: box2d.b2Vec2[][];

		public constructor()
		{
			this._polygons = [];
		}

		public get density(): number
		{
			return this._density;
		}

		public set density(value: number)
		{
			this._density = value;
		}

		public get friction(): number
		{
			return this._friction;
		}

		public set friction(value: number)
		{
			this._friction = value;
		}

		public get restitution(): number
		{
			return this._restitution;
		}

		public set restitution(value: number)
		{
			this._restitution = value;
		}

		public get filter_categoryBits(): number
		{
			return this._filter_categoryBits;
		}

		public set filter_categoryBits(value: number)
		{
			this._filter_categoryBits = value;
		}

		public get filter_groupIndex(): number
		{
			return this._filter_groupIndex;
		}

		public set filter_groupIndex(value: number)
		{
			this._filter_groupIndex = value;
		}

		public get filter_maskBits(): number
		{
			return this._filter_maskBits;
		}

		public set filter_maskBits(value: number)
		{
			this._filter_maskBits = value;
		}

		public get fixture_type(): string
		{
			return this._fixture_type;
		}

		public set fixture_type(value: string)
		{
			this._fixture_type = value;
		}

		public get polygons(): box2d.b2Vec2[][]
		{
			return this._polygons;
		}

		public set polygons(value: box2d.b2Vec2[][])
		{
			this._polygons = value;
		}
	}
}
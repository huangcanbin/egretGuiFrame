namespace frame.physics
{
	/**
	 * @author 陈小军
	 */
	export class Metadata
	{
		private _format: number;
		private _ptm_ratio: number;

		public constructor()
		{
		}

		public get format(): number
		{
			return this._format;
		}

		public set format(value: number)
		{
			this._format = value;
		}

		public get ptm_ratio(): number
		{
			return this._ptm_ratio;
		}

		public set ptm_ratio(value: number)
		{
			this._ptm_ratio = value;
		}
	}
}
namespace frame.display
{
	/**
	 * @author 陈小军
	 */
	export class FrameRate implements IFrameRate
	{
		private _framerate: number;

		public get framerate(): number
		{
			return 100;
		}

		public set framerate(value: number)
		{
			this._framerate = value;
		}
	}
}
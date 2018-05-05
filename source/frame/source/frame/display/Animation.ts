namespace frame.display
{
	/**
	 * @author 陈小军
	 */
	export abstract class Animation extends egret.Sprite implements IAnimation
	{
		private _resources: IResources;
		private _framerate: IFrameRate;

		public constructor()
		{
			super();
			this._resources = this.newResources();
			this._framerate = this.newFrameRate();
		}

		public abstract play(name: string): void;

		public dispose(): void
		{
		}

		public get framerate(): IFrameRate
		{
			return this._framerate;
		}

		public get resources(): IResources
		{
			return this._resources;
		}

		public newFrameRate(): IFrameRate
		{
			return new FrameRate();
		}

		public newResources(): IResources
		{
			return new Resources();
		}
	}
}
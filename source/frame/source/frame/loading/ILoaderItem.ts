namespace frame.loading
{
	/**
	 * @author 陈小军
	 */
	export abstract class ILoaderItem extends egret.EventDispatcher
	{
		private _url: string;
		protected _status: LoaderStatus;

		public constructor(url: string)
		{
			super();
			this._url = url;
		}

		public get url(): string
		{
			return this._url;
		}

		public get status(): LoaderStatus
		{
			return this._status;
		}

		public clear(): void
		{
		}

		public abstract become(value: LoaderStatus): void;

		public abstract error(stream: frame.loading.IStream): void;

		public abstract complete(stream: frame.loading.IStream): void;

		public abstract onComplete(event: egret.Event): void;

		public abstract onIOError(event: egret.IOErrorEvent): void;
	}
}
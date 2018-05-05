namespace frame.loading
{
	/**
	 * @author 陈小军
	 */
	export abstract class Stream extends egret.EventDispatcher implements IStream
	{
		private data: any;
		private _url: string;
		private _status: StreamStatus;
		private stream: egret.URLLoader;

		public constructor(url: string)
		{
			super();
			this._url = url;
			this.stream = new egret.URLLoader();
			this.stream.dataFormat = this.format();
			this.stream.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
			this.stream.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onIOError, this);
			this.become(StreamStatus.READY);
		}

		public get url(): string
		{
			return this._url;
		}

		public get content(): any
		{
			return this.data;
		}

		public get status(): StreamStatus
		{
			return this._status;
		}

		private become(value: StreamStatus): void
		{
			this._status = value;
		}

		public load(): void
		{
			if (this.status == StreamStatus.READY)
			{
				this.become(StreamStatus.LOADING);
				this.stream.load(new egret.URLRequest(this.url + "?version=" + Resources.version(this.url)));
			}
			else
			{
				throw new Error(this.url + "处理中或处理完。");
			}
		}

		private onComplete(event: egret.Event): void
		{
			if (this.stream.data)
				this.data = this.decode(this.stream.data);
			this.become(StreamStatus.COMPLETE);
			this.dispatchEventWith(egret.Event.COMPLETE);
		}

		private onIOError(event: egret.IOErrorEvent): void
		{
			console.error("加载" + this.url + "失败。");
			this.become(StreamStatus.ERROR);
			this.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
		}

		protected abstract format(): string

		protected abstract decode(value: any): any;
	}
}
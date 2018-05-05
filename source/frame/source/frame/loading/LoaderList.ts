namespace frame.loading
{
	/**
	 * @author 陈小军
	 */
	export class LoaderList extends ILoaderItem
	{
		public count: number;
		public urls: string[];
		private states: Object;
		private state: LoaderListState;
		public children: ILoaderItem[];

		public constructor(url: string = "")
		{
			super(url);
			this.children = [];
			this.states = new Object();
			this.states[LoaderStatus.READY] = new ReadyLoaderList(this);
			this.states[LoaderStatus.INSIDE] = new InsideLoaderList(this);
			this.states[LoaderStatus.LOADING] = new LoadingLoaderList(this);
			this.states[LoaderStatus.COMPLETE] = new CompleteLoaderList(this);
			this.states[LoaderStatus.ERROR] = new ErrorLoaderList(this);
			this.become(LoaderStatus.READY);
		}

		public load(): void
		{
			this.state.load();
		}

		public addChild(child: ILoaderItem): void
		{
			this.state.addChild(child);
		}

		public get numChildren(): number
		{
			return this.children.length;
		}

		public getChild(url: string): ILoaderItem
		{
			let length: number = this.numChildren;
			for (let i: number = 0; i < length; ++i)
				if (url == this.children[i].url)
					return this.children[i];
			return null;
		}

		public getChildAt(index: number): ILoaderItem
		{
			if (index > -1 && index < this.numChildren)
				return this.children[index];
			throw new Error("ERROR");
		}

		public become(value: LoaderStatus): void
		{
			this._status = value;
			this.state = this.states[value];
		}

		public complete(stream: frame.loading.IStream): void
		{
			stream.removeEventListener(egret.Event.COMPLETE, this.onComplete, this);
			stream.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onIOError, this);
			let quantity: number = this.howmany(stream.url);
			this.dispatchEventWith(egret.ProgressEvent.PROGRESS, false, (this.count + quantity) / this.urls.length);
			if ((this.count += quantity) == this.urls.length)
				this.dispatchEventWith(egret.Event.COMPLETE);
		}

		public error(stream: frame.loading.IStream): void
		{
			this.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
			this.complete(stream);
		}

		public onComplete(event: egret.Event): void
		{
			let stream: frame.loading.IStream = event.target as frame.loading.IStream;
			this.complete(stream);
		}

		public onIOError(event: egret.IOErrorEvent): void
		{
			let stream: frame.loading.IStream = event.target as frame.loading.IStream;
			this.error(stream);
		}

		/**
		 * 计数
		 */
		private howmany(url: string): number
		{
			let quantity: number = 0;
			for (let i: number = 0; i < this.urls.length; ++i)
				if (this.urls[i] == url)
					++quantity;
			return quantity;
		}
	}
}
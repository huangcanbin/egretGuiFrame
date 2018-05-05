///<reference path="ILoaderItem.ts"/>
namespace frame.loading
{
	/**
	 * @author 陈小军
	 */
	export class LoaderItem extends ILoaderItem
	{
		private states: Object;
		private state: LoaderItemState;

		public constructor(url: string)
		{
			super(url);
			this.states = new Object();
			this.states[LoaderStatus.READY] = new ReadyLoaderItem(this);
			this.states[LoaderStatus.INSIDE] = new InsideLoaderItem(this);
			this.states[LoaderStatus.LOADING] = new LoadingLoaderItem(this);
			this.states[LoaderStatus.COMPLETE] = new CompleteLoaderItem(this);
			this.states[LoaderStatus.ERROR] = new ErrorLoaderItem(this);
			this.become(LoaderStatus.READY);
		}

		public load(): void
		{
			this.state.load();
		}

		public get content(): any
		{
			return this.state.content;
		}

		public become(value: LoaderStatus): void
		{
			this._status = value;
			this.state = this.states[value];
		}

		public error(stream: frame.loading.IStream): void
		{
			this.become(LoaderStatus.ERROR);
			stream.removeEventListener(egret.Event.COMPLETE, this.onComplete, this);
			stream.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onIOError, this);
			this.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
		}

		public complete(stream: frame.loading.IStream): void
		{
			this.become(LoaderStatus.COMPLETE);
			stream.removeEventListener(egret.Event.COMPLETE, this.onComplete, this);
			stream.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onIOError, this);
			this.dispatchEventWith(egret.Event.COMPLETE);
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
	}
}
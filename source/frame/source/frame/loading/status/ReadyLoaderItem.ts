namespace frame.loading
{
	/**
	 * @author 陈小军
	 */
	export class ReadyLoaderItem extends LoaderItemState
	{
		public constructor(parent: LoaderItem)
		{
			super(parent);
		}

		public load(): void
		{
			this.parent.become(LoaderStatus.LOADING);
			let stream: frame.loading.IStream = Resources.need(this.parent.url);
			stream.addEventListener(egret.Event.COMPLETE, this.parent.onComplete, this.parent);
			stream.addEventListener(egret.IOErrorEvent.IO_ERROR, this.parent.onIOError, this.parent);
			switch (stream.status)
			{
				case StreamStatus.ERROR:
					this.parent.error(stream);
					break;
				case StreamStatus.COMPLETE:
					this.parent.complete(stream);
					break;
			}
		}

		public get content(): any
		{
			throw new Error("ERROR");
		}
	}
}
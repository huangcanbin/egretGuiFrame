namespace frame.loading
{
	/**
	 * @author 陈小军
	 */
	export class ReadyLoaderList extends LoaderListState
	{
		public constructor(parent: LoaderList)
		{
			super(parent);
		}

		public load(): void
		{
			this.forEachChild(this.parent);
		}

		private forEachChild(list: LoaderList): string[]
		{
			let urls: string[] = [];
			let child: ILoaderItem = null;
			let length: number = list.children.length;
			for (let i: number = 0; i < length; ++i)
			{
				child = list.children[i];
				if (child instanceof LoaderList)
				{
					urls = urls.concat(this.forEachChild(child as LoaderList));
				}
				else
				{
					let stream: IStream = Resources.need(child.url);
					this.addOrSendEvent(child, stream);
					urls.push(child.url);
				}
			}

			list.count = 0;
			list.urls = urls;
			let size: number = urls.length;
			for (let j: number = 0; j < size; ++j)
			{
				let stream: IStream = Resources.need(urls[j]);
				this.addOrSendEvent(list, stream);
			}
			if (urls.length == 0)
			{
				list.become(LoaderStatus.COMPLETE);
				list.dispatchEventWith(egret.Event.COMPLETE);
			}

			return urls;
		}

		public addChild(child: ILoaderItem): void
		{
			if (child.status == LoaderStatus.READY)
			{
				this.parent.children.push(child);
				child.become(LoaderStatus.INSIDE);
			}
		}

		private addOrSendEvent(loader: ILoaderItem, stream: frame.loading.IStream): void
		{
			stream.addEventListener(egret.Event.COMPLETE, loader.onComplete, loader);
			stream.addEventListener(egret.IOErrorEvent.IO_ERROR, loader.onIOError, loader);
			switch (stream.status)
			{
				case StreamStatus.ERROR:
					loader.error(stream);
					break;
				case StreamStatus.COMPLETE:
					loader.complete(stream);
					break;
			}
		}
	}
}
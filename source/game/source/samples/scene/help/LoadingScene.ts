namespace samples.scene
{
	/**
	 * @author 陈小军
	 */
	export abstract class LoadingScene extends frame.scene.Scene
	{
		private _urls: Array<string>;
		private loaders: frame.loading.LoaderList;

		public constructor()
		{
			super();
			this._urls = this.urls();
		}

		/**
		 * 添加资源
		 */
		public push(url: string): void
		{
			this._urls.push(url);
		}

		public onOpen(): void
		{
			console.log("进入Loading");
			this.load();
		}

		public onClose(): void
		{
			console.log("退出Loading");
		}

		private load(): void
		{
			this.loaders = new frame.loading.LoaderList();
			let length: number = this._urls.length;
			for (let i: number = 0; i < length; ++i)
				this.loaders.addChild(new frame.loading.LoaderItem(this._urls[i]));
			this.loaders.addEventListener(egret.Event.COMPLETE, this._onComplete, this);
			this.loaders.addEventListener(egret.ProgressEvent.PROGRESS, this._onProgress, this);
			this.loaders.load();
		}

		private _onComplete(event: egret.Event): void
		{
			this.onComplete();
			this.dispatchEventWith(egret.Event.COMPLETE);
		}

		private _onProgress(event: egret.ProgressEvent): void
		{
			let progress = event.data as number;
			this.onProgress(progress);
		}

		protected abstract onComplete(): void;

		protected abstract onProgress(progress: number): void;

		protected abstract urls(): Array<string>;
	}
}
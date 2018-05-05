module dragon
{
	/**
	 * 场景加载界面
	 * @export
	 * @abstract
	 * @class LoadingScene
	 * @extends {frame.scene.Scene}
	 */
	export abstract class BaseLoadingScene extends frame.scene.Scene
	{
		private _urls: Array<string>;
		private loaders: frame.loading.LoaderList;
		private _display: fairygui.GComponent;

		public constructor()
		{
			super();
			this._urls = this.urls();
		}

		/**
		 * 添加资源路径
		 * @param {string} url 
		 * @memberof BaseLoadingScene
		 */
		public push(url: string): void
		{
			this._urls.push(url);
		}

		public onOpen(): void
		{
			console.log("进入Loading");
			// this.load();
		}

		public onClose(): void
		{
			console.log("退出Loading");
		}

		public load(): void
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

		/**
		 * 场景资源加载完成后回调
		 * @protected
		 * @abstract
		 * @memberof BaseLoadingScene
		 */
		protected abstract onComplete(): void;

		/**
		 * 资源加载进度（0-1）
		 * @protected
		 * @abstract
		 * @param {number} progress 
		 * @memberof BaseLoadingScene
		 */
		protected abstract onProgress(progress: number): void;

		/**
		 * 资源路径集合
		 * @protected
		 * @abstract
		 * @returns {Array<string>} 
		 * @memberof BaseLoadingScene
		 */
		protected abstract urls(): Array<string>;

		protected newCanvas(root: egret.Sprite): dragon.BaseCanvas
		{
			return new dragon.BaseCanvas(root);
		}
	}
}
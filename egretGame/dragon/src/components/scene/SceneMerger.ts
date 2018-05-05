module dragon
{
    /**
      * 有loading界面的场景
      */
    export abstract class SceneMerger extends frame.scene.SceneSet
    {
        private loading: BaseLoadingScene;
        private studio: frame.scene.IScene;

        public constructor()
        {
            super();
            this.studio = this.newStudio();
            this.loading = this.newLoading();
        }

		/**
		 * 开始加载资源
		 */
        private load(): void
        {
            let urls: Array<string> = this.urls();
            for (let i: number = 0; i < urls.length; ++i)
                this.loading.push(urls[i]);
            this.loading.addEventListener(egret.Event.COMPLETE, this._onComplete, this);
        }

        public onOpen(): void
        {
            this.open(this.loading);
            this.load();
            this.loading.load();
        }

        public onClose(): void
        {
        }

        private _onComplete(event: egret.Event): void
        {
            this.open(this.studio);
        }

		/**
		 * 要加载的资源
		 */
        protected abstract urls(): Array<string>;

		/**
		 * 加载场景
		 */
        protected abstract newLoading(): BaseLoadingScene;

		/**
		 * 主场景
		 */
        protected abstract newStudio(): frame.scene.IScene;
    }
}
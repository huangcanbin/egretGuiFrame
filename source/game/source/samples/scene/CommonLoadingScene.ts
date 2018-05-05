///<reference path="help/LoadingScene"/>
namespace samples.scene
{
	/**
	 * @author 陈小军
	 * 通用加载场景
	 */
	export class CommonLoadingScene extends LoadingScene
	{
		public constructor()
		{
			super();
		}

		/**
		 * 场景实际显示出来，会调用这个方法
		 */
		public onOpen(): void
		{
			super.onOpen();
			let display = gui.Loading.UI_Loading.createInstance();
			let window = new frame.layout.Display();
			window.display = display;
			window.clean = true;
			this.windows.addChild(window);
		}

		/**
		 * 返回要加载的资源
		 */
		protected urls(): Array<string>
		{
			return [];
		}

		/**
		 * 加载完成回调函数
		 */
		protected onComplete(): void
		{
		}

		/**
		 * 加载进度回调函数
		 */
		protected onProgress(progress: number): void
		{
		}

		protected newCanvas(root: egret.Sprite): frame.scene.Canvas
		{
			return new frame.scene.Canvas(root);
		}
	}
}
///<reference path="help/LoadingScene"/>
namespace samples.scene
{
	/**
	 * @author 陈小军
	 * 通用加载场景
	 */
	export class SmallLoadingScene extends LoadingScene
	{
		public constructor()
		{
			super();
		}

		public onOpen(): void
		{
			super.onOpen();
			// 显示进度条
			// let display = gui.SmallLoading.UI_SmallLoading.createInstance();
			// let window = new frame.layout.Display();
			// window.display = display;
			// window.clean = true;
			// // this.windows是窗口管理器
			// this.windows.addChild(window);

			// let a = new MenuBaseComponents()
			// this.windows.addChild(a);
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
namespace samples.scene
{
	/**
	 * @author 陈小军
	 * 场景0 -- 用来加载SmallLoading，就这么简单
	 */
	export class HeadScene extends LoadingScene
	{
		public constructor()
		{
			super();
		}

		/**
		 * 加载的资源列表
		 */
		protected urls(): Array<string>
		{
			let assets = new Array<string>();
			assets.push("binary/assets/SmallLoading.fui");
			assets.push("binary/assets/SmallLoading@atlas0.png");
			assets.push("binary/assets/SmallLoading@atlas0_1.png");
			assets.push("binary/assets/SmallLoading@atlas0_2.png");
			assets.push("binary/assets/SmallLoading@atlas0_3.png");
			assets.push("binary/assets/SmallLoading@atlas0_4.png");
			assets.push("binary/assets/SmallLoading@atlas0_5.png");
			assets.push("binary/assets/SmallLoading@atlas0_6.png");
			assets.push("binary/assets/SmallLoading@atlas0_7.png");
			assets.push("binary/assets/SmallLoading@atlas0_8.png");
			assets.push("binary/assets/SmallLoading@atlas0_9.png");
			assets.push("binary/assets/SmallLoading@atlas0_10.png");
			assets.push("binary/assets/SmallLoading@atlas0_11.png");
			assets.push("binary/assets/SmallLoading@atlas0_12.png");
			return assets;
		}

		/**
		 * 加载完成回调函数
		 */
		protected onComplete(): void
		{
			// 这里后面会进行优化
			fairygui.UIPackage.addPackage("binary/assets/SmallLoading.fui");
			// 跳转到下一个场景
			let scene = new InitScene();
			this.scenes.open(scene);
		}

		/**
		 * 加载进度回调函数
		 */
		protected onProgress(progress: number): void
		{
			this.canvas.display;
			// let ui = this.windows as UI;
			// ui.re
		}

		/**
		 * 使用白鹭的API 用于显示地图，动画之类的（跟fairygui一点关系都没有哦）
		 */
		protected newCanvas(root: egret.Sprite): frame.scene.Canvas
		{
			return new frame.scene.Canvas(root);
		}
	}
}
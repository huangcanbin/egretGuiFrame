///<reference path="help/SceneMerger.ts"/>
namespace samples.scene
{
	/**
	 * 场景2 -- 没有什么东西
	 * 该场景之所以继承自SceneMerger，是因为ABC场景前有个Loading场景
	 */
	export class MainScene extends SceneMerger
	{
		/**
		 * Loading场景要加载的资源列表，在这里列出来
		 */
		protected urls(): string[]
		{
			let assets = new Array<string>();
			assets.push("binary/assets/Main.fui");
			assets.push("binary/assets/a.png");
			return assets;
		}

		/**
		 * 你可以指定一个Loading场景用于加载ABC场景的资源
		 */
		protected newLoading(): LoadingScene
		{
			return new CommonLoadingScene();
		}

		/**
		 * Loading场景加载完后，跳转到实际场景进行工作
		 */
		protected newStudio(): frame.scene.IScene
		{
			return new ABC();
		}
	}

	/**
	 * 是MainScene的实际场景
	 */
	class ABC extends frame.scene.Scene
	{
		public constructor()
		{
			super();
		}
		private index: number = 0;
		/**
		 * 场景实际显示出来，会调用这个方法
		 */
		public onOpen(): void
		{
			console.log("进入ABC");
			// 取得窗口管理器，用于添加像背包之类的UI
			fairygui.UIPackage.addPackage("binary/assets/Main.fui");

			let a = this.aaa();

			let t = frame.loading.Resources.getRes("binary/assets/a.png");
			let s = new egret.Sprite();
			s.touchEnabled = true;
			s.addChild(new egret.Bitmap(t));
			this.canvas.display.addChild(s);
			s.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		}

		private onTouch(event: egret.TouchEvent): void
		{
		}

		private onReleaseOutside(event: egret.Event): void
		{
			this.windows.removeChild(event.target);
			event.target.removeEventListener(frame.layout.IDisplay.RELEASEOUTSIDE, this.onReleaseOutside, this);

			let a = this.aaa();
			if (this.index++ % 2 == 0)
				a.setCenter();
		}

		private aaa(): frame.layout.Window
		{
			let a = gui.Main.UI_Component1.createInstance();
			a.displayObject.name = "a";
			let windows = new frame.layout.Window();
			windows.display = a;
			this.windows.addChild(windows);
			// windows.addEventListener(frame.layout.IDisplay.RELEASEOUTSIDE, this.onReleaseOutside, this);
			return windows;
		}

		/**
		 * 场景被切换出去后，会调用这个方法
		 */
		public onClose(): void
		{
			console.log("退出ABC");
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
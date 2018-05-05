///<reference path="SmallLoadingScene"/>
namespace samples.scene
{
	/**
	 * 场景1 -- 好像也没有什么东西
	 */
	export class InitScene extends SmallLoadingScene
	{
		/**
		 * 加载的资源列表
		 */
		protected urls(): string[]
		{
			let assets = new Array<string>();
			assets.push("binary/setting/scenes.json");
			assets.push("binary/assets/Loading.fui");
			return assets;
		}

		/**
		 * 加载完成回调函数
		 */
		protected onComplete(): void
		{
			fairygui.UIPackage.addPackage("binary/assets/Loading.fui");
			// 进入下一个场景
			let scene = new MainScene();
			this.scenes.open(scene);
		}
	}
}
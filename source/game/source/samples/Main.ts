class Main extends egret.Sprite
{
	private scenes: samples.scene.SceneManager;

	public constructor()
	{
		super();
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
	}

	private onAddedToStage(event: egret.Event): void
	{
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
		//
		fairygui.Resource.setResourceManager(new frame.ui.Loading());
		gui.Loading.LoadingBinder.bindAll();
		gui.SmallLoading.SmallLoadingBinder.bindAll();
		gui.Main.MainBinder.bindAll();
		//
		this.scenes = new samples.scene.SceneManager(this);
		let scene = new samples.scene.HeadScene();
		this.scenes.open(scene);

		// let loader = new frame.loading.LoaderItem("aa.zip");
		// loader.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
		// loader.load();
	}

	// private onComplete(event: egret.Event): void
	// {
	// 	let aa = frame.loading.Resources.getRes("aa.zip");
	// 	let zip = new JSZip("");
	// 	zip.file("versions.txt");
	// }
}
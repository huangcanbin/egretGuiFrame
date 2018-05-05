class LoadSample extends egret.Sprite
{
	// 加载器，加载器是一次性的，为了设计方便
	private loaders: frame.extension.LoadingList;

	public constructor()
	{
		super();
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
	}

	private onAddedToStage(event: egret.Event): void
	{
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
		// 加载文件例子
		this.loaders = new frame.extension.LoadingList();
		this.loaders.push("binary/resources/1.png");
		this.loaders.push("binary/resources/2.png");
		this.loaders.push("binary/resources/3.png");
		// 注册事件
		this.loaders.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
		this.loaders.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onIOError, this);
		this.loaders.addEventListener(egret.ProgressEvent.PROGRESS, this.onProgress, this);
		// 开始加载
		this.loaders.load();
	}

	/**
	 * 文件加载成功后的回调函数
	 * @param event 没用
	 */
	private onComplete(event: egret.Event): void
	{
		// 取文件方式1
		let a = frame.loading.Resources.getRes("binary/resources/1.png");
		// 取文件方式2
		let b = this.loaders.getChild("binary/resources/1.png");
		// 取文件方式3
		let c = this.loaders.getChildAt(0);
	}

	/**
	 * 加载文件错误的回调函数
	 * @param event 没用
	 */
	private onIOError(event: egret.IOErrorEvent): void
	{
	}

	/**
	 * 加载进度回调函数
	 * @param event 没用
	 */
	private onProgress(event: egret.ProgressEvent): void
	{
	}
}
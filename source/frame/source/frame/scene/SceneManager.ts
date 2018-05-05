namespace frame.scene
{
	/**
	 * @author 陈小军
	 */
	export abstract class SceneManager extends ISceneSet
	{
		private _root: egret.Sprite;
		private _windows: frame.layout.WindowManager;

		public constructor(root: egret.Sprite)
		{
			super();
			this._root = root;
			this._scenes = this;
			this._windows = this.newWindows(fairygui.GRoot.inst);
			this.root.addChild(new egret.Sprite());
			this.root.addChild(fairygui.GRoot.inst.displayObject);
			// 以下代码用于自动调整fairygui尺寸
			this.autoResizeWindowManager();
		}

		public get root(): egret.Sprite
		{
			return this._root;
		}

		public get $canvas(): egret.Sprite
		{
			return this.root.getChildAt(0) as egret.Sprite;
		}

		public get windows(): frame.layout.WindowManager
		{
			return this._windows;
		}

		public onOpen(): void
		{
		}

		public onClose(): void
		{
		}

		/**
		 * 指定场景管理器要使用的窗口管理器
		 */
		protected abstract newWindows(root: fairygui.GRoot): frame.layout.WindowManager;

		/**
		 * 以下代码用于自动调整fairygui尺寸
		 */
		private autoResizeWindowManager(): void
		{
			if (this.root.stage)
			{
				this.resizeWindowManager();
				this.root.stage.addEventListener(egret.Event.RESIZE, this.onResizeWindowManager, this);
				this.root.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
			}
			else
			{
				this.root.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
			}
		}

		private onAddedToStage(event: egret.Event): void
		{
			this.resizeWindowManager();
			this.root.stage.addEventListener(egret.Event.RESIZE, this.onResizeWindowManager, this);
			this.root.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
		}

		private onRemovedFromStage(event: egret.Event): void
		{
			this.root.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
			this.root.stage.removeEventListener(egret.Event.RESIZE, this.onResizeWindowManager, this);
			this.root.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
		}

		private resizeWindowManager(): void
		{
			fairygui.GRoot.inst.setSize(this.root.stage.stageWidth, this.root.stage.stageHeight);
		}

		private onResizeWindowManager(event: egret.Event): void
		{
			this.resizeWindowManager();
		}
	}
}
namespace frame.scene
{
	/**
	 * @author 陈小军
	 */
	export abstract class Scene extends egret.EventDispatcher implements IScene
	{
		private _canvas: Canvas;
		private _scenes: SceneManager;

		public constructor()
		{
			super();
			this._canvas = null;
			this._scenes = null;
		}

		public abstract onOpen(): void;

		public abstract onClose(): void;

		public get canvas(): Canvas
		{
			return this._canvas;
		}

		public get windows(): frame.layout.WindowManager
		{
			if (this.scenes == null)
			{
				console.log("fdfsdf");
			}
			return this.scenes.windows;
		}

		public get scenes(): SceneManager
		{
			return this._scenes;
		}

		public $show(scenes: SceneManager): void
		{
			this._scenes = scenes;
			this._canvas = this.newCanvas(this.scenes.$canvas);
			this.onOpen();
		}

		public $hide(): void
		{
			// 清空绘图区
			if (this._canvas)
			{
				this._canvas.onExit();
				this._canvas.display.removeChildren();
			}
			// 清理界面区
			let items = new Array<layout.IDisplay>();
			let callback = (item: layout.IDisplay): boolean =>
			{
				if (item.clean)
					items.push(item);
				return true;
			}
			this.windows.foreach(callback, this);
			for (let i: number = 0; i < items.length; ++i)
				items[i].parent.removeChild(items[i]);
			// 清空
			this.onClose();
			this._scenes = null;
		}

		protected abstract newCanvas(root: egret.Sprite): Canvas;
	}
}
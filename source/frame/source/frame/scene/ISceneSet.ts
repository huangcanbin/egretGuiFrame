namespace frame.scene
{
	/**
	 * @author 陈小军
	 */
	export abstract class ISceneSet extends egret.EventDispatcher implements IIScene
	{
		private child: IScene;
		protected _scenes: SceneManager;

		public constructor()
		{
			super();
			this.child = null;
			this._scenes = null;
		}

		public open(scene: IScene): void
		{
			if (this._scenes)
			{

				if (this.child)
					this.child.$hide();
				this.child = scene;
				this.child.$show(this._scenes);
				return;
			}
			throw new Error("ERROR");
		}

		public $show(scenes: SceneManager): void
		{
			this._scenes = scenes;
			this.onOpen();
			// if (this.child)
			// 	this.child.$show(this._scenes);
		}

		public $hide(): void
		{
			if (this.child)
				this.child.$hide();
			this.onClose();
			this._scenes = null;
		}

		public abstract onOpen(): void;

		public abstract onClose(): void;

		public get canvas(): Canvas
		{
			if (this.child)
				return this.child.canvas;
			return null;
		}

		public get windows(): frame.layout.WindowManager
		{
			if (this.child)
				return this.child.windows;
			return null;
		}

		public get scenes(): SceneManager
		{
			return this._scenes;
		}
	}
}
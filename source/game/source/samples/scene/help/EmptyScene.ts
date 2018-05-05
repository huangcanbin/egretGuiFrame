namespace samples.scene
{
	/**
	 * @author 陈小军
	 */
	export class EmptyScene extends frame.scene.Scene
	{
		public constructor()
		{
			super();
		}

		public onOpen(): void
		{
			console.log("进入Empty");
		}

		public onClose(): void
		{
			console.log("退出Empty");
		}

		protected newCanvas(root: egret.Sprite): frame.scene.Canvas
		{
			return new frame.scene.Canvas(root);
		}
	}
}
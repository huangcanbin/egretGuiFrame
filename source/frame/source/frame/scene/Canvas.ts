namespace frame.scene
{
	/**
	 * @author 陈小军
	 * 场景的绘图区
	 */
	export class Canvas
	{
		private _display: egret.Sprite;

		public constructor(display: egret.Sprite)
		{
			this._display = display;
		}

		/**
		 * 显示对象
		 */
		public get display(): egret.Sprite
		{
			return this._display;
		}

		public set display(value: egret.Sprite)
		{
			this._display = value;
		}

		/**
		 * 退出
		 */
		public onExit(): void { }
	}
}
namespace frame.layout
{
	/**
	 * @author 陈小军
	 */
	export class WindowManager extends IContainer
	{
		/**
		 * @param root 
		 */
		public constructor(root: fairygui.GRoot)
		{
			super();
			this._manager = this;
			this._display = root;
			// this._display.opaque = true;
		}
	}
}
namespace samples.window
{
	export class Window extends frame.layout.Window
	{
		public constructor(display: fairygui.GComponent)
		{
			super();
			this.display = display;
		}
	}
}
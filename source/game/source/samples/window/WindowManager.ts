namespace samples.window
{
	export class WindowManager extends frame.layout.WindowManager
	{
		public constructor(root: fairygui.GRoot)
		{
			super(root);
			// 分为5层
			for (let i: number = 0; i < 5; ++i)
				super.addChild(new frame.layout.Container());
		}

		public addChild(child: frame.layout.IDisplay): void
		{
			super.addChild(child);
		}

		public removeChild(child: frame.layout.IDisplay): void
		{
			super.removeChild(child);
		}
	}
}
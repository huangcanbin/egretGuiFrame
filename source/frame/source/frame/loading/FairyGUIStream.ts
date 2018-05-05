namespace frame.loading
{
	/**
	 * @author 陈小军
	 */
	export class FairyGUIStream extends Stream
	{
		public constructor(url: string)
		{
			super(url);
		}

		protected decode(value: any): any
		{
			// return fairygui.UIPackage.addPackage(this.url);
			return value;
		}

		protected format(): string
		{
			return egret.URLLoaderDataFormat.BINARY;
		}
	}
}
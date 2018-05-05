namespace frame.loading
{
	/**
	 * @author 陈小军
	 */
	export class DisplayStream extends Stream
	{
		public constructor(url: string)
		{
			super(url);
		}

		protected decode(value: any): any
		{
			return value;
		}

		protected format(): string
		{
			return egret.URLLoaderDataFormat.TEXTURE;
		}
	}
}
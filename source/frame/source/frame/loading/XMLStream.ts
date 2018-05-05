namespace frame.loading
{
	/**
	 * @author 陈小军
	 */
	export class XMLStream extends Stream
	{
		public constructor(url: string)
		{
			super(url);
		}

		protected decode(value: any): any
		{
			return egret.XML.parse(value);
		}

		protected format(): string
		{
			return egret.URLLoaderDataFormat.TEXT;
		}
	}
}
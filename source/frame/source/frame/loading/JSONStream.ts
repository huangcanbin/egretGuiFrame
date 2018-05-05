namespace frame.loading
{
	/**
	 * @author 陈小军
	 */
	export class JSONStream extends Stream
	{
		public constructor(url: string)
		{
			super(url);
		}

		protected decode(value: any): any
		{
			return JSON.parse(value as string);
		}

		protected format(): string
		{
			return egret.URLLoaderDataFormat.TEXT;
		}
	}
}
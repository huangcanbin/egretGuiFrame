///<reference path="Stream.ts"/>
namespace frame.loading
{
	/**
	 * @author 陈小军
	 */
	export class BinaryStream extends Stream
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
			return egret.URLLoaderDataFormat.BINARY;
		}
	}
}
namespace frame.loading
{
	/**
	 * @author 陈小军
	 */
	export interface IConverter
	{
		convert(url: string): IStream;
	}
}
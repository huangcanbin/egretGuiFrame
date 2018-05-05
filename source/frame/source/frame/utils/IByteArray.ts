namespace frame.utils
{
	/**
	 * @author 陈小军
	 */
	export interface IByteArray extends IDataInput, IDataOutput
	{
		codec: frame.codec.ICodec;
		readonly objectsAvailable: boolean;
	}
}
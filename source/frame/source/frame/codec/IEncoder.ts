namespace frame.codec
{
	/**
	 * @author 陈小军
	 */
	export interface IEncoder
	{
		encode(): frame.utils.ByteArray;
	}
}
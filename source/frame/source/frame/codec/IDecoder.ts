namespace frame.codec
{
	/**
	 * @author 陈小军
	 */
	export interface IDecoder
	{
		decode(bytes: frame.utils.ByteArray): void;
	}
}
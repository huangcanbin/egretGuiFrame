namespace frame.codec
{
	/**
	 * @author 陈小军
	 */
	export interface ICodec
	{
		/**
		 * 返回bytes中首个对象的大小
		 * @param bytes socket的缓存区
		 * @return 首个对象的大小
		 */
		sizeof(bytes: frame.utils.ByteArray): number;
		/**
		 * 把bytes中的二进制数据解码成对象
		 * @param bytes 二进制数据对象
		 * @return 解码后的数据对象
		 */
		decode(bytes: frame.utils.ByteArray): IDecoder;
		/**
		 * 把数据对象编码成二进制对象
		 * @param encoder 数据对象
		 * @return 编码后的二进制对象
		 */
		encode(encoder: IEncoder): frame.utils.ByteArray;
	}
}
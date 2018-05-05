namespace samples.net
{
	/**
	 * @author 陈小军
	 * 注重格式方面
	 */
	export class JSONCodec implements frame.codec.ICodec
	{
		/**
		 * 返回bytes中首个对象的大小
		 * @param bytes socket的缓存区
		 * @return 首个对象的大小
		 */
		public sizeof(bytes: frame.utils.ByteArray): number
		{
			let size: number = bytes.readUnsignedInt();
			return size;
		}

		/**
		 * 把bytes中的二进制数据解码成对象
		 * @param bytes 二进制数据对象
		 * @return 解码后的数据对象
		 */
		public decode(bytes: frame.utils.ByteArray): frame.codec.IDecoder
		{
			let size: number = bytes.readUnsignedInt();
			let coder = new JSONCoder();
			coder.decode(bytes);
			return coder;
		}

		/**
		 * 把数据对象编码成二进制对象
		 * @param encoder 数据对象
		 * @return 编码后的二进制对象
		 */
		public encode(encoder: frame.codec.IEncoder): frame.utils.ByteArray
		{
			let buffer: frame.utils.ByteArray = encoder.encode();
			let bytes = new frame.utils.ByteArray();
			bytes.writeUnsignedInt(bytes.length);
			bytes.writeBytes(buffer, 0, bytes.length);
			return bytes;
		}
	}
}
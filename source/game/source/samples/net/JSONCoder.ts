namespace samples.net
{
	/**
	 * @author 陈小军
	 */
	export class JSONCoder implements frame.codec.IEncoder, frame.codec.IDecoder
	{
		public type: number;
		public data: Object;

		public constructor()
		{
			this.type = -1;
			this.data = null;
		}

		/**
		 * 把数据对象编码成二进制对象
		 * @return 编码后的二进制对象
		 */
		public encode(): frame.utils.ByteArray
		{
			let bytes = new frame.utils.ByteArray();
			bytes.writeUnsignedInt(this.type);
			let data = JSON.stringify(this.data);
			bytes.writeUTF(data);
			return bytes;
		}

		/**
		 * 把bytes中的二进制数据解码成对象
		 * @param bytes 二进制数据对象
		 */
		public decode(bytes: frame.utils.ByteArray): void
		{
			this.type = bytes.readUnsignedInt();
			let data = bytes.readUTF();
			this.data = JSON.parse(data);
		}
	}
}
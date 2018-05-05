namespace frame.codec
{
	/**
	 * @author 陈小军
	 */
	export class Codec implements frame.codec.ICodec
	{
		public sizeof(bytes: utils.ByteArray): number
		{
			throw new Error("ERROR");
		}

		public encode(encoder: IEncoder): frame.utils.ByteArray
		{
			throw new Error("ERROR");
		}

		public decode(bytes: frame.utils.ByteArray): IDecoder
		{
			throw new Error("ERROR");
		}
	}
}
namespace frame.utils
{
	/**
	 * @author 陈小军
	 */
	export class StringUtils
	{
		public static size(value: string): number
		{
			let bytes: frame.utils.ByteArray = new frame.utils.ByteArray();
			bytes.writeUTFBytes(value);
			return bytes.length;
		}
	}
}
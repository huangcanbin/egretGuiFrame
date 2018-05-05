namespace frame.utils
{
	/**
	 * @author 陈小军
	 */
	export interface IDataOutput
	{
		writeBoolean(value: boolean): void;
		writeByte(value: number): void;
		writeBytes(bytes: ByteArray, offset: number, length: number): void;
		writeDouble(value: number): void;
		writeFloat(value: number): void;
		writeInt(value: number): void;
		writeMultiByte(value: string, charSet: string): void;
		writeObject(value: frame.codec.IEncoder): void;
		writeShort(value: number): void;
		writeUnsignedByte(value: number): void;
		writeUnsignedInt(value: number): void;
		writeUnsignedShort(value: number): void;
		writeUTF(value: string): void;
		writeUTFBytes(value: string): void;
	}
}
namespace frame.utils
{
	/**
	 * @author 陈小军
	 */
	export interface IDataInput
	{
		readBoolean(): boolean;
		readByte(): number;
		readBytes(bytes: ByteArray, offset: number, length: number): void;
		readDouble(): number;
		readFloat(): number;
		readInt(): number;
		readMultiByte(length: number, charSet: string): string;
		readObject(): frame.codec.IDecoder;
		readShort(): number;
		readUnsignedByte(): number;
		readUnsignedInt(): number;
		readUnsignedShort(): number;
		readUTF(): string;
		readUTFBytes(length: number): string;
	}
}
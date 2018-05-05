namespace frame.net
{
	/**
	 * @author 陈小军
	 */
	export interface IWebSocket extends egret.IEventDispatcher, frame.utils.IByteArray
	{
		endian: string;
		codec: frame.codec.ICodec;
		readonly objectsAvailable: boolean;
		readonly bytesAvailable: number;
		readonly connected: boolean;
		close(): void;
		connect(host: string, port: number): void;
		flush(): void;
		readObject(): frame.codec.IDecoder;
		writeObject(value: frame.codec.IEncoder): void;
	}
}
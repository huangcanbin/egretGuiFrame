namespace frame.net
{
	/**
	 * @author 陈小军
	 */
	export class WebSocket extends egret.EventDispatcher implements IWebSocket
	{
		private socket: egret.WebSocket;
		private _codec: frame.codec.ICodec;
		private bytes: frame.utils.ByteArray;
		private chars: frame.utils.ByteArray;

		public constructor()
		{
			super();
			this.socket = new egret.WebSocket();
			this._codec = new frame.codec.Codec();
			this.bytes = new frame.utils.ByteArray();
			this.chars = new frame.utils.ByteArray();
			this.socket.type = egret.WebSocket.TYPE_BINARY;
			this.socket.addEventListener(egret.Event.CLOSE, this.onClose, this);
			this.socket.addEventListener(egret.Event.CONNECT, this.onConnect, this);
			this.socket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onIOError, this);
			this.socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onSocketData, this);
		}

		public get endian(): string
		{
			return this.bytes.endian;
		}

		public set endian(value: string)
		{
			this.bytes.endian = value;
			this.chars.endian = value;
		}

		public get connected(): boolean
		{
			return this.socket.connected;
		}

		public get bytesAvailable(): number
		{
			return this.bytes.bytesAvailable;
		}

		public get codec(): frame.codec.ICodec
		{
			return this._codec;
		}

		public set codec(value: frame.codec.ICodec)
		{
			this._codec = value;
		}

		public get objectsAvailable(): boolean
		{
			let position: number = this.bytes.position;
			let size: number = this.codec.sizeof(this.bytes);
			this.bytes.position = position;
			return size > 0;
		}

		public close(): void
		{
			this.socket.close();
		}

		public connect(host: string, port: number): void
		{
			this.socket.connect(host, port);
		}

		public flush(): void
		{
			this.socket.flush();
		}

		private onClose(event: egret.Event): void
		{
			this.dispatchEvent(event);
		}

		private onConnect(event: egret.Event): void
		{
			this.dispatchEvent(event);
		}

		private onIOError(event: egret.IOErrorEvent): void
		{
			this.dispatchEvent(event);
		}

		private onSocketData(event: egret.ProgressEvent): void
		{
			let bytes: frame.utils.ByteArray = new frame.utils.ByteArray();
			this.socket.readBytes(bytes);
			let position: number = this.bytes.position;
			this.bytes.writeBytes(bytes);
			this.bytes.position = position;
			this.dispatchEvent(event);
		}

		public readBoolean(): boolean
		{
			return this.bytes.readBoolean();
		}

		public readByte(): number
		{
			return this.bytes.readByte();
		}

		public readBytes(bytes: frame.utils.ByteArray, offset: number = 0, length: number = 0): void
		{
			this.bytes.readBytes(bytes, offset, length);
		}

		public readDouble(): number
		{
			return this.bytes.readDouble();
		}

		public readFloat(): number
		{
			return this.bytes.readFloat();
		}

		public readInt(): number
		{
			return this.bytes.readInt();
		}

		public readMultiByte(length: number, charSet: string): string
		{
			throw new Error("Method not implemented.");
		}

		public readObject(): frame.codec.IDecoder
		{
			let position: number = this.bytes.position;
			let size: number = this.codec.sizeof(this.bytes);
			this.bytes.position = position;
			if (size)
			{
				let decoder: frame.codec.IDecoder = this.codec.decode(this.bytes);
				this.bytes.position = position + size;
				if (this.bytes.position > 4096)
				{
					let bytes: frame.utils.ByteArray = new frame.utils.ByteArray();
					this.bytes.readBytes(bytes, 0, this.bytes.bytesAvailable);
					bytes.position = 0;
					this.bytes = bytes;
				}
				return decoder;
			}
			throw new Error("ERROR");
		}

		public readShort(): number
		{
			return this.bytes.readShort();
		}

		public readUnsignedByte(): number
		{
			return this.bytes.readUnsignedByte();
		}

		public readUnsignedInt(): number
		{
			return this.bytes.readUnsignedInt();
		}

		public readUnsignedShort(): number
		{
			return this.bytes.readUnsignedShort();
		}

		public readUTF(): string
		{
			return this.bytes.readUTF();
		}

		public readUTFBytes(length: number): string
		{
			return this.bytes.readUTFBytes(length);
		}

		public writeBoolean(value: boolean): void
		{
			this.chars.writeBoolean(value);
			this.send();
		}

		public writeByte(value: number): void
		{
			this.chars.writeByte(value);
			this.send();
		}

		public writeBytes(bytes: frame.utils.ByteArray, offset: number = 0, length: number = 0): void
		{
			this.chars.writeBytes(bytes, offset, length);
			this.send();
		}

		public writeDouble(value: number): void
		{
			this.chars.writeDouble(value);
			this.send();
		}

		public writeFloat(value: number): void
		{
			this.chars.writeFloat(value);
			this.send();
		}

		public writeInt(value: number): void
		{
			this.chars.writeInt(value);
			this.send();
		}

		public writeMultiByte(value: string, charSet: string): void
		{
			throw new Error("Method not implemented.");
		}

		public writeObject(value: frame.codec.IEncoder): void
		{
			let bytes: frame.utils.ByteArray = this.codec.encode(value);
			this.chars.writeBytes(bytes, 0, bytes.length);
			this.send();
		}

		public writeShort(value: number): void
		{
			this.chars.writeShort(value);
			this.send();
		}

		public writeUnsignedByte(value: number): void
		{
			this.chars.writeByte(value);
			this.send();
		}

		public writeUnsignedInt(value: number): void
		{
			this.chars.writeUnsignedInt(value);
			this.send();
		}

		public writeUnsignedShort(value: number): void
		{
			this.chars.writeUnsignedShort(value);
			this.send();
		}

		public writeUTF(value: string): void
		{
			this.chars.writeUTF(value);
			this.send();
		}

		public writeUTFBytes(value: string): void
		{
			this.chars.writeUTFBytes(value);
			this.send();
		}

		private send(): void
		{
			this.socket.writeBytes(this.chars, 0, this.chars.length);
			this.chars.clear();
		}
	}
}
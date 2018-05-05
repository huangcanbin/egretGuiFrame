namespace frame.utils
{
	/**
	 * @author 陈小军
	 */
	export class ByteArray extends egret.ByteArray implements IByteArray
	{
		private _codec: frame.codec.ICodec;

		public constructor()
		{
			super();
			this._codec = new frame.codec.Codec();
			this.endian = egret.Endian.LITTLE_ENDIAN;
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
			let position: number = this.position;
			let size: number = this.codec.sizeof(this);
			this.position = position;
			return size > 0;
		}

		public readMultiByte(length: number, charSet: string): string
		{
			throw new Error("Method not implemented.");
		}

		public readObject(): frame.codec.IDecoder
		{
			return this.codec.decode(this);
		}

		public writeMultiByte(value: string, charSet: string): void
		{
			throw new Error("Method not implemented.");
		}

		public writeObject(value: frame.codec.IEncoder): void
		{
			let bytes: ByteArray = this.codec.encode(value);
			this.writeBytes(bytes, 0, bytes.length);
		}

		public writeUnsignedByte(value: number): void
		{
			this.writeByte(value);
		}

		/**
		 * offset相对于bytes
		 * readBytes(bytes: ByteArray, offset: number, length: number): void;
		 */

		/**
		 * offset相对于bytes
		 * writeBytes(bytes: ByteArray, offset: number, length: number): void;
		 */

		public readLongLong(): number
		{
			return this.readUnsignedInt() + this.readUnsignedInt() * 4294967296;
		}

		public writeLongLong(value: number): void
		{
			this.writeUnsignedInt(Math.floor(value % 4294967296));
			this.writeUnsignedInt(Math.floor(value / 4294967296));
		}

		public readUnsignedLongLong(): number
		{
			return this.readUnsignedInt() + this.readUnsignedInt() * 4294967296;
		}

		public writeUnsignedLongLong(value: number): void
		{
			this.writeUnsignedInt(Math.floor(value % 4294967296));
			this.writeUnsignedInt(Math.floor(value / 4294967296));
		}

		public readString(length: number, size: number = -1): string
		{
			let position: number = this.position;
			if (size == -1)
			{
				for (let i: number = 0; i < length; ++i)
				{
					if (this.readByte() == 0)
					{
						size = i;
						break;
					}
				}
				size = size == -1 ? length : size;
				this.position = position;
			}
			let value: string = this.readUTFBytes(length);
			// let value: string = this.readUTFBytes(size);
			this.position = position + length;
			return value;
		}

		public writeString(value: string, length: number): void
		{
			let bytes: ByteArray = new ByteArray();
			bytes.writeUTFBytes(value);
			let min: number = bytes.length < length ? bytes.length : length;
			let max: number = bytes.length > length ? bytes.length : length;
			this.writeBytes(bytes, 0, min);
			for (; min < max; ++min)
				this.writeByte(0);
		}
	}
}
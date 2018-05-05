namespace frame.net
{
	/**
	 * @author 陈小军
	 */
	export class Socket extends egret.EventDispatcher implements ISocket
	{
		private socket: WebSocket;

		public constructor(codec: frame.codec.ICodec)
		{
			super();
			this.codec = codec;
			this.socket = new WebSocket();
			this.socket.addEventListener(egret.Event.CLOSE, this.onClose, this);
			this.socket.addEventListener(egret.Event.CONNECT, this.onConnect, this);
			this.socket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onIOError, this);
			this.socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onSocketData, this);
		}

		/**
		 * 字节序
		 */
		public get endian(): string
		{
			return this.socket.endian;
		}

		public set endian(value: string)
		{
			this.socket.endian = value;
		}

		public get codec(): frame.codec.ICodec
		{
			return this.socket.codec;
		}

		public set codec(value: frame.codec.ICodec)
		{
			this.socket.codec = value;
		}

		public get objectsAvailable(): boolean
		{
			return this.socket.objectsAvailable;
		}

		/**
		 * 当前socket是否连接
		 */
		public get connected(): boolean
		{
			return this.socket.connected;
		}

		/**
		 * 关闭连接
		 */
		public close(): void
		{
			this.socket.close();
		}

		/**
		 * @param host ip地址
		 * @param port 端口
		 */
		public connect(host: string, port: number): void
		{
			this.socket.connect(host, port);
		}

		/**
		 * 刷新socket缓存
		 */
		public flush(): void
		{
			this.socket.flush();
		}

		/**
		 * 读取缓存中对象
		 */
		public readObject(): frame.codec.IDecoder
		{
			return this.socket.readObject();
		}

		/**
		 * 对象写入缓存中
		 */
		public writeObject(value: frame.codec.IEncoder): void
		{
			this.socket.writeObject(value);
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
			this.dispatchEvent(event);
		}
	}
}
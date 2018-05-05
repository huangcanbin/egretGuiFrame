class SocketSample extends egret.Sprite
{
	private socket: frame.net.Socket;

	public constructor()
	{
		super();
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
	}

	private onAddedToStage(event: egret.Event): void
	{
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
		// 网络连接方面
		let codec = new samples.net.JSONCodec();
		this.socket = new frame.net.Socket(codec);
		this.socket.addEventListener(egret.Event.CLOSE, this.onClose, this);
		this.socket.addEventListener(egret.Event.CONNECT, this.onConnect, this);
		this.socket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onIOError, this);
		this.socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onSocketData, this);
		// 连接服务器
		this.socket.connect("192.168.23.6", 10000);
	}

	/**
	 * 客户端或服务器断开连接
	 * @param event 没用
	 */
	private onClose(event: egret.Event): void
	{
	}

	/**
	 * 客户端与服务器建立连接
	 * @param event 没用
	 */
	private onConnect(event: egret.Event): void
	{
	}

	/**
	 * 网络连接发生IO错误
	 * @param event 没用
	 */
	private onIOError(event: egret.IOErrorEvent): void
	{
	}

	/**
	 * 客户端收到服务器消息
	 * @param event 没用
	 */
	private onSocketData(event: egret.ProgressEvent): void
	{
	}
}
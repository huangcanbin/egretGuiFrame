///<reference path="IVersions.ts"/>
///<reference path="Versions.ts"/>
namespace frame.loading
{
	/**
	 * @author 陈小军
	 */
	export class Resources
	{
		private static UNLOAD: IStream[] = [];
		private static LOADING: IStream[] = [];
		private static LOADED: frame.io.Dictionary<IStream> = new frame.io.Dictionary<IStream>();

		private static find(streams: IStream[], url: string): IStream
		{
			let length: number = streams.length;
			for (let i: number = 0; i < length; ++i)
				if (streams[i].url == url)
					return streams[i];
			return null;
		}

		public static has(url: string): boolean
		{
			if (Resources.find(Resources.UNLOAD, url))
				return true;
			if (Resources.find(Resources.LOADING, url))
				return true;
			return Resources.LOADED.has(url);
		}

		public static pick(url: string): IStream
		{
			let stream: IStream = Resources.find(Resources.UNLOAD, url);
			if (stream)
				return stream;
			stream = Resources.find(Resources.LOADING, url);
			if (stream)
				return stream;
			return Resources.LOADED.get(url);
		}

		public static need(url: string): IStream
		{
			let stream: IStream = Resources.pick(url);
			if (stream)
				return stream;
			stream = Resources.converter.convert(url);
			Resources.UNLOAD.push(stream);
			Resources.load();
			return stream;
		}

		private static load(): void
		{
			if (Resources.LOADING.length < 16 && Resources.UNLOAD.length > 0)
			{
				let stream: IStream = Resources.UNLOAD.shift();
				Resources.LOADING.push(stream);
				stream.addEventListener(egret.Event.COMPLETE, Resources.onComplete, null);
				stream.load();
			}
		}

		private static onComplete(event: egret.Event): void
		{
			let stream: IStream = event.target as IStream;
			stream.removeEventListener(egret.Event.COMPLETE, Resources.onComplete, null);
			let index: number = Resources.LOADING.indexOf(stream);
			Resources.LOADING.splice(index, 1);
			Resources.LOADED.add(stream.url, stream);
			Resources.load();
		}
		/**
		 * 
		 */
		public static converter: IConverter = new Converter();

		public static getRes(url: string): any
		{
			let stream: IStream = Resources.pick(url);
			if (stream)
				return stream.content;
			return null;
		}

		public static getResAsync(key: string, listener: Function, thisObject: any): void
		{
			let stream: IStream = Resources.need(key);
			if (stream.status == StreamStatus.COMPLETE || stream.status == StreamStatus.ERROR)
				listener.call(thisObject, stream.content(), key);
			else
			{
				let callback = (): void =>
				{
					listener.apply(thisObject, [stream.content(), key]);
				}
				stream.addEventListener(egret.Event.COMPLETE, callback, thisObject);
			}
		}

		/**
		 * 版本控制器
		 */
		public static versions: IVersions = new Versions();

		public static version(url: string): string
		{
			return Resources.versions.version(url);
		}
	}
}
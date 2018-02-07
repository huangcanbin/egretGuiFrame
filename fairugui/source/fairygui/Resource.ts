namespace fairygui
{
	export class Resource
	{
		private static assets: IResource;

		public static setCache(assets: IResource): void
		{
			Resource.assets = assets;
		}

		public static getRes(key: string): any
		{
			return Resource.assets.getRes(key);
		}

		public static getResAsync(key: string, compFunc: Function, thisObject: any): void
		{
			Resource.assets.getResAsync(key, compFunc, thisObject);
		}
	}
}

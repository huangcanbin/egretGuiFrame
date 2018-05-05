namespace fairygui
{
	export class Resource
	{
		private static assets: IResource;

		public static setResourceManager(assets: IResource): void
		{
			Resource.assets = assets;
		}

		public static getRes(key: string): any
		{
			if (Resource.assets)
				return Resource.assets.getRes(key);
			return RES.getRes(key);
		}

		public static getResAsync(key: string, compFunc: Function, thisObject: any): void
		{
			if (Resource.assets)
				Resource.assets.getResAsync(key, compFunc, thisObject);
			else
				RES.getResAsync(key, compFunc, thisObject);
		}
	}
}

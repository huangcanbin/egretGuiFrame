///<reference path="../loading/LoaderItem.ts"/>
///<reference path="../loading/LoaderList.ts"/>
namespace frame.extension
{
	import LoaderItem = frame.loading.LoaderItem;
	import LoaderList = frame.loading.LoaderList;

	export class LoadingList extends LoaderList
	{
		public constructor()
		{
			super();
		}

		public push(url: string): void
		{
			let loader = new LoaderItem(url);
			this.addChild(loader);
		}
	}
}
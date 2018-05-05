namespace frame.ui
{
	export class Loading implements fairygui.IResource
	{
		public constructor()
		{
		}

		public getRes(url: string): any
		{
			return frame.loading.Resources.getRes(url);
		}

		public getResAsync(key: string, onComplete: Function, thisObject: any): void
		{
			frame.loading.Resources.getResAsync(key, onComplete, thisObject);
		}
	}
}

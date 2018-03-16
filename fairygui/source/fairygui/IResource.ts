namespace fairygui
{
	export interface IResource
	{
		getRes(url: string): any;
		getResAsync(key: string, compFunc: Function, thisObject: any): void
	}
}
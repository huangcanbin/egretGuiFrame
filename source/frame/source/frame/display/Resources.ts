namespace frame.display
{
	/**
	 * @author 陈小军
	 */
	export class Resources implements IResources
	{
		public constructor()
		{
		}

		public getRes(url: string): any
		{
			return frame.loading.Resources.getRes(url);
		}
	}
}
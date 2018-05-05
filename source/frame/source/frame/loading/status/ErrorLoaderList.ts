namespace frame.loading
{
	/**
	 * @author 陈小军
	 */
	export class ErrorLoaderList extends LoaderListState
	{
		public constructor(parent: LoaderList)
		{
			super(parent);
		}

		public load(): void
		{
			throw new Error("ERROR");
		}

		public addChild(child: ILoaderItem): void
		{
			throw new Error("ERROR");
		}
	}
}
namespace frame.loading
{
	/**
	 * @author 陈小军
	 */
	export class LoadingLoaderItem extends LoaderItemState
	{
		public constructor(parent: LoaderItem)
		{
			super(parent);
		}

		public load(): void
		{
			throw new Error("ERROR");
		}

		public get content(): any
		{
			throw new Error("ERROR");
		}
	}
}
namespace frame.loading
{
	/**
	 * @author 陈小军
	 */
	export class CompleteLoaderItem extends LoaderItemState
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
			return Resources.pick(this.parent.url).content;
		}
	}
}
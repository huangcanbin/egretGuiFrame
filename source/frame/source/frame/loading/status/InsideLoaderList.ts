namespace frame.loading
{
	/**
	 * @author 陈小军
	 */
	export class InsideLoaderList extends LoaderListState
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
			if (child.status == LoaderStatus.READY)
			{
				this.parent.children.push(child);
				child.become(LoaderStatus.INSIDE);
			}
		}
	}
}
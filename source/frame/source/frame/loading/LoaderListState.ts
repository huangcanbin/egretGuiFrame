namespace frame.loading
{
	/**
	 * @author 陈小军
	 */
	export abstract class LoaderListState
	{
		private _parent: LoaderList;

		public constructor(parent: LoaderList)
		{
			this._parent = parent;
		}

		protected get parent(): LoaderList
		{
			return this._parent;
		}

		public abstract load(): void;

		public abstract addChild(child: ILoaderItem): void;
	}
}
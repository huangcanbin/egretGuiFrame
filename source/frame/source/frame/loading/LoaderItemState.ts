namespace frame.loading
{
	/**
	 * @author 陈小军
	 */
	export abstract class LoaderItemState
	{
		private _parent: LoaderItem;

		public constructor(parent: LoaderItem)
		{
			this._parent = parent;
		}

		protected get parent(): LoaderItem
		{
			return this._parent;
		}

		public abstract load(): void;

		public abstract get content(): any;
	}
}
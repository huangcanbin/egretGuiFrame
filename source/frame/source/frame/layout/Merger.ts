namespace frame.layout
{
	/**
	 * @author 陈小军
	 */
	export abstract class Merger extends IContainer
	{
		private status: IDisplay;
		private loading: IDisplay;
		private studio: IDisplay;

		public constructor()
		{
			super();
			this.loading = this.newLoading();
			this.studio = this.newStudio();
			this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
		}

		private _onAddedToStage(event: egret.Event): void
		{
			this.status = this.loading;
		}

		public get display(): fairygui.GComponent
		{
			return this.status.display;
		}

		public set display(value: fairygui.GComponent)
		{
			throw new Error("ERROR");
		}

		protected abstract newLoading(): IDisplay;

		protected abstract newStudio(): IDisplay;
	}
}
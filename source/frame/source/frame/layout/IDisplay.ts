namespace frame.layout
{
	/**
	 * @author 陈小军
	 */
	export abstract class IDisplay extends egret.EventDispatcher
	{
		public clean: boolean;
		protected _parent: IContainer;
		protected _manager: WindowManager;
		protected _display: fairygui.GComponent;

		public constructor()
		{
			super();
			this.clean = false;
			this._parent = null;
			this._manager = null;
			this._display = null;
		}

		public get parent(): IContainer
		{
			return this._parent;
		}

		public set parent(parent: IContainer)
		{
			this._parent = parent;
		}

		public get manager(): WindowManager
		{
			return this._manager;
		}

		public set manager(value: WindowManager)
		{
			if (this._manager == null && value)
			{
				this._manager = value;
				this.$hasSame();
				this.onOpen();
				this.onAdded(this.display);
				this.dispatchEventWith(egret.Event.ADDED_TO_STAGE);
			}
			else if (this._manager && value == null)
			{
				this.onClose();
				this.dispatchEventWith(egret.Event.REMOVED_FROM_STAGE);
				this._manager = value;
			}
		}

		public $hasSame(): void
		{
			let exist: boolean = this.manager.$displayIsExist(this.display);
			if (exist)
				throw new Error("ERROR");
		}

		public get display(): fairygui.GComponent
		{
			return this._display
		}

		public set display(value: fairygui.GComponent)
		{
			if (this._display == null)
			{
				this._display = value;
				this.$show();
				this.onAdded(value);
				this.onDisplay(value);
			}
			else
				throw new Error("错误");
		}

		/**
		 * 给灿滨那边用的，我还不知道什么意思
		 * @param value 
		 */
		protected onDisplay(value: fairygui.GComponent): void
		{
		}

		/**
		 * 添加事件
		 */
		protected onAdded(value: fairygui.GComponent): void
		{
			if (this.added)
			{
				if (value.displayObject.stage)
				{
					value.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
					value.displayObject.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRootTouchTap, this);
					value.displayObject.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
				}
				else
				{
					value.displayObject.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
				}
			}
		}

		private touched: boolean = false;

		private static target: IDisplay = null;

		public static readonly RELEASEOUTSIDE: string = "RELEASEOUTSIDE";

		private onTouchTap(event: egret.TouchEvent): void
		{
			this.touched = true;
			IDisplay.target = this;
		}

		private onRootTouchTap(event: egret.TouchEvent): void
		{
			if (event.eventPhase == egret.EventPhase.AT_TARGET)
			{
				this.dispatchEventWith(IDisplay.RELEASEOUTSIDE);
			}
			else if (event.eventPhase == egret.EventPhase.BUBBLING_PHASE)
			{
				if (this.touched == false && IDisplay.target && IDisplay.target != this)
				{
					let temp = IDisplay.target;
					if (temp.isPosterityOf(this) == false)
						this.dispatchEventWith(IDisplay.RELEASEOUTSIDE);
				}
				this.touched = false;
			}
		}

		private onAddedToStage(event: egret.Event): void
		{
			this.display.displayObject.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
			this.display.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
			this.display.displayObject.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRootTouchTap, this);
			this.display.displayObject.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
		}

		private onRemovedFromStage(event: egret.Event): void
		{
			this.display.displayObject.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
			this.display.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
			this.display.displayObject.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onRootTouchTap, this);
			this.display.displayObject.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
		}

		/**
		 * 显示界面
		 */
		public $show(): void
		{
			if (this.visible && this.eyeable && this.display)
			{
				let depth: number = this.manager.$getItemDepth(this);
				this.manager.display.addChildAt(this.display, depth);
			}
		}

		/**
		 * 关闭界面
		 */
		public $close(): void
		{
			if (this.visible && this.eyeable && this.display)
			{
				this.manager.display.removeChild(this.display);
			}
		}

		/**
		 * 进入
		 */
		public onOpen(): void
		{
		}

		/**
		 * 退出
		 */
		public onClose(): void
		{
		}

		public get added(): boolean
		{
			return this.visible && this.eyeable && this.display != null;
		}

		public get visible(): boolean
		{
			return this.manager != null;
		}

		public get eyeable(): boolean
		{
			return this instanceof Display || this instanceof Window;
		}

		/**
		 * 查询自己是不是item的后代
		 * @param item 
		 */
		public isPosterityOf(item: IDisplay): boolean
		{
			let parent: IDisplay = this.parent;
			while (parent)
			{
				if (parent == item)
					return true;
				parent = parent.parent;
			}
			return false;
		}

		/**
		 * 居中设置
		 */
		public setCenter(): void
		{
			// this.display.addRelation(this.display.root, fairygui.RelationType.Center_Center, false);
			// this.display.addRelation(this.display.root, fairygui.RelationType.Middle_Middle, false);
			this.display.center();
		}
	}
}
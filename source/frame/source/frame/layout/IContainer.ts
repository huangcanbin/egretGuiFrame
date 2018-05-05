///<reference path="IDisplay.ts"/>

namespace frame.layout
{
	/**
	 * @author 陈小军
	 */
	export abstract class IContainer extends IDisplay
	{
		protected _children: Array<IDisplay>;

		public constructor()
		{
			super();
			this._children = new Array<IDisplay>();
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
				this.updateChildManager(value);
			}
			else if (this._manager && value == null)
			{
				this.onClose();
				this.dispatchEventWith(egret.Event.REMOVED_FROM_STAGE);
				this._manager = value;
				this.updateChildManager(value);
			}
		}

		public get numChildren(): number
		{
			return this._children.length;
		}

		public getChildAt(index: number): IDisplay
		{
			if (index > -1 && index < this._children.length)
				return this._children[index];
			return null;
		}

		public getChildIndex(child: IDisplay): number
		{
			return this._children.indexOf(child);
		}

		public contains(child: IDisplay): boolean
		{
			return this._children.indexOf(child) > -1
		}

		private updateChildManager(value: WindowManager): void
		{
			let length: number = this._children.length;
			for (let i: number = 0; i < length; ++i)
				this._children[i].manager = value;
		}

		public removeAllChildren(): void
		{
			let child: IDisplay = null;
			let length: number = this.numChildren;
			while (length--)
			{
				child = this._children[length];
				if (this.visible)
					child.$close();
				this._children.pop();
				child.parent = null;
				child.manager = null;
			}
			this.onUpdateMask();
		}

		public addChild(child: IDisplay): void
		{
			if (child.parent == null)
			{
				this._children.push(child);
				child.parent = this;
				child.manager = this.manager;
				if (this.visible)
					child.$show();
				this.onUpdateMask();
			}
		}

		public removeChild(child: IDisplay): void
		{
			if (child.parent == this)
			{
				if (this.visible)
					child.$close();
				let index: number = this._children.indexOf(child);
				this._children.splice(index, 1);
				child.parent = null;
				child.manager = null;
				this.onUpdateMask();
			}
		}

		/**
		 * 更新遮罩
		 */
		private onUpdateMask(): void
		{
			if (this.visible && this.eyeable && this.display)
			{
				if (this._children.length == 0)
					this.display.touchable = true;
				else
					this.display.touchable = false;
			}
		}

		/**
		 * 显示界面
		 */
		public $show(): void
		{
			super.$show();
			let length: number = this.numChildren;
			for (let i: number = 0; i < length; ++i)
				this._children[i].$show();
		}

		/**
		 * 关闭界面
		 */
		public $close(): void
		{
			super.$close();
			let length: number = this.numChildren;
			for (let i: number = 0; i < length; ++i)
				this._children[i].$close();
		}

		/**
		 * 查询自己是不是item的上级
		 * @param item 上级
		 */
		protected isAncestorOf(item: IDisplay): boolean
		{
			let parent: IContainer = item.parent;
			while (parent)
			{
				if (parent == this)
					return true;
				parent = parent.parent;
			}
			return false;
		}

		/**
		 * 遍历所有子级
		 * @param callback 回调函数
		 * @param thisObject 回调函数
		 */
		public foreach(callback: (item: IDisplay) => boolean, thisObject: any): boolean
		{
			let child: IDisplay = null;
			let length: number = this.numChildren;
			let children = this._children.slice();
			for (let i: number = 0; i < length; ++i)
			{
				child = children[i];
				if (callback.call(thisObject, child) == false)
					return false;
				if (child instanceof IContainer)
					if (child.foreach(callback, thisObject) == false)
						return false;
			}
			return true;
		}

		public $getItemDepth(item: IDisplay): number
		{
			let depth: number = 0;
			// 返回值代表是否继续循环
			let callback = (who: IDisplay): boolean =>
			{
				if (item == who)
					return false;
				else if (who.eyeable && who.display)
					++depth;
				return true;
			}
			this.foreach(callback, this);
			return depth;
		}

		public $displayIsExist(display: fairygui.GComponent): boolean
		{
			if (display == null)
				return false;
			// 返回值代表是否继续循环
			let callback = (who: IDisplay): boolean =>
			{
				if (who.eyeable && who.display && who.display == display)
					return true;
			}
			this.foreach(callback, this);
			return false;
		}
	}
}
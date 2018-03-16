
module fairygui
{

	export class Controller extends egret.EventDispatcher
	{
		private _name: string;
		private _selectedIndex: number = 0;
		private _previousIndex: number = 0;
		private _pageIds: Array<string>;
		private _pageNames: Array<string>;
		private _actions: Array<ControllerAction>;

		public _parent: GComponent;
		public _autoRadioGroupDepth: boolean;
		public changing: boolean = false;

		private static _nextPageId: number = 0;

		public constructor()
		{
			super();
			this._pageIds = [];
			this._pageNames = [];
			this._selectedIndex = -1;
			this._previousIndex = -1;
		}

		public get name(): string
		{
			return this._name;
		}

		public set name(value: string)
		{
			this._name = value;
		}

		public get parent(): GComponent
		{
			return this._parent;
		}

		public get selectedIndex(): number
		{
			return this._selectedIndex;
		}

		public set selectedIndex(value: number)
		{
			if (this._selectedIndex != value)
			{
				if (value > this._pageIds.length - 1)
					throw "index out of bounds: " + value;

				this.changing = true;
				this._previousIndex = this._selectedIndex;
				this._selectedIndex = value;
				this._parent.applyController(this);

				this.dispatchEvent(new StateChangeEvent(StateChangeEvent.CHANGED));

				this.changing = false;
			}
		}

		//功能和设置selectedIndex一样，但不会触发事件
		public setSelectedIndex(value: number = 0): void
		{
			if (this._selectedIndex != value)
			{
				if (value > this._pageIds.length - 1)
					throw "index out of bounds: " + value;

				this.changing = true;
				this._previousIndex = this._selectedIndex;
				this._selectedIndex = value;
				this._parent.applyController(this);
				this.changing = false;
			}
		}

		public get previsousIndex(): number
		{
			return this._previousIndex;
		}

		public get selectedPage(): string
		{
			if (this._selectedIndex == -1)
				return null;
			else
				return this._pageNames[this._selectedIndex];
		}

		public set selectedPage(val: string)
		{
			var i: number = this._pageNames.indexOf(val);
			if (i == -1)
				i = 0;
			this.selectedIndex = i;
		}

		//功能和设置selectedPage一样，但不会触发事件
		public setSelectedPage(value: string): void
		{
			var i: number = this._pageNames.indexOf(value);
			if (i == -1)
				i = 0;
			this.setSelectedIndex(i);
		}

		public get previousPage(): string
		{
			if (this._previousIndex == -1)
				return null;
			else
				return this._pageNames[this._previousIndex];
		}

		public get pageCount(): number
		{
			return this._pageIds.length;
		}

		public getPageName(index: number = 0): string
		{
			return this._pageNames[index];
		}

		public addPage(name: string = ""): void
		{
			this.addPageAt(name, this._pageIds.length);
		}

		public addPageAt(name: string, index: number = 0): void
		{
			var nid: string = "" + (Controller._nextPageId++);
			if (index == this._pageIds.length)
			{
				this._pageIds.push(nid);
				this._pageNames.push(name);
			}
			else
			{
				this._pageIds.splice(index, 0, nid);
				this._pageNames.splice(index, 0, name);
			}
		}

		public removePage(name: string): void
		{
			var i: number = this._pageNames.indexOf(name);
			if (i != -1)
			{
				this._pageIds.splice(i, 1);
				this._pageNames.splice(i, 1);
				if (this._selectedIndex >= this._pageIds.length)
					this.selectedIndex = this._selectedIndex - 1;
				else
					this._parent.applyController(this);
			}
		}

		public removePageAt(index: number = 0): void
		{
			this._pageIds.splice(index, 1);
			this._pageNames.splice(index, 1);
			if (this._selectedIndex >= this._pageIds.length)
				this.selectedIndex = this._selectedIndex - 1;
			else
				this._parent.applyController(this);
		}

		public clearPages(): void
		{
			this._pageIds.length = 0;
			this._pageNames.length = 0;
			if (this._selectedIndex != -1)
				this.selectedIndex = -1;
			else
				this._parent.applyController(this);
		}

		public hasPage(aName: string): boolean
		{
			return this._pageNames.indexOf(aName) != -1;
		}

		public getPageIndexById(aId: string): number
		{
			return this._pageIds.indexOf(aId);
		}

		public getPageIdByName(aName: string): string
		{
			var i: number = this._pageNames.indexOf(aName);
			if (i != -1)
				return this._pageIds[i];
			else
				return null;
		}

		public getPageNameById(aId: string): string
		{
			var i: number = this._pageIds.indexOf(aId);
			if (i != -1)
				return this._pageNames[i];
			else
				return null;
		}

		public getPageId(index: number = 0): string
		{
			return this._pageIds[index];
		}

		public get selectedPageId(): string
		{
			if (this._selectedIndex == -1)
				return null;
			else
				return this._pageIds[this._selectedIndex];
		}

		public set selectedPageId(val: string)
		{
			var i: number = this._pageIds.indexOf(val);
			this.selectedIndex = i;
		}

		public set oppositePageId(val: string)
		{
			var i: number = this._pageIds.indexOf(val);
			if (i > 0)
				this.selectedIndex = 0;
			else if (this._pageIds.length > 1)
				this.selectedIndex = 1;
		}

		public get previousPageId(): string
		{
			if (this._previousIndex == -1)
				return null;
			else
				return this._pageIds[this._previousIndex];
		}

		public runActions(): void
		{
			if (this._actions)
			{
				var cnt: number = this._actions.length;
				for (var i: number = 0; i < cnt; i++)
					this._actions[i].run(this, this.previousPageId, this.selectedPageId);
			}
		}

		public setup(xml: any): void
		{
			this._name = xml.attributes.name;
			this._autoRadioGroupDepth = xml.attributes.autoRadioGroupDepth == "true";

			var i: number = 0;
			var k: number = 0;
			var str: string = xml.attributes.pages;
			if (str)
			{
				var arr: string[] = str.split(",");
				var cnt: number = arr.length;
				for (i = 0; i < cnt; i += 2)
				{
					this._pageIds.push(arr[i]);
					this._pageNames.push(arr[i + 1]);
				}
			}

			var col: any = xml.children;
			var length1: number = col.length;
			if (length1 > 0)
			{
				if (!this._actions)
					this._actions = new Array<ControllerAction>();

				for (var i1: number = 0; i1 < length1; i1++)
				{
					var cxml: any = col[i1];
					var action: ControllerAction = ControllerAction.createAction(cxml.attributes.type);
					action.setup(cxml);
					this._actions.push(action);
				}
			}

			str = xml.attributes.transitions;
			if (str)
			{
				if (!this._actions)
					this._actions = new Array<ControllerAction>();

				arr = str.split(",");
				cnt = arr.length;
				var ii: number;
				for (i = 0; i < cnt; i++)
				{
					str = arr[i];
					if (!str)
						continue;

					var taction: PlayTransitionAction = new PlayTransitionAction();
					k = str.indexOf("=");
					taction.transitionName = str.substr(k + 1);
					str = str.substring(0, k);
					k = str.indexOf("-");
					ii = parseInt(str.substring(k + 1));
					if (ii < this._pageIds.length)
						taction.toPage = [this._pageIds[ii]];
					str = str.substring(0, k);
					if (str != "*")
					{

						ii = parseInt(str);
						if (ii < this._pageIds.length)
							taction.fromPage = [this._pageIds[ii]];
					}
					taction.stopOnExit = true;
					this._actions.push(taction);
				}
			}

			if (this._parent && this._pageIds.length > 0)
				this._selectedIndex = 0;
			else
				this._selectedIndex = -1;
		}
	}
}
namespace frame.animation
{
	/**
	 * @author 陈小军
	 * 基于TexturePacker的动画
	 */
	export class TexturePacker extends egret.Sprite
	{
		/**
		 * 
		 */
		private time: number;
		private frame: number;
		private label: string;
		/**
		 * 
		 */
		private indices: Array<number>;
		/**
		 * 
		 */
		private list: List;
		/**
		 * 计时器
		 */
		private ticker: frame.utils.Ticker;
		/**
		 * TexturePacker解析器
		 */
		private animation: frame.display.TexturePacker;

		public constructor(format: Object, texture: egret.Texture)
		{
			super();
			this.ticker = new frame.utils.Ticker();
			this.animation = new frame.display.TexturePacker(format, texture);
			this.addChild(this.animation);

			this.list = new List("");

			for (let i: number = 0; i < this.animation.frames.length; ++i)
			{
				let list: List = this.list;
				let label: string = this.animation.frames[i].name;
				let names: Array<string> = frame.io.Path.filenames(label);
				for (let j: number = 0; j < names.length - 1; ++j)
					list = list.addChild(new List(names[j])) as List;
				list.addChild(new Node(names[names.length - 1], i));
			}
			console.log("fsdfsd");
		}

		public play(label: string): void
		{
			// 开始时间
			this.time = 0;
			// 当前索引
			this.frame = 0;

			this.label = label;
			let a = this.list.getPosterity(this.label);

			let indices = new Array<number>();
			let callback = (node: INode): void =>
			{
				if (node instanceof Node)
					indices.push(node.index);
			}
			(a as List).foreach(callback, this);
			this.indices = indices;
			this.ticker.register(this.onTick, this);
		}

		public stop(): void
		{
		}

		private onTick(intervals: number): void
		{
			this.time += intervals;
			let frames = Math.floor(this.time / 100);
			let remainder = this.time - frames * 100;
			for (let i: number = 0; i < frames; ++i)
			{
				this.frame = (this.frame + 1) % this.indices.length;
				this.dispatchEventWith("frame");
			}
			this.animation.goto(this.indices[this.frame]);
			this.time = remainder;
		}
	}

	abstract class INode
	{
		private _name: string;

		public constructor(name: string)
		{
			this._name = name;
		}

		public get name(): string
		{
			return this._name;
		}
	}

	class Node extends INode
	{
		private _index: number;

		public constructor(name: string, index: number)
		{
			super(name);
			this._index = index;
		}

		public get index(): number
		{
			return this._index;
		}
	}

	class List extends INode
	{
		private children: Array<INode>;

		public constructor(name: string)
		{
			super(name);
			this.children = new Array<INode>();
		}

		public addChild(child: INode): INode
		{
			let node = this.getChild(child.name);
			if (node)
				return node;
			this.children.push(child);
			return child;
		}

		private getChild(name: string): INode
		{
			for (let i: number = 0; i < this.children.length; ++i)
				if (this.children[i].name == name)
					return this.children[i];
		}

		public getPosterity(name: string): INode
		{
			let list: List = this;
			let node: INode = null;
			let names = frame.io.Path.filenames(name);
			for (let i: number = 0; i < names.length; ++i)
			{
				node = list.getChild(names[i]);
				if (node == null)
					return null;
				else if (node instanceof List)
					list = node;
			}
			return node;
		}

		public foreach(callback: (node: INode) => void, thisObject: any): void
		{
			let length: number = this.children.length;
			for (let i: number = 0; i < length; ++i)
			{
				let child = this.children[i];
				callback.call(thisObject, child);
				if (child instanceof List)
					child.foreach(callback, thisObject);
			}
		}
	}
}
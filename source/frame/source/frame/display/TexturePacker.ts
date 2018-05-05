namespace frame.display
{
	/**
	 * @author 陈小军
	 */
	export class TexturePacker extends egret.Sprite
	{
		/**
		 * 当前帧
		 */
		private index: number;
		/**
		 * 所有帧数据
		 */
		private _frames: Frame[];
		/**
		 * 图集
		 */
		private texture: egret.Bitmap;
		/**
		 * 
		 */
		private names: frame.utils.Dictionary<number>;

		/**
		 * @param format TexturePacker导出的json文件
		 * @param texture TexturePacker导出的图集文件
		 */
		public constructor(format: Object, texture: egret.Texture)
		{
			super();
			this._frames = [];
			this.names = new frame.utils.Dictionary<number>();
			this.parse(format);
			this.texture = new egret.Bitmap(texture);
			this.addChild(this.texture);
			this.goto(0);
		}

		/**
		 * 所有帧数据
		 */
		public get frames(): Frame[]
		{
			return this._frames;
		}

		/**
		 * 显示某帧的图像
		 * @param frame 帧索引
		 */
		public goto(frame: number): void
		{
			this.index = frame;
			this.show(frame);
		}

		/**
		 * TextPacker导出的JSON文件解析成帧格式
		 */
		private parse(setting: Object): void
		{
			let frame: Object;
			let frames: Object[] = setting["frames"];
			let length: number = frames.length;
			for (let i: number = 0; i < length; ++i)
			{
				frame = frames[i];
				let transform: Frame = new Frame();
				// 路径名
				transform.name = frame["filename"];
				// 是否旋转
				transform.rotate = frame["rotated"];
				// 是否裁剪
				let trim: boolean = frame["trimmed"];

				let rectangle: Object = frame["frame"];
				let x: number = rectangle["x"];
				let y: number = rectangle["y"];
				let w: number = rectangle["w"];
				let h: number = rectangle["h"];
				let width: number = transform.rotate ? h : w;
				let height: number = transform.rotate ? w : h;
				transform.bounds = new egret.Rectangle(x, y, width, height);

				let pivot: Object = frame["pivot"];
				let size: Object = frame["sourceSize"];
				let area: Object = frame["spriteSourceSize"];
				if (transform.rotate)
				{
					transform.x = area["x"] + area["w"] / 2 - size["w"] * pivot["x"] - y - w / 2;
					transform.y = area["y"] + area["h"] / 2 - size["h"] * pivot["y"] + x + h / 2;
				}
				else
				{
					transform.x = area["x"] - size["w"] * pivot["x"] - x;
					transform.y = area["y"] - size["h"] * pivot["y"] - y;
				}
				this.names.add(transform.name, i);
				this._frames.push(transform);
			}
		}

		/**
		 * 获取名字对应的帧索引
		 */
		public getIndex(name: string): number
		{
			return this.names.get(name);
		}

		public getName(index: number): string
		{
			return this.frames[index].name;
		}

		/**
		 * 显示某帧的图像
		 * @param frame 帧索引
		 */
		private show(index: number): void
		{
			let frame: Frame = this._frames[index];
			this.texture.mask = frame.bounds;
			this.texture.rotation = frame.rotate ? -90 : 0;
			this.texture.x = frame.x;
			this.texture.y = frame.y;
		}

		/**
		 * 当前帧名
		 */
		public get name(): string
		{
			return this._frames[this.index].name;
		}

		/**
		 * 宽度
		 */
		public get width(): number
		{
			return this._frames[this.index].bounds.width;
		}

		/**
		 * 高度
		 */
		public get height(): number
		{
			return this._frames[this.index].bounds.height;
		}

		/**
		 * 当前停在哪一帧
		 */
		public get currentFrame(): number
		{
			return this.index;
		}

		/**
		 * 总共有多少帧
		 */
		public get totalFrames(): number
		{
			return this._frames.length;
		}
	}
}
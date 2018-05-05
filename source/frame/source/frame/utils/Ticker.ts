namespace frame.utils
{
	/**
	 * @author 陈小军
	 */
	export class Ticker implements ITicker
	{
		private running: boolean;
		private handlers: Handler[];

		public constructor()
		{
			this.handlers = [];
			this.running = false;
		}

		public register(listener: Function, thiz: any): void
		{
			if (listener && thiz)
			{
				let index: number = this.index(listener, thiz);
				if (index == -1)
					this.handlers.push(new Handler(listener, thiz));
				if (this.running == false && this.handlers.length)
				{
					this.running = true;
					egret.Ticker.getInstance().register(this.onTick, this);
				}
			}
			else
				throw new Error("ERROR");
		}

		public unregister(listener: Function, thiz: any): void
		{
			if (listener && thiz)
			{
				let index: number = this.index(listener, thiz);
				if (index > -1)
					this.handlers.splice(index, 1);
				if (this.running == true && this.handlers.length == 0)
				{
					this.running = false;
					egret.Ticker.getInstance().unregister(this.onTick, this);
				}
			}
			else
				throw new Error("ERROR");
		}

		public clear(): void
		{
			this.handlers = [];
			if (this.running == true)
			{
				this.running = false;
				egret.Ticker.getInstance().unregister(this.onTick, this);
			}
		}

		private onTick(intervals: number): void
		{
			intervals = intervals * Ticker.SCALE;
			let length: number = this.handlers.length;
			let handlers: Handler[] = this.handlers.slice();
			for (let i: number = 0; i < length; ++i)
				handlers[i].execute(intervals);
		}

		private index(listener: Function, thiz: any): number
		{
			let handler: Handler = null;
			let length: number = this.handlers.length;
			for (let i: number = 0; i < length; ++i)
			{
				handler = this.handlers[i];
				if (listener == handler.listener && thiz == handler.thisObject)
					return i;
			}
			return -1;
		}

		public static SCALE: number = 1;
	}
}
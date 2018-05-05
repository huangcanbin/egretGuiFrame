namespace frame.utils
{
	/**
	 * @author 陈小军
	 */
	export class Handler implements IHandler
	{
		private _thisObject: any;
		private _listener: Function;

		public constructor(listener: Function, thisObject: any)
		{
			if (listener)
			{
				this._thisObject = thisObject;
				this._listener = listener;
			}
			else
				throw new Error("ERROR");
		}

		public execute(...args: any[]): void
		{
			this._listener.apply(this._thisObject, args);
		}

		public equal(listener: Function, thisObject: any): boolean
		{
			return this._listener == listener && this._thisObject == thisObject;
		}

		public get thisObject(): any
		{
			return this._thisObject;
		}

		public get listener(): Function
		{
			return this._listener;
		}
	}
}
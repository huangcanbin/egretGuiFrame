namespace frame.io
{
	/**
	 * @author 陈小军
	 */
	export class Keyboard
	{
		private static KEYS: number[] = [];
		private static LISTENERS: frame.io.Dictionary<frame.utils.Handler[]> = new frame.io.Dictionary<frame.utils.Handler[]>();

		public static start(): void
		{
			Keyboard.KEYS = [];
			Keyboard.LISTENERS[Keyboard.KEY_DOWN] = [];
			Keyboard.LISTENERS[Keyboard.KEY_UP] = [];
			document.addEventListener(Keyboard.KEY_DOWN, Keyboard.onKeyDown);
			document.addEventListener(Keyboard.KEY_UP, Keyboard.onKeyUp);
		}

		public static stop(): void
		{
			Keyboard.KEYS = [];
			document.addEventListener(Keyboard.KEY_DOWN, Keyboard.onKeyDown);
			document.addEventListener(Keyboard.KEY_UP, Keyboard.onKeyUp);
		}

		public static addEventListener(type: string, listener: Function, thisObject: any): void
		{
			if (listener && (type == Keyboard.KEY_DOWN || type == Keyboard.KEY_UP))
			{
				let handlers: frame.utils.Handler[] = Keyboard.LISTENERS[type];
				let length: number = handlers.length;
				for (let i: number = 0; i < length; ++i)
					if (handlers[i].equal(listener, thisObject))
						return;
				handlers.push(new frame.utils.Handler(listener, thisObject));
			}
		}

		public static removeEventListener(type: string, listener: Function, thisObject: any): void
		{
			if (listener && (type == Keyboard.KEY_DOWN || type == Keyboard.KEY_UP))
			{
				let handlers: frame.utils.Handler[] = Keyboard.LISTENERS[type];
				let length: number = handlers.length;
				for (let i: number = 0; i < length; ++i)
				{
					if (handlers[i].equal(listener, thisObject))
					{
						handlers.splice(i, 1);
						break;
					}
				}
			}
		}

		private static onKeyDown(event: KeyboardEvent): void
		{
			let key: number = event.keyCode;
			let index: number = Keyboard.KEYS.indexOf(key);
			if (index == -1)
			{
				Keyboard.KEYS.push(key);
				let handlers: frame.utils.Handler[] = Keyboard.LISTENERS[Keyboard.KEY_DOWN].slice();
				let length: number = handlers.length;
				for (let i: number = 0; i < length; ++i)
					handlers[i].execute(event);
			}
		}

		private static onKeyUp(event: KeyboardEvent): void
		{
			let key: number = event.keyCode;
			let index: number = Keyboard.KEYS.indexOf(key);
			if (index > -1)
			{
				Keyboard.KEYS.splice(index, 1);
				let handlers: frame.utils.Handler[] = Keyboard.LISTENERS[Keyboard.KEY_UP].slice();
				let length: number = handlers.length;
				for (let i: number = 0; i < length; ++i)
					handlers[i].execute(event);
			}
		}

		public static readonly KEY_DOWN: string = "keydown";
		public static readonly KEY_UP: string = "keyup";
		public static readonly KEY_PRESS: string = "keypress";

		public static readonly SPACE: number = 32;
		public static readonly LEFT: number = 37;
		public static readonly UP: number = 38;
		public static readonly RIGHT: number = 39;
		public static readonly DOWN: number = 40;
	}
}
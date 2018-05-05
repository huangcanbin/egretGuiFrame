namespace frame.events
{
	/**
	 * @author 陈小军
	 */
	export class Notifier
	{
		private static listeners: egret.EventDispatcher = new egret.EventDispatcher();

		public static register(type: string, listener: Function, thiz: any): void
		{
			Notifier.listeners.addEventListener(type, listener, thiz);
		}

		public static remove(type: string, listener: Function, thiz: any): void
		{
			Notifier.listeners.removeEventListener(type, listener, thiz);
		}

		public static notify(type: string, data?: any): void
		{
			Notifier.listeners.dispatchEventWith(type, false, data);
		}
	}
}
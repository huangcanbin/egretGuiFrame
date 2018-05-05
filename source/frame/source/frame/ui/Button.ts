namespace frame.ui
{
	export class Button extends fairygui.GButton
	{
		private timer: egret.Timer;

		public constructor()
		{
			super();
			this.timer = new egret.Timer(150, 1);
		}

		protected constructFromXML(xml: any): void
		{
			super.constructFromXML(xml);
			this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
		}

		private onTouchTap(event: egret.TouchEvent): void
		{
			this.timer.reset();
			this.touchable = false;
			this.timer.addEventListener(egret.TimerEvent.COMPLETE, this.onTimer, this);
			this.timer.start();
		}

		private onTimer(event: egret.TimerEvent): void
		{
			this.touchable = true;
			this.timer.removeEventListener(egret.TimerEvent.COMPLETE, this.onTimer, this);
		}
	}
}
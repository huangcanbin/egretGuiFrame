/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module gui.SmallLoading {

	export class UI_SmallLoading extends fairygui.GComponent {

		public m_haha:fairygui.GMovieClip;

		public static URL:string = "ui://qa1ed4bwfkpf0";

		public static createInstance():UI_SmallLoading {
			return <UI_SmallLoading><any>(fairygui.UIPackage.createObject("SmallLoading","SmallLoading"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_haha = <fairygui.GMovieClip><any>(this.getChild("haha"));
		}
	}
}
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module gui.Loading {

	export class UI_Loading extends fairygui.GComponent {

		public m_progress:fairygui.GProgressBar;

		public static URL:string = "ui://q65qotvtfkpf0";

		public static createInstance():UI_Loading {
			return <UI_Loading><any>(fairygui.UIPackage.createObject("Loading","Loading"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_progress = <fairygui.GProgressBar><any>(this.getChild("progress"));
		}
	}
}
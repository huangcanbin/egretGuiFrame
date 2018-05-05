/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module gui.Main {

	export class UI_Component1 extends fairygui.GComponent {

		public m_haha:fairygui.GTextField;
		public m_btn:fairygui.GButton;
		public m_btn1:fairygui.GButton;

		public static URL:string = "ui://4cjnm0rajht30";

		public static createInstance():UI_Component1 {
			return <UI_Component1><any>(fairygui.UIPackage.createObject("Main","Component1"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_haha = <fairygui.GTextField><any>(this.getChild("haha"));
			this.m_btn = <fairygui.GButton><any>(this.getChild("btn"));
			this.m_btn1 = <fairygui.GButton><any>(this.getChild("btn1"));
		}
	}
}
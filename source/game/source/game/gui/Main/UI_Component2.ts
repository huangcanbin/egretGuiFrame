/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module gui.Main {

	export class UI_Component2 extends fairygui.GComponent {

		public m_haha:fairygui.GTextField;
		public m_btn:fairygui.GButton;

		public static URL:string = "ui://4cjnm0raq7nq2";

		public static createInstance():UI_Component2 {
			return <UI_Component2><any>(fairygui.UIPackage.createObject("Main","Component2"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_haha = <fairygui.GTextField><any>(this.getChild("haha"));
			this.m_btn = <fairygui.GButton><any>(this.getChild("btn"));
		}
	}
}
namespace frame.scene
{
	/**
	 * @author 陈小军
	 */
	export interface IIScene extends egret.IEventDispatcher
	{
		/**
		 * 关闭自己，内部使用
		 */
		$hide(): void;
		/**
		 * 显示自己，内部使用
		 * @param scenes 场景管理器
		 */
		$show(scenes: SceneManager): void;
		/**
		 * 场景管理器
		 */
		readonly scenes: SceneManager;
		/**
		 * 绘图区
		 */
		readonly canvas: Canvas;
		/**
		 * 窗口管理器
		 */
		readonly windows: frame.layout.WindowManager;
	}
}
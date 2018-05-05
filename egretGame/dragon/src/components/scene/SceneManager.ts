module dragon
{
    /**
     * 场景管理器
     * @export
     * @class SceneManager
     * @extends {frame.scene.SceneManager}
     */
    export class SceneManager extends frame.scene.SceneManager
    {
        private static INSTANCE: frame.scene.SceneManager;

        public static getInstance(): frame.scene.SceneManager
        {
            return SceneManager.INSTANCE;
        }

        public constructor(root: egret.Sprite)
        {
            if (SceneManager.INSTANCE)
            {
                throw new Error("ERROR");
            }
            else
            {
                super(root);
                SceneManager.INSTANCE = this
            }
        }

        /**
		 * 表明场景要使用的窗口管理器
		 */
        protected newWindows(root: fairygui.GRoot): frame.layout.WindowManager
        {
            return dragon.UI.getInstance();
        }
    }

    /**
     * 获取全局场景管理器
     * @export
     * @param {egret.Sprite} root 
     * @returns {dragon.SceneManager} 
     */
    export function getSceneManager(root: egret.Sprite): dragon.SceneManager
    {
        return new dragon.SceneManager(root);
    }
}
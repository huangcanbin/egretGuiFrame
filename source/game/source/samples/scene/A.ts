namespace samples.scene
{
	/**
	 * @author 陈小军
	 * 场景0 -- 用来加载SmallLoading，就这么简单
	 */
    export class A extends LoadingScene
    {
        protected onComplete(): void
        {
            throw new Error("Method not implemented.");
        }
        protected onProgress(progress: number): void
        {
            throw new Error("Method not implemented.");
        }
        protected urls(): string[]
        {
            throw new Error("Method not implemented.");
        }

        protected newCanvas(root: egret.Sprite): frame.scene.Canvas
        {
            throw new Error("Method not implemented.");
        }

        public constructor()
        {
            super();
        }
    }
}
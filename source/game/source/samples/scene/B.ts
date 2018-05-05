///<reference path="help/SceneMerger.ts"/>
namespace samples.scene
{
    /**
     * 场景2 -- 没有什么东西
     * 该场景之所以继承自SceneMerger，是因为ABC场景前有个Loading场景
     */
    export class B extends SceneMerger
    {
        protected urls(): string[]
        {
            throw new Error("Method not implemented.");
        }

        protected newLoading(): LoadingScene
        {
            throw new Error("Method not implemented.");
        }

        protected newStudio(): frame.scene.IScene
        {
            return new ABC();
        }
    }

	/**
	 * 是MainScene的实际场景
	 */
    class ABC extends frame.scene.Scene
    {
        // public get ui(): UI
        // {
        //     this.windows as UI;
        // }
        onOpen(): void
        {
            //this.ui.getefedf
            throw new Error("Method not implemented.");
        }
        onClose(): void
        {
            throw new Error("Method not implemented.");
        }
        protected newCanvas(root: egret.Sprite): frame.scene.Canvas
        {
            //return new frame.scene.Canvas(root);
            return new C(root);
        }
        public constructor()
        {
            super();
        }
    }

    class C extends frame.scene.Canvas
    {
        public constructor(root)
        {
            super(root);
        }

        public init(): void
        {

            // this.display.addChild()
        }
    }
}
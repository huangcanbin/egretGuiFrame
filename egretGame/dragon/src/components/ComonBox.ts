module dragon
{
    /**
     * 弹框基类
     * @export
     * @class Box
     * @extends {dragon.BaseComponent}
     */
    export class CommonBox extends dragon.BaseComponent
    {
        private _maskClick: boolean = false;

        public constructor(...args)
        {
            super(...args);
            this.removeMaskEvent();
        }

        public set maskClick(value: boolean)
        {
            this._maskClick = value;
            if (dragon.UI.getBoxMask() && value)
            {
                dragon.UI.getBoxMask().addClickListener(this.closeView, this);
            }
        }

        public get maskClick(): boolean
        {
            return this._maskClick;
        }

        private closeView(): void
        {
            this.removeMaskEvent();
            dragon.display.removeFromParent(this);
        }

        private removeMaskEvent(): void
        {
            if (dragon.UI.getBoxMask())
            {
                dragon.UI.getBoxMask().removeClickListener(this.closeView, this);
            }
        }

        public setCenter(): void
        {
            if (this.display)
            {
                this.display.x = (dragon.stage.stageWidth - this.display.width) / 2 + this.display.pivotX * this.display.width;
                this.display.y = (dragon.stage.stageHeight - this.display.height) / 2 + this.display.pivotY * this.display.height;;
                // this.display.addRelation(fairygui.GRoot.inst, fairygui.RelationType.Left_Center);
                // this.display.addRelation(fairygui.GRoot.inst, fairygui.RelationType.Middle_Middle);
            }
        }

        public onClose(): void
        {
            super.onClose();
            dragon.UI.clearBoxMask();
        }
    }
}
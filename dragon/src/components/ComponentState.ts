/**
 * @author Andrew_Huang
 */
module dragon
{
    /**
     * 组件状态（添加与移除）
     * @export
     * @class ComponentState
     */
    export class ComponentState
    {
        private _component: dragon.BaseComponent;
        private _args: any[] = [];
        private _listeners: any[] = [];

        public constructor(component: dragon.BaseComponent)
        {
            this._component = component;
            component.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            component.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
        }

        public getArgs(): any
        {
            return this._args;
        }

        public setArgs(args: any): void
        {
            this._args = args;
        }

        public listener(component: dragon.BaseComponent, callback: (e: egret.Event) => void): void
        {
            if (!component || !callback)
            {
                return;
            }
            let type = egret.TouchEvent.TOUCH_TAP;
            this._listeners.push({ component: component, callback: callback, type: type });
            component.addEventListener(type, callback, this);
        }

        public onAddToStage(): void
        {
            dragon.addPullObject(NoticeNameKey.GetComponent, this.getComponent, this);
            this._component.onEnter(...this._args);
        }

        public onRemovedFromStage(): void
        {
            dragon.removePullObject(NoticeNameKey.GetComponent, this.getComponent, this);
            this.clearListeners();
            this._component.onExit();
        }

        public clearListeners(): void
        {
            while (this._listeners.length > 0)
            {
                let item = this._listeners.shift();
                item.component.removeEventListener(item.type, item.callback, this);
            }
        }

        private getComponent(id: any): void | IComponent
        {
            if (id == this._component.autoId && is.truthy(id))
            {
                return this._component;
            } else if ((<any>this._component).componentName == id && is.truthy(id))
            {
                return this._component;
            }
        }
    }
}
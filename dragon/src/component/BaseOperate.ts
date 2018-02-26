/**
 * @author Andrew_Huang
 */
module dragon
{
    /**
     * 
     * @export
     * @interface IComponentOperate
     * @template T 
     */
    export interface IComponentOperate<T>
    {
        type: string;
        state: OperateState;
        isComplete: boolean;
        setComplete(): void;
        getName(): string;
        setName(val: string): T;
        serialize(): any;
        unserialize(data: any): void;
        enter(component: BaseComponent): void;
        exit(component: BaseComponent): void;
    }

    /**
     *
     * @export
     * @class BaseOperate
     * @extends {egret.HashObject}
     * @implements {IComponentOperate<T>}
     * @template T
     */
    export class BaseOperate<T> extends egret.HashObject implements IComponentOperate<T> {

        private _name: string;
        private _state: OperateState;
        private _complete: boolean = false;

        public get state(): OperateState
        {
            return this._state;
        }

        public set state(value: OperateState)
        {
            this._state = value;
        }

        protected getType(): string
        {
            return 'none';
        }

        public get type(): string
        {
            return this.getType();
        }

        public setComplete(): void
        {
            this._complete = true;
        }

        protected getIsComplete(): boolean
        {
            return this._complete;
        }

        public get isComplete(): boolean
        {
            return this.getIsComplete();
        }

        public getName(): string
        {
            return this._name;
        }

        public setName(val: string): T
        {
            this._name = val;
            let result: any = this;
            return <T>result;
        }

        public serialize()
        {
            return null;
        }

        public unserialize(data: any): void
        {

        }

        public enter(component: BaseComponent): void
        {

        }

        public exit(component: BaseComponent): void
        {

        }
    }
}
/**
 * @author Andrew_Huang
 */
module dragon
{
    /**
     * 对象的一个属性发生更改时传递到事件侦听器的事件
     * @export
     * @class PropertyEvent
     * @extends {egret.Event}
     */
    export class PropertyEvent extends egret.Event
    {
        public static PROPERTY_CHANGE: string = "PROPERTY_CHANGE";
        public property: string;  //发生改变的属性名称

        public constructor(type: string, bubbles?: boolean, cancelable?: boolean, property?: string)
        {
            super(type, bubbles, cancelable, property);
        }

        public static dispatchPropertyEvent(target: egret.IEventDispatcher, eventType: string, property?: string): boolean
        {
            if (!target.hasEventListener(eventType))
            {
                return true;
            }
            var event = egret.Event.create(PropertyEvent, eventType);
            event.property = property;
            var result = target.dispatchEvent(event);
            egret.Event.release(event);
            return result;
        }
    }
}
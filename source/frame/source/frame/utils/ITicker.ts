namespace frame.utils
{
	/**
	 * @author 陈小军
	 */
	export interface ITicker
	{
		register(listener: Function, thiz: any): void;
		unregister(listener: Function, thiz: any): void;
		clear(): void;
	}
}
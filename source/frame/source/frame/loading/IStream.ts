namespace frame.loading
{
	/**
	 * @author 陈小军
	 */
	export interface IStream extends egret.IEventDispatcher
	{
		load(): void;
		readonly url: string;
		readonly content: any;
		readonly status: StreamStatus;
	}
}
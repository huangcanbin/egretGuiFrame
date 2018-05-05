namespace frame.utils
{
	/**
	 * @author 陈小军
	 */
	export interface IHandler
	{
		execute(...args: any[]): void;
	}
}
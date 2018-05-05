namespace frame.display
{
	/**
	 * @author 陈小军
	 */
	export interface IAnimation
	{
		play(name: string): void;
		readonly framerate: IFrameRate;
		readonly resources: IResources;
	}
}
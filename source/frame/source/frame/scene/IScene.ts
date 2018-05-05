namespace frame.scene
{
	/**
	 * @author 陈小军
	 */
	export interface IScene extends IIScene
	{
		onOpen(): void;
		onClose(): void;
	}
}
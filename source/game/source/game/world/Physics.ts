namespace game.world
{
	/**
	 * @author 陈小军
	 */
	export class Physics
	{
		private static readonly PTM: number = 32;

		public static force(mass: number, acceleration: number): number
		{
			return mass * acceleration / Physics.PTM;
		}
	}
}
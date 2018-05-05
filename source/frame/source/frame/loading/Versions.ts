namespace frame.loading
{
	export class Versions implements IVersions
	{
		public version(url: string): string
		{
			return Math.random().toString();
		}
	}
}
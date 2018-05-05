namespace frame.loading
{
	/**
	 * @author 陈小军
	 */
	export class Converter implements IConverter
	{

		private suffix(url: string): string
		{
			return url.substring(url.lastIndexOf(".") + 1, url.length);
		}

		public convert(url: string): IStream
		{
			let suffix: string = this.suffix(url);
			switch (suffix)
			{
				case "bin":
					return new BinaryStream(url);
				case "txt":
					return new StringStream(url);
				case "jpg":
				case "png":
					return new DisplayStream(url);
				case "mp3":
					return new SoundStream(url);
				case "json":
					return new JSONStream(url);
				case "var":
					return new VariableStream(url);
				case "xml":
					return new XMLStream(url);
				case "fui":
					return new FairyGUIStream(url);
				default:
					return new BinaryStream(url);
			}
		}
	}
}
namespace frame.io
{
	/**
	 * @author 陈小军
	 */
	export class Path
	{
		public static suffix(url: string): string
		{
			// 取文件名
			const char: string = "[^\/\\/:*?\"<>|]";
			let pattern: string = char + "+";
			let regex: RegExp = new RegExp(pattern, "g");
			let items: RegExpMatchArray = url.match(regex);
			let item: string = items[items.length - 1];
			// 取后缀名
			pattern = "\\." + char + "{1,4}$";
			regex = new RegExp(pattern, "g");
			items = item.match(regex);
			item = items[items.length - 1];
			return item.substring(1, item.length);
		}

		/**
		 * 获取出节点
		 */
		public static filenames(pathname: string): Array<string>
		{
			let index: number = -1;
			let result: RegExpExecArray;
			let names = new Array<string>();
			let pattern: RegExp = /(\w+)(?=\/)/g;
			while (true)
			{
				result = pattern.exec(pathname);
				if (result)
				{
					index = pattern.lastIndex;
					names.push(result[0]);
				}
				else
				{
					names.push(pathname.substring(index + 1, pathname.length));
					break;
				}
			}
			return names;
		}
	}
}

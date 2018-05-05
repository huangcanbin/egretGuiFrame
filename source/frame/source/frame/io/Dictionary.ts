namespace frame.io
{
	/**
	 * @author 陈小军
	 */
	export class Dictionary<V> implements IDictionary<V>
	{
		private items: { [index: string]: V };

		public constructor()
		{
			this.items = {};
		}

		public get(key: string): V
		{
			return this.items[key];
		}

		public add(key: string, value: V): void
		{
			if (!this.has(key))
			{
				this.items[key] = value;
			}
		}

		public has(key: string): boolean
		{
			return this.items.hasOwnProperty(key);
		}

		public remove(key: string): void
		{
			if (this.has(key))
			{
				delete this.items[key];
			}
		}

		public clear(): void
		{
			this.items = {};
		}

		/*
		public keys():string[]
		{
			for (let key:string in this.items)
		}*/
	}
}
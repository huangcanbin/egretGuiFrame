namespace frame.physics
{
	/**
	 * @author 陈小军
	 */
	export class PhysicsEditor
	{
		private bodies: Body[];
		private metadata: Metadata;

		public constructor()
		{
			this.bodies = [];
			this.metadata = new Metadata();
		}

		public parse(items: egret.XML): void
		{
			this.foreach(items, this.onBodydef);
			this.toMeter();
		}

		public getBodyByName(name: string): Body
		{
			let numBodies: number = this.bodies.length;
			for (let i: number = 0; i < numBodies; ++i)
				if (this.bodies[i].name == name)
					return this.bodies[i];
		}

		public getBodyByIndex(index: number): Body
		{
			return this.bodies[index];
		}

		private toMeter(): void
		{
			let numBodies: number = this.bodies.length;
			for (let i: number = 0; i < numBodies; ++i)
			{
				let fixtures: Fixture[] = this.bodies[i].fixtures;
				let numFixtures: number = fixtures.length;
				for (let j: number = 0; j < numFixtures; ++j)
				{
					let polygons: box2d.b2Vec2[][] = fixtures[j].polygons;
					let numPolygons: number = polygons.length;
					for (let k: number = 0; k < numPolygons; ++k)
					{
						let vertices: box2d.b2Vec2[] = polygons[k];
						let numVertices: number = vertices.length;
						for (let h: number = 0; h < numVertices; ++h)
						{
							vertices[h].x /= this.metadata.ptm_ratio;
							vertices[h].y /= this.metadata.ptm_ratio;
						}
					}
				}
			}
		}

		private onBodydef(items: egret.XML): void
		{
			switch (items.name)
			{
				case "bodies":
					this.foreach(items, this.onBodies);
					break;
				case "metadata":
					this.foreach(items, this.onMetadata);
					break;
			}
		}

		private onMetadata(items: egret.XML): void
		{
			switch (items.name)
			{
				case "format":
					this.metadata.format = this.float(items);
					break;
				case "ptm_ratio":
					this.metadata.ptm_ratio = this.float(items);
					break;
			}
		}

		private onBodies(items: egret.XML): void
		{
			let body: Body = new Body();
			body.name = items.attributes.name;
			this.bodies.push(body);
			this.foreach(items, this.onBody, body);
		}

		private onBody(items: egret.XML, body: Body): void
		{
			switch (items.name)
			{
				case "anchorpoint":
					let floats: number[] = this.floats(items);
					body.anchorpoint.x = floats[0];
					body.anchorpoint.y = floats[1];
					break;
				case "fixtures":
					this.foreach(items, this.onFixtures, body);
					break;
			}
		}

		private onFixtures(items: egret.XML, body: Body): void
		{
			switch (items.name)
			{
				case "fixture":
					let fixture: Fixture = new Fixture();
					body.fixtures.push(fixture);
					this.foreach(items, this.onFixture, fixture);
					break;
			}
		}

		private onFixture(items: egret.XML, fixture: Fixture): void
		{
			switch (items.name)
			{
				case "density":
					fixture.density = this.float(items);
					break;
				case "friction":
					fixture.friction = this.float(items);
					break;
				case "restitution":
					fixture.restitution = this.float(items);
					break;
				case "filter_categoryBits":
					fixture.filter_categoryBits = this.float(items);
					break;
				case "filter_groupIndex":
					fixture.filter_groupIndex = this.float(items);
					break;
				case "filter_maskBits":
					fixture.filter_maskBits = this.float(items);
					break;
				case "fixture_type":
					fixture.fixture_type = this.text(items);
					break;
				case "polygons":
					this.foreach(items, this.onPolygons, fixture);
					break;
			}
		}

		private onPolygons(items: egret.XML, fixture: Fixture): void
		{
			let value: number[] = this.floats(items);
			let vertices: box2d.b2Vec2[] = [];
			for (let i: number = value.length - 1; i > -1; i -= 2)
				vertices.push(new box2d.b2Vec2(value[i - 1], -value[i]));
			fixture.polygons.push(vertices);
		}

		private foreach(items: egret.XML, callback: Function, parameter?: any): void
		{
			let length: number = items.children.length;
			for (let i: number = 0; i < length; ++i)
			{
				if (parameter == undefined)
				{
					callback.call(this, items.children[i]);
				}
				else
				{
					callback.call(this, items.children[i], parameter);
				}
			}
		}

		private text(items: egret.XML): string
		{
			let child: egret.XMLText = items.children[0] as egret.XMLText;
			return child.text;
		}

		private float(items: egret.XML): number
		{
			let child: egret.XMLText = items.children[0] as egret.XMLText;
			let text: string = child.text;
			let pattern: RegExp = /-?\d+\.?\d*/g;
			let result: RegExpExecArray = pattern.exec(text);
			return parseFloat(result[0]);
		}

		private floats(items: egret.XML): number[]
		{
			let child: egret.XMLText = items.children[0] as egret.XMLText;
			let text: string = child.text;
			let value: number[] = [];
			let pattern: RegExp = /-?\d+\.?\d*/g;
			let result: RegExpExecArray;
			while (result = pattern.exec(text))
				value.push(parseFloat(result[0]));
			return value;
		}
	}
}
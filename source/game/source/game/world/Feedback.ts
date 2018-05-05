namespace game.world
{
	/**
	 * @author 陈小军
	 */
	export class Feedback extends box2d.b2ContactListener
	{
		private world: World;
		public constructor(world: World)
		{
			super();
			this.world = world;
		}

		public BeginContact(contact: box2d.b2Contact): void
		{
			// console.log("BeginContact" + " " + contact.IsTouching());
			contact.GetFixtureA().GetBody();
			contact.GetFixtureB().GetBody();
			let manifold: box2d.b2WorldManifold = new box2d.b2WorldManifold();
			contact.GetWorldManifold(manifold);
			manifold.points;
			manifold.normal;
		}

		public EndContact(contact: box2d.b2Contact): void
		{
			// console.log("EndContact" + " " + contact.IsTouching());
		}

		public PreSolve(contact: box2d.b2Contact, oldManifold: box2d.b2Manifold): void
		{
			// console.log("PreSolve" + " " + contact.IsTouching());
		}

		public PostSolve(contact: box2d.b2Contact, impulse: box2d.b2ContactImpulse): void
		{
			// console.log("PostSolve" + " " + contact.IsTouching());
		}
	}
}
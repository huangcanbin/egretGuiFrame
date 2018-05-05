namespace frame.animation
{
	/**
	 * @author 陈小军
	 * 基于DragonBone的动画
	 */
	export class DragonBone extends egret.Sprite implements IAnimation
	{
		/**
		 * 骨架
		 */
		private factory: dragonBones.EgretFactory;
		private armature: dragonBones.Armature;
		private display: egret.DisplayObject;

		public constructor(skeleton: Object, format: Object, texture: egret.Texture)
		{
			super();
			this.factory = new dragonBones.EgretFactory();
			let bones = dragonBones.DataParser.parseDragonBonesData(skeleton);
			this.factory.addDragonBonesData(bones);
			let images = this.factory.parseTextureAtlasData(format, texture);
			this.factory.addTextureAtlasData(images);
			this.gotoAndStop(bones.armatureNames[0]);
			console.log("");
		}

		public gotoAndPlay(label: string): void
		{
			this.removeChildren();
			if (this.armature)
				dragonBones.WorldClock.clock.remove(this.armature);
			this.armature = this.factory.buildArmature(label);
			this.display = this.armature.getDisplay();
			this.addChild(this.display);
			dragonBones.WorldClock.clock.add(this.armature);
			this.armature.animation.gotoAndPlay(label);
		}

		public gotoAndStop(label: string): void
		{
			this.removeChildren();
			if (this.armature)
				dragonBones.WorldClock.clock.remove(this.armature);
			this.armature = this.factory.buildArmature(label);
			this.display = this.armature.getDisplay();
			this.addChild(this.display);
			dragonBones.WorldClock.clock.add(this.armature);
			this.armature.animation.gotoAndStop(label);
		}
	}
}
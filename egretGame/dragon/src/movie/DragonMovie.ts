/*
 * @Author: Andrew_Huang 
 * @Date: 2018-05-04 10:16:39 
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-05-04 14:10:35
 */
module dragon
{
    /**
     * 龙骨动画
     * @author Andrew_Huang
     * @export
     * @class DragonMovie
     * @extends {frame.animation.DragonBone}
     */
    export class DragonMovie extends egret.Sprite implements dragon.IMovie
    {
        private _factory: dragonBones.BaseFactory;      //龙骨工厂，管理龙骨动画
        private _armature: dragonBones.Armature;        //骨架
        private _bones: dragonBones.DragonBonesData;    //龙骨数据
        private _images: dragonBones.TextureAtlasData;  //贴图集数据
        private _moviePlay: dragon.IMoviePlay;          //播放器
        private _armatureName: string;                  //骨架数据名称
        private _frameRate: number = null;              //帧频，控制动画播放速度
        private _replaceDisplayArr: MovieSlotDisplayInfo[] = [];
        private _intialized: boolean = false;
        private _skeleton: any;
        private _format: any;
        private _texture: any;

        /**
         * 初始化
         * @author Andrew_Huang
         * @param {Object} skeleton       龙骨DragonBone的Json数据
         * @param {Object} format         纹理图集的Json数据
         * @param {egret.Texture} texture 纹理图集
         * @param {string} armatureName   骨架数据名称
         * @param {number} frameRate      帧频，控制动画播放速度
         * @memberof DragonMovie
         */
        public constructor(skeleton: Object, format: Object, texture: egret.Texture, armatureName: string, frameRate: number = null)
        {
            super()
            if (skeleton && format && texture)
            {
                this._skeleton = skeleton;
                this._format = format;
                this._texture = texture;
                this._armatureName = armatureName;
                this._frameRate = frameRate;
                this.init();
            } else
            {
                console.warn('Please Check Skeleton Or Format Or Texture');
            }
        }

        private init(): void
        {
            this._factory = dragon.BaseFactory();
            this._bones = this._factory.parseDragonBonesData(this._skeleton);
            //this._factory.addDragonBonesData(this._bones);
            this._images = this._factory.parseTextureAtlasData(this._format, this._texture);
            //this._factory.addTextureAtlasData(this._images);
            if (!this._intialized)
            {
                this._intialized = true;
                if (this.stage)
                {
                    this.onAddToStage();
                }
                if (!this.hasEventListener(egret.Event.ADDED_TO_STAGE))
                {
                    this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
                }
                if (!this.hasEventListener(egret.Event.REMOVED_FROM_STAGE))
                {
                    this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveFromStage, this);
                }
            }
        }

        private onAddToStage(): void
        {
            if (this._armature)
            {
                dragonBones.WorldClock.clock.add(this._armature);
                if (this._armature.animation)
                {
                    this._armature.animation.play();
                }
                this._armature.addEventListener(dragonBones.EventObject.START, this.onStart, this);
                this._armature.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.onComplete, this);
                this._armature.addEventListener(dragonBones.EventObject.COMPLETE, this.onComplete, this);
                this._armature.addEventListener(dragonBones.EventObject.FRAME_EVENT, this.onFrame, this);
            }
        }

        private onRemoveFromStage(): void
        {
            dragonBones.WorldClock.clock.remove(this._armature);
            if (this._armature)
            {
                this._armature.addEventListener(dragonBones.EventObject.START, this.onStart, this);
                this._armature.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.onComplete, this);
                this._armature.addEventListener(dragonBones.EventObject.COMPLETE, this.onComplete, this);
                this._armature.addEventListener(dragonBones.EventObject.FRAME_EVENT, this.onFrame, this);
            }
        }

        private _play(): void
        {
            if (this._armature)
            {
                this._moviePlay.play(this._armature.animation);
                return;
            }
            dragonBones.WorldClock.clock.remove(this._armature);
            this._armature = this._factory.buildArmature(this._armatureName)
            this._armature.display.x = 0;
            this._armature.display.y = 0;
            this._moviePlay.play(this._armature.animation);
            this._armature.addEventListener(dragonBones.EventObject.START, this.onStart, this);
            this._armature.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this.onComplete, this);
            this._armature.addEventListener(dragonBones.EventObject.COMPLETE, this.onComplete, this);
            this._armature.addEventListener(dragonBones.EventObject.FRAME_EVENT, this.onFrame, this);
            this.addChild(this._armature.display);
            while (this._replaceDisplayArr.length > 0)
            {
                let info: MovieSlotDisplayInfo = this._replaceDisplayArr.shift();
                this.replaceDisplay(info.name, <egret.DisplayObject>info.display);
            }
            dragonBones.WorldClock.clock.add(this._armature);
            if (this._frameRate)
            {
                this.frameRate = this._frameRate;
            }
        }

        /**
         * 插槽数据替换
         * @author Andrew_Huang
         * @public
         * @param {string} slotName 
         * @param {egret.DisplayObject} display 
         * @memberof DragonMovie
         */
        public replaceDisplay(slotName: string, display: egret.DisplayObject): void
        {
            if (this._armature)
            {
                let slot: dragonBones.Slot = this._armature.getSlot(slotName);
                slot.displayIndex = 0;
                slot.display = display;
            } else
            {
                this._replaceDisplayArr.push({ name: slotName, display: display });
            }
        }

        /**
         * 动画开始
         * @author Andrew_Huang
         * @private
         * @param {dragonBones.EventObject} event 
         * @memberof DragonMovie
         */
        private onStart(event: dragonBones.EventObject): void
        {
            let movieEvent = new dragon.MovieEvent(dragon.MovieEvent.START);
            this.dispatchEvent(movieEvent)
        }

        /**
         * 每一帧监听，动画帧事件
         * @author Andrew_Huang
         * @private
         * @param {dragonBones.EgretEvent} event 
         * @memberof DragonMovie
         */
        private onFrame(event: dragonBones.EventObject): void
        {
            let movieEvent = new dragon.MovieEvent(dragon.MovieEvent.FRAME_LABEL, event.name);
            this.dispatchEvent(movieEvent);
        }

        /**
         * 动画播放完成（循环一次）
         * @author Andrew_Huang
         * @private
         * @param {dragonBones.EgretEvent} event 
         * @memberof DragonMovie
         */
        private onComplete(event: dragonBones.EventObject)
        {
            let movieEvent = new dragon.MovieEvent(dragon.MovieEvent.COMPLETE);
            this.dispatchEvent(movieEvent)
        }

        /**
         * 动画播放
         * @author Andrew_Huang
         * @param {string} name 
         * @param {number} [playTimes] 循环播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次] （默认: -1）
         * @memberof DragonMovie
         */
        public play(name: string, playTimes?: number): void
        {
            if (this.armatureName)
            {
                this._moviePlay = new MoviePlay(name, playTimes);
                this._play();
            }
        }

        /**
         * 骨架数据名称
         */
        public set armatureName(value: string)
        {
            this._armatureName = value;
        }

        /**
         * 骨架数据名称
         */
        public get armatureName(): string
        {
            return this._armatureName;
        }

        public get frameRate(): number
        {
            return this._frameRate;
        }

        /**
         * 播放速度，用于控制动画变速播放
         * @memberof DragonMovie
         */
        public set frameRate(value: number)
        {
            this._frameRate = value;
            if (this._armature)
            {
                this._armature.clock.timeScale = this._frameRate / 24;
            }
        }

        /**
         * 获取动画名称
         * @readonly
         * @type {string}
         * @memberof DragonMovie
         */
        public get animationName(): string
        {
            return this._armature.animation.lastAnimationState.name;
        }

        public destroy(): void
        {

        }
    }
}
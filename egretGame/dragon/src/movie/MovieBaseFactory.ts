/*
 * @Author: Andrew_Huang 
 * @Date: 2018-05-04 11:26:07 
 * @Last Modified by: Andrew_Huang
 * @Last Modified time: 2018-05-04 11:31:27
 */
module dragon
{
    /**
     * 龙骨骨架基础工厂
     * @author Andrew_Huang
     * @export
     * @class MovieBaseFactory
     * @extends {dragonBones.BaseFactory}
     */
    export class MovieBaseFactory extends dragonBones.BaseFactory
    {
        public constructor(dataParser?: dragonBones.DataParser | null)
        {
            super(dataParser);
        }

        protected _buildTextureAtlasData(textureAtlasData: dragonBones.TextureAtlasData, textureAtlas: any): dragonBones.TextureAtlasData
        {
            throw new Error("Method not implemented.");
        }
        protected _buildArmature(dataPackage: dragonBones.BuildArmaturePackage): dragonBones.Armature
        {
            throw new Error("Method not implemented.");
        }
        protected _buildSlot(dataPackage: dragonBones.BuildArmaturePackage, slotData: dragonBones.SlotData, displays: dragonBones.DisplayData[], armature: dragonBones.Armature): dragonBones.Slot
        {
            throw new Error("Method not implemented.");
        }

        /**
         * 将原始数据解析为 DragonBonesData 实例，并缓存到工厂中
         * @author Andrew_Huang
         * @param {*} rawData                 原始数据
         * @param {(string | null)} [name]    为该实例指定一个缓存名称，以便可以通过此名称获取该实例。 （如果未设置，则使用该实例中的名称）
         * @param {number} [scale]            为所有的骨架指定一个缩放值。 （默认: 1.0）
         * @returns {(dragonBones.DragonBonesData | null)} 
         * @memberof MovieBaseFactory
         */
        public parseDragonBonesData(rawData: any, name?: string | null, scale?: number): dragonBones.DragonBonesData | null
        {
            return super.parseDragonBonesData(rawData, name, scale);
        }

        /**
         * 将原始贴图集数据和贴图集对象解析为 TextureAtlasData 实例，并缓存到工厂中
         * @author Andrew_Huang
         * @param {*} rawData               原始贴图集数据
         * @param {*} textureAtlas          贴图集对象
         * @param {(string | null)} [name]  为该实例指定一个缓存名称，以便可以通过此名称获取该实例。 （如果未设置，则使用该实例中的名称）
         * @param {number} [scale]          为贴图集指定一个缩放值。 （默认: 1.0）
         * @returns {TextureAtlasData} 
         * @memberof MovieBaseFactory
         */
        public parseTextureAtlasData(rawData: any, textureAtlas: any, name?: string | null, scale?: number): dragonBones.TextureAtlasData
        {
            return super.parseTextureAtlasData(rawData, textureAtlas, name, scale);
        }
    }

    /**
     * 创建一个龙骨工厂实例。 （通常只需要一个全局工厂实例）
     * @author Andrew_Huang
     * @export
     * @returns {dragon.MovieBaseFactory} 
     */
    export function BaseFactory(): dragon.MovieBaseFactory
    {
        return dragon.singleton(dragon.MovieBaseFactory);
    }
}
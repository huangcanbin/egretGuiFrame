declare namespace frame.layout {
    /**
     * @author 陈小军
     */
    abstract class IDisplay extends egret.EventDispatcher {
        clean: boolean;
        protected _parent: IContainer;
        protected _manager: WindowManager;
        protected _display: fairygui.GComponent;
        constructor();
        parent: IContainer;
        manager: WindowManager;
        $hasSame(): void;
        display: fairygui.GComponent;
        protected onDisplay(value: fairygui.GComponent): void;
        /**
         * 显示界面
         */
        $show(): void;
        /**
         * 关闭界面
         */
        $close(): void;
        /**
         * 进入
         */
        onOpen(): void;
        /**
         * 退出
         */
        onClose(): void;
        readonly visible: boolean;
        readonly eyeable: boolean;
        /**
         * 查询{item}就是不是{this}的上级
         * @param item 上级
         */
        protected isAncestor(item: IContainer): boolean;
    }
}
declare namespace frame.loading {
    /**
     * @author 陈小军
     */
    abstract class ILoaderItem extends egret.EventDispatcher {
        private _url;
        protected _status: LoaderStatus;
        constructor(url: string);
        readonly url: string;
        readonly status: LoaderStatus;
        clear(): void;
        abstract become(value: LoaderStatus): void;
        abstract error(stream: frame.loading.IStream): void;
        abstract complete(stream: frame.loading.IStream): void;
        abstract onComplete(event: egret.Event): void;
        abstract onIOError(event: egret.IOErrorEvent): void;
    }
}
declare namespace frame.layout {
    /**
     * @author 陈小军
     */
    abstract class IContainer extends IDisplay {
        protected _children: Array<IDisplay>;
        constructor();
        manager: WindowManager;
        readonly numChildren: number;
        getChildAt(index: number): IDisplay;
        getChildIndex(child: IDisplay): number;
        contains(child: IDisplay): boolean;
        private updateChildManager(value);
        removeAllChildren(): void;
        addChild(child: IDisplay): void;
        removeChild(child: IDisplay): void;
        /**
         * 更新遮罩
         */
        private onUpdateMask();
        /**
         * 显示界面
         */
        $show(): void;
        /**
         * 关闭界面
         */
        $close(): void;
        /**
         * 查询后代
         * @param item
         */
        protected isPosterity(item: IDisplay): boolean;
        /**
         * 遍历所有子级
         * @param callback 回调函数
         * @param thisObject 回调函数
         */
        foreach(callback: (item: IDisplay) => boolean, thisObject: any): boolean;
        $getItemDepth(item: IDisplay): number;
        $displayIsExist(display: fairygui.GComponent): boolean;
    }
}
declare namespace frame.loading {
    /**
     * @author 陈小军
     */
    class LoaderList extends ILoaderItem {
        count: number;
        urls: string[];
        private states;
        private state;
        children: ILoaderItem[];
        constructor(url?: string);
        load(): void;
        addChild(child: ILoaderItem): void;
        readonly numChildren: number;
        getChild(url: string): ILoaderItem;
        getChildAt(index: number): ILoaderItem;
        become(value: LoaderStatus): void;
        complete(stream: frame.loading.IStream): void;
        error(stream: frame.loading.IStream): void;
        onComplete(event: egret.Event): void;
        onIOError(event: egret.IOErrorEvent): void;
        /**
         * 计数
         */
        private howmany(url);
    }
}
declare namespace frame.io {
    /**
     * @author 陈小军
     */
    class Dictionary<V> implements IDictionary<V> {
        private items;
        constructor();
        get(key: string): V;
        add(key: string, value: V): void;
        has(key: string): boolean;
        remove(key: string): void;
        clear(): void;
    }
}
declare namespace frame.scene {
    /**
     * @author 陈小军
     */
    abstract class ISceneSet extends egret.EventDispatcher implements IIScene {
        private child;
        protected _scenes: SceneManager;
        constructor();
        open(scene: IScene): void;
        show(scenes: SceneManager): void;
        hide(): void;
        readonly canvas: Canvas;
        readonly windows: frame.layout.WindowManager;
        readonly scenes: SceneManager;
    }
}
declare namespace frame.loading {
    /**
     * @author 陈小军
     */
    class LoaderItem extends ILoaderItem {
        private states;
        private state;
        constructor(url: string);
        load(): void;
        readonly content: any;
        become(value: LoaderStatus): void;
        error(stream: frame.loading.IStream): void;
        complete(stream: frame.loading.IStream): void;
        onComplete(event: egret.Event): void;
        onIOError(event: egret.IOErrorEvent): void;
    }
}
declare namespace frame.loading {
    /**
     * @author 陈小军
     */
    abstract class Stream extends egret.EventDispatcher implements IStream {
        private data;
        private _url;
        private _status;
        private stream;
        constructor(url: string);
        readonly url: string;
        readonly content: any;
        readonly status: StreamStatus;
        private become(value);
        load(): void;
        private onComplete(event);
        private onIOError(event);
        protected abstract format(): string;
        protected abstract decode(value: any): any;
    }
}
declare namespace frame.loading {
    /**
     * @author 陈小军
     */
    class Converter implements IConverter {
        private suffix(url);
        convert(url: string): IStream;
    }
}
declare namespace frame.loading {
    /**
     * @author 陈小军
     */
    abstract class LoaderItemState {
        private _parent;
        constructor(parent: LoaderItem);
        protected readonly parent: LoaderItem;
        abstract load(): void;
        readonly abstract content: any;
    }
}
declare namespace frame.loading {
    /**
     * @author 陈小军
     */
    abstract class LoaderListState {
        private _parent;
        constructor(parent: LoaderList);
        protected readonly parent: LoaderList;
        abstract load(): void;
        abstract addChild(child: ILoaderItem): void;
    }
}
declare namespace frame.loading {
    class Versions implements IVersions {
        version(url: string): string;
    }
}
declare namespace frame.loading {
    /**
     * @author 陈小军
     */
    class SoundStream extends Stream {
        constructor(url: string);
        protected decode(value: any): any;
        protected format(): string;
    }
}
declare namespace frame.display {
    /**
     * @author 陈小军
     */
    class Resources implements IResources {
        constructor();
        getRes(url: string): any;
    }
}
declare namespace frame.display {
    /**
     * @author 陈小军
     */
    class TexturePacker extends egret.Sprite {
        /**
         * 当前帧
         */
        private index;
        /**
         * 所有帧数据
         */
        private _frames;
        /**
         * 图集
         */
        private texture;
        /**
         *
         */
        private names;
        /**
         * @param format TexturePacker导出的json文件
         * @param texture TexturePacker导出的图集文件
         */
        constructor(format: Object, texture: egret.Texture);
        /**
         * 所有帧数据
         */
        readonly frames: Frame[];
        /**
         * 显示某帧的图像
         * @param frame 帧索引
         */
        goto(frame: number): void;
        /**
         * TextPacker导出的JSON文件解析成帧格式
         */
        private parse(setting);
        /**
         * 获取名字对应的帧索引
         */
        getIndex(name: string): number;
        getName(index: number): string;
        /**
         * 显示某帧的图像
         * @param frame 帧索引
         */
        private show(index);
        /**
         * 当前帧名
         */
        readonly name: string;
        /**
         * 宽度
         */
        readonly width: number;
        /**
         * 高度
         */
        readonly height: number;
        /**
         * 当前停在哪一帧
         */
        readonly currentFrame: number;
        /**
         * 总共有多少帧
         */
        readonly totalFrames: number;
    }
}
declare namespace frame.events {
    /**
     * @author 陈小军
     */
    class Notifier {
        private static listeners;
        static register(type: string, listener: Function, thiz: any): void;
        static remove(type: string, listener: Function, thiz: any): void;
        static notify(type: string, data?: any): void;
    }
}
declare namespace frame.animation {
    /**
     * @author 陈小军
     * 基于TexturePacker的动画
     */
    class TexturePacker extends egret.Sprite {
        /**
         *
         */
        private time;
        private frame;
        private label;
        /**
         *
         */
        private indices;
        /**
         *
         */
        private list;
        /**
         * 计时器
         */
        private ticker;
        /**
         * TexturePacker解析器
         */
        private animation;
        constructor(format: Object, texture: egret.Texture);
        play(label: string): void;
        stop(): void;
        private onTick(intervals);
    }
}
declare namespace frame.codec {
    /**
     * @author 陈小军
     */
    class Codec implements frame.codec.ICodec {
        sizeof(bytes: utils.ByteArray): number;
        encode(encoder: IEncoder): frame.utils.ByteArray;
        decode(bytes: frame.utils.ByteArray): IDecoder;
    }
}
declare namespace frame.extension {
    import LoaderList = frame.loading.LoaderList;
    class LoadingList extends LoaderList {
        constructor();
        push(url: string): void;
    }
}
declare namespace frame.physics {
    /**
     * @author 陈小军
     */
    class Orientation {
        /**
         * 正交到等距
         */
        static toIso(x: number, y: number): egret.Point;
        /**
         * 等距到正交(鼠标点击场景的位置是等距)
         */
        static toOrt(x: number, y: number): egret.Point;
        /**
         * 等距大小到正交大小
         * @param width
         */
        static toWidth(width: number): number;
    }
}
declare namespace frame.physics {
    /**
     * @author 陈小军
     */
    class Vector {
        static angle(v1: egret.Point, v2: egret.Point): number;
        static dot(v1: egret.Point, v2: egret.Point): number;
    }
}
declare namespace frame.codec {
    /**
     * @author 陈小军
     */
    interface ICodec {
        /**
         * 返回bytes中首个对象的大小
         * @param bytes socket的缓存区
         * @return 首个对象的大小
         */
        sizeof(bytes: frame.utils.ByteArray): number;
        /**
         * 把bytes中的二进制数据解码成对象
         * @param bytes 二进制数据对象
         * @return 解码后的数据对象
         */
        decode(bytes: frame.utils.ByteArray): IDecoder;
        /**
         * 把数据对象编码成二进制对象
         * @param encoder 数据对象
         * @return 编码后的二进制对象
         */
        encode(encoder: IEncoder): frame.utils.ByteArray;
    }
}
declare namespace frame.io {
    /**
     * @author 陈小军
     */
    interface IDictionary<V> {
    }
}
declare namespace frame.io {
    /**
     * @author 陈小军
     */
    class Keyboard {
        private static KEYS;
        private static LISTENERS;
        static start(): void;
        static stop(): void;
        static addEventListener(type: string, listener: Function, thisObject: any): void;
        static removeEventListener(type: string, listener: Function, thisObject: any): void;
        private static onKeyDown(event);
        private static onKeyUp(event);
        static readonly KEY_DOWN: string;
        static readonly KEY_UP: string;
        static readonly KEY_PRESS: string;
        static readonly SPACE: number;
        static readonly LEFT: number;
        static readonly UP: number;
        static readonly RIGHT: number;
        static readonly DOWN: number;
    }
}
declare namespace frame.io {
    /**
     * @author 陈小军
     */
    class Path {
        static suffix(url: string): string;
        /**
         * 获取出节点
         */
        static filenames(pathname: string): Array<string>;
    }
}
declare namespace frame.codec {
    /**
     * @author 陈小军
     */
    interface IDecoder {
        decode(bytes: frame.utils.ByteArray): void;
    }
}
declare namespace frame.codec {
    /**
     * @author 陈小军
     */
    interface IEncoder {
        encode(): frame.utils.ByteArray;
    }
}
declare namespace frame.layout {
    /**
     * @author 陈小军
     */
    class Container extends IContainer {
        constructor();
    }
}
declare namespace frame.layout {
    /**
     * @author 陈小军
     */
    class Display extends IDisplay {
        constructor();
    }
}
declare namespace frame.layout {
    /**
     * @author 陈小军
     */
    abstract class Merger extends IContainer {
        private status;
        private loading;
        private studio;
        constructor();
        private _onAddedToStage(event);
        display: fairygui.GComponent;
        protected abstract newLoading(): IDisplay;
        protected abstract newStudio(): IDisplay;
    }
}
declare namespace frame.layout {
    /**
     * @author 陈小军
     */
    class Window extends IContainer {
        constructor();
    }
}
declare namespace frame.layout {
    /**
     * @author 陈小军
     */
    class WindowManager extends IContainer {
        /**
         * @param root
         */
        constructor(root: fairygui.GRoot);
    }
}
declare namespace frame.display {
    /**
     * @author 陈小军
     */
    abstract class Animation extends egret.Sprite implements IAnimation {
        private _resources;
        private _framerate;
        constructor();
        abstract play(name: string): void;
        dispose(): void;
        readonly framerate: IFrameRate;
        readonly resources: IResources;
        newFrameRate(): IFrameRate;
        newResources(): IResources;
    }
}
declare namespace frame.loading {
    /**
     * @author 陈小军
     */
    class BinaryStream extends Stream {
        constructor(url: string);
        protected decode(value: any): any;
        protected format(): string;
    }
}
declare namespace frame.display {
    /**
     * @author 陈小军
     */
    class Frame {
        x: number;
        y: number;
        name: string;
        rotate: boolean;
        bounds: egret.Rectangle;
    }
}
declare namespace frame.loading {
    /**
     * @author 陈小军
     */
    class DisplayStream extends Stream {
        constructor(url: string);
        protected decode(value: any): any;
        protected format(): string;
    }
}
declare namespace frame.loading {
    /**
     * @author 陈小军
     */
    class FairyGUIStream extends Stream {
        constructor(url: string);
        protected decode(value: any): any;
        protected format(): string;
    }
}
declare namespace frame.loading {
    /**
     * @author 陈小军
     */
    interface IConverter {
        convert(url: string): IStream;
    }
}
declare namespace frame.loading {
    /**
     * @author 陈小军
     */
    interface IStream extends egret.IEventDispatcher {
        load(): void;
        readonly url: string;
        readonly content: any;
        readonly status: StreamStatus;
    }
}
declare namespace frame.loading {
    interface IVersions {
        version(url: string): string;
    }
}
declare namespace frame.loading {
    /**
     * @author 陈小军
     */
    class JSONStream extends Stream {
        constructor(url: string);
        protected decode(value: any): any;
        protected format(): string;
    }
}
declare namespace frame.display {
    /**
     * @author 陈小军
     */
    class FrameRate implements IFrameRate {
        private _framerate;
        framerate: number;
    }
}
declare namespace frame.display {
    /**
     * @author 陈小军
     */
    interface IAnimation {
        play(name: string): void;
        readonly framerate: IFrameRate;
        readonly resources: IResources;
    }
}
declare namespace frame.loading {
    /**
     * @author 陈小军
     */
    enum LoaderStatus {
        READY = 0,
        ERROR = 1,
        INSIDE = 2,
        LOADING = 3,
        COMPLETE = 4,
    }
}
declare namespace frame.loading {
    /**
     * @author 陈小军
     */
    class Resources {
        private static UNLOAD;
        private static LOADING;
        private static LOADED;
        private static find(streams, url);
        static has(url: string): boolean;
        static pick(url: string): IStream;
        static need(url: string): IStream;
        private static load();
        private static onComplete(event);
        /**
         *
         */
        static converter: IConverter;
        static getRes(url: string): any;
        static getResAsync(key: string, listener: Function, thisObject: any): void;
        /**
         * 版本控制器
         */
        static versions: IVersions;
        static version(url: string): string;
    }
}
declare namespace frame.animation {
    interface IAnimation {
        readonly isPlaying: boolean;
        readonly currentFrame: number;
        readonly currentLabel: string;
        readonly totalFrames: number;
        gotoAndPlay(): void;
        gotoAndStop(): void;
        nextFrame(): void;
        play(): void;
        prevFrame(): void;
        stop(): void;
    }
}
declare namespace frame.loading {
    /**
     * @author 陈小军
     */
    enum StreamStatus {
        READY = 0,
        ERROR = 1,
        LOADING = 2,
        COMPLETE = 3,
    }
}
declare namespace frame.loading {
    /**
     * @author 陈小军
     */
    class StringStream extends Stream {
        constructor(url: string);
        protected decode(value: any): any;
        protected format(): string;
    }
}
declare namespace frame.loading {
    /**
     * @author 陈小军
     */
    class VariableStream extends Stream {
        constructor(url: string);
        protected decode(value: any): any;
        protected format(): string;
    }
}
declare namespace frame.display {
    /**
     * @author 陈小军
     */
    interface IFrameRate {
        framerate: number;
    }
}
declare namespace frame.loading {
    /**
     * @author 陈小军
     */
    class XMLStream extends Stream {
        constructor(url: string);
        protected decode(value: any): any;
        protected format(): string;
    }
}
declare namespace frame.loading {
    /**
     * @author 陈小军
     */
    class CompleteLoaderItem extends LoaderItemState {
        constructor(parent: LoaderItem);
        load(): void;
        readonly content: any;
    }
}
declare namespace frame.loading {
    /**
     * @author 陈小军
     */
    class CompleteLoaderList extends LoaderListState {
        constructor(parent: LoaderList);
        load(): void;
        addChild(child: ILoaderItem): void;
    }
}
declare namespace frame.loading {
    /**
     * @author 陈小军
     */
    class ErrorLoaderItem extends LoaderItemState {
        constructor(parent: LoaderItem);
        load(): void;
        readonly content: any;
    }
}
declare namespace frame.loading {
    /**
     * @author 陈小军
     */
    class ErrorLoaderList extends LoaderListState {
        constructor(parent: LoaderList);
        load(): void;
        addChild(child: ILoaderItem): void;
    }
}
declare namespace frame.loading {
    /**
     * @author 陈小军
     */
    class InsideLoaderItem extends LoaderItemState {
        constructor(parent: LoaderItem);
        load(): void;
        readonly content: any;
    }
}
declare namespace frame.loading {
    /**
     * @author 陈小军
     */
    class InsideLoaderList extends LoaderListState {
        constructor(parent: LoaderList);
        load(): void;
        addChild(child: ILoaderItem): void;
    }
}
declare namespace frame.loading {
    /**
     * @author 陈小军
     */
    class LoadingLoaderItem extends LoaderItemState {
        constructor(parent: LoaderItem);
        load(): void;
        readonly content: any;
    }
}
declare namespace frame.loading {
    /**
     * @author 陈小军
     */
    class LoadingLoaderList extends LoaderListState {
        constructor(parent: LoaderList);
        load(): void;
        addChild(child: ILoaderItem): void;
    }
}
declare namespace frame.loading {
    /**
     * @author 陈小军
     */
    class ReadyLoaderItem extends LoaderItemState {
        constructor(parent: LoaderItem);
        load(): void;
        readonly content: any;
    }
}
declare namespace frame.loading {
    /**
     * @author 陈小军
     */
    class ReadyLoaderList extends LoaderListState {
        constructor(parent: LoaderList);
        load(): void;
        private forEachChild(list);
        addChild(child: ILoaderItem): void;
        private addOrSendEvent(loader, stream);
    }
}
declare namespace frame.net {
    /**
     * @author:陈小军
     */
    class FlatBuffersSocket extends egret.EventDispatcher {
    }
}
declare namespace frame.net {
    /**
     * @author 陈小军
     */
    interface ISocket extends egret.IEventDispatcher {
        endian: string;
        codec: frame.codec.ICodec;
        readonly objectsAvailable: boolean;
        readonly connected: boolean;
        close(): void;
        connect(host: string, port: number): void;
        flush(): void;
        readObject(): frame.codec.IDecoder;
        writeObject(value: frame.codec.IEncoder): void;
    }
}
declare namespace frame.net {
    /**
     * @author 陈小军
     */
    interface IWebSocket extends egret.IEventDispatcher, frame.utils.IByteArray {
        endian: string;
        codec: frame.codec.ICodec;
        readonly objectsAvailable: boolean;
        readonly bytesAvailable: number;
        readonly connected: boolean;
        close(): void;
        connect(host: string, port: number): void;
        flush(): void;
        readObject(): frame.codec.IDecoder;
        writeObject(value: frame.codec.IEncoder): void;
    }
}
declare namespace frame.net {
    /**
     * @author:陈小军
     */
    class ProtocolbuffersSocket extends egret.EventDispatcher {
    }
}
declare namespace frame.net {
    /**
     * @author 陈小军
     */
    class Socket extends egret.EventDispatcher implements ISocket {
        private socket;
        constructor(codec: frame.codec.ICodec);
        /**
         * 字节序
         */
        endian: string;
        codec: frame.codec.ICodec;
        readonly objectsAvailable: boolean;
        /**
         * 当前socket是否连接
         */
        readonly connected: boolean;
        /**
         * 关闭连接
         */
        close(): void;
        /**
         * @param host ip地址
         * @param port 端口
         */
        connect(host: string, port: number): void;
        /**
         * 刷新socket缓存
         */
        flush(): void;
        /**
         * 读取缓存中对象
         */
        readObject(): frame.codec.IDecoder;
        /**
         * 对象写入缓存中
         */
        writeObject(value: frame.codec.IEncoder): void;
        private onClose(event);
        private onConnect(event);
        private onIOError(event);
        private onSocketData(event);
    }
}
declare namespace frame.net {
    /**
     * @author 陈小军
     */
    class WebSocket extends egret.EventDispatcher implements IWebSocket {
        private socket;
        private _codec;
        private bytes;
        private chars;
        constructor();
        endian: string;
        readonly connected: boolean;
        readonly bytesAvailable: number;
        codec: frame.codec.ICodec;
        readonly objectsAvailable: boolean;
        close(): void;
        connect(host: string, port: number): void;
        flush(): void;
        private onClose(event);
        private onConnect(event);
        private onIOError(event);
        private onSocketData(event);
        readBoolean(): boolean;
        readByte(): number;
        readBytes(bytes: frame.utils.ByteArray, offset?: number, length?: number): void;
        readDouble(): number;
        readFloat(): number;
        readInt(): number;
        readMultiByte(length: number, charSet: string): string;
        readObject(): frame.codec.IDecoder;
        readShort(): number;
        readUnsignedByte(): number;
        readUnsignedInt(): number;
        readUnsignedShort(): number;
        readUTF(): string;
        readUTFBytes(length: number): string;
        writeBoolean(value: boolean): void;
        writeByte(value: number): void;
        writeBytes(bytes: frame.utils.ByteArray, offset?: number, length?: number): void;
        writeDouble(value: number): void;
        writeFloat(value: number): void;
        writeInt(value: number): void;
        writeMultiByte(value: string, charSet: string): void;
        writeObject(value: frame.codec.IEncoder): void;
        writeShort(value: number): void;
        writeUnsignedByte(value: number): void;
        writeUnsignedInt(value: number): void;
        writeUnsignedShort(value: number): void;
        writeUTF(value: string): void;
        writeUTFBytes(value: string): void;
        private send();
    }
}
declare namespace frame.physics {
    /**
     * @author 陈小军
     */
    class Body {
        private _name;
        private _anchorpoint;
        private _fixtures;
        constructor();
        name: string;
        anchorpoint: egret.Point;
        fixtures: Fixture[];
    }
}
declare namespace frame.physics {
    /**
     * @author 陈小军
     */
    class Fixture {
        private _density;
        private _friction;
        private _restitution;
        private _filter_categoryBits;
        private _filter_groupIndex;
        private _filter_maskBits;
        private _fixture_type;
        private _polygons;
        constructor();
        density: number;
        friction: number;
        restitution: number;
        filter_categoryBits: number;
        filter_groupIndex: number;
        filter_maskBits: number;
        fixture_type: string;
        polygons: box2d.b2Vec2[][];
    }
}
declare namespace frame.physics {
    /**
     * @author 陈小军
     */
    class Metadata {
        private _format;
        private _ptm_ratio;
        constructor();
        format: number;
        ptm_ratio: number;
    }
}
declare namespace frame.physics {
    /**
     * @author 陈小军
     */
    class PhysicsEditor {
        private bodies;
        private metadata;
        constructor();
        parse(items: egret.XML): void;
        getBodyByName(name: string): Body;
        getBodyByIndex(index: number): Body;
        private toMeter();
        private onBodydef(items);
        private onMetadata(items);
        private onBodies(items);
        private onBody(items, body);
        private onFixtures(items, body);
        private onFixture(items, fixture);
        private onPolygons(items, fixture);
        private foreach(items, callback, parameter?);
        private text(items);
        private float(items);
        private floats(items);
    }
}
declare namespace frame.physics {
    /**
     * @author 陈小军
     */
    class PhysicsEditorTool extends egret.Sprite {
        constructor();
    }
}
declare namespace frame.scene {
    /**
     * @author 陈小军
     * 场景的绘图区
     */
    class Canvas {
        private _display;
        constructor(display: egret.Sprite);
        /**
         * 显示对象
         */
        display: egret.Sprite;
        /**
         * 退出
         */
        onExit(): void;
    }
}
declare namespace frame.scene {
    /**
     * @author 陈小军
     */
    interface IIScene extends egret.IEventDispatcher {
        /**
         * 关闭自己，内部使用
         */
        hide(): void;
        /**
         * 显示自己，内部使用
         * @param scenes 场景管理器
         */
        show(scenes: SceneManager): void;
        /**
         * 场景管理器
         */
        readonly scenes: SceneManager;
        /**
         * 绘图区
         */
        readonly canvas: Canvas;
        /**
         * 窗口管理器
         */
        readonly windows: frame.layout.WindowManager;
    }
}
declare namespace frame.scene {
    /**
     * @author 陈小军
     */
    interface IScene extends IIScene {
        onOpen(): void;
        onClose(): void;
    }
}
declare namespace frame.display {
    /**
     * @author 陈小军
     */
    interface IResources {
        getRes(url: string): any;
    }
}
declare namespace frame.scene {
    /**
     * @author 陈小军
     */
    abstract class Scene extends egret.EventDispatcher implements IScene {
        private _canvas;
        private _scenes;
        constructor();
        abstract onOpen(): void;
        abstract onClose(): void;
        readonly canvas: Canvas;
        readonly windows: frame.layout.WindowManager;
        readonly scenes: SceneManager;
        show(scenes: SceneManager): void;
        hide(): void;
        protected abstract newCanvas(root: egret.Sprite): Canvas;
    }
}
declare namespace frame.scene {
    /**
     * @author 陈小军
     */
    abstract class SceneManager extends ISceneSet {
        private _root;
        private _windows;
        constructor(root: egret.Sprite);
        readonly root: egret.Sprite;
        readonly $canvas: egret.Sprite;
        readonly windows: frame.layout.WindowManager;
        /**
         * 指定场景管理器要使用的窗口管理器
         */
        protected abstract newWindows(root: fairygui.GRoot): frame.layout.WindowManager;
        /**
         * 以下代码用于自动调整fairygui尺寸
         */
        private autoResizeWindowManager();
        private onAddedToStage(event);
        private onRemovedFromStage(event);
        private resizeWindowManager();
        private onResizeWindowManager(event);
    }
}
declare namespace frame.scene {
    /**
     * @author 陈小军
     */
    abstract class SceneSet extends ISceneSet implements IScene {
        constructor();
        abstract onOpen(): void;
        abstract onClose(): void;
    }
}
declare namespace frame.ui {
    class Button extends fairygui.GButton {
        private timer;
        constructor();
        protected constructFromXML(xml: any): void;
        private onTouchTap(event);
        private onTimer(event);
    }
}
declare namespace frame.ui {
    class Loading implements fairygui.IResource {
        constructor();
        getRes(url: string): any;
        getResAsync(key: string, onComplete: Function, thisObject: any): void;
    }
}
declare namespace frame.utils {
    /**
     * @author 陈小军
     */
    class ByteArray extends egret.ByteArray implements IByteArray {
        private _codec;
        constructor();
        codec: frame.codec.ICodec;
        readonly objectsAvailable: boolean;
        readMultiByte(length: number, charSet: string): string;
        readObject(): frame.codec.IDecoder;
        writeMultiByte(value: string, charSet: string): void;
        writeObject(value: frame.codec.IEncoder): void;
        writeUnsignedByte(value: number): void;
        /**
         * offset相对于bytes
         * readBytes(bytes: ByteArray, offset: number, length: number): void;
         */
        /**
         * offset相对于bytes
         * writeBytes(bytes: ByteArray, offset: number, length: number): void;
         */
        readLongLong(): number;
        writeLongLong(value: number): void;
        readUnsignedLongLong(): number;
        writeUnsignedLongLong(value: number): void;
        readString(length: number, size?: number): string;
        writeString(value: string, length: number): void;
    }
}
declare namespace frame.utils {
    /**
     * 陈小军
     */
    class Dictionary<T> {
        private items;
        constructor();
        get(key: string): T;
        add(key: string, value: T): void;
        has(key: string): boolean;
        remove(key: string): void;
        clear(): void;
    }
}
declare namespace frame.utils {
    /**
     * @author 陈小军
     */
    class Handler implements IHandler {
        private _thisObject;
        private _listener;
        constructor(listener: Function, thisObject: any);
        execute(...args: any[]): void;
        equal(listener: Function, thisObject: any): boolean;
        readonly thisObject: any;
        readonly listener: Function;
    }
}
declare namespace frame.utils {
    /**
     * @author 陈小军
     */
    interface IByteArray extends IDataInput, IDataOutput {
        codec: frame.codec.ICodec;
        readonly objectsAvailable: boolean;
    }
}
declare namespace frame.utils {
    /**
     * @author 陈小军
     */
    interface IDataInput {
        readBoolean(): boolean;
        readByte(): number;
        readBytes(bytes: ByteArray, offset: number, length: number): void;
        readDouble(): number;
        readFloat(): number;
        readInt(): number;
        readMultiByte(length: number, charSet: string): string;
        readObject(): frame.codec.IDecoder;
        readShort(): number;
        readUnsignedByte(): number;
        readUnsignedInt(): number;
        readUnsignedShort(): number;
        readUTF(): string;
        readUTFBytes(length: number): string;
    }
}
declare namespace frame.utils {
    /**
     * @author 陈小军
     */
    interface IDataOutput {
        writeBoolean(value: boolean): void;
        writeByte(value: number): void;
        writeBytes(bytes: ByteArray, offset: number, length: number): void;
        writeDouble(value: number): void;
        writeFloat(value: number): void;
        writeInt(value: number): void;
        writeMultiByte(value: string, charSet: string): void;
        writeObject(value: frame.codec.IEncoder): void;
        writeShort(value: number): void;
        writeUnsignedByte(value: number): void;
        writeUnsignedInt(value: number): void;
        writeUnsignedShort(value: number): void;
        writeUTF(value: string): void;
        writeUTFBytes(value: string): void;
    }
}
declare namespace frame.utils {
    /**
     * @author 陈小军
     */
    interface IHandler {
        execute(...args: any[]): void;
    }
}
declare namespace frame.utils {
    /**
     * @author 陈小军
     */
    interface ITicker {
        register(listener: Function, thiz: any): void;
        unregister(listener: Function, thiz: any): void;
        clear(): void;
    }
}
declare namespace frame.utils {
    /**
     * @author 陈小军
     */
    class StringUtils {
        static size(value: string): number;
    }
}
declare namespace frame.utils {
    /**
     * @author 陈小军
     */
    class Ticker implements ITicker {
        private running;
        private handlers;
        constructor();
        register(listener: Function, thiz: any): void;
        unregister(listener: Function, thiz: any): void;
        clear(): void;
        private onTick(intervals);
        private index(listener, thiz);
        static SCALE: number;
    }
}

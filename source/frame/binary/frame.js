var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var engine;
(function (engine) {
    engine.Ticker = egret.Ticker;
    engine.ByteArray = egret.ByteArray;
    engine.Event = egret.Event;
    engine.Timer = egret.Timer;
    engine.Sprite = egret.Sprite;
    engine.TouchEvent = egret.TouchEvent;
    engine.Endian = egret.Endian;
    engine.Matrix = egret.Matrix;
    engine.Point = egret.Point;
    engine.TimerEvent = egret.TimerEvent;
    engine.EventDispatcher = egret.EventDispatcher;
    engine.IOErrorEvent = egret.IOErrorEvent;
    engine.ProgressEvent = egret.ProgressEvent;
    engine.WebSocket = egret.WebSocket;
    engine.EventPhase = egret.EventPhase;
    engine.Rectangle = egret.Rectangle;
    engine.DisplayObject = egret.DisplayObject;
    engine.Texture = egret.Texture;
    engine.Bitmap = egret.Bitmap;
    engine.URLLoaderDataFormat = egret.URLLoaderDataFormat;
    engine.URLLoader = egret.URLLoader;
    engine.URLRequest = egret.URLRequest;
    engine.XML = egret.XML;
})(engine || (engine = {}));
var frame;
(function (frame) {
    var animation;
    (function (animation) {
        /**
         * @author 陈小军
         * 基于DragonBone的动画
         */
        var DragonBone = /** @class */ (function (_super) {
            __extends(DragonBone, _super);
            function DragonBone(skeleton, format, texture) {
                var _this = _super.call(this) || this;
                _this.factory = new dragonBones.EgretFactory();
                var bones = dragonBones.DataParser.parseDragonBonesData(skeleton);
                _this.factory.addDragonBonesData(bones);
                var images = _this.factory.parseTextureAtlasData(format, texture);
                _this.factory.addTextureAtlasData(images);
                _this.gotoAndStop(bones.armatureNames[0]);
                console.log("");
                return _this;
            }
            DragonBone.prototype.gotoAndPlay = function (label) {
                this.removeChildren();
                if (this.armature)
                    dragonBones.WorldClock.clock.remove(this.armature);
                this.armature = this.factory.buildArmature(label);
                this.display = this.armature.getDisplay();
                this.addChild(this.display);
                dragonBones.WorldClock.clock.add(this.armature);
                this.armature.animation.gotoAndPlay(label);
            };
            DragonBone.prototype.gotoAndStop = function (label) {
                this.removeChildren();
                if (this.armature)
                    dragonBones.WorldClock.clock.remove(this.armature);
                this.armature = this.factory.buildArmature(label);
                this.display = this.armature.getDisplay();
                this.addChild(this.display);
                dragonBones.WorldClock.clock.add(this.armature);
                this.armature.animation.gotoAndStop(label);
            };
            return DragonBone;
        }(egret.Sprite));
        animation.DragonBone = DragonBone;
    })(animation = frame.animation || (frame.animation = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var animation;
    (function (animation) {
        /**
         * @author 陈小军
         * 基于TexturePacker的动画
         */
        var TexturePacker = /** @class */ (function (_super) {
            __extends(TexturePacker, _super);
            function TexturePacker(format, texture) {
                var _this = _super.call(this) || this;
                _this.ticker = new frame.utils.Ticker();
                _this.animation = new frame.display.TexturePacker(format, texture);
                _this.addChild(_this.animation);
                _this.list = new List("");
                for (var i = 0; i < _this.animation.frames.length; ++i) {
                    var list = _this.list;
                    var label = _this.animation.frames[i].name;
                    var names = frame.io.Path.filenames(label);
                    for (var j = 0; j < names.length - 1; ++j)
                        list = list.addChild(new List(names[j]));
                    list.addChild(new Node(names[names.length - 1], i));
                }
                console.log("fsdfsd");
                return _this;
            }
            TexturePacker.prototype.play = function (label) {
                // 开始时间
                this.time = 0;
                // 当前索引
                this.frame = 0;
                this.label = label;
                var a = this.list.getPosterity(this.label);
                var indices = new Array();
                var callback = function (node) {
                    if (node instanceof Node)
                        indices.push(node.index);
                };
                a.foreach(callback, this);
                this.indices = indices;
                this.ticker.register(this.onTick, this);
            };
            TexturePacker.prototype.stop = function () {
            };
            TexturePacker.prototype.onTick = function (intervals) {
                this.time += intervals;
                var frames = Math.floor(this.time / 100);
                var remainder = this.time - frames * 100;
                for (var i = 0; i < frames; ++i) {
                    this.frame = (this.frame + 1) % this.indices.length;
                    this.dispatchEventWith("frame");
                }
                this.animation.goto(this.indices[this.frame]);
                this.time = remainder;
            };
            return TexturePacker;
        }(egret.Sprite));
        animation.TexturePacker = TexturePacker;
        var INode = /** @class */ (function () {
            function INode(name) {
                this._name = name;
            }
            Object.defineProperty(INode.prototype, "name", {
                get: function () {
                    return this._name;
                },
                enumerable: true,
                configurable: true
            });
            return INode;
        }());
        var Node = /** @class */ (function (_super) {
            __extends(Node, _super);
            function Node(name, index) {
                var _this = _super.call(this, name) || this;
                _this._index = index;
                return _this;
            }
            Object.defineProperty(Node.prototype, "index", {
                get: function () {
                    return this._index;
                },
                enumerable: true,
                configurable: true
            });
            return Node;
        }(INode));
        var List = /** @class */ (function (_super) {
            __extends(List, _super);
            function List(name) {
                var _this = _super.call(this, name) || this;
                _this.children = new Array();
                return _this;
            }
            List.prototype.addChild = function (child) {
                var node = this.getChild(child.name);
                if (node)
                    return node;
                this.children.push(child);
                return child;
            };
            List.prototype.getChild = function (name) {
                for (var i = 0; i < this.children.length; ++i)
                    if (this.children[i].name == name)
                        return this.children[i];
            };
            List.prototype.getPosterity = function (name) {
                var list = this;
                var node = null;
                var names = frame.io.Path.filenames(name);
                for (var i = 0; i < names.length; ++i) {
                    node = list.getChild(names[i]);
                    if (node == null)
                        return null;
                    else if (node instanceof List)
                        list = node;
                }
                return node;
            };
            List.prototype.foreach = function (callback, thisObject) {
                var length = this.children.length;
                for (var i = 0; i < length; ++i) {
                    var child = this.children[i];
                    callback.call(thisObject, child);
                    if (child instanceof List)
                        child.foreach(callback, thisObject);
                }
            };
            return List;
        }(INode));
    })(animation = frame.animation || (frame.animation = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var codec;
    (function (codec) {
        /**
         * @author 陈小军
         */
        var Codec = /** @class */ (function () {
            function Codec() {
            }
            Codec.prototype.sizeof = function (bytes) {
                throw new Error("ERROR");
            };
            Codec.prototype.encode = function (encoder) {
                throw new Error("ERROR");
            };
            Codec.prototype.decode = function (bytes) {
                throw new Error("ERROR");
            };
            return Codec;
        }());
        codec.Codec = Codec;
    })(codec = frame.codec || (frame.codec = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var display;
    (function (display) {
        /**
         * @author 陈小军
         */
        var Animation = /** @class */ (function (_super) {
            __extends(Animation, _super);
            function Animation() {
                var _this = _super.call(this) || this;
                _this._resources = _this.newResources();
                _this._framerate = _this.newFrameRate();
                return _this;
            }
            Animation.prototype.dispose = function () {
            };
            Object.defineProperty(Animation.prototype, "framerate", {
                get: function () {
                    return this._framerate;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Animation.prototype, "resources", {
                get: function () {
                    return this._resources;
                },
                enumerable: true,
                configurable: true
            });
            Animation.prototype.newFrameRate = function () {
                return new display.FrameRate();
            };
            Animation.prototype.newResources = function () {
                return new display.Resources();
            };
            return Animation;
        }(egret.Sprite));
        display.Animation = Animation;
    })(display = frame.display || (frame.display = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var display;
    (function (display) {
        /**
         * @author 陈小军
         */
        var Frame = /** @class */ (function () {
            function Frame() {
            }
            return Frame;
        }());
        display.Frame = Frame;
    })(display = frame.display || (frame.display = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var display;
    (function (display) {
        /**
         * @author 陈小军
         */
        var FrameRate = /** @class */ (function () {
            function FrameRate() {
            }
            Object.defineProperty(FrameRate.prototype, "framerate", {
                get: function () {
                    return 100;
                },
                set: function (value) {
                    this._framerate = value;
                },
                enumerable: true,
                configurable: true
            });
            return FrameRate;
        }());
        display.FrameRate = FrameRate;
    })(display = frame.display || (frame.display = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var display;
    (function (display) {
        /**
         * @author 陈小军
         */
        var Resources = /** @class */ (function () {
            function Resources() {
            }
            Resources.prototype.getRes = function (url) {
                return frame.loading.Resources.getRes(url);
            };
            return Resources;
        }());
        display.Resources = Resources;
    })(display = frame.display || (frame.display = {}));
})(frame || (frame = {}));
var frame;
(function (frame_1) {
    var display;
    (function (display) {
        /**
         * @author 陈小军
         */
        var TexturePacker = /** @class */ (function (_super) {
            __extends(TexturePacker, _super);
            /**
             * @param format TexturePacker导出的json文件
             * @param texture TexturePacker导出的图集文件
             */
            function TexturePacker(format, texture) {
                var _this = _super.call(this) || this;
                _this._frames = [];
                _this.names = new frame.utils.Dictionary();
                _this.parse(format);
                _this.texture = new egret.Bitmap(texture);
                _this.addChild(_this.texture);
                _this.goto(0);
                return _this;
            }
            Object.defineProperty(TexturePacker.prototype, "frames", {
                /**
                 * 所有帧数据
                 */
                get: function () {
                    return this._frames;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 显示某帧的图像
             * @param frame 帧索引
             */
            TexturePacker.prototype.goto = function (frame) {
                this.index = frame;
                this.show(frame);
            };
            /**
             * TextPacker导出的JSON文件解析成帧格式
             */
            TexturePacker.prototype.parse = function (setting) {
                var frame;
                var frames = setting["frames"];
                var length = frames.length;
                for (var i = 0; i < length; ++i) {
                    frame = frames[i];
                    var transform = new display.Frame();
                    // 路径名
                    transform.name = frame["filename"];
                    // 是否旋转
                    transform.rotate = frame["rotated"];
                    // 是否裁剪
                    var trim = frame["trimmed"];
                    var rectangle = frame["frame"];
                    var x = rectangle["x"];
                    var y = rectangle["y"];
                    var w = rectangle["w"];
                    var h = rectangle["h"];
                    var width = transform.rotate ? h : w;
                    var height = transform.rotate ? w : h;
                    transform.bounds = new egret.Rectangle(x, y, width, height);
                    var pivot = frame["pivot"];
                    var size = frame["sourceSize"];
                    var area = frame["spriteSourceSize"];
                    if (transform.rotate) {
                        transform.x = area["x"] + area["w"] / 2 - size["w"] * pivot["x"] - y - w / 2;
                        transform.y = area["y"] + area["h"] / 2 - size["h"] * pivot["y"] + x + h / 2;
                    }
                    else {
                        transform.x = area["x"] - size["w"] * pivot["x"] - x;
                        transform.y = area["y"] - size["h"] * pivot["y"] - y;
                    }
                    this.names.add(transform.name, i);
                    this._frames.push(transform);
                }
            };
            /**
             * 获取名字对应的帧索引
             */
            TexturePacker.prototype.getIndex = function (name) {
                return this.names.get(name);
            };
            TexturePacker.prototype.getName = function (index) {
                return this.frames[index].name;
            };
            /**
             * 显示某帧的图像
             * @param frame 帧索引
             */
            TexturePacker.prototype.show = function (index) {
                var frame = this._frames[index];
                this.texture.mask = frame.bounds;
                this.texture.rotation = frame.rotate ? -90 : 0;
                this.texture.x = frame.x;
                this.texture.y = frame.y;
            };
            Object.defineProperty(TexturePacker.prototype, "name", {
                /**
                 * 当前帧名
                 */
                get: function () {
                    return this._frames[this.index].name;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TexturePacker.prototype, "width", {
                /**
                 * 宽度
                 */
                get: function () {
                    return this._frames[this.index].bounds.width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TexturePacker.prototype, "height", {
                /**
                 * 高度
                 */
                get: function () {
                    return this._frames[this.index].bounds.height;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TexturePacker.prototype, "currentFrame", {
                /**
                 * 当前停在哪一帧
                 */
                get: function () {
                    return this.index;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TexturePacker.prototype, "totalFrames", {
                /**
                 * 总共有多少帧
                 */
                get: function () {
                    return this._frames.length;
                },
                enumerable: true,
                configurable: true
            });
            return TexturePacker;
        }(egret.Sprite));
        display.TexturePacker = TexturePacker;
    })(display = frame_1.display || (frame_1.display = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var events;
    (function (events) {
        /**
         * @author 陈小军
         */
        var Notifier = /** @class */ (function () {
            function Notifier() {
            }
            Notifier.register = function (type, listener, thiz) {
                Notifier.listeners.addEventListener(type, listener, thiz);
            };
            Notifier.remove = function (type, listener, thiz) {
                Notifier.listeners.removeEventListener(type, listener, thiz);
            };
            Notifier.notify = function (type, data) {
                Notifier.listeners.dispatchEventWith(type, false, data);
            };
            Notifier.listeners = new egret.EventDispatcher();
            return Notifier;
        }());
        events.Notifier = Notifier;
    })(events = frame.events || (frame.events = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var loading;
    (function (loading) {
        /**
         * @author 陈小军
         */
        var ILoaderItem = /** @class */ (function (_super) {
            __extends(ILoaderItem, _super);
            function ILoaderItem(url) {
                var _this = _super.call(this) || this;
                _this._url = url;
                return _this;
            }
            Object.defineProperty(ILoaderItem.prototype, "url", {
                get: function () {
                    return this._url;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ILoaderItem.prototype, "status", {
                get: function () {
                    return this._status;
                },
                enumerable: true,
                configurable: true
            });
            ILoaderItem.prototype.clear = function () {
            };
            return ILoaderItem;
        }(egret.EventDispatcher));
        loading.ILoaderItem = ILoaderItem;
    })(loading = frame.loading || (frame.loading = {}));
})(frame || (frame = {}));
///<reference path="ILoaderItem.ts"/>
var frame;
(function (frame) {
    var loading;
    (function (loading) {
        /**
         * @author 陈小军
         */
        var LoaderItem = /** @class */ (function (_super) {
            __extends(LoaderItem, _super);
            function LoaderItem(url) {
                var _this = _super.call(this, url) || this;
                _this.states = new Object();
                _this.states[loading.LoaderStatus.READY] = new loading.ReadyLoaderItem(_this);
                _this.states[loading.LoaderStatus.INSIDE] = new loading.InsideLoaderItem(_this);
                _this.states[loading.LoaderStatus.LOADING] = new loading.LoadingLoaderItem(_this);
                _this.states[loading.LoaderStatus.COMPLETE] = new loading.CompleteLoaderItem(_this);
                _this.states[loading.LoaderStatus.ERROR] = new loading.ErrorLoaderItem(_this);
                _this.become(loading.LoaderStatus.READY);
                return _this;
            }
            LoaderItem.prototype.load = function () {
                this.state.load();
            };
            Object.defineProperty(LoaderItem.prototype, "content", {
                get: function () {
                    return this.state.content;
                },
                enumerable: true,
                configurable: true
            });
            LoaderItem.prototype.become = function (value) {
                this._status = value;
                this.state = this.states[value];
            };
            LoaderItem.prototype.error = function (stream) {
                this.become(loading.LoaderStatus.ERROR);
                stream.removeEventListener(egret.Event.COMPLETE, this.onComplete, this);
                stream.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onIOError, this);
                this.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
            };
            LoaderItem.prototype.complete = function (stream) {
                this.become(loading.LoaderStatus.COMPLETE);
                stream.removeEventListener(egret.Event.COMPLETE, this.onComplete, this);
                stream.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onIOError, this);
                this.dispatchEventWith(egret.Event.COMPLETE);
            };
            LoaderItem.prototype.onComplete = function (event) {
                var stream = event.target;
                this.complete(stream);
            };
            LoaderItem.prototype.onIOError = function (event) {
                var stream = event.target;
                this.error(stream);
            };
            return LoaderItem;
        }(loading.ILoaderItem));
        loading.LoaderItem = LoaderItem;
    })(loading = frame.loading || (frame.loading = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var loading;
    (function (loading) {
        /**
         * @author 陈小军
         */
        var LoaderList = /** @class */ (function (_super) {
            __extends(LoaderList, _super);
            function LoaderList(url) {
                if (url === void 0) { url = ""; }
                var _this = _super.call(this, url) || this;
                _this.children = [];
                _this.states = new Object();
                _this.states[loading.LoaderStatus.READY] = new loading.ReadyLoaderList(_this);
                _this.states[loading.LoaderStatus.INSIDE] = new loading.InsideLoaderList(_this);
                _this.states[loading.LoaderStatus.LOADING] = new loading.LoadingLoaderList(_this);
                _this.states[loading.LoaderStatus.COMPLETE] = new loading.CompleteLoaderList(_this);
                _this.states[loading.LoaderStatus.ERROR] = new loading.ErrorLoaderList(_this);
                _this.become(loading.LoaderStatus.READY);
                return _this;
            }
            LoaderList.prototype.load = function () {
                this.state.load();
            };
            LoaderList.prototype.addChild = function (child) {
                this.state.addChild(child);
            };
            Object.defineProperty(LoaderList.prototype, "numChildren", {
                get: function () {
                    return this.children.length;
                },
                enumerable: true,
                configurable: true
            });
            LoaderList.prototype.getChild = function (url) {
                var length = this.numChildren;
                for (var i = 0; i < length; ++i)
                    if (url == this.children[i].url)
                        return this.children[i];
                return null;
            };
            LoaderList.prototype.getChildAt = function (index) {
                if (index > -1 && index < this.numChildren)
                    return this.children[index];
                throw new Error("ERROR");
            };
            LoaderList.prototype.become = function (value) {
                this._status = value;
                this.state = this.states[value];
            };
            LoaderList.prototype.complete = function (stream) {
                stream.removeEventListener(egret.Event.COMPLETE, this.onComplete, this);
                stream.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onIOError, this);
                var quantity = this.howmany(stream.url);
                this.dispatchEventWith(egret.ProgressEvent.PROGRESS, false, (this.count + quantity) / this.urls.length);
                if ((this.count += quantity) == this.urls.length)
                    this.dispatchEventWith(egret.Event.COMPLETE);
            };
            LoaderList.prototype.error = function (stream) {
                this.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
                this.complete(stream);
            };
            LoaderList.prototype.onComplete = function (event) {
                var stream = event.target;
                this.complete(stream);
            };
            LoaderList.prototype.onIOError = function (event) {
                var stream = event.target;
                this.error(stream);
            };
            /**
             * 计数
             */
            LoaderList.prototype.howmany = function (url) {
                var quantity = 0;
                for (var i = 0; i < this.urls.length; ++i)
                    if (this.urls[i] == url)
                        ++quantity;
                return quantity;
            };
            return LoaderList;
        }(loading.ILoaderItem));
        loading.LoaderList = LoaderList;
    })(loading = frame.loading || (frame.loading = {}));
})(frame || (frame = {}));
///<reference path="../loading/LoaderItem.ts"/>
///<reference path="../loading/LoaderList.ts"/>
var frame;
(function (frame) {
    var extension;
    (function (extension) {
        var LoaderItem = frame.loading.LoaderItem;
        var LoaderList = frame.loading.LoaderList;
        var LoadingList = /** @class */ (function (_super) {
            __extends(LoadingList, _super);
            function LoadingList() {
                return _super.call(this) || this;
            }
            LoadingList.prototype.push = function (url) {
                var loader = new LoaderItem(url);
                this.addChild(loader);
            };
            return LoadingList;
        }(LoaderList));
        extension.LoadingList = LoadingList;
    })(extension = frame.extension || (frame.extension = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var physics;
    (function (physics) {
        /**
         * @author 陈小军
         */
        var Orientation = /** @class */ (function () {
            function Orientation() {
            }
            /**
             * 正交到等距
             */
            Orientation.toIso = function (x, y) {
                return new egret.Point(0.707106781 * (x - y), 0.35355338 * (x + y));
            };
            /**
             * 等距到正交(鼠标点击场景的位置是等距)
             */
            Orientation.toOrt = function (x, y) {
                return new egret.Point(0.707106781 * x + 1.414213562 * y, 1.414213562 * y - 0.707106781 * x);
            };
            /**
             * 等距大小到正交大小
             * @param width
             */
            Orientation.toWidth = function (width) {
                return Math.sqrt(width * width * 0.5);
            };
            return Orientation;
        }());
        physics.Orientation = Orientation;
    })(physics = frame.physics || (frame.physics = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var physics;
    (function (physics) {
        /**
         * @author 陈小军
         */
        var Vector = /** @class */ (function () {
            function Vector() {
            }
            Vector.angle = function (v1, v2) {
                var sin = v1.x * v2.y - v2.x * v1.y;
                var cos = v1.x * v2.x + v1.y * v2.y;
                return Math.atan2(sin, cos) * (180 / Math.PI);
            };
            Vector.dot = function (v1, v2) {
                return v1.x * v2.x + v1.y * v2.y;
            };
            return Vector;
        }());
        physics.Vector = Vector;
    })(physics = frame.physics || (frame.physics = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var io;
    (function (io) {
        /**
         * @author 陈小军
         */
        var Dictionary = /** @class */ (function () {
            function Dictionary() {
                this.items = {};
            }
            Dictionary.prototype.get = function (key) {
                return this.items[key];
            };
            Dictionary.prototype.add = function (key, value) {
                if (!this.has(key)) {
                    this.items[key] = value;
                }
            };
            Dictionary.prototype.has = function (key) {
                return this.items.hasOwnProperty(key);
            };
            Dictionary.prototype.remove = function (key) {
                if (this.has(key)) {
                    delete this.items[key];
                }
            };
            Dictionary.prototype.clear = function () {
                this.items = {};
            };
            return Dictionary;
        }());
        io.Dictionary = Dictionary;
    })(io = frame.io || (frame.io = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var io;
    (function (io) {
        /**
         * @author 陈小军
         */
        var Keyboard = /** @class */ (function () {
            function Keyboard() {
            }
            Keyboard.start = function () {
                Keyboard.KEYS = [];
                Keyboard.LISTENERS[Keyboard.KEY_DOWN] = [];
                Keyboard.LISTENERS[Keyboard.KEY_UP] = [];
                document.addEventListener(Keyboard.KEY_DOWN, Keyboard.onKeyDown);
                document.addEventListener(Keyboard.KEY_UP, Keyboard.onKeyUp);
            };
            Keyboard.stop = function () {
                Keyboard.KEYS = [];
                document.addEventListener(Keyboard.KEY_DOWN, Keyboard.onKeyDown);
                document.addEventListener(Keyboard.KEY_UP, Keyboard.onKeyUp);
            };
            Keyboard.addEventListener = function (type, listener, thisObject) {
                if (listener && (type == Keyboard.KEY_DOWN || type == Keyboard.KEY_UP)) {
                    var handlers = Keyboard.LISTENERS[type];
                    var length_1 = handlers.length;
                    for (var i = 0; i < length_1; ++i)
                        if (handlers[i].equal(listener, thisObject))
                            return;
                    handlers.push(new frame.utils.Handler(listener, thisObject));
                }
            };
            Keyboard.removeEventListener = function (type, listener, thisObject) {
                if (listener && (type == Keyboard.KEY_DOWN || type == Keyboard.KEY_UP)) {
                    var handlers = Keyboard.LISTENERS[type];
                    var length_2 = handlers.length;
                    for (var i = 0; i < length_2; ++i) {
                        if (handlers[i].equal(listener, thisObject)) {
                            handlers.splice(i, 1);
                            break;
                        }
                    }
                }
            };
            Keyboard.onKeyDown = function (event) {
                var key = event.keyCode;
                var index = Keyboard.KEYS.indexOf(key);
                if (index == -1) {
                    Keyboard.KEYS.push(key);
                    var handlers = Keyboard.LISTENERS[Keyboard.KEY_DOWN].slice();
                    var length_3 = handlers.length;
                    for (var i = 0; i < length_3; ++i)
                        handlers[i].execute(event);
                }
            };
            Keyboard.onKeyUp = function (event) {
                var key = event.keyCode;
                var index = Keyboard.KEYS.indexOf(key);
                if (index > -1) {
                    Keyboard.KEYS.splice(index, 1);
                    var handlers = Keyboard.LISTENERS[Keyboard.KEY_UP].slice();
                    var length_4 = handlers.length;
                    for (var i = 0; i < length_4; ++i)
                        handlers[i].execute(event);
                }
            };
            Keyboard.KEYS = [];
            Keyboard.LISTENERS = new frame.io.Dictionary();
            Keyboard.KEY_DOWN = "keydown";
            Keyboard.KEY_UP = "keyup";
            Keyboard.KEY_PRESS = "keypress";
            Keyboard.SPACE = 32;
            Keyboard.LEFT = 37;
            Keyboard.UP = 38;
            Keyboard.RIGHT = 39;
            Keyboard.DOWN = 40;
            return Keyboard;
        }());
        io.Keyboard = Keyboard;
    })(io = frame.io || (frame.io = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var io;
    (function (io) {
        /**
         * @author 陈小军
         */
        var Path = /** @class */ (function () {
            function Path() {
            }
            Path.suffix = function (url) {
                // 取文件名
                var char = "[^\/\\/:*?\"<>|]";
                var pattern = char + "+";
                var regex = new RegExp(pattern, "g");
                var items = url.match(regex);
                var item = items[items.length - 1];
                // 取后缀名
                pattern = "\\." + char + "{1,4}$";
                regex = new RegExp(pattern, "g");
                items = item.match(regex);
                item = items[items.length - 1];
                return item.substring(1, item.length);
            };
            /**
             * 获取出节点
             */
            Path.filenames = function (pathname) {
                var index = -1;
                var result;
                var names = new Array();
                var pattern = /(\w+)(?=\/)/g;
                while (true) {
                    result = pattern.exec(pathname);
                    if (result) {
                        index = pattern.lastIndex;
                        names.push(result[0]);
                    }
                    else {
                        names.push(pathname.substring(index + 1, pathname.length));
                        break;
                    }
                }
                return names;
            };
            return Path;
        }());
        io.Path = Path;
    })(io = frame.io || (frame.io = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var layout;
    (function (layout) {
        /**
         * @author 陈小军
         */
        var IDisplay = /** @class */ (function (_super) {
            __extends(IDisplay, _super);
            function IDisplay() {
                var _this = _super.call(this) || this;
                _this.touched = false;
                _this.clean = false;
                _this._parent = null;
                _this._manager = null;
                _this._display = null;
                return _this;
            }
            Object.defineProperty(IDisplay.prototype, "parent", {
                get: function () {
                    return this._parent;
                },
                set: function (parent) {
                    this._parent = parent;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(IDisplay.prototype, "manager", {
                get: function () {
                    return this._manager;
                },
                set: function (value) {
                    if (this._manager == null && value) {
                        this._manager = value;
                        this.$hasSame();
                        this.onOpen();
                        this.onAdded(this.display);
                        this.dispatchEventWith(egret.Event.ADDED_TO_STAGE);
                    }
                    else if (this._manager && value == null) {
                        this.onClose();
                        this.dispatchEventWith(egret.Event.REMOVED_FROM_STAGE);
                        this._manager = value;
                    }
                },
                enumerable: true,
                configurable: true
            });
            IDisplay.prototype.$hasSame = function () {
                var exist = this.manager.$displayIsExist(this.display);
                if (exist)
                    throw new Error("ERROR");
            };
            Object.defineProperty(IDisplay.prototype, "display", {
                get: function () {
                    return this._display;
                },
                set: function (value) {
                    if (this._display == null) {
                        this._display = value;
                        this.$show();
                        this.onAdded(value);
                        this.onDisplay(value);
                    }
                    else
                        throw new Error("错误");
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 给灿滨那边用的，我还不知道什么意思
             * @param value
             */
            IDisplay.prototype.onDisplay = function (value) {
            };
            /**
             * 添加事件
             */
            IDisplay.prototype.onAdded = function (value) {
                if (this.added) {
                    if (value.displayObject.stage) {
                        value.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
                        value.displayObject.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRootTouchTap, this);
                        value.displayObject.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
                    }
                    else {
                        value.displayObject.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
                    }
                }
            };
            IDisplay.prototype.onTouchTap = function (event) {
                this.touched = true;
                IDisplay.target = this;
            };
            IDisplay.prototype.onRootTouchTap = function (event) {
                if (event.eventPhase == 2 /* AT_TARGET */) {
                    this.dispatchEventWith(IDisplay.RELEASEOUTSIDE);
                }
                else if (event.eventPhase == 3 /* BUBBLING_PHASE */) {
                    if (this.touched == false && IDisplay.target && IDisplay.target != this) {
                        var temp = IDisplay.target;
                        if (temp.isPosterityOf(this) == false)
                            this.dispatchEventWith(IDisplay.RELEASEOUTSIDE);
                    }
                    this.touched = false;
                }
            };
            IDisplay.prototype.onAddedToStage = function (event) {
                this.display.displayObject.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
                this.display.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
                this.display.displayObject.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRootTouchTap, this);
                this.display.displayObject.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            };
            IDisplay.prototype.onRemovedFromStage = function (event) {
                this.display.displayObject.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
                this.display.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
                this.display.displayObject.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onRootTouchTap, this);
                this.display.displayObject.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            };
            /**
             * 显示界面
             */
            IDisplay.prototype.$show = function () {
                if (this.visible && this.eyeable && this.display) {
                    var depth = this.manager.$getItemDepth(this);
                    this.manager.display.addChildAt(this.display, depth);
                }
            };
            /**
             * 关闭界面
             */
            IDisplay.prototype.$close = function () {
                if (this.visible && this.eyeable && this.display) {
                    this.manager.display.removeChild(this.display);
                }
            };
            /**
             * 进入
             */
            IDisplay.prototype.onOpen = function () {
            };
            /**
             * 退出
             */
            IDisplay.prototype.onClose = function () {
            };
            Object.defineProperty(IDisplay.prototype, "added", {
                get: function () {
                    return this.visible && this.eyeable && this.display != null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(IDisplay.prototype, "visible", {
                get: function () {
                    return this.manager != null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(IDisplay.prototype, "eyeable", {
                get: function () {
                    return this instanceof layout.Display || this instanceof layout.Window;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 查询自己是不是item的后代
             * @param item
             */
            IDisplay.prototype.isPosterityOf = function (item) {
                var parent = this.parent;
                while (parent) {
                    if (parent == item)
                        return true;
                    parent = parent.parent;
                }
                return false;
            };
            /**
             * 居中设置
             */
            IDisplay.prototype.setCenter = function () {
                // this.display.addRelation(this.display.root, fairygui.RelationType.Center_Center, false);
                // this.display.addRelation(this.display.root, fairygui.RelationType.Middle_Middle, false);
                this.display.center();
            };
            IDisplay.target = null;
            IDisplay.RELEASEOUTSIDE = "RELEASEOUTSIDE";
            return IDisplay;
        }(egret.EventDispatcher));
        layout.IDisplay = IDisplay;
    })(layout = frame.layout || (frame.layout = {}));
})(frame || (frame = {}));
///<reference path="IDisplay.ts"/>
var frame;
(function (frame) {
    var layout;
    (function (layout) {
        /**
         * @author 陈小军
         */
        var IContainer = /** @class */ (function (_super) {
            __extends(IContainer, _super);
            function IContainer() {
                var _this = _super.call(this) || this;
                _this._children = new Array();
                return _this;
            }
            Object.defineProperty(IContainer.prototype, "manager", {
                get: function () {
                    return this._manager;
                },
                set: function (value) {
                    if (this._manager == null && value) {
                        this._manager = value;
                        this.$hasSame();
                        this.onOpen();
                        this.onAdded(this.display);
                        this.dispatchEventWith(egret.Event.ADDED_TO_STAGE);
                        this.updateChildManager(value);
                    }
                    else if (this._manager && value == null) {
                        this.onClose();
                        this.dispatchEventWith(egret.Event.REMOVED_FROM_STAGE);
                        this._manager = value;
                        this.updateChildManager(value);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(IContainer.prototype, "numChildren", {
                get: function () {
                    return this._children.length;
                },
                enumerable: true,
                configurable: true
            });
            IContainer.prototype.getChildAt = function (index) {
                if (index > -1 && index < this._children.length)
                    return this._children[index];
                return null;
            };
            IContainer.prototype.getChildIndex = function (child) {
                return this._children.indexOf(child);
            };
            IContainer.prototype.contains = function (child) {
                return this._children.indexOf(child) > -1;
            };
            IContainer.prototype.updateChildManager = function (value) {
                var length = this._children.length;
                for (var i = 0; i < length; ++i)
                    this._children[i].manager = value;
            };
            IContainer.prototype.removeAllChildren = function () {
                var child = null;
                var length = this.numChildren;
                while (length--) {
                    child = this._children[length];
                    if (this.visible)
                        child.$close();
                    this._children.pop();
                    child.parent = null;
                    child.manager = null;
                }
                this.onUpdateMask();
            };
            IContainer.prototype.addChild = function (child) {
                if (child.parent == null) {
                    this._children.push(child);
                    child.parent = this;
                    child.manager = this.manager;
                    if (this.visible)
                        child.$show();
                    this.onUpdateMask();
                }
            };
            IContainer.prototype.removeChild = function (child) {
                if (child.parent == this) {
                    if (this.visible)
                        child.$close();
                    var index = this._children.indexOf(child);
                    this._children.splice(index, 1);
                    child.parent = null;
                    child.manager = null;
                    this.onUpdateMask();
                }
            };
            /**
             * 更新遮罩
             */
            IContainer.prototype.onUpdateMask = function () {
                if (this.visible && this.eyeable && this.display) {
                    if (this._children.length == 0)
                        this.display.touchable = true;
                    else
                        this.display.touchable = false;
                }
            };
            /**
             * 显示界面
             */
            IContainer.prototype.$show = function () {
                _super.prototype.$show.call(this);
                var length = this.numChildren;
                for (var i = 0; i < length; ++i)
                    this._children[i].$show();
            };
            /**
             * 关闭界面
             */
            IContainer.prototype.$close = function () {
                _super.prototype.$close.call(this);
                var length = this.numChildren;
                for (var i = 0; i < length; ++i)
                    this._children[i].$close();
            };
            /**
             * 查询自己是不是item的上级
             * @param item 上级
             */
            IContainer.prototype.isAncestorOf = function (item) {
                var parent = item.parent;
                while (parent) {
                    if (parent == this)
                        return true;
                    parent = parent.parent;
                }
                return false;
            };
            /**
             * 遍历所有子级
             * @param callback 回调函数
             * @param thisObject 回调函数
             */
            IContainer.prototype.foreach = function (callback, thisObject) {
                var child = null;
                var length = this.numChildren;
                var children = this._children.slice();
                for (var i = 0; i < length; ++i) {
                    child = children[i];
                    if (callback.call(thisObject, child) == false)
                        return false;
                    if (child instanceof IContainer)
                        if (child.foreach(callback, thisObject) == false)
                            return false;
                }
                return true;
            };
            IContainer.prototype.$getItemDepth = function (item) {
                var depth = 0;
                // 返回值代表是否继续循环
                var callback = function (who) {
                    if (item == who)
                        return false;
                    else if (who.eyeable && who.display)
                        ++depth;
                    return true;
                };
                this.foreach(callback, this);
                return depth;
            };
            IContainer.prototype.$displayIsExist = function (display) {
                if (display == null)
                    return false;
                // 返回值代表是否继续循环
                var callback = function (who) {
                    if (who.eyeable && who.display && who.display == display)
                        return true;
                };
                this.foreach(callback, this);
                return false;
            };
            return IContainer;
        }(layout.IDisplay));
        layout.IContainer = IContainer;
    })(layout = frame.layout || (frame.layout = {}));
})(frame || (frame = {}));
///<reference path="IContainer.ts"/>
var frame;
(function (frame) {
    var layout;
    (function (layout) {
        /**
         * @author 陈小军
         */
        var Container = /** @class */ (function (_super) {
            __extends(Container, _super);
            function Container() {
                return _super.call(this) || this;
            }
            return Container;
        }(layout.IContainer));
        layout.Container = Container;
    })(layout = frame.layout || (frame.layout = {}));
})(frame || (frame = {}));
///<reference path="IDisplay.ts"/>
var frame;
(function (frame) {
    var layout;
    (function (layout) {
        /**
         * @author 陈小军
         */
        var Display = /** @class */ (function (_super) {
            __extends(Display, _super);
            function Display() {
                return _super.call(this) || this;
            }
            return Display;
        }(layout.IDisplay));
        layout.Display = Display;
    })(layout = frame.layout || (frame.layout = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var layout;
    (function (layout) {
        /**
         * @author 陈小军
         */
        var Merger = /** @class */ (function (_super) {
            __extends(Merger, _super);
            function Merger() {
                var _this = _super.call(this) || this;
                _this.loading = _this.newLoading();
                _this.studio = _this.newStudio();
                _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this._onAddedToStage, _this);
                return _this;
            }
            Merger.prototype._onAddedToStage = function (event) {
                this.status = this.loading;
            };
            Object.defineProperty(Merger.prototype, "display", {
                get: function () {
                    return this.status.display;
                },
                set: function (value) {
                    throw new Error("ERROR");
                },
                enumerable: true,
                configurable: true
            });
            return Merger;
        }(layout.IContainer));
        layout.Merger = Merger;
    })(layout = frame.layout || (frame.layout = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var layout;
    (function (layout) {
        /**
         * @author 陈小军
         */
        var Window = /** @class */ (function (_super) {
            __extends(Window, _super);
            function Window() {
                return _super.call(this) || this;
            }
            return Window;
        }(layout.IContainer));
        layout.Window = Window;
    })(layout = frame.layout || (frame.layout = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var layout;
    (function (layout) {
        /**
         * @author 陈小军
         */
        var WindowManager = /** @class */ (function (_super) {
            __extends(WindowManager, _super);
            /**
             * @param root
             */
            function WindowManager(root) {
                var _this = _super.call(this) || this;
                _this._manager = _this;
                _this._display = root;
                return _this;
                // this._display.opaque = true;
            }
            return WindowManager;
        }(layout.IContainer));
        layout.WindowManager = WindowManager;
    })(layout = frame.layout || (frame.layout = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var loading;
    (function (loading) {
        /**
         * @author 陈小军
         */
        var Stream = /** @class */ (function (_super) {
            __extends(Stream, _super);
            function Stream(url) {
                var _this = _super.call(this) || this;
                _this._url = url;
                _this.stream = new egret.URLLoader();
                _this.stream.dataFormat = _this.format();
                _this.stream.addEventListener(egret.Event.COMPLETE, _this.onComplete, _this);
                _this.stream.addEventListener(egret.IOErrorEvent.IO_ERROR, _this.onIOError, _this);
                _this.become(loading.StreamStatus.READY);
                return _this;
            }
            Object.defineProperty(Stream.prototype, "url", {
                get: function () {
                    return this._url;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Stream.prototype, "content", {
                get: function () {
                    return this.data;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Stream.prototype, "status", {
                get: function () {
                    return this._status;
                },
                enumerable: true,
                configurable: true
            });
            Stream.prototype.become = function (value) {
                this._status = value;
            };
            Stream.prototype.load = function () {
                if (this.status == loading.StreamStatus.READY) {
                    this.become(loading.StreamStatus.LOADING);
                    this.stream.load(new egret.URLRequest(this.url + "?version=" + loading.Resources.version(this.url)));
                }
                else {
                    throw new Error(this.url + "处理中或处理完。");
                }
            };
            Stream.prototype.onComplete = function (event) {
                if (this.stream.data)
                    this.data = this.decode(this.stream.data);
                this.become(loading.StreamStatus.COMPLETE);
                this.dispatchEventWith(egret.Event.COMPLETE);
            };
            Stream.prototype.onIOError = function (event) {
                console.error("加载" + this.url + "失败。");
                this.become(loading.StreamStatus.ERROR);
                this.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
            };
            return Stream;
        }(egret.EventDispatcher));
        loading.Stream = Stream;
    })(loading = frame.loading || (frame.loading = {}));
})(frame || (frame = {}));
///<reference path="Stream.ts"/>
var frame;
(function (frame) {
    var loading;
    (function (loading) {
        /**
         * @author 陈小军
         */
        var BinaryStream = /** @class */ (function (_super) {
            __extends(BinaryStream, _super);
            function BinaryStream(url) {
                return _super.call(this, url) || this;
            }
            BinaryStream.prototype.decode = function (value) {
                return value;
            };
            BinaryStream.prototype.format = function () {
                return egret.URLLoaderDataFormat.BINARY;
            };
            return BinaryStream;
        }(loading.Stream));
        loading.BinaryStream = BinaryStream;
    })(loading = frame.loading || (frame.loading = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var loading;
    (function (loading) {
        /**
         * @author 陈小军
         */
        var Converter = /** @class */ (function () {
            function Converter() {
            }
            Converter.prototype.suffix = function (url) {
                return url.substring(url.lastIndexOf(".") + 1, url.length);
            };
            Converter.prototype.convert = function (url) {
                var suffix = this.suffix(url);
                switch (suffix) {
                    case "bin":
                        return new loading.BinaryStream(url);
                    case "txt":
                        return new loading.StringStream(url);
                    case "jpg":
                    case "png":
                        return new loading.DisplayStream(url);
                    case "mp3":
                        return new loading.SoundStream(url);
                    case "json":
                        return new loading.JSONStream(url);
                    case "var":
                        return new loading.VariableStream(url);
                    case "xml":
                        return new loading.XMLStream(url);
                    case "fui":
                        return new loading.FairyGUIStream(url);
                    default:
                        return new loading.BinaryStream(url);
                }
            };
            return Converter;
        }());
        loading.Converter = Converter;
    })(loading = frame.loading || (frame.loading = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var loading;
    (function (loading) {
        /**
         * @author 陈小军
         */
        var DisplayStream = /** @class */ (function (_super) {
            __extends(DisplayStream, _super);
            function DisplayStream(url) {
                return _super.call(this, url) || this;
            }
            DisplayStream.prototype.decode = function (value) {
                return value;
            };
            DisplayStream.prototype.format = function () {
                return egret.URLLoaderDataFormat.TEXTURE;
            };
            return DisplayStream;
        }(loading.Stream));
        loading.DisplayStream = DisplayStream;
    })(loading = frame.loading || (frame.loading = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var loading;
    (function (loading) {
        /**
         * @author 陈小军
         */
        var FairyGUIStream = /** @class */ (function (_super) {
            __extends(FairyGUIStream, _super);
            function FairyGUIStream(url) {
                return _super.call(this, url) || this;
            }
            FairyGUIStream.prototype.decode = function (value) {
                // return fairygui.UIPackage.addPackage(this.url);
                return value;
            };
            FairyGUIStream.prototype.format = function () {
                return egret.URLLoaderDataFormat.BINARY;
            };
            return FairyGUIStream;
        }(loading.Stream));
        loading.FairyGUIStream = FairyGUIStream;
    })(loading = frame.loading || (frame.loading = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var loading;
    (function (loading) {
        /**
         * @author 陈小军
         */
        var JSONStream = /** @class */ (function (_super) {
            __extends(JSONStream, _super);
            function JSONStream(url) {
                return _super.call(this, url) || this;
            }
            JSONStream.prototype.decode = function (value) {
                return JSON.parse(value);
            };
            JSONStream.prototype.format = function () {
                return egret.URLLoaderDataFormat.TEXT;
            };
            return JSONStream;
        }(loading.Stream));
        loading.JSONStream = JSONStream;
    })(loading = frame.loading || (frame.loading = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var loading;
    (function (loading) {
        /**
         * @author 陈小军
         */
        var LoaderItemState = /** @class */ (function () {
            function LoaderItemState(parent) {
                this._parent = parent;
            }
            Object.defineProperty(LoaderItemState.prototype, "parent", {
                get: function () {
                    return this._parent;
                },
                enumerable: true,
                configurable: true
            });
            return LoaderItemState;
        }());
        loading.LoaderItemState = LoaderItemState;
    })(loading = frame.loading || (frame.loading = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var loading;
    (function (loading) {
        /**
         * @author 陈小军
         */
        var LoaderListState = /** @class */ (function () {
            function LoaderListState(parent) {
                this._parent = parent;
            }
            Object.defineProperty(LoaderListState.prototype, "parent", {
                get: function () {
                    return this._parent;
                },
                enumerable: true,
                configurable: true
            });
            return LoaderListState;
        }());
        loading.LoaderListState = LoaderListState;
    })(loading = frame.loading || (frame.loading = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var loading;
    (function (loading) {
        /**
         * @author 陈小军
         */
        var LoaderStatus;
        (function (LoaderStatus) {
            LoaderStatus[LoaderStatus["READY"] = 0] = "READY";
            LoaderStatus[LoaderStatus["ERROR"] = 1] = "ERROR";
            LoaderStatus[LoaderStatus["INSIDE"] = 2] = "INSIDE";
            LoaderStatus[LoaderStatus["LOADING"] = 3] = "LOADING";
            LoaderStatus[LoaderStatus["COMPLETE"] = 4] = "COMPLETE";
        })(LoaderStatus = loading.LoaderStatus || (loading.LoaderStatus = {}));
    })(loading = frame.loading || (frame.loading = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var loading;
    (function (loading) {
        var Versions = /** @class */ (function () {
            function Versions() {
            }
            Versions.prototype.version = function (url) {
                return Math.random().toString();
            };
            return Versions;
        }());
        loading.Versions = Versions;
    })(loading = frame.loading || (frame.loading = {}));
})(frame || (frame = {}));
///<reference path="IVersions.ts"/>
///<reference path="Versions.ts"/>
var frame;
(function (frame) {
    var loading;
    (function (loading) {
        /**
         * @author 陈小军
         */
        var Resources = /** @class */ (function () {
            function Resources() {
            }
            Resources.find = function (streams, url) {
                var length = streams.length;
                for (var i = 0; i < length; ++i)
                    if (streams[i].url == url)
                        return streams[i];
                return null;
            };
            Resources.has = function (url) {
                if (Resources.find(Resources.UNLOAD, url))
                    return true;
                if (Resources.find(Resources.LOADING, url))
                    return true;
                return Resources.LOADED.has(url);
            };
            Resources.pick = function (url) {
                var stream = Resources.find(Resources.UNLOAD, url);
                if (stream)
                    return stream;
                stream = Resources.find(Resources.LOADING, url);
                if (stream)
                    return stream;
                return Resources.LOADED.get(url);
            };
            Resources.need = function (url) {
                var stream = Resources.pick(url);
                if (stream)
                    return stream;
                stream = Resources.converter.convert(url);
                Resources.UNLOAD.push(stream);
                Resources.load();
                return stream;
            };
            Resources.load = function () {
                if (Resources.LOADING.length < 16 && Resources.UNLOAD.length > 0) {
                    var stream = Resources.UNLOAD.shift();
                    Resources.LOADING.push(stream);
                    stream.addEventListener(egret.Event.COMPLETE, Resources.onComplete, null);
                    stream.load();
                }
            };
            Resources.onComplete = function (event) {
                var stream = event.target;
                stream.removeEventListener(egret.Event.COMPLETE, Resources.onComplete, null);
                var index = Resources.LOADING.indexOf(stream);
                Resources.LOADING.splice(index, 1);
                Resources.LOADED.add(stream.url, stream);
                Resources.load();
            };
            Resources.getRes = function (url) {
                var stream = Resources.pick(url);
                if (stream)
                    return stream.content;
                return null;
            };
            Resources.getResAsync = function (key, listener, thisObject) {
                var stream = Resources.need(key);
                if (stream.status == loading.StreamStatus.COMPLETE || stream.status == loading.StreamStatus.ERROR)
                    listener.call(thisObject, stream.content(), key);
                else {
                    var callback = function () {
                        listener.apply(thisObject, [stream.content(), key]);
                    };
                    stream.addEventListener(egret.Event.COMPLETE, callback, thisObject);
                }
            };
            Resources.version = function (url) {
                return Resources.versions.version(url);
            };
            Resources.UNLOAD = [];
            Resources.LOADING = [];
            Resources.LOADED = new frame.io.Dictionary();
            /**
             *
             */
            Resources.converter = new loading.Converter();
            /**
             * 版本控制器
             */
            Resources.versions = new loading.Versions();
            return Resources;
        }());
        loading.Resources = Resources;
    })(loading = frame.loading || (frame.loading = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var loading;
    (function (loading) {
        /**
         * @author 陈小军
         */
        var SoundStream = /** @class */ (function (_super) {
            __extends(SoundStream, _super);
            function SoundStream(url) {
                return _super.call(this, url) || this;
            }
            SoundStream.prototype.decode = function (value) {
                return value;
            };
            SoundStream.prototype.format = function () {
                return egret.URLLoaderDataFormat.SOUND;
            };
            return SoundStream;
        }(loading.Stream));
        loading.SoundStream = SoundStream;
    })(loading = frame.loading || (frame.loading = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var loading;
    (function (loading) {
        /**
         * @author 陈小军
         */
        var StreamStatus;
        (function (StreamStatus) {
            StreamStatus[StreamStatus["READY"] = 0] = "READY";
            StreamStatus[StreamStatus["ERROR"] = 1] = "ERROR";
            StreamStatus[StreamStatus["LOADING"] = 2] = "LOADING";
            StreamStatus[StreamStatus["COMPLETE"] = 3] = "COMPLETE";
        })(StreamStatus = loading.StreamStatus || (loading.StreamStatus = {}));
    })(loading = frame.loading || (frame.loading = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var loading;
    (function (loading) {
        /**
         * @author 陈小军
         */
        var StringStream = /** @class */ (function (_super) {
            __extends(StringStream, _super);
            function StringStream(url) {
                return _super.call(this, url) || this;
            }
            StringStream.prototype.decode = function (value) {
                return value;
            };
            StringStream.prototype.format = function () {
                return egret.URLLoaderDataFormat.TEXT;
            };
            return StringStream;
        }(loading.Stream));
        loading.StringStream = StringStream;
    })(loading = frame.loading || (frame.loading = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var loading;
    (function (loading) {
        /**
         * @author 陈小军
         */
        var VariableStream = /** @class */ (function (_super) {
            __extends(VariableStream, _super);
            function VariableStream(url) {
                return _super.call(this, url) || this;
            }
            VariableStream.prototype.decode = function (value) {
                return value;
            };
            VariableStream.prototype.format = function () {
                return egret.URLLoaderDataFormat.VARIABLES;
            };
            return VariableStream;
        }(loading.Stream));
        loading.VariableStream = VariableStream;
    })(loading = frame.loading || (frame.loading = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var loading;
    (function (loading) {
        /**
         * @author 陈小军
         */
        var XMLStream = /** @class */ (function (_super) {
            __extends(XMLStream, _super);
            function XMLStream(url) {
                return _super.call(this, url) || this;
            }
            XMLStream.prototype.decode = function (value) {
                return egret.XML.parse(value);
            };
            XMLStream.prototype.format = function () {
                return egret.URLLoaderDataFormat.TEXT;
            };
            return XMLStream;
        }(loading.Stream));
        loading.XMLStream = XMLStream;
    })(loading = frame.loading || (frame.loading = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var loading;
    (function (loading) {
        /**
         * @author 陈小军
         */
        var CompleteLoaderItem = /** @class */ (function (_super) {
            __extends(CompleteLoaderItem, _super);
            function CompleteLoaderItem(parent) {
                return _super.call(this, parent) || this;
            }
            CompleteLoaderItem.prototype.load = function () {
                throw new Error("ERROR");
            };
            Object.defineProperty(CompleteLoaderItem.prototype, "content", {
                get: function () {
                    return loading.Resources.pick(this.parent.url).content;
                },
                enumerable: true,
                configurable: true
            });
            return CompleteLoaderItem;
        }(loading.LoaderItemState));
        loading.CompleteLoaderItem = CompleteLoaderItem;
    })(loading = frame.loading || (frame.loading = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var loading;
    (function (loading) {
        /**
         * @author 陈小军
         */
        var CompleteLoaderList = /** @class */ (function (_super) {
            __extends(CompleteLoaderList, _super);
            function CompleteLoaderList(parent) {
                return _super.call(this, parent) || this;
            }
            CompleteLoaderList.prototype.load = function () {
                throw new Error("ERROR");
            };
            CompleteLoaderList.prototype.addChild = function (child) {
                throw new Error("ERROR");
            };
            return CompleteLoaderList;
        }(loading.LoaderListState));
        loading.CompleteLoaderList = CompleteLoaderList;
    })(loading = frame.loading || (frame.loading = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var loading;
    (function (loading) {
        /**
         * @author 陈小军
         */
        var ErrorLoaderItem = /** @class */ (function (_super) {
            __extends(ErrorLoaderItem, _super);
            function ErrorLoaderItem(parent) {
                return _super.call(this, parent) || this;
            }
            ErrorLoaderItem.prototype.load = function () {
                throw new Error("ERROR");
            };
            Object.defineProperty(ErrorLoaderItem.prototype, "content", {
                get: function () {
                    throw new Error("ERROR");
                },
                enumerable: true,
                configurable: true
            });
            return ErrorLoaderItem;
        }(loading.LoaderItemState));
        loading.ErrorLoaderItem = ErrorLoaderItem;
    })(loading = frame.loading || (frame.loading = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var loading;
    (function (loading) {
        /**
         * @author 陈小军
         */
        var ErrorLoaderList = /** @class */ (function (_super) {
            __extends(ErrorLoaderList, _super);
            function ErrorLoaderList(parent) {
                return _super.call(this, parent) || this;
            }
            ErrorLoaderList.prototype.load = function () {
                throw new Error("ERROR");
            };
            ErrorLoaderList.prototype.addChild = function (child) {
                throw new Error("ERROR");
            };
            return ErrorLoaderList;
        }(loading.LoaderListState));
        loading.ErrorLoaderList = ErrorLoaderList;
    })(loading = frame.loading || (frame.loading = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var loading;
    (function (loading) {
        /**
         * @author 陈小军
         */
        var InsideLoaderItem = /** @class */ (function (_super) {
            __extends(InsideLoaderItem, _super);
            function InsideLoaderItem(parent) {
                return _super.call(this, parent) || this;
            }
            InsideLoaderItem.prototype.load = function () {
                throw new Error("ERROR");
            };
            Object.defineProperty(InsideLoaderItem.prototype, "content", {
                get: function () {
                    throw new Error("ERROR");
                },
                enumerable: true,
                configurable: true
            });
            return InsideLoaderItem;
        }(loading.LoaderItemState));
        loading.InsideLoaderItem = InsideLoaderItem;
    })(loading = frame.loading || (frame.loading = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var loading;
    (function (loading) {
        /**
         * @author 陈小军
         */
        var InsideLoaderList = /** @class */ (function (_super) {
            __extends(InsideLoaderList, _super);
            function InsideLoaderList(parent) {
                return _super.call(this, parent) || this;
            }
            InsideLoaderList.prototype.load = function () {
                throw new Error("ERROR");
            };
            InsideLoaderList.prototype.addChild = function (child) {
                if (child.status == loading.LoaderStatus.READY) {
                    this.parent.children.push(child);
                    child.become(loading.LoaderStatus.INSIDE);
                }
            };
            return InsideLoaderList;
        }(loading.LoaderListState));
        loading.InsideLoaderList = InsideLoaderList;
    })(loading = frame.loading || (frame.loading = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var loading;
    (function (loading) {
        /**
         * @author 陈小军
         */
        var LoadingLoaderItem = /** @class */ (function (_super) {
            __extends(LoadingLoaderItem, _super);
            function LoadingLoaderItem(parent) {
                return _super.call(this, parent) || this;
            }
            LoadingLoaderItem.prototype.load = function () {
                throw new Error("ERROR");
            };
            Object.defineProperty(LoadingLoaderItem.prototype, "content", {
                get: function () {
                    throw new Error("ERROR");
                },
                enumerable: true,
                configurable: true
            });
            return LoadingLoaderItem;
        }(loading.LoaderItemState));
        loading.LoadingLoaderItem = LoadingLoaderItem;
    })(loading = frame.loading || (frame.loading = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var loading;
    (function (loading) {
        /**
         * @author 陈小军
         */
        var LoadingLoaderList = /** @class */ (function (_super) {
            __extends(LoadingLoaderList, _super);
            function LoadingLoaderList(parent) {
                return _super.call(this, parent) || this;
            }
            LoadingLoaderList.prototype.load = function () {
                throw new Error("ERROR");
            };
            LoadingLoaderList.prototype.addChild = function (child) {
                throw new Error("ERROR");
            };
            return LoadingLoaderList;
        }(loading.LoaderListState));
        loading.LoadingLoaderList = LoadingLoaderList;
    })(loading = frame.loading || (frame.loading = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var loading;
    (function (loading) {
        /**
         * @author 陈小军
         */
        var ReadyLoaderItem = /** @class */ (function (_super) {
            __extends(ReadyLoaderItem, _super);
            function ReadyLoaderItem(parent) {
                return _super.call(this, parent) || this;
            }
            ReadyLoaderItem.prototype.load = function () {
                this.parent.become(loading.LoaderStatus.LOADING);
                var stream = loading.Resources.need(this.parent.url);
                stream.addEventListener(egret.Event.COMPLETE, this.parent.onComplete, this.parent);
                stream.addEventListener(egret.IOErrorEvent.IO_ERROR, this.parent.onIOError, this.parent);
                switch (stream.status) {
                    case loading.StreamStatus.ERROR:
                        this.parent.error(stream);
                        break;
                    case loading.StreamStatus.COMPLETE:
                        this.parent.complete(stream);
                        break;
                }
            };
            Object.defineProperty(ReadyLoaderItem.prototype, "content", {
                get: function () {
                    throw new Error("ERROR");
                },
                enumerable: true,
                configurable: true
            });
            return ReadyLoaderItem;
        }(loading.LoaderItemState));
        loading.ReadyLoaderItem = ReadyLoaderItem;
    })(loading = frame.loading || (frame.loading = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var loading;
    (function (loading) {
        /**
         * @author 陈小军
         */
        var ReadyLoaderList = /** @class */ (function (_super) {
            __extends(ReadyLoaderList, _super);
            function ReadyLoaderList(parent) {
                return _super.call(this, parent) || this;
            }
            ReadyLoaderList.prototype.load = function () {
                this.forEachChild(this.parent);
            };
            ReadyLoaderList.prototype.forEachChild = function (list) {
                var urls = [];
                var child = null;
                var length = list.children.length;
                for (var i = 0; i < length; ++i) {
                    child = list.children[i];
                    if (child instanceof loading.LoaderList) {
                        urls = urls.concat(this.forEachChild(child));
                    }
                    else {
                        var stream = loading.Resources.need(child.url);
                        this.addOrSendEvent(child, stream);
                        urls.push(child.url);
                    }
                }
                list.count = 0;
                list.urls = urls;
                var size = urls.length;
                for (var j = 0; j < size; ++j) {
                    var stream = loading.Resources.need(urls[j]);
                    this.addOrSendEvent(list, stream);
                }
                if (urls.length == 0) {
                    list.become(loading.LoaderStatus.COMPLETE);
                    list.dispatchEventWith(egret.Event.COMPLETE);
                }
                return urls;
            };
            ReadyLoaderList.prototype.addChild = function (child) {
                if (child.status == loading.LoaderStatus.READY) {
                    this.parent.children.push(child);
                    child.become(loading.LoaderStatus.INSIDE);
                }
            };
            ReadyLoaderList.prototype.addOrSendEvent = function (loader, stream) {
                stream.addEventListener(egret.Event.COMPLETE, loader.onComplete, loader);
                stream.addEventListener(egret.IOErrorEvent.IO_ERROR, loader.onIOError, loader);
                switch (stream.status) {
                    case loading.StreamStatus.ERROR:
                        loader.error(stream);
                        break;
                    case loading.StreamStatus.COMPLETE:
                        loader.complete(stream);
                        break;
                }
            };
            return ReadyLoaderList;
        }(loading.LoaderListState));
        loading.ReadyLoaderList = ReadyLoaderList;
    })(loading = frame.loading || (frame.loading = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var net;
    (function (net) {
        /**
         * @author:陈小军
         */
        var FlatBuffersSocket = /** @class */ (function (_super) {
            __extends(FlatBuffersSocket, _super);
            function FlatBuffersSocket() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return FlatBuffersSocket;
        }(egret.EventDispatcher));
        net.FlatBuffersSocket = FlatBuffersSocket;
    })(net = frame.net || (frame.net = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var net;
    (function (net) {
        /**
         * @author:陈小军
         */
        var ProtocolbuffersSocket = /** @class */ (function (_super) {
            __extends(ProtocolbuffersSocket, _super);
            function ProtocolbuffersSocket() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return ProtocolbuffersSocket;
        }(egret.EventDispatcher));
        net.ProtocolbuffersSocket = ProtocolbuffersSocket;
    })(net = frame.net || (frame.net = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var net;
    (function (net) {
        /**
         * @author 陈小军
         */
        var Socket = /** @class */ (function (_super) {
            __extends(Socket, _super);
            function Socket(codec) {
                var _this = _super.call(this) || this;
                _this.codec = codec;
                _this.socket = new net.WebSocket();
                _this.socket.addEventListener(egret.Event.CLOSE, _this.onClose, _this);
                _this.socket.addEventListener(egret.Event.CONNECT, _this.onConnect, _this);
                _this.socket.addEventListener(egret.IOErrorEvent.IO_ERROR, _this.onIOError, _this);
                _this.socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, _this.onSocketData, _this);
                return _this;
            }
            Object.defineProperty(Socket.prototype, "endian", {
                /**
                 * 字节序
                 */
                get: function () {
                    return this.socket.endian;
                },
                set: function (value) {
                    this.socket.endian = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Socket.prototype, "codec", {
                get: function () {
                    return this.socket.codec;
                },
                set: function (value) {
                    this.socket.codec = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Socket.prototype, "objectsAvailable", {
                get: function () {
                    return this.socket.objectsAvailable;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Socket.prototype, "connected", {
                /**
                 * 当前socket是否连接
                 */
                get: function () {
                    return this.socket.connected;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 关闭连接
             */
            Socket.prototype.close = function () {
                this.socket.close();
            };
            /**
             * @param host ip地址
             * @param port 端口
             */
            Socket.prototype.connect = function (host, port) {
                this.socket.connect(host, port);
            };
            /**
             * 刷新socket缓存
             */
            Socket.prototype.flush = function () {
                this.socket.flush();
            };
            /**
             * 读取缓存中对象
             */
            Socket.prototype.readObject = function () {
                return this.socket.readObject();
            };
            /**
             * 对象写入缓存中
             */
            Socket.prototype.writeObject = function (value) {
                this.socket.writeObject(value);
            };
            Socket.prototype.onClose = function (event) {
                this.dispatchEvent(event);
            };
            Socket.prototype.onConnect = function (event) {
                this.dispatchEvent(event);
            };
            Socket.prototype.onIOError = function (event) {
                this.dispatchEvent(event);
            };
            Socket.prototype.onSocketData = function (event) {
                this.dispatchEvent(event);
            };
            return Socket;
        }(egret.EventDispatcher));
        net.Socket = Socket;
    })(net = frame.net || (frame.net = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var net;
    (function (net) {
        /**
         * @author 陈小军
         */
        var WebSocket = /** @class */ (function (_super) {
            __extends(WebSocket, _super);
            function WebSocket() {
                var _this = _super.call(this) || this;
                _this.socket = new egret.WebSocket();
                _this._codec = new frame.codec.Codec();
                _this.bytes = new frame.utils.ByteArray();
                _this.chars = new frame.utils.ByteArray();
                _this.socket.type = egret.WebSocket.TYPE_BINARY;
                _this.socket.addEventListener(egret.Event.CLOSE, _this.onClose, _this);
                _this.socket.addEventListener(egret.Event.CONNECT, _this.onConnect, _this);
                _this.socket.addEventListener(egret.IOErrorEvent.IO_ERROR, _this.onIOError, _this);
                _this.socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, _this.onSocketData, _this);
                return _this;
            }
            Object.defineProperty(WebSocket.prototype, "endian", {
                get: function () {
                    return this.bytes.endian;
                },
                set: function (value) {
                    this.bytes.endian = value;
                    this.chars.endian = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebSocket.prototype, "connected", {
                get: function () {
                    return this.socket.connected;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebSocket.prototype, "bytesAvailable", {
                get: function () {
                    return this.bytes.bytesAvailable;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebSocket.prototype, "codec", {
                get: function () {
                    return this._codec;
                },
                set: function (value) {
                    this._codec = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebSocket.prototype, "objectsAvailable", {
                get: function () {
                    var position = this.bytes.position;
                    var size = this.codec.sizeof(this.bytes);
                    this.bytes.position = position;
                    return size > 0;
                },
                enumerable: true,
                configurable: true
            });
            WebSocket.prototype.close = function () {
                this.socket.close();
            };
            WebSocket.prototype.connect = function (host, port) {
                this.socket.connect(host, port);
            };
            WebSocket.prototype.flush = function () {
                this.socket.flush();
            };
            WebSocket.prototype.onClose = function (event) {
                this.dispatchEvent(event);
            };
            WebSocket.prototype.onConnect = function (event) {
                this.dispatchEvent(event);
            };
            WebSocket.prototype.onIOError = function (event) {
                this.dispatchEvent(event);
            };
            WebSocket.prototype.onSocketData = function (event) {
                var bytes = new frame.utils.ByteArray();
                this.socket.readBytes(bytes);
                var position = this.bytes.position;
                this.bytes.writeBytes(bytes);
                this.bytes.position = position;
                this.dispatchEvent(event);
            };
            WebSocket.prototype.readBoolean = function () {
                return this.bytes.readBoolean();
            };
            WebSocket.prototype.readByte = function () {
                return this.bytes.readByte();
            };
            WebSocket.prototype.readBytes = function (bytes, offset, length) {
                if (offset === void 0) { offset = 0; }
                if (length === void 0) { length = 0; }
                this.bytes.readBytes(bytes, offset, length);
            };
            WebSocket.prototype.readDouble = function () {
                return this.bytes.readDouble();
            };
            WebSocket.prototype.readFloat = function () {
                return this.bytes.readFloat();
            };
            WebSocket.prototype.readInt = function () {
                return this.bytes.readInt();
            };
            WebSocket.prototype.readMultiByte = function (length, charSet) {
                throw new Error("Method not implemented.");
            };
            WebSocket.prototype.readObject = function () {
                var position = this.bytes.position;
                var size = this.codec.sizeof(this.bytes);
                this.bytes.position = position;
                if (size) {
                    var decoder = this.codec.decode(this.bytes);
                    this.bytes.position = position + size;
                    if (this.bytes.position > 4096) {
                        var bytes = new frame.utils.ByteArray();
                        this.bytes.readBytes(bytes, 0, this.bytes.bytesAvailable);
                        bytes.position = 0;
                        this.bytes = bytes;
                    }
                    return decoder;
                }
                throw new Error("ERROR");
            };
            WebSocket.prototype.readShort = function () {
                return this.bytes.readShort();
            };
            WebSocket.prototype.readUnsignedByte = function () {
                return this.bytes.readUnsignedByte();
            };
            WebSocket.prototype.readUnsignedInt = function () {
                return this.bytes.readUnsignedInt();
            };
            WebSocket.prototype.readUnsignedShort = function () {
                return this.bytes.readUnsignedShort();
            };
            WebSocket.prototype.readUTF = function () {
                return this.bytes.readUTF();
            };
            WebSocket.prototype.readUTFBytes = function (length) {
                return this.bytes.readUTFBytes(length);
            };
            WebSocket.prototype.writeBoolean = function (value) {
                this.chars.writeBoolean(value);
                this.send();
            };
            WebSocket.prototype.writeByte = function (value) {
                this.chars.writeByte(value);
                this.send();
            };
            WebSocket.prototype.writeBytes = function (bytes, offset, length) {
                if (offset === void 0) { offset = 0; }
                if (length === void 0) { length = 0; }
                this.chars.writeBytes(bytes, offset, length);
                this.send();
            };
            WebSocket.prototype.writeDouble = function (value) {
                this.chars.writeDouble(value);
                this.send();
            };
            WebSocket.prototype.writeFloat = function (value) {
                this.chars.writeFloat(value);
                this.send();
            };
            WebSocket.prototype.writeInt = function (value) {
                this.chars.writeInt(value);
                this.send();
            };
            WebSocket.prototype.writeMultiByte = function (value, charSet) {
                throw new Error("Method not implemented.");
            };
            WebSocket.prototype.writeObject = function (value) {
                var bytes = this.codec.encode(value);
                this.chars.writeBytes(bytes, 0, bytes.length);
                this.send();
            };
            WebSocket.prototype.writeShort = function (value) {
                this.chars.writeShort(value);
                this.send();
            };
            WebSocket.prototype.writeUnsignedByte = function (value) {
                this.chars.writeByte(value);
                this.send();
            };
            WebSocket.prototype.writeUnsignedInt = function (value) {
                this.chars.writeUnsignedInt(value);
                this.send();
            };
            WebSocket.prototype.writeUnsignedShort = function (value) {
                this.chars.writeUnsignedShort(value);
                this.send();
            };
            WebSocket.prototype.writeUTF = function (value) {
                this.chars.writeUTF(value);
                this.send();
            };
            WebSocket.prototype.writeUTFBytes = function (value) {
                this.chars.writeUTFBytes(value);
                this.send();
            };
            WebSocket.prototype.send = function () {
                this.socket.writeBytes(this.chars, 0, this.chars.length);
                this.chars.clear();
            };
            return WebSocket;
        }(egret.EventDispatcher));
        net.WebSocket = WebSocket;
    })(net = frame.net || (frame.net = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var physics;
    (function (physics) {
        /**
         * @author 陈小军
         */
        var Body = /** @class */ (function () {
            function Body() {
                this._name = "";
                this._fixtures = [];
                this._anchorpoint = new egret.Point();
            }
            Object.defineProperty(Body.prototype, "name", {
                get: function () {
                    return this._name;
                },
                set: function (value) {
                    this._name = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Body.prototype, "anchorpoint", {
                get: function () {
                    return this._anchorpoint;
                },
                set: function (value) {
                    this._anchorpoint = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Body.prototype, "fixtures", {
                get: function () {
                    return this._fixtures;
                },
                set: function (value) {
                    this._fixtures = value;
                },
                enumerable: true,
                configurable: true
            });
            return Body;
        }());
        physics.Body = Body;
    })(physics = frame.physics || (frame.physics = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var physics;
    (function (physics) {
        /**
         * @author 陈小军
         */
        var Fixture = /** @class */ (function () {
            function Fixture() {
                this._polygons = [];
            }
            Object.defineProperty(Fixture.prototype, "density", {
                get: function () {
                    return this._density;
                },
                set: function (value) {
                    this._density = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Fixture.prototype, "friction", {
                get: function () {
                    return this._friction;
                },
                set: function (value) {
                    this._friction = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Fixture.prototype, "restitution", {
                get: function () {
                    return this._restitution;
                },
                set: function (value) {
                    this._restitution = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Fixture.prototype, "filter_categoryBits", {
                get: function () {
                    return this._filter_categoryBits;
                },
                set: function (value) {
                    this._filter_categoryBits = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Fixture.prototype, "filter_groupIndex", {
                get: function () {
                    return this._filter_groupIndex;
                },
                set: function (value) {
                    this._filter_groupIndex = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Fixture.prototype, "filter_maskBits", {
                get: function () {
                    return this._filter_maskBits;
                },
                set: function (value) {
                    this._filter_maskBits = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Fixture.prototype, "fixture_type", {
                get: function () {
                    return this._fixture_type;
                },
                set: function (value) {
                    this._fixture_type = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Fixture.prototype, "polygons", {
                get: function () {
                    return this._polygons;
                },
                set: function (value) {
                    this._polygons = value;
                },
                enumerable: true,
                configurable: true
            });
            return Fixture;
        }());
        physics.Fixture = Fixture;
    })(physics = frame.physics || (frame.physics = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var physics;
    (function (physics) {
        /**
         * @author 陈小军
         */
        var Metadata = /** @class */ (function () {
            function Metadata() {
            }
            Object.defineProperty(Metadata.prototype, "format", {
                get: function () {
                    return this._format;
                },
                set: function (value) {
                    this._format = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Metadata.prototype, "ptm_ratio", {
                get: function () {
                    return this._ptm_ratio;
                },
                set: function (value) {
                    this._ptm_ratio = value;
                },
                enumerable: true,
                configurable: true
            });
            return Metadata;
        }());
        physics.Metadata = Metadata;
    })(physics = frame.physics || (frame.physics = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var physics;
    (function (physics) {
        /**
         * @author 陈小军
         */
        var PhysicsEditor = /** @class */ (function () {
            function PhysicsEditor() {
                this.bodies = [];
                this.metadata = new physics.Metadata();
            }
            PhysicsEditor.prototype.parse = function (items) {
                this.foreach(items, this.onBodydef);
                this.toMeter();
            };
            PhysicsEditor.prototype.getBodyByName = function (name) {
                var numBodies = this.bodies.length;
                for (var i = 0; i < numBodies; ++i)
                    if (this.bodies[i].name == name)
                        return this.bodies[i];
            };
            PhysicsEditor.prototype.getBodyByIndex = function (index) {
                return this.bodies[index];
            };
            PhysicsEditor.prototype.toMeter = function () {
                var numBodies = this.bodies.length;
                for (var i = 0; i < numBodies; ++i) {
                    var fixtures = this.bodies[i].fixtures;
                    var numFixtures = fixtures.length;
                    for (var j = 0; j < numFixtures; ++j) {
                        var polygons = fixtures[j].polygons;
                        var numPolygons = polygons.length;
                        for (var k = 0; k < numPolygons; ++k) {
                            var vertices = polygons[k];
                            var numVertices = vertices.length;
                            for (var h = 0; h < numVertices; ++h) {
                                vertices[h].x /= this.metadata.ptm_ratio;
                                vertices[h].y /= this.metadata.ptm_ratio;
                            }
                        }
                    }
                }
            };
            PhysicsEditor.prototype.onBodydef = function (items) {
                switch (items.name) {
                    case "bodies":
                        this.foreach(items, this.onBodies);
                        break;
                    case "metadata":
                        this.foreach(items, this.onMetadata);
                        break;
                }
            };
            PhysicsEditor.prototype.onMetadata = function (items) {
                switch (items.name) {
                    case "format":
                        this.metadata.format = this.float(items);
                        break;
                    case "ptm_ratio":
                        this.metadata.ptm_ratio = this.float(items);
                        break;
                }
            };
            PhysicsEditor.prototype.onBodies = function (items) {
                var body = new physics.Body();
                body.name = items.attributes.name;
                this.bodies.push(body);
                this.foreach(items, this.onBody, body);
            };
            PhysicsEditor.prototype.onBody = function (items, body) {
                switch (items.name) {
                    case "anchorpoint":
                        var floats = this.floats(items);
                        body.anchorpoint.x = floats[0];
                        body.anchorpoint.y = floats[1];
                        break;
                    case "fixtures":
                        this.foreach(items, this.onFixtures, body);
                        break;
                }
            };
            PhysicsEditor.prototype.onFixtures = function (items, body) {
                switch (items.name) {
                    case "fixture":
                        var fixture = new physics.Fixture();
                        body.fixtures.push(fixture);
                        this.foreach(items, this.onFixture, fixture);
                        break;
                }
            };
            PhysicsEditor.prototype.onFixture = function (items, fixture) {
                switch (items.name) {
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
            };
            PhysicsEditor.prototype.onPolygons = function (items, fixture) {
                var value = this.floats(items);
                var vertices = [];
                for (var i = value.length - 1; i > -1; i -= 2)
                    vertices.push(new box2d.b2Vec2(value[i - 1], -value[i]));
                fixture.polygons.push(vertices);
            };
            PhysicsEditor.prototype.foreach = function (items, callback, parameter) {
                var length = items.children.length;
                for (var i = 0; i < length; ++i) {
                    if (parameter == undefined) {
                        callback.call(this, items.children[i]);
                    }
                    else {
                        callback.call(this, items.children[i], parameter);
                    }
                }
            };
            PhysicsEditor.prototype.text = function (items) {
                var child = items.children[0];
                return child.text;
            };
            PhysicsEditor.prototype.float = function (items) {
                var child = items.children[0];
                var text = child.text;
                var pattern = /-?\d+\.?\d*/g;
                var result = pattern.exec(text);
                return parseFloat(result[0]);
            };
            PhysicsEditor.prototype.floats = function (items) {
                var child = items.children[0];
                var text = child.text;
                var value = [];
                var pattern = /-?\d+\.?\d*/g;
                var result;
                while (result = pattern.exec(text))
                    value.push(parseFloat(result[0]));
                return value;
            };
            return PhysicsEditor;
        }());
        physics.PhysicsEditor = PhysicsEditor;
    })(physics = frame.physics || (frame.physics = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var physics;
    (function (physics) {
        /**
         * @author 陈小军
         */
        var PhysicsEditorTool = /** @class */ (function (_super) {
            __extends(PhysicsEditorTool, _super);
            function PhysicsEditorTool() {
                var _this = _super.call(this) || this;
                var radius = 24;
                var numVertices = 6;
                var radian = -90 * Math.PI / 180 / numVertices;
                var matrix = new egret.Matrix();
                var points = [];
                var point = new egret.Point(radius, 0);
                for (var i = 0; i < numVertices + 1; ++i) {
                    matrix.identity();
                    matrix.rotate(radian * i);
                    var position = matrix.transformPoint(point.x, point.y);
                    points.push(position);
                }
                for (var i = 0; i < numVertices + 1; ++i)
                    console.log(i + "," + Math.round(points[i].x) + "," + -Math.round(points[i].y));
                var circle = new egret.Sprite();
                circle.graphics.lineStyle(1, 0xff0000);
                circle.graphics.moveTo(0, 0);
                for (var i = 0; i < numVertices + 1; ++i) {
                    circle.graphics.lineTo(points[i].x, points[i].y);
                }
                circle.graphics.lineTo(0, 0);
                circle.x = circle.y = 100;
                _this.addChild(circle);
                return _this;
            }
            return PhysicsEditorTool;
        }(egret.Sprite));
        physics.PhysicsEditorTool = PhysicsEditorTool;
    })(physics = frame.physics || (frame.physics = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var scene;
    (function (scene) {
        /**
         * @author 陈小军
         * 场景的绘图区
         */
        var Canvas = /** @class */ (function () {
            function Canvas(display) {
                this._display = display;
            }
            Object.defineProperty(Canvas.prototype, "display", {
                /**
                 * 显示对象
                 */
                get: function () {
                    return this._display;
                },
                set: function (value) {
                    this._display = value;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 退出
             */
            Canvas.prototype.onExit = function () { };
            return Canvas;
        }());
        scene.Canvas = Canvas;
    })(scene = frame.scene || (frame.scene = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var scene;
    (function (scene_1) {
        /**
         * @author 陈小军
         */
        var ISceneSet = /** @class */ (function (_super) {
            __extends(ISceneSet, _super);
            function ISceneSet() {
                var _this = _super.call(this) || this;
                _this.child = null;
                _this._scenes = null;
                return _this;
            }
            ISceneSet.prototype.open = function (scene) {
                if (this._scenes) {
                    if (this.child)
                        this.child.$hide();
                    this.child = scene;
                    this.child.$show(this._scenes);
                    return;
                }
                throw new Error("ERROR");
            };
            ISceneSet.prototype.$show = function (scenes) {
                this._scenes = scenes;
                this.onOpen();
                // if (this.child)
                // 	this.child.$show(this._scenes);
            };
            ISceneSet.prototype.$hide = function () {
                if (this.child)
                    this.child.$hide();
                this.onClose();
                this._scenes = null;
            };
            Object.defineProperty(ISceneSet.prototype, "canvas", {
                get: function () {
                    if (this.child)
                        return this.child.canvas;
                    return null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ISceneSet.prototype, "windows", {
                get: function () {
                    if (this.child)
                        return this.child.windows;
                    return null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ISceneSet.prototype, "scenes", {
                get: function () {
                    return this._scenes;
                },
                enumerable: true,
                configurable: true
            });
            return ISceneSet;
        }(egret.EventDispatcher));
        scene_1.ISceneSet = ISceneSet;
    })(scene = frame.scene || (frame.scene = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var scene;
    (function (scene) {
        /**
         * @author 陈小军
         */
        var Scene = /** @class */ (function (_super) {
            __extends(Scene, _super);
            function Scene() {
                var _this = _super.call(this) || this;
                _this._canvas = null;
                _this._scenes = null;
                return _this;
            }
            Object.defineProperty(Scene.prototype, "canvas", {
                get: function () {
                    return this._canvas;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Scene.prototype, "windows", {
                get: function () {
                    if (this.scenes == null) {
                        console.log("fdfsdf");
                    }
                    return this.scenes.windows;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Scene.prototype, "scenes", {
                get: function () {
                    return this._scenes;
                },
                enumerable: true,
                configurable: true
            });
            Scene.prototype.$show = function (scenes) {
                this._scenes = scenes;
                this._canvas = this.newCanvas(this.scenes.$canvas);
                this.onOpen();
            };
            Scene.prototype.$hide = function () {
                // 清空绘图区
                if (this._canvas) {
                    this._canvas.onExit();
                    this._canvas.display.removeChildren();
                }
                // 清理界面区
                var items = new Array();
                var callback = function (item) {
                    if (item.clean)
                        items.push(item);
                    return true;
                };
                this.windows.foreach(callback, this);
                for (var i = 0; i < items.length; ++i)
                    items[i].parent.removeChild(items[i]);
                // 清空
                this.onClose();
                this._scenes = null;
            };
            return Scene;
        }(egret.EventDispatcher));
        scene.Scene = Scene;
    })(scene = frame.scene || (frame.scene = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var scene;
    (function (scene) {
        /**
         * @author 陈小军
         */
        var SceneManager = /** @class */ (function (_super) {
            __extends(SceneManager, _super);
            function SceneManager(root) {
                var _this = _super.call(this) || this;
                _this._root = root;
                _this._scenes = _this;
                _this._windows = _this.newWindows(fairygui.GRoot.inst);
                _this.root.addChild(new egret.Sprite());
                _this.root.addChild(fairygui.GRoot.inst.displayObject);
                // 以下代码用于自动调整fairygui尺寸
                _this.autoResizeWindowManager();
                return _this;
            }
            Object.defineProperty(SceneManager.prototype, "root", {
                get: function () {
                    return this._root;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SceneManager.prototype, "$canvas", {
                get: function () {
                    return this.root.getChildAt(0);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SceneManager.prototype, "windows", {
                get: function () {
                    return this._windows;
                },
                enumerable: true,
                configurable: true
            });
            SceneManager.prototype.onOpen = function () {
            };
            SceneManager.prototype.onClose = function () {
            };
            /**
             * 以下代码用于自动调整fairygui尺寸
             */
            SceneManager.prototype.autoResizeWindowManager = function () {
                if (this.root.stage) {
                    this.resizeWindowManager();
                    this.root.stage.addEventListener(egret.Event.RESIZE, this.onResizeWindowManager, this);
                    this.root.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
                }
                else {
                    this.root.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
                }
            };
            SceneManager.prototype.onAddedToStage = function (event) {
                this.resizeWindowManager();
                this.root.stage.addEventListener(egret.Event.RESIZE, this.onResizeWindowManager, this);
                this.root.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            };
            SceneManager.prototype.onRemovedFromStage = function (event) {
                this.root.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
                this.root.stage.removeEventListener(egret.Event.RESIZE, this.onResizeWindowManager, this);
                this.root.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            };
            SceneManager.prototype.resizeWindowManager = function () {
                fairygui.GRoot.inst.setSize(this.root.stage.stageWidth, this.root.stage.stageHeight);
            };
            SceneManager.prototype.onResizeWindowManager = function (event) {
                this.resizeWindowManager();
            };
            return SceneManager;
        }(scene.ISceneSet));
        scene.SceneManager = SceneManager;
    })(scene = frame.scene || (frame.scene = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var scene;
    (function (scene) {
        /**
         * @author 陈小军
         */
        var SceneSet = /** @class */ (function (_super) {
            __extends(SceneSet, _super);
            function SceneSet() {
                return _super.call(this) || this;
            }
            return SceneSet;
        }(scene.ISceneSet));
        scene.SceneSet = SceneSet;
    })(scene = frame.scene || (frame.scene = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var ui;
    (function (ui) {
        var Button = /** @class */ (function (_super) {
            __extends(Button, _super);
            function Button() {
                var _this = _super.call(this) || this;
                _this.timer = new egret.Timer(150, 1);
                return _this;
            }
            Button.prototype.constructFromXML = function (xml) {
                _super.prototype.constructFromXML.call(this, xml);
                this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
            };
            Button.prototype.onTouchTap = function (event) {
                this.timer.reset();
                this.touchable = false;
                this.timer.addEventListener(egret.TimerEvent.COMPLETE, this.onTimer, this);
                this.timer.start();
            };
            Button.prototype.onTimer = function (event) {
                this.touchable = true;
                this.timer.removeEventListener(egret.TimerEvent.COMPLETE, this.onTimer, this);
            };
            return Button;
        }(fairygui.GButton));
        ui.Button = Button;
    })(ui = frame.ui || (frame.ui = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var ui;
    (function (ui) {
        var Loading = /** @class */ (function () {
            function Loading() {
            }
            Loading.prototype.getRes = function (url) {
                return frame.loading.Resources.getRes(url);
            };
            Loading.prototype.getResAsync = function (key, onComplete, thisObject) {
                frame.loading.Resources.getResAsync(key, onComplete, thisObject);
            };
            return Loading;
        }());
        ui.Loading = Loading;
    })(ui = frame.ui || (frame.ui = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var utils;
    (function (utils) {
        /**
         * @author 陈小军
         */
        var ByteArray = /** @class */ (function (_super) {
            __extends(ByteArray, _super);
            function ByteArray() {
                var _this = _super.call(this) || this;
                _this._codec = new frame.codec.Codec();
                _this.endian = egret.Endian.LITTLE_ENDIAN;
                return _this;
            }
            Object.defineProperty(ByteArray.prototype, "codec", {
                get: function () {
                    return this._codec;
                },
                set: function (value) {
                    this._codec = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ByteArray.prototype, "objectsAvailable", {
                get: function () {
                    var position = this.position;
                    var size = this.codec.sizeof(this);
                    this.position = position;
                    return size > 0;
                },
                enumerable: true,
                configurable: true
            });
            ByteArray.prototype.readMultiByte = function (length, charSet) {
                throw new Error("Method not implemented.");
            };
            ByteArray.prototype.readObject = function () {
                return this.codec.decode(this);
            };
            ByteArray.prototype.writeMultiByte = function (value, charSet) {
                throw new Error("Method not implemented.");
            };
            ByteArray.prototype.writeObject = function (value) {
                var bytes = this.codec.encode(value);
                this.writeBytes(bytes, 0, bytes.length);
            };
            ByteArray.prototype.writeUnsignedByte = function (value) {
                this.writeByte(value);
            };
            /**
             * offset相对于bytes
             * readBytes(bytes: ByteArray, offset: number, length: number): void;
             */
            /**
             * offset相对于bytes
             * writeBytes(bytes: ByteArray, offset: number, length: number): void;
             */
            ByteArray.prototype.readLongLong = function () {
                return this.readUnsignedInt() + this.readUnsignedInt() * 4294967296;
            };
            ByteArray.prototype.writeLongLong = function (value) {
                this.writeUnsignedInt(Math.floor(value % 4294967296));
                this.writeUnsignedInt(Math.floor(value / 4294967296));
            };
            ByteArray.prototype.readUnsignedLongLong = function () {
                return this.readUnsignedInt() + this.readUnsignedInt() * 4294967296;
            };
            ByteArray.prototype.writeUnsignedLongLong = function (value) {
                this.writeUnsignedInt(Math.floor(value % 4294967296));
                this.writeUnsignedInt(Math.floor(value / 4294967296));
            };
            ByteArray.prototype.readString = function (length, size) {
                if (size === void 0) { size = -1; }
                var position = this.position;
                if (size == -1) {
                    for (var i = 0; i < length; ++i) {
                        if (this.readByte() == 0) {
                            size = i;
                            break;
                        }
                    }
                    size = size == -1 ? length : size;
                    this.position = position;
                }
                var value = this.readUTFBytes(length);
                // let value: string = this.readUTFBytes(size);
                this.position = position + length;
                return value;
            };
            ByteArray.prototype.writeString = function (value, length) {
                var bytes = new ByteArray();
                bytes.writeUTFBytes(value);
                var min = bytes.length < length ? bytes.length : length;
                var max = bytes.length > length ? bytes.length : length;
                this.writeBytes(bytes, 0, min);
                for (; min < max; ++min)
                    this.writeByte(0);
            };
            return ByteArray;
        }(egret.ByteArray));
        utils.ByteArray = ByteArray;
    })(utils = frame.utils || (frame.utils = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var utils;
    (function (utils) {
        /**
         * 陈小军
         */
        var Dictionary = /** @class */ (function () {
            function Dictionary() {
                this.items = {};
            }
            Dictionary.prototype.get = function (key) {
                return this.items[key];
            };
            Dictionary.prototype.add = function (key, value) {
                if (!this.has(key)) {
                    this.items[key] = value;
                }
            };
            Dictionary.prototype.has = function (key) {
                return this.items.hasOwnProperty(key);
            };
            Dictionary.prototype.remove = function (key) {
                if (this.has(key))
                    delete this.items[key];
            };
            Dictionary.prototype.clear = function () {
                this.items = {};
            };
            return Dictionary;
        }());
        utils.Dictionary = Dictionary;
    })(utils = frame.utils || (frame.utils = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var utils;
    (function (utils) {
        /**
         * @author 陈小军
         */
        var Handler = /** @class */ (function () {
            function Handler(listener, thisObject) {
                if (listener) {
                    this._thisObject = thisObject;
                    this._listener = listener;
                }
                else
                    throw new Error("ERROR");
            }
            Handler.prototype.execute = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                this._listener.apply(this._thisObject, args);
            };
            Handler.prototype.equal = function (listener, thisObject) {
                return this._listener == listener && this._thisObject == thisObject;
            };
            Object.defineProperty(Handler.prototype, "thisObject", {
                get: function () {
                    return this._thisObject;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Handler.prototype, "listener", {
                get: function () {
                    return this._listener;
                },
                enumerable: true,
                configurable: true
            });
            return Handler;
        }());
        utils.Handler = Handler;
    })(utils = frame.utils || (frame.utils = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var utils;
    (function (utils) {
        /**
         * @author 陈小军
         */
        var StringUtils = /** @class */ (function () {
            function StringUtils() {
            }
            StringUtils.size = function (value) {
                var bytes = new frame.utils.ByteArray();
                bytes.writeUTFBytes(value);
                return bytes.length;
            };
            return StringUtils;
        }());
        utils.StringUtils = StringUtils;
    })(utils = frame.utils || (frame.utils = {}));
})(frame || (frame = {}));
var frame;
(function (frame) {
    var utils;
    (function (utils) {
        /**
         * @author 陈小军
         */
        var Ticker = /** @class */ (function () {
            function Ticker() {
                this.handlers = [];
                this.running = false;
            }
            Ticker.prototype.register = function (listener, thiz) {
                if (listener && thiz) {
                    var index = this.index(listener, thiz);
                    if (index == -1)
                        this.handlers.push(new utils.Handler(listener, thiz));
                    if (this.running == false && this.handlers.length) {
                        this.running = true;
                        egret.Ticker.getInstance().register(this.onTick, this);
                    }
                }
                else
                    throw new Error("ERROR");
            };
            Ticker.prototype.unregister = function (listener, thiz) {
                if (listener && thiz) {
                    var index = this.index(listener, thiz);
                    if (index > -1)
                        this.handlers.splice(index, 1);
                    if (this.running == true && this.handlers.length == 0) {
                        this.running = false;
                        egret.Ticker.getInstance().unregister(this.onTick, this);
                    }
                }
                else
                    throw new Error("ERROR");
            };
            Ticker.prototype.clear = function () {
                this.handlers = [];
                if (this.running == true) {
                    this.running = false;
                    egret.Ticker.getInstance().unregister(this.onTick, this);
                }
            };
            Ticker.prototype.onTick = function (intervals) {
                intervals = intervals * Ticker.SCALE;
                var length = this.handlers.length;
                var handlers = this.handlers.slice();
                for (var i = 0; i < length; ++i)
                    handlers[i].execute(intervals);
            };
            Ticker.prototype.index = function (listener, thiz) {
                var handler = null;
                var length = this.handlers.length;
                for (var i = 0; i < length; ++i) {
                    handler = this.handlers[i];
                    if (listener == handler.listener && thiz == handler.thisObject)
                        return i;
                }
                return -1;
            };
            Ticker.SCALE = 1;
            return Ticker;
        }());
        utils.Ticker = Ticker;
    })(utils = frame.utils || (frame.utils = {}));
})(frame || (frame = {}));
//# sourceMappingURL=frame.js.map
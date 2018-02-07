/**
 * 游戏框架的基础配置设置
 * @author Andrew_Huang
 */
module dragon
{

    export interface ISetting
    {
        ProjectName: string;          //项目名
        BoxAnimation: string;         //弹框动画类
        PanelAnimation: string;       //面板动画类
        SceneAnimation: string;       //场景动画类
        TooltipClass: string;         //tips类
        SimpleLoadingClass: string;   //简单加载类
        BoxClass: string;             //弹框类
        ProgressLoadingClass: string; //进度加载类
        ConfirmClass: string;         //确认框类
        ItemModelClass: string;       //道具模型类
        GameCallbackClass: string;    //游戏的全局回调类
        AnimationBlueprint: string;   //动画蓝图类（blueprint_json）
        LoadSceneClass: string;       //加载场景类
    }

    export class Setting implements ISetting
    {
        private _setting: ISetting;

        private getAnimation(animation): string
        {
            if (animation)
            {
                return animation;
            }
            return "NoneAnimation";
        }

        public get SimpleLoadingClass(): string
        {
            return this._setting.SimpleLoadingClass;
        }

        public get LoadSceneClass(): string
        {
            return this._setting.LoadSceneClass;
        }

        public get TooltipClass(): string
        {
            return this._setting.TooltipClass;
        }

        public get AnimationBlueprint(): string
        {
            return this._setting.AnimationBlueprint;
        }

        public get ProgressLoadingClass(): string
        {
            return this._setting.ProgressLoadingClass;
        }

        public get GameCallbackClass(): string
        {
            return this._setting.GameCallbackClass;
        }

        public get BoxClass(): string
        {
            return this._setting.BoxClass;
        }

        public get ConfirmClass(): string
        {
            return this._setting.ConfirmClass;
        }

        public get SceneAnimation(): string
        {
            return this.getAnimation(this._setting.SceneAnimation);
        }

        public get PanelAnimation(): string
        {
            return this.getAnimation(this._setting.PanelAnimation);
        }

        public get ItemModelClass(): string
        {
            return this._setting.ItemModelClass;
        }

        public get BoxAnimation(): string
        {
            return this.getAnimation(this._setting.BoxAnimation);
        }

        public get ProjectName(): string
        {
            return this._setting.ProjectName;
        }

        public init(setting: ISetting): void
        {
            this._setting = setting;
            //localStorage.setPrefix(this._setting.ProjectName + "-" + extra.spId);
        }

        static init(game_config: any): void
        {
            var conf: ISetting = Obj.getValue(game_config, "GameConfig");
            dragon.singleton(Setting).init(conf);
            var modules = Obj.getValue(game_config, "Modules");
            for (var key in modules)
            {
                var moduleVal = modules[key];
                var className = moduleVal["Setting"];
                if (className)
                {
                    var definition = egret.getDefinitionByName(className);
                    if (definition)
                    {
                        definition.init(moduleVal["Property"]);
                    }
                }
            }
        }
    }

    export function getSetting(): ISetting
    {
        return dragon.singleton(Setting);
    }
}
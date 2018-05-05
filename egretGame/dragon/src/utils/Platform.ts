/**
 * @author Andrew_Huang
 */
module dragon
{
    /**
     * 平台的功能支持类型
     * @export
     * @enum {number}
     */
    export enum PlatformFunType
    {
        SendToDesktop = 1,     //发送到桌面
        TencentLogin = 2,      //腾讯登陆
        InvitationFriend = 3,  //邀请朋友
        OpenBBS = 4,           //打开论坛
        Share = 5,             //支持分享
    }
    /**
     * 基础平台接口（基础信息、通用方法）
     * @export
     * @interface IPlatform
     */
    export interface IPlatform
    {
        name: string;
        contact: any;
        supportInfo: any;
        HasSubscribe: boolean;
        doLogin(): void;
        init(): void;
        login(args?: any): void;
        logout(callback?: (...args) => void, context?: Object): void;//
        payment(data: any, callback?: (...args) => void, context?: Object): void;//
        share(data: any, callback?: (...args) => void, context?: Object): void;//
        openBBS(callback?: (...args) => void, context?: Object): void;//
        isSupport(type: PlatformFunType, callback?: (...args) => void, context?: Object): void;//
        userIsSupport(data: any, callback?: (...args) => void, context?: Object): void;//
        sendToDesktop(callback?: (...args) => void, context?: Object): void;//
        setShareInfo(info?: any, callback?: (...args) => void, context?: Object): void;//
        doAttention(callback?: Function, context?: Object): void;//
    }

    /**
     * 返回当前运行环境的平台对象
     * @export
     * @returns {IPlatform} 
     */
    export function getPlatform(): IPlatform
    {
        let platform = dragon.extra.platform || 'ND';
        return dragon.ClassFactory.instance<IPlatform>('pf', platform);
    }
}
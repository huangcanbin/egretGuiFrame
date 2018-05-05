declare class VConsole {
    constructor(opt?: any);

    addPlugin(plugin: any): any;

    destroy(): void;

    hide(): void;

    hideSwitch(): void;

    removePlugin(pluginID: any): any;

    setOption(keyOrObj: any, value: any): void;

    show(): void;

    showSwitch(): void;

    showTab(tabID: any): void;

    triggerEvent(eventName: any, param: any): void;

}


declare namespace VConsole {
    class VConsolePlugin {
        constructor(id: any, ...args: any[]);

        on(eventName: any, callback: any): any;

        trigger(eventName: any, data: any): any;

    }
    class VConsoleLogTab
    {
        constructor(id: any, ...args: any[]);
    }

    class VConsoleDefaultTab
    {
        constructor(id: any, ...args: any[]);
        allowUnformattedLog:boolean;
    }

    namespace VConsolePlugin {

    }
}


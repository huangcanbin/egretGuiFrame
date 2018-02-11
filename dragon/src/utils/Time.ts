/**
 * @author Andrew_Huang
 * 时间操作类：延迟、判断时间戳
 */
module dragon
{
    var timestamp: RegExp = /^\d{10}$|^\d{13}$/; //时间戳：10或者13个整数

    /**
     * 指定的时间数值是否是时间戳
     * @export
     * @param {number} time 
     * @returns {boolean} 
     */
    export function isTimestamp(time: number): boolean
    {
        return timestamp.test(time.toString());
    }
    /**
     * 以指定的延迟（以毫秒为单位）间隔循环调用指定的函数
     * @export
     * @template T 
     * @param {(context: T, ...args) => void} callback  侦听函数
     * @param {T} context this对象
     * @param {number} time 延迟时间，以毫秒为单位
     * @param {any} args 参数列表
     * @returns {number}  返回索引，可以用于 clearInterval
     */
    export function setInterval<T>(callback: (context: T, ...args) => void, context: T, time: number, ...args: any[]): number
    {
        return egret.setInterval(callback, context, time, ...args);
    }

    /**
     * 清除指定延迟后运行的函数
     * @export
     * @param {number} timeId egret.setInterval所返回的索引
     */
    export function clearInterval(timeId: number): void
    {
        egret.clearInterval(timeId);
    }

    /**
     * 在指定的延迟（以毫秒为单位）后运行指定的函数
     * @export
     * @template T 
     * @param {(context: T, ...args) => void} callback 侦听函数
     * @param {T} context this对象
     * @param {number} time 延迟时间，以毫秒为单位
     * @param {...any[]} args 参数列表
     * @returns {number} 返回索引，可以用于 clearTimeout
     */
    export function setTimeout<T>(callback: (context: T, ...args) => void, context: T, time: number, ...args: any[]): number
    {
        return egret.setTimeout(callback, context, time, ...args)
    }

    /**
     * 清除指定延迟后运行的函数
     * @export
     * @param {number} timeId egret.setTimeout所返回的索引
     */
    export function clearTimeout(timeId: number): void
    {
        egret.clearTimeout(timeId);
    }
}
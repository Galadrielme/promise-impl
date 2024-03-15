import PromiseImpl from "../promise";
import { defineConstant } from "./define";
import { noop } from "./execute";
import _global from "./global";
import { microTask } from "./microTask";

const _PromiseRejectionEvent = typeof PromiseRejectionEvent === "function" ? PromiseRejectionEvent : class PromiseRejectionEvent extends Event {
    declare readonly promise: Promise<any>;
    declare readonly reason: any;
    constructor (type: string, init: any) {
        super(type, init);
        defineConstant(this, "promise", (init || {}).promise);
        defineConstant(this, "reason", (init || {}).reason);
    }
}
const queue: PromiseRejectionEvent[] = [];

/**
 * 触发事件
 * 
 * @param { PromiseRejectionEvent } event 
 */
export function dispatchRejectionEvent (event: PromiseRejectionEvent) {
    _global.dispatchEvent && _global.dispatchEvent(event)
}

/**
 * 控制台打印reason
 * (这个暂时无法模拟出和浏览器完全一致的Console行为, 慎用)
 * 
 * @param { PromiseRejectionEvent } event 
 */
export function consoleRejectionEvent (event: PromiseRejectionEvent) {
    microTask(() => {
        if (!event.defaultPrevented) {
            console.error("Uncaught (in promise)", event.reason);
        }
    })
    
}

/**
 * 处理Promise的unhandledrejection事件
 * 
 * @param { Function? } callback
 * @param { boolean? } useDispatch
 * @param { boolean? } useConsole
 */
export function handledRejectionEvent (
    this: PromiseImpl<any>,
    callback?: (event: PromiseRejectionEvent) => void,
    useDispatch?: boolean,
    useConsole?: boolean
) {
    this._.callback(noop, (reason: any) => {
        const event = createUnhandledRejectionEvent(this, reason);
        callback && callback(event);
        if (useDispatch) {
            dispatchRejectionEvent(event)
        }
        if (useConsole) {
            consoleRejectionEvent(event);
        }
        return event;
    });
}

/**
 * 创建unhandledrejection事件
 * 
 * @param { Promise } promise 
 * @param { any } reason 
 * @returns { PromiseRejectionEvent }
 */
export function createUnhandledRejectionEvent (promise: Promise<any>, reason: any): PromiseRejectionEvent {
    return new _PromiseRejectionEvent("unhandledrejection", {
        promise,
        reason
    });
}
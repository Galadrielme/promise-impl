import { isNative } from "./types";

/** 定义的回调函数 */
const callbacks: VoidFunction[] = [];

/** 实际的运行实现(参考了vue2) */
let run = () => {
    if (typeof Promise === "function" && isNative(Promise)) {
        /** 如果存在native Promise, 就是用native Promise, 这个确实有点赖皮了 */
        const promise = Promise.resolve();
        run = function () {
            promise.then(flushCallbacks);
        }
    } if (typeof MutationObserver !== 'undefined' && (
        isNative(MutationObserver) ||
        // PhantomJS and iOS 7.x
        MutationObserver.toString() === '[object MutationObserverConstructor]'
    )) {
        let counter = 1;
        const observer = new MutationObserver(flushCallbacks);
        const textNode = document.createTextNode(String(counter));
        observer.observe(textNode, {
            characterData: true
        });
        run = function () {
            counter = (counter + 1) % 2;
            textNode.data = String(counter);
        };
    } else {
        /** 回退方案, 如果确实无法实现microtask, 就使用macrotask */
        run = function () {
            setTimeout(flushCallbacks, 0);
        };
    }
    run();
}

/**
 * 冲洗回调函数
 */
function flushCallbacks () {
    const copies = callbacks.slice(0);
    callbacks.length = 0;
    for (var i = 0; i < copies.length; i++) {
        copies[i]();
    }
}

/**
 * 获取microTask回调
 * 
 * @param { VoidFunction } callback 
 */
export function microTask (callback: VoidFunction) {
    callbacks.push(callback);
    run();
}
microTask.flush = flushCallbacks;
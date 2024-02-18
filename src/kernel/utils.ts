import PromiseKernel from ".";
import PromiseState from "../enum/PromiseState";
import { isPromiseLike } from "../utils/types";
import { bail } from "../utils/bail";

//#region PromiseKernel 相关私有函数
/**
 * 接受值
 * 
 * @param { PromiseKernel } kernel 
 * @param { any } value 
 */
export function _resolve (kernel: PromiseKernel, value: any) {
    if (isPromiseLike(value)) {
        _asyncFulfilled(kernel, value);
    } else {
        _fulfilled(kernel, value);
    }
}

/**
 * 异步PromiseLike的实现, 可能回进一步调用_resolve, 直到彻底完成为止
 * 
 * @param { PromiseKernel } kernel 
 * @param { any } value 
 */
export function _asyncFulfilled (kernel: PromiseKernel, value: PromiseLike<any>)  {
    const bailed = bail((value) => { _resolve(kernel, value) }, (reason) => { _rejected(kernel, reason) })
    try {
      value.then(bailed.onfulfilled, bailed.onrejected);
    } catch (error) {
      bailed.onrejected(error);
    }
}

/**
 * 成功之后的处理逻辑
 * 
 * @param { PromiseKernel } kernel 
 * @param { any } value 
 */
export function _fulfilled (kernel: PromiseKernel, value: any) {
    kernel.state = PromiseState.FULFILLED;
    kernel.result = value;
    _emitFinally(kernel);
}

/**
 * 失败之后的处理逻辑
 * 
 * @param { PromiseKernel } kernel 
 * @param { any } reason 
 */
export function _rejected (kernel: PromiseKernel, reason: any) {
    kernel.state = PromiseState.REJECTED;
    kernel.result = reason;
    _emitFinally(kernel);
}

/**
 * 处理回调
 * 
 * @param { PromiseKernel } kernel 
 * @param { Function } onfulfilled 
 * @param { Function } onrejected 
 */
export function _callback (kernel: PromiseKernel, onfulfilled: (value: any) => void, onrejected: (reason: any) => void) {
    _onFinally(kernel, () => {
        if (kernel.state === PromiseState.FULFILLED) {
            onfulfilled(kernel.result);
        } else if (kernel.state === PromiseState.REJECTED) {
            onrejected(kernel.result);
        }
    });
}

/**
 * 完成之后的事件
 * 
 * @param { PromiseKernel } kernel 
 * @param { Function } callback 
 */
export function _onFinally (kernel: PromiseKernel, callback: (kernel: PromiseKernel) => void) {
    if (kernel.state === PromiseState.PENDING) {
        (kernel.callbacks || (kernel.callbacks = [])).push(callback);
    } else {
        callback(kernel);
    }
}

/**
 * 触发完成之后的回调
 * 
 * @param { Function } kernel 
 */
export function _emitFinally (kernel: PromiseKernel) {
    if (kernel.callbacks) {
        [...kernel.callbacks].forEach(callback => callback(kernel));
        kernel.callbacks.length = 0;
        kernel.callbacks = void 0;
    }
}
//#endregion

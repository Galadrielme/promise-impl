import PromiseState from "../enum/PromiseState";
import { _callback, _rejected, _resolve } from "./utils";

class PromiseKernel {
    /** 内部状态位 */
    state: PromiseState;
    /** 处理后的值 */
    result: any;
    /** 是否调用过 */
    invoked: boolean;
    /** 回调 */
    callbacks?: ((kernel: PromiseKernel) => void)[] | void;
  
    constructor () {
        this.state = PromiseState.PENDING;
        this.result = void 0;
        this.callbacks = void 0;
        this.invoked = false;
    }

    //#region settled
    /**
     * 是否确定下来了
     */
    get settled (): boolean {
        return this.state === PromiseState.FULFILLED || this.state === PromiseState.REJECTED;
    }
    //#endregion

    //#region resolve / reject
    /**
     * 接收结果
     * 
     * @param { any } value
     */
    resolve (value: any) {
        /** 只有在pending状态才进一步处理 */
        if (this.invoked) return;
        this.invoked = true;
        _resolve(this, value);
    }
  
    /**
     * 拒绝
     * 
     * @param { any } reason
     */
    reject (reason: any) {
        /** 只有在pending状态才进一步处理 */
        if (this.invoked || this.state !== PromiseState.PENDING) return;
        this.invoked = true;
        _rejected(this, reason);
    }
    //#endregion

    //#region callback
    /**
     * 执行回调
     * 
     * @param { Function } fulfilled 
     * @param { Function } rejected 
     */
    callback (fulfilled: (value: any) => void, rejected: (reason: any) => void) {
      _callback(this, fulfilled, rejected);
    }
    //#endregion
}

export default PromiseKernel;
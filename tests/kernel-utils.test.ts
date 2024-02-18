import * as KernelUtils from "../src/kernel/utils";
import PromiseState from "../src/enum/PromiseState";
import PromiseKernel from "../src/kernel";
import { createPromiseLike, sleep } from "./_utils";

/**
 * 测试bail
 * 期望 onfulfilled / onrejected 只有第一次会触发, 后续的触发都无效
 */
describe("/kernel/utils", () => {
    //#region assertPending / assertFulfilled / assertRejected
    const assertPending = (kernel: PromiseKernel) => {
        expect(kernel.state).toEqual(PromiseState.PENDING);
        expect(kernel.result).toEqual(void 0);
    }
    const assertFulfilled = (kernel: PromiseKernel, value: any) => {
        expect(kernel.state).toEqual(PromiseState.FULFILLED);
        expect(kernel.result).toEqual(value);
    }
    const assertRejected = (kernel: PromiseKernel, reason: any) => {
        expect(kernel.state).toEqual(PromiseState.REJECTED);
        expect(kernel.result).toEqual(reason);
    }
    //#endregion

    //#region promiseLikeFulfilled / promiseLikeRejected
    const fulfilledValue = 1;
    const rejectedReason = -1;
    const promiseLikeFulfilled: PromiseLike<any> = createPromiseLike(PromiseState.FULFILLED, fulfilledValue);
    const promiseLikeRejected: PromiseLike<any> = createPromiseLike(PromiseState.REJECTED, rejectedReason);
    //#endregion

    describe("_resolve", () => {
        test("fulfilled sync value", () => {
            const kernel = new PromiseKernel();
            KernelUtils._resolve(kernel, fulfilledValue);
            assertFulfilled(kernel, fulfilledValue);
        });

        /** 这个不知道为什么始终不通过, 报错是因为 await sleep(1), 逻辑应该没问题 */
        test("fulfilled async value", async () => {
            const promiseFulfilled: Promise<any> = Promise.resolve(fulfilledValue);
            const kernel = new PromiseKernel();
            KernelUtils._resolve(kernel, promiseFulfilled);
            await sleep(1);
            assertFulfilled(kernel, fulfilledValue);
        });

        test("rejected async error", async () => {
            const promiseRejected: Promise<any> = Promise.reject(rejectedReason);
            const kernel = new PromiseKernel();
            KernelUtils._resolve(kernel, promiseRejected);
            await sleep(1);
            assertRejected(kernel, rejectedReason);
        });

        test("fulfilled async value (PromiseLike)", async () => {
            const kernel = new PromiseKernel();
            KernelUtils._resolve(kernel, promiseLikeFulfilled);
            await sleep(1);
            assertFulfilled(kernel, fulfilledValue);
        });

        test("rejected async error (PromiseLike)", async () => {
            const kernel = new PromiseKernel();
            KernelUtils._resolve(kernel, promiseLikeRejected);
            await sleep(1);
            assertRejected(kernel, rejectedReason);
        });
    });
    describe("_asyncFulfilled", () => {
        test("fulfilled async value", async () => {
            const promiseFulfilled: Promise<any> = Promise.resolve(fulfilledValue);
            const kernel = new PromiseKernel();
            KernelUtils._asyncFulfilled(kernel, promiseFulfilled);
            assertPending(kernel);
            await sleep(1);
            assertFulfilled(kernel, fulfilledValue);
        });
        test("rejected async error", async () => {
            const kernel = new PromiseKernel();
            KernelUtils._asyncFulfilled(kernel, promiseLikeRejected);
            await sleep(1);
            assertRejected(kernel, rejectedReason);
        });
    });
    describe("_fulfilled", () => {
        test("fulfilled sync value", () => {
            const kernel = new PromiseKernel();
            KernelUtils._fulfilled(kernel, fulfilledValue);
            assertFulfilled(kernel, fulfilledValue);
        });
    });
    describe("_rejected", () => {
        test("rejected sync error", () => {
            const kernel = new PromiseKernel();
            KernelUtils._rejected(kernel, rejectedReason);
            assertRejected(kernel, rejectedReason);
        });
    });
    describe("_onFinally", () => {
        test("Callback once", () => {
            const kernel = new PromiseKernel();
            const onfinally = jest.fn();
            KernelUtils._onFinally(kernel, onfinally);
            
            /** 测试在emit之前不调用 */
            expect(onfinally).toHaveBeenCalledTimes(0);

            KernelUtils._emitFinally(kernel);

            /** 测试在只应该调用一次 */
            expect(onfinally).toHaveBeenCalledTimes(1);

            KernelUtils._emitFinally(kernel);

            /** 已经被删除不再被调用 */
            expect(onfinally).toHaveBeenCalledTimes(1);
        });
    });
    describe("_callback", () => {
        /** 此时应该一条定义 */
        test("Defined", () => {
            const kernel = new PromiseKernel();
            const onfulfilled = jest.fn();
            const onrejected = jest.fn();
    
            KernelUtils._callback(kernel, onfulfilled, onrejected);
            expect(kernel.callbacks).toHaveLength(1);
        });
    });
});
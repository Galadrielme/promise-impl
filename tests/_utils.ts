import { defineConstant } from "../src/utils/define";
import PromiseImpl from "../src/promise";
import PromiseState from "../src/enum/PromiseState";
import _global from "../src/utils/global";

/**
 * 延迟一定的ms
 * 
 * @param { number } ms
 * @param { any } value
 * @returns { Promise }
 */
export const sleep = <T = any>(ms: number, value?: T): Promise<T> => {
    // return jest.advanceTimersByTimeAsync(ms);
    return new Promise<any>(resolve => {
        setTimeout(() => { resolve(value); }, ms);
    });
}

/**
 * 不应该被执行到函数, 如果执行到了就直接抛出异常
 * 
 * @throws
 */
export const shouldNotBeInvoked = () => {
    expect("Invoked 0 times").toBe("Invoked 1 times");
    throw "Should not be executed";
}

/**
 * 将异常模糊化(不同类型的异常都视为同一种处理, 毕竟要将异常信息完全模拟的和原生的完全一致是麻烦的, 有些情况下只要和原生特性一样进行了报错就行了)
 * 
 * @param { Function } runnable
 * @returns { any }
 * @throws
 */
export const fuzzyError = <T>(runnable: () => T): T => {
    try {
        return runnable();
    } catch (e) {
        throw "Fuzzy Error";
    }
}

/**
 * 模拟创建一个PromiseLike(并不具备完整的Promise功能, 只是用于测试模拟)
 * 
 * @param { PromiseState } state 
 * @param { any } value 
 * @returns { PromiseLike }
 */
export const createPromiseLike = (state: PromiseState, value?: any): PromiseLike<any> => {
    return Object.create({
        then (onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
            switch (state) {
                case PromiseState.PENDING: return createPromiseLike(PromiseState.PENDING);
                case PromiseState.FULFILLED: return Promise.resolve(onfulfilled ? onfulfilled(value) : value);
                case PromiseState.REJECTED: return Promise.resolve(onrejected ? onrejected(value) : value);
            }
        }
    }, {
        [Symbol.toStringTag]: {
            value: "PromiseLike",
            enumerable: true
        }
    })
}

/**
 * 和原生Promise进行比较测试
 * 
 * @param { Function } generate - 生成器
 * @returns { Promise }
 */
export const testWithNativePromise = (generate: PromiseGenerator, assert: typeof assertPromiseTestingContext = assertPromiseTestingContext): Promise<void> => {
    const nativeContext = createPromiseTestingContext(generate, Promise);
    const implContext = createPromiseTestingContext(generate, PromiseImpl);

    return assert(nativeContext, implContext);
}

/**
 * 创建Promise测试上下文
 * 
 * @param { PromiseGenerator } generate 
 * @param { PromiseConstructor | typeof PromiseImpl } ctor 
 * @returns { PromiseTestingContext }
 */
export const createPromiseTestingContext = (generate: PromiseGenerator, ctor: PromiseConstructor | typeof PromiseImpl): PromiseTestingContext => {
    const start = performance.now();
    let context: any = {};
    try {
        const promise = generate(ctor);
        context.status = "success";
        context.promise = promise;
    } catch (e) {
        context.status = "error";
        context.error = e;
    }
    defineConstant(context, "cost", performance.now() - start);
    defineConstant(context, "type", ctor instanceof Promise ? "native" : "impl");
    return context;
}

/**
 * 断言Promise的状态(和原生Promise比较)
 * 
 * @param { PromiseTestingContext } nativeContext 
 * @param { PromiseTestingContext } implContext 
 * @returns { Promise }
 */
export const assertPromiseTestingContext = (nativeContext: PromiseTestingContext, implContext: PromiseTestingContext): Promise<void> => {
    if (nativeContext.status === "success" && implContext.status === "success") {
        return assertPromiseTestingSuccessContext(nativeContext, implContext);
    }
    if (nativeContext.status === "error" && implContext.status === "error") {
        return assertPromiseTestingErrorContext(nativeContext, implContext);
    }
    expect(nativeContext).toEqual(implContext);
    return Promise.resolve();
}

/**
 * 断言Promise的成功状态
 * 
 * @param { PromiseTestingSuccessContext } nativeContext 
 * @param { PromiseTestingSuccessContext } implContext 
 * @returns { Promise }
 */
export const assertPromiseTestingSuccessContext = (nativeContext: PromiseTestingSuccessContext, implContext: PromiseTestingSuccessContext): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        let assertted = false;
        let nativeSettled: PromiseSettledResult<PromiseTestingSuccessContext> | void = void 0;
        let implSettled: PromiseSettledResult<PromiseTestingSuccessContext> | void = void 0;
        Promise.allSettled([nativeContext.promise]).then(([settled]) => { nativeSettled = settled; assertSettled(); });
        Promise.allSettled([implContext.promise]).then(([settled]) => { implSettled = settled; assertSettled(); });
    
        /** 进行断言 */
        const assertSettled = () => {
            if (assertted || (!nativeSettled || !implSettled)) return;
            assertted = true;
            /** 清除pedding断言 */
            clearTimeout(assertPeddingToken);

            expect(implSettled.status).toBe(nativeSettled.status);
            switch (implSettled.status) {
                case "fulfilled": {
                    expect(implSettled.value).toEqual((nativeSettled as any).value);
                    break;
                }
                case "rejected": {
                    expect(implSettled.reason).toEqual((nativeSettled as any).reason);
                    break;
                }
            }
            resolve();
        }
        /** 测试同为pending状态 */
        const assertPending = () => {
            if (assertted) return;
            assertted = true;
            expect(implSettled).toBe(void 0);
            expect(nativeSettled).toBe(void 0);
            resolve();
        }
        /** 单个测试用例如果超过50ms以上都没有settled, 都视为Pending */
        let assertPeddingToken = setTimeout(assertPending, 50);
    });

}

/**
 * 断言Promise的报错状态
 * 
 * @param { PromiseTestingErrorContext } nativeContext 
 * @param { PromiseTestingErrorContext } implContext 
 * @returns { Promise }
 */
export const assertPromiseTestingErrorContext = (nativeContext: PromiseTestingErrorContext, implContext: PromiseTestingErrorContext): Promise<void> => {
    const nativeError = nativeContext.error;
    const implError = implContext.error;
    if (
        nativeError instanceof Error &&
        implError instanceof Error
    ) {
        expect(Object.getPrototypeOf(nativeError)).toBe(Object.getPrototypeOf(implError));
        expect(nativeError.message).toEqual(implError.message);
    } else {
        expect(nativeError).toEqual(implError);
    }
    return Promise.resolve();
}

/** 一些基础的测试用例 */
export const CASES = {
    get ImmediateValue () { return "Immediate Value" },
    get PendingPromise () { return new Promise(() => {}) },
    get FulfilledPromise () { return new Promise(resolve => { resolve("Fulfilled Promise") }) },
    get RejectedPromise () { return new Promise((_, reject) => { reject("Rejected Promise") }) },
    get PendingPromiseImpl () { return new PromiseImpl(() => {}) },
    get FulfilledPromiseImpl () { return new PromiseImpl(resolve => { resolve("Fulfilled PromiseImpl") }) },
    get RejectedPromiseImpl () { return new PromiseImpl((_, reject) => { reject("Rejected PromiseImpl") }) },
    get PendingPromiseLike () { return createPromiseLike(PromiseState.PENDING) },
    get FulfilledPromiseLike () { return createPromiseLike(PromiseState.FULFILLED, "Fulfilled PromiseLike") },
    get RejectedPromiseLike () { return createPromiseLike(PromiseState.REJECTED, "Rejecdte PromiseLike") }
}

/** 测试多种类型 */
export const MANY_TYPES: Map<string, any> = new Map([
    ["is function", () => void 0],
    ["is void", void 0],
    ["is null", null],
    ["is number", 1],
    ["is NaN", NaN],
    ["is bigint", 1n],
    ["is string", "string"],
    ["is symol,", Symbol("symbol")],
    ["is boolean", true],
    ["is object,", {}],
    ["is EmptyObject,", Object.create(null)],
    /** 这两个在NodeJs和浏览器上的表现不一致, 因此不做测试了 */
    //["is AnonymousObject,", new (class {})],
    //["is NamedObject,", new (class Name {})],
    ["is ExtendString,", new (class ExtendString extends String {})],
    ["is String", new String(1)],
    ["is Number", new Number(1)],
    ["is Array", []],
    ["is RegExp", /REG/],
    ["is Date", new Date()],
    ["is Map", new Map()],
    ["is Set", new Set()],
    ["is Promise", CASES.FulfilledPromise]
] as [string, any][]);

/** 测试多种pending类型 */
export const MANY_PENDING: Map<string, () => PromiseLike<any>> = new Map([
    ["with Pending Promise", () => CASES.PendingPromise],
    ["with Pending PromiseImpl", () => CASES.PendingPromiseImpl],
    ["with Pending PromiseLike", () => CASES.PendingPromiseLike],
]);

/** 测试多种fulfilled类型 */
export const MANY_FULFILLED: Map<string, () => PromiseLike<any>> = new Map([
    ["with Fulfilled Promise", () => CASES.FulfilledPromise],
    ["with Fulfilled PromiseImpl", () => CASES.FulfilledPromiseImpl],
    ["with Fulfilled PromiseLike", () => CASES.FulfilledPromiseLike],
]);

/** 测试多种rejected类型 */
export const MANY_REJECTED: Map<string, () => PromiseLike<any>> = new Map([
    ["with Rejected Promise", () => CASES.RejectedPromise],
    ["with Rejected PromiseImpl", () => CASES.RejectedPromiseImpl],
    ["with Rejected PromiseLike", () => CASES.RejectedPromiseLike],
]);

export interface PromiseGenerator {
    (ctor: PromiseConstructor): Promise<any>;
    (ctor: typeof PromiseImpl): PromiseImpl<any>;
    (ctor: PromiseConstructor | typeof PromiseImpl): Promise<any> | PromiseImpl<any>;
}

export type PromiseTestingContext = PromiseTestingSuccessContext | PromiseTestingErrorContext;

export interface PromiseTestingSuccessContext extends PromiseTestingBaseContext {
    status: "success";
    promise: Promise<any> | PromiseImpl<any> | any;
}

export interface PromiseTestingErrorContext extends PromiseTestingBaseContext {
    status: "error";
    error: any;
}

export interface PromiseTestingBaseContext {
    type: "native" | "impl";
    cost: number;
}
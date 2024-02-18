import { testWithNativePromise, fuzzyError, CASES, MANY_TYPES, shouldNotBeInvoked, MANY_PENDING } from "./_utils";

/**
 * 测试Promise.allSettled
 */
describe("/promise/implements/Promise.allSettled", () => {

    /** 某些类型下期望获取异常 */
    describe("expect errors", () => {
        MANY_TYPES.forEach((value, key) => {
            test(key, () => {
                return testWithNativePromise((ctor) => {
                    return ctor.allSettled(value);
                });
            });
        })
    });

    describe("Promise.allSettled", () => {
        test("without Pending", () => {
            /**
             * 测试用例
             */
            const cases = [
                1,
                new Error("error"),
                CASES.FulfilledPromise,
                CASES.FulfilledPromiseImpl,
                CASES.FulfilledPromiseLike,
                CASES.ImmediateValue,
                CASES.RejectedPromise,
                CASES.RejectedPromiseImpl,
                CASES.RejectedPromiseLike,
                CASES.FulfilledPromise.then(() => Promise.resolve("Promise.reject(Promise)"))
            ]
            return testWithNativePromise((ctor) => {
                return ctor.allSettled(cases);
            });
        });

        /** 测试包含pending的 */
        MANY_PENDING.forEach((getter, key) => {
            test(key, () => {
                return testWithNativePromise((ctor) => {
                    return ctor.allSettled([1, getter()]).then(shouldNotBeInvoked);
                });
            });
        });
    });
});
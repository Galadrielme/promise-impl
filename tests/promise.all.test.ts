import { testWithNativePromise, shouldNotBeInvoked, CASES, MANY_TYPES, MANY_PENDING, MANY_REJECTED } from "./_utils";

/**
 * 测试Promise.all
 */
describe("/promise/implements/Promise.all", () => {
    /** 某些类型下期望获取异常 */
    describe("expect errors", () => {
        MANY_TYPES.forEach((value, key) => {
            test(key, () => {
                return testWithNativePromise((ctor) => {
                    return ctor.all(value);
                });
            });
        })
    });

    describe("Promise.all", () => {
        test("without Pending / Rejected", () => {
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
            ]
            return testWithNativePromise((ctor) => {
                return ctor.all(cases);
            });
        });

        /** 测试包含pending的 */
        MANY_PENDING.forEach((getter, key) => {
            test(key, () => {
                return testWithNativePromise((ctor) => {
                    return ctor.all([1, getter()]).then(shouldNotBeInvoked);
                });
            });
        });

        /** 测试包含rejected的 */
        MANY_REJECTED.forEach((getter, key) => {
            test(key, () => {
                return testWithNativePromise((ctor) => {
                    return ctor.all([1, getter()]);
                });
            });
        });
    });
});
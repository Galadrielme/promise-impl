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

        test ("without immediate Rejected", () => {
            /**
             * 测试用例
             */
            const cases = [
                /** 测试在存在Rejected的时候是否立即截止 */
                new Promise((resolve) => {
                    setTimeout(resolve, 10000);
                }),
                CASES.RejectedPromise,
            ]
            return testWithNativePromise((ctor) => {
                return ctor.all(cases);
            });
        });

        test ("without first Rejected", () => {
            /**
             * 测试用例
             */
            const cases = [
                /** 测试是否返回第一个拒绝的原因 */
                new Promise((_, reject) => {
                    setTimeout(() => { reject("first") }, 10000);
                }),
                CASES.RejectedPromise,
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
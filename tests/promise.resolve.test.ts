import { testWithNativePromise, shouldNotBeInvoked, CASES, MANY_TYPES, MANY_PENDING, MANY_REJECTED, MANY_FULFILLED } from "./_utils";

/**
 * 测试Promise.resolve
 */
describe("/promise/implements/Promise.resolve", () => {

    describe("Promise.resolve", () => {
        test("with Immediate Value", () => {
            return testWithNativePromise((ctor) => {
                return ctor.resolve(CASES.ImmediateValue);
            });
        })
        
        /** 测试包含pending的 */
        MANY_PENDING.forEach((getter, key) => {
            test(key, () => {
                return testWithNativePromise((ctor) => {
                    return ctor.resolve(getter()).then(shouldNotBeInvoked);
                });
            });
        });
        
        /** 测试包含fulfilled的 */
        MANY_FULFILLED.forEach((getter, key) => {
            test(key, () => {
                return testWithNativePromise((ctor) => {
                    return ctor.resolve(getter()).then(shouldNotBeInvoked);
                });
            });
        });

        /** 测试包含rejected的 */
        MANY_REJECTED.forEach((getter, key) => {
            test(key, () => {
                return testWithNativePromise((ctor) => {
                    return ctor.resolve(getter());
                });
            });
        });
    });
});
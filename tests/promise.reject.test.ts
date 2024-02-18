import { testWithNativePromise, shouldNotBeInvoked, CASES, MANY_TYPES, MANY_PENDING, MANY_REJECTED, MANY_FULFILLED } from "./_utils";

/**
 * 测试Promise.reject
 */
describe("/promise/implements/Promise.reject", () => {

    describe("Promise.reject", () => {
        test("with Immediate Value", () => {
            return testWithNativePromise((ctor) => {
                return ctor.reject(CASES.ImmediateValue);
            });
        })
        
        /** 测试包含pending的 */
        MANY_PENDING.forEach((getter, key) => {
            test(key, () => {
                return testWithNativePromise((ctor) => {
                    return ctor.reject(getter()).then(shouldNotBeInvoked);
                });
            });
        });
        
        /** 测试包含fulfilled的 */
        MANY_FULFILLED.forEach((getter, key) => {
            test(key, () => {
                return testWithNativePromise((ctor) => {
                    return ctor.reject(getter()).then(shouldNotBeInvoked);
                });
            });
        });
    });
});
import { testWithNativePromise, shouldNotBeInvoked, CASES, MANY_TYPES, MANY_PENDING, MANY_REJECTED, sleep } from "./_utils";

/**
 * 测试Promise.race
 */
describe("/promise/implements/Promise.race", () => {

    /** 某些类型下期望获取异常 */
    describe("expect errors", () => {
        MANY_TYPES.forEach((value, key) => {
            test(key, () => {
                return testWithNativePromise((ctor) => {
                    return ctor.rece(value);
                });
            });
        })
    });
    return;

    describe("Promise.race", () => {
        const slower = () => sleep(5, "slower");
        const faster = () => sleep(1, "faster");

        test("without Pending / Rejted", () => {
            /**
             * 测试用例
             */
            const cases = [
                slower(),
                faster(),
            ]
            return testWithNativePromise((ctor) => {
                return ctor.race(cases);
            });
        });

        /** 测试包含pending的 */
        MANY_PENDING.forEach((getter, key) => {
            test(key, () => {
                return testWithNativePromise((ctor) => {
                    return ctor.race([faster(), getter()]);
                });
            });
        });

        /** 测试包含rejected的 */
        MANY_REJECTED.forEach((getter, key) => {
            test(key, () => {
                return testWithNativePromise((ctor) => {
                    return ctor.race([faster(), getter()]);
                });
            });
        });
    });
});
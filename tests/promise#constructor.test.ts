import { MANY_TYPES, testWithNativePromise } from "./_utils";

/**
 * 测试构造器
 */
describe("/promise/implements/constructor", () => {
    const testConstructorError = (args: any[]) => {
        return testWithNativePromise((ctor) => {
            return new ctor(...args);
        });
    }

    describe("new Promise", () => {
        test("fulfilled sync value", () => {
            return testWithNativePromise((ctor) => {
                return new ctor((resolve) => {
                    resolve("fulfilled sync value");
                });
            });
        });
        test("fulfilled async value", () => {
            return testWithNativePromise((ctor) => {
                return new ctor((resolve) => {
                    resolve(new ctor((resolve) => resolve("fulfilled async value")));
                });
            });
        });
        test("reject sync value", () => {
            return testWithNativePromise((ctor) => {
                return new ctor((_, reject) => {
                    reject("reject sync value");
                });
            });
        });
        test("reject async value", () => {
            return testWithNativePromise((ctor) => {
                return new ctor((_, reject) => {
                    reject(new ctor((resolve) => resolve("fulfilled async value")));
                });
            });
        });
        test("throws", () => {
            return testWithNativePromise((ctor) => {
                return new ctor(() => {
                    throw "throw errors @new Promise";
                });
            });
        });
    });

    describe("executor error", () => {
        MANY_TYPES.forEach((value, key) => {
            test(key, () => {
                return testConstructorError(value === void 0 ? [] : [value]);
            });
        })
    });
});
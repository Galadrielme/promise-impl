import { isFunction } from "../src/utils/types";
import { testWithNativePromise, shouldNotBeInvoked, CASES, MANY_TYPES, MANY_PENDING, MANY_REJECTED } from "./_utils";

/**
 * 测试Promise.withResolvers
 */
describe("/promise/implements/Promise.withResolvers", () => {
    if (!isFunction(Promise.withResolvers)) {
        test("No native Promise.withResovlers", () => {
            expect(0).toBe(0);
        });
        return;
    }
    /** 某些类型下期望获取异常 */
    describe("expect errors", () => {
        MANY_TYPES.forEach((value, key) => {
            test(key, () => {
                return testWithNativePromise((ctor) => {
                    return ctor.withResolvers.call(value).promise;
                });
            });
        })
    });

    describe("Promise.withResolvers", () => {
        test("with Pending", () => {
            return testWithNativePromise((ctor) => {
                return ctor.withResolvers().promise;
            });
        });
        test("with Fulfilled", () => {
            return testWithNativePromise((ctor) => {
                const { promise, resolve } = ctor.withResolvers();
                resolve(1);
                return promise;
            });
        });
        test("with Rejected", () => {
            return testWithNativePromise((ctor) => {
                const { promise, reject } = ctor.withResolvers();
                reject(-1);
                return promise;
            });
        });

        test("custom Class(Not execute)", () => {
            return testWithNativePromise((ctor) => {
                const { promise, reject } = ctor.withResolvers.call(class {});
                reject(-1);
                return promise;
            });
        });

        test("custom Class(Executed once)", () => {
            return testWithNativePromise((ctor) => {
                const { promise, resolve, reject } = ctor.withResolvers.call(class {
                    resolved: any = null;
                    rejected: any = null;
                    constructor(executor: (resolve: (value: any) => void, reject: (reason?: any) => void) => void) {
                        executor(
                            (resolved: any) => { this.resolved = resolved; },
                            (rejected: any) => { this.rejected = rejected; }
                        );
                    }
                });
                resolve(1);
                reject(-1);
                resolve(2);
                reject(-2);
                return promise;
            });
        });

        test("custom Class(Executed twice)", () => {
            return testWithNativePromise((ctor) => {
                const { promise, resolve, reject } = ctor.withResolvers.call(class {
                    resolved: any = null;
                    rejected: any = null;
                    constructor(executor: (resolve: (value: any) => void, reject: (reason?: any) => void) => void) {
                        executor(
                            (resolved: any) => { this.resolved = resolved; },
                            (rejected: any) => { this.rejected = rejected; }
                        );
                        executor(
                            (resolved: any) => { this.resolved = resolved; },
                            (rejected: any) => { this.rejected = rejected; }
                        );
                    }
                });
                resolve(1);
                reject(-1);
                resolve(2);
                reject(-2);
                return promise;
            });
        });
    });
});
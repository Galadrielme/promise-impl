import { testWithNativePromise, shouldNotBeInvoked } from "./_utils";

/**
 * 测试Promise#finally
 */
describe("/promise/implements/Promise#finally", () => {
    const testPromiseFinallyOnfulfilled = (ctor: PromiseConstructor, handle: (value?: any) => any): any => {
        return new ctor((resolve) => resolve(1)).finally(handle);
    }
    const testPromiseFinallyOnrejected = (ctor: PromiseConstructor, handle: (value?: any) => any): any => {
        return new ctor((_, reject) => reject(-1)).finally(handle);
    }

    describe("pending", () => {
        test("should not be invoked", () => {
            return testWithNativePromise((ctor) => {
                return new ctor(() => {}).finally(shouldNotBeInvoked);
            });
        });
    })
    describe("fulfilled", () => {
        test("return sync fulfilled", () => {
            return testWithNativePromise((ctor) => {
                return testPromiseFinallyOnfulfilled(ctor, value => {
                    return `fulfilled ${ value }`;
                });
            });
        });
        test("return async fulfilled", () => {
            return testWithNativePromise((ctor) => {
                return testPromiseFinallyOnfulfilled(ctor, value => {
                    return new ctor(resolve => { resolve(`fulfilled ${ value }`); });
                });
            });
        });
        test("return async rejected", () => {
            return testWithNativePromise((ctor) => {
                return testPromiseFinallyOnfulfilled(ctor, value => {
                    return new ctor((_, reject) => { reject(`rejected ${ value }`); });
                });
            });
        });
        test("throws", () => {
            return testWithNativePromise((ctor) => {
                return testPromiseFinallyOnfulfilled(ctor, value => {
                    throw `throw errors @Promise.finally(onfulfilled(${ value }))`;
                });
            });
        });
    });
    describe("rejected", () => {
        test("return sync fulfilled", () => {
            return testWithNativePromise((ctor) => {
                return testPromiseFinallyOnrejected(ctor, value => {
                    return `fulfilled ${ value }`;
                });
            });
        });
        test("return async fulfilled", () => {
            return testWithNativePromise((ctor) => {
                return testPromiseFinallyOnrejected(ctor, value => {
                    return new ctor(resolve => { resolve(`fulfilled ${ value }`); });
                });
            });
        });
        test("return async rejected", () => {
            return testWithNativePromise((ctor) => {
                return testPromiseFinallyOnrejected(ctor, value => {
                    return new ctor((_, reject) => { reject(`rejected ${ value }`); });
                });
            });
        });
        test("throws", () => {
            return testWithNativePromise((ctor) => {
                return testPromiseFinallyOnrejected(ctor, value => {
                    throw `throw errors @Promise.finally(onrejected(${ value }))`;
                });
            });
        });
    });
});
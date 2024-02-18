import { testWithNativePromise, shouldNotBeInvoked } from "./_utils";

/**
 * 测试Promise#catch
 */
describe("/promise/implements/Promise#catch", () => {
    const testPromiseCatch = (ctor: PromiseConstructor, handle: (value: any) => any): any => {
        return new ctor((_, reject) => reject(-1)).catch(handle);
    }

    describe("pending", () => {
        test("should not be invoked", () => {
            return testWithNativePromise((ctor) => {
                return new ctor(() => {}).catch(shouldNotBeInvoked);
            });
        });
    })
    describe("fulfilled", () => {
        test("should not be invoked", () => {
            return testWithNativePromise((ctor) => {
                return new ctor((resolve) => resolve(1)).catch(shouldNotBeInvoked);
            });
        });
    });
    describe("rejected", () => {
        test("return sync fulfilled", () => {
            return testWithNativePromise((ctor) => {
                return testPromiseCatch(ctor, value => {
                    return `fulfilled ${ value }`;
                });
            });
        });
        test("return async fulfilled", () => {
            return testWithNativePromise((ctor) => {
                return testPromiseCatch(ctor, value => {
                    return new ctor(resolve => { resolve(`fulfilled ${ value }`); });
                });
            });
        });
        test("return async rejected", () => {
            return testWithNativePromise((ctor) => {
                return testPromiseCatch(ctor, value => {
                    return new ctor((_, reject) => { reject(`rejected ${ value }`); });
                });
            });
        });
        test("throws", () => {
            return testWithNativePromise((ctor) => {
                return testPromiseCatch(ctor, value => {
                    throw `throw errors @Promise.catch(onrejected(${ value }))`;
                });
            });
        });
    });
});
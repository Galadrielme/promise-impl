import { testWithNativePromise, shouldNotBeInvoked } from "./_utils";

/**
 * 测试Promise#then
 */
describe("/promise/implements/Promise#then", () => {
    const testPromiseThenOnfulfilled = (ctor: PromiseConstructor, handle: (value: any) => any): any => {
        return new ctor((resolve) => resolve(1)).then(handle, shouldNotBeInvoked);
    }
    const testPromiseThenOnrejected = (ctor: PromiseConstructor, handle: (value: any) => any): any => {
        return new ctor((_, reject) => reject(-1)).then(shouldNotBeInvoked, handle);
    }
    
    describe("pending", () => {
        test("should not be invoked", () => {
            return testWithNativePromise((ctor) => {
                return new ctor(() => {}).then(shouldNotBeInvoked, shouldNotBeInvoked);
            });
        });
    })
    describe("fulfilled", () => {
        test("return sync value", () => {
            return testWithNativePromise((ctor) => {
                return testPromiseThenOnfulfilled(ctor, value => {
                    return `fulfilled ${ value }`;
                });
            });
        });
        test("return async fulfilled", () => {
            return testWithNativePromise((ctor) => {
                return testPromiseThenOnfulfilled(ctor, value => {
                    return new ctor(resolve => { resolve(`fulfilled ${ value }`); });
                });
            });
        });
        test("return async rejected", () => {
            return testWithNativePromise((ctor) => {
                return testPromiseThenOnfulfilled(ctor, value => {
                    return new ctor((_, reject) => { reject(`rejected ${ value }`); });
                });
            });
        });
        test("throws", () => {
            return testWithNativePromise((ctor) => {
                return testPromiseThenOnfulfilled(ctor, value => {
                    throw `throw errors @Promise.then(onfulfilled)`;
                });
            });
        });
        test("return generator", () => {
            return testWithNativePromise((ctor) => {
                return testPromiseThenOnfulfilled(ctor, function * (value) {
                    yield value;
                    return value;
                });
            });
        });
    });
    describe("rejected", () => {
        test("return sync value", () => {
            return testWithNativePromise((ctor) => {
                return testPromiseThenOnrejected(ctor, value => {
                    return `fulfilled ${ value }`;
                });
            });
        });
        test("return async fulfilled", () => {
            return testWithNativePromise((ctor) => {
                return testPromiseThenOnrejected(ctor, value => {
                    return new ctor(resolve => { resolve(`fulfilled ${ value }`); });
                });
            });
        });
        test("return async rejected", () => {
            return testWithNativePromise((ctor) => {
                return testPromiseThenOnrejected(ctor, value => {
                    return new ctor((_, reject) => { reject(`rejected ${ value }`); });
                });
            });
        });
        test("throws", () => {
            return testWithNativePromise((ctor) => {
                return testPromiseThenOnrejected(ctor, value => {
                    throw `throw errors @Promise.then(onfulfilled(${ value }))`;
                });
            });
        });
    });
});
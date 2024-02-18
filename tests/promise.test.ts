import { testWithNativePromise, PromiseGenerator } from "./_utils";

/**
 * 测试Promise.then
 */
describe("/promise", () => {
    /** 测试在异步函数中的表现 */
    const testAsyncFunction = (generate: PromiseGenerator) => {
        return testWithNativePromise((ctor: any) => {
            return (async () => {
                return await generate(ctor);
            })() as any;
        });
    }

    describe("AsyncFunction", () => {
        test("fulfulled", () => {
            return testAsyncFunction((ctor) => {
                return new ctor(resolve => {
                    resolve("test AsyncFunction fulfulled");
                })
            })
        });
        test("rejected", () => { 
            return testAsyncFunction((ctor) => {
                return new ctor((_, reject) => {
                    reject("test AsyncFunction rejected");
                })
            })
        });
        test("throws", () => { 
            return testAsyncFunction((ctor) => {
                return new ctor(() => {
                    throw "test AsyncFunction throws";
                })
            })
        });
    });
});
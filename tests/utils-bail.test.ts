import { bail } from "../src/utils/bail";

/**
 * 测试bail
 * 期望 onfulfilled / onrejected 只有第一次会触发, 后续的触发都无效
 */
describe("/utils/bail", () => {
    describe("onfulfilled", () => {
        let results: [any, any] = [void 0, void 0];
        const bailed = bail((result: any) => {
            results[0] = result;
        }, (result: any) => {
            results[1] = result;
        });

        bailed.onfulfilled(1);
        bailed.onfulfilled(2);
        bailed.onrejected(-1);

        test("returns", () => {
            expect(results[0]).toEqual(1);
            expect(results[1]).toEqual(void 0);
        });

    });
    describe("onrejected", () => {
        let results: [any, any] = [void 0, void 0];
        const bailed = bail((result: any) => {
            results[0] = result;
        }, (result: any) => {
            results[1] = result;
        });

        bailed.onrejected(-1);
        bailed.onrejected(-2);
        bailed.onfulfilled(1);

        test("returns", () => {
            expect(results[0]).toEqual(void 0);
            expect(results[1]).toEqual(-1);
        })
    });
});